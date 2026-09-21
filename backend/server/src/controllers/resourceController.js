import path from 'path';
import fs from 'fs';
import { query } from '../../database/index.js';
import { calculateFileHash, getUploadsPath, removeUploadedFile } from '../services/storage/storageService.js';
import { extractPdfPages, ragService } from '../services/rag/ragService.js';

export const getResources = async (req, res, next) => {
  try {
    const {
      search,
      subject,
      degree,
      branch,
      semester,
      resourceType,
      verified,
      view, // all, saved, trending, recommendations
      sort = 'newest',
      page = 1,
      limit = 50
    } = req.query;

    const currentUserId = req.user ? req.user.id : null;
    let sql = `
      SELECT r.*, 
             u.name as uploader_name, 
             u.avatar as uploader_avatar,
             u.role as uploader_role
      FROM resources r
      LEFT JOIN users u ON r.owner_id = u.id
      WHERE r.status = 'approved'
    `;
    const params = [];

    // Filter by view
    if (view === 'saved' && currentUserId) {
      sql += ` AND r.id IN (SELECT resource_id FROM bookmarks WHERE user_id = ?)`;
      params.push(currentUserId);
    } else if (view === 'trending') {
      sql += ` AND (r.download_count >= 100 OR r.like_count >= 50)`;
    } else if (view === 'recommendations' && req.user) {
      sql += ` AND (r.branch = ? OR r.semester = ? OR r.degree = ?)`;
      params.push(req.user.branch || '', req.user.semester || '', req.user.degree || '');
    }

    // Filter by search keyword
    if (search && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      sql += ` AND (
        LOWER(r.title) LIKE ? OR 
        LOWER(r.description) LIKE ? OR 
        LOWER(r.subject) LIKE ? OR
        r.id IN (SELECT resource_id FROM resource_tags WHERE LOWER(tag) LIKE ?)
      )`;
      params.push(term, term, term, term);
    }

    if (subject) {
      sql += ` AND r.subject = ?`;
      params.push(subject);
    }
    if (degree) {
      sql += ` AND r.degree = ?`;
      params.push(degree);
    }
    if (branch) {
      sql += ` AND r.branch = ?`;
      params.push(branch);
    }
    if (semester) {
      sql += ` AND r.semester = ?`;
      params.push(semester);
    }
    if (resourceType) {
      sql += ` AND r.resource_type = ?`;
      params.push(resourceType);
    }
    if (verified === 'true' || verified === '1') {
      sql += ` AND r.verified = 1`;
    }

    // Sorting
    if (sort === 'downloads') {
      sql += ` ORDER BY r.download_count DESC`;
    } else if (sort === 'rating') {
      sql += ` ORDER BY r.rating DESC, r.rating_count DESC`;
    } else if (sort === 'likes') {
      sql += ` ORDER BY r.like_count DESC`;
    } else {
      sql += ` ORDER BY r.created_at DESC`;
    }

    // Pagination
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const rows = query.all(sql, params);

    // Enrich rows with user-specific state (isLiked, isBookmarked, isDownloaded) and tags
    const enriched = rows.map(r => {
      let isLiked = false;
      let isBookmarked = false;
      let isDownloaded = false;

      if (currentUserId) {
        const like = query.get('SELECT 1 FROM likes WHERE user_id = ? AND resource_id = ?', [currentUserId, r.id]);
        isLiked = !!like;

        const bm = query.get('SELECT 1 FROM bookmarks WHERE user_id = ? AND resource_id = ?', [currentUserId, r.id]);
        isBookmarked = !!bm;

        const dl = query.get('SELECT 1 FROM downloads WHERE user_id = ? AND resource_id = ?', [currentUserId, r.id]);
        isDownloaded = !!dl;
      }

      const tags = query.all('SELECT tag FROM resource_tags WHERE resource_id = ?', [r.id]).map(t => t.tag);

      return {
        id: r.id,
        title: r.title,
        description: r.description,
        subject: r.subject,
        semester: r.semester,
        branch: r.branch,
        degree: r.degree,
        resourceType: r.resource_type,
        fileSize: r.file_size,
        fileName: r.file_name,
        uploadDate: r.created_at ? r.created_at.split('T')[0] : '2026-05-01',
        downloadCount: r.download_count,
        likeCount: r.like_count,
        rating: r.rating,
        ratingCount: r.rating_count,
        verified: !!r.verified,
        youtubeUrl: r.youtube_url,
        isLiked,
        isBookmarked,
        isDownloaded,
        tags,
        uploader: {
          id: r.owner_id,
          name: r.uploader_name || 'Academic Scholar',
          avatar: r.uploader_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          role: r.uploader_role || 'Student'
        }
      };
    });

    res.json({ resources: enriched });
  } catch (err) {
    next(err);
  }
};

export const getResourceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user ? req.user.id : null;

    const r = query.get(`
      SELECT r.*, u.name as uploader_name, u.avatar as uploader_avatar, u.role as uploader_role
      FROM resources r
      LEFT JOIN users u ON r.owner_id = u.id
      WHERE r.id = ?
    `, [id]);

    if (!r) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    const tags = query.all('SELECT tag FROM resource_tags WHERE resource_id = ?', [id]).map(t => t.tag);
    const ratings = query.all(`
      SELECT rt.rating, rt.review, rt.created_at, u.name as reviewer_name, u.avatar as reviewer_avatar
      FROM ratings rt
      LEFT JOIN users u ON rt.user_id = u.id
      WHERE rt.resource_id = ?
      ORDER BY rt.created_at DESC
    `, [id]);

    let isLiked = false;
    let isBookmarked = false;
    let isDownloaded = false;
    let userRating = null;

    if (currentUserId) {
      isLiked = !!query.get('SELECT 1 FROM likes WHERE user_id = ? AND resource_id = ?', [currentUserId, id]);
      isBookmarked = !!query.get('SELECT 1 FROM bookmarks WHERE user_id = ? AND resource_id = ?', [currentUserId, id]);
      isDownloaded = !!query.get('SELECT 1 FROM downloads WHERE user_id = ? AND resource_id = ?', [currentUserId, id]);
      const ur = query.get('SELECT rating, review FROM ratings WHERE user_id = ? AND resource_id = ?', [currentUserId, id]);
      if (ur) userRating = ur;
    }

    // Related resources
    const related = query.all(`
      SELECT id, title, subject, resource_type as resourceType, rating, download_count as downloadCount
      FROM resources
      WHERE subject = ? AND id != ? AND status = 'approved'
      LIMIT 3
    `, [r.subject, id]);

    res.json({
      resource: {
        id: r.id,
        title: r.title,
        description: r.description,
        subject: r.subject,
        semester: r.semester,
        branch: r.branch,
        degree: r.degree,
        resourceType: r.resource_type,
        fileSize: r.file_size,
        fileName: r.file_name,
        filePath: r.file_path,
        uploadDate: r.created_at ? r.created_at.split('T')[0] : '2026-05-01',
        downloadCount: r.download_count,
        likeCount: r.like_count,
        rating: r.rating,
        ratingCount: r.rating_count,
        verified: !!r.verified,
        youtubeUrl: r.youtube_url,
        isLiked,
        isBookmarked,
        isDownloaded,
        userRating,
        tags,
        ratings,
        related,
        uploader: {
          id: r.owner_id,
          name: r.uploader_name || 'Academic Scholar',
          avatar: r.uploader_avatar,
          role: r.uploader_role
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createResource = async (req, res, next) => {
  let uploadedFile;
  let resourceId;

  try {
    const file = req.file;
    uploadedFile = file;
    const { title, description, subject, semester, branch, degree, resourceType, tags, youtubeUrl } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'A PDF file is required.' });
    }
    if (path.extname(file.originalname).toLowerCase() !== '.pdf' || file.mimetype !== 'application/pdf') {
      await removeUploadedFile(file.path);
      return res.status(400).json({ error: 'Only valid PDF files can be uploaded.' });
    }
    try {
      await extractPdfPages(file.path);
    } catch (validationError) {
      await removeUploadedFile(file.path);
      return res.status(400).json({ error: validationError.message });
    }
    if (!title || !description || !subject) {
      await removeUploadedFile(file.path);
      return res.status(400).json({ error: 'Title, description, and subject are required.' });
    }

    const userId = req.user.id;
    const isFacultyOrAdmin = req.user.role === 'Faculty' || req.user.role === 'Admin';
    const verified = isFacultyOrAdmin ? 1 : 0;

    let fileName = null;
    let filePath = null;
    let fileHash = null;
    let fileSize = '1.5 MB';
    let mimeType = 'application/pdf';

    if (file) {
      fileName = file.originalname;
      filePath = file.filename;
      fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      mimeType = file.mimetype;

      // Duplicate detection using file hash
      fileHash = await calculateFileHash(file.path);
      const existingDuplicate = query.get('SELECT id, title FROM resources WHERE file_hash = ?', [fileHash]);
      if (existingDuplicate) {
        await removeUploadedFile(file.path);
        return res.status(409).json({
          error: `Duplicate file detected! Exactly identical content was already uploaded as "${existingDuplicate.title}".`,
          existingResourceId: existingDuplicate.id
        });
      }
    }

    const id = `note-${Date.now()}`;
    resourceId = id;

    query.run(`
      INSERT INTO resources (
        id, owner_id, title, description, degree, branch, semester, subject,
        resource_type, file_name, file_path, file_hash, file_size, mime_type,
        youtube_url, download_count, like_count, rating, rating_count, status, visibility, verified
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 5.0, 1, 'approved', 'public', ?)
    `, [
      id, userId, title, description, degree || 'BTech', branch || 'Computer Science', semester || 'Semester 3',
      subject, resourceType || 'PDFs', fileName, filePath, fileHash, fileSize, mimeType,
      youtubeUrl || null, verified
    ]);

    await ragService.indexResource(id);

    // Insert tags
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);
      for (const tag of tagList) {
        query.run('INSERT INTO resource_tags (id, resource_id, tag) VALUES (?, ?, ?)', [`tag-${Date.now()}-${Math.random()}`, id, tag]);
      }
    }

    // Award 30 XP to uploader
    query.run('UPDATE users SET xp = xp + 30 WHERE id = ?', [userId]);
    query.run(`
      INSERT INTO xp_events (id, user_id, action_type, xp_amount, description)
      VALUES (?, ?, 'upload', 30, ?)
    `, [`xp-${Date.now()}`, userId, `Uploaded study material: "${title}"`]);

    // Check if first upload for badge
    const totalUploads = query.get('SELECT COUNT(*) as count FROM resources WHERE owner_id = ?', [userId]);
    if (totalUploads && totalUploads.count === 1) {
      query.run(`
        INSERT OR IGNORE INTO user_badges (id, user_id, badge_key, name, description, icon)
        VALUES (?, ?, 'knowledge-contributor', 'Knowledge Contributor', 'Uploaded your first study notes material.', '🚀')
      `, [`ub-kc-${userId}`, userId]);
    }

    const created = query.get('SELECT * FROM resources WHERE id = ?', [id]);

    res.status(201).json({
      message: 'Resource published successfully!',
      resource: created
    });
  } catch (err) {
    if (resourceId) {
      query.run('DELETE FROM resources WHERE id = ?', [resourceId]);
    }
    if (uploadedFile) {
      await removeUploadedFile(uploadedFile.path);
    }
    next(err);
  }
};

export const getResourceFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resource = query.get('SELECT file_path, file_name, mime_type FROM resources WHERE id = ?', [id]);

    if (!resource || !resource.file_path) {
      return res.status(404).json({ error: 'Resource file not found.' });
    }

    const fullPath = getUploadsPath(resource.file_path);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Physical file not found on server storage.' });
    }

    res.setHeader('Content-Type', resource.mime_type || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${resource.file_name || 'document.pdf'}"`);
    fs.createReadStream(fullPath).pipe(res);
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = query.get('SELECT 1 FROM likes WHERE user_id = ? AND resource_id = ?', [userId, id]);

    if (existing) {
      query.run('DELETE FROM likes WHERE user_id = ? AND resource_id = ?', [userId, id]);
      query.run('UPDATE resources SET like_count = MAX(0, like_count - 1) WHERE id = ?', [id]);
      return res.json({ liked: false });
    } else {
      query.run('INSERT INTO likes (user_id, resource_id) VALUES (?, ?)', [userId, id]);
      query.run('UPDATE resources SET like_count = like_count + 1 WHERE id = ?', [id]);
      return res.json({ liked: true });
    }
  } catch (err) {
    next(err);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = query.get('SELECT 1 FROM bookmarks WHERE user_id = ? AND resource_id = ?', [userId, id]);

    if (existing) {
      query.run('DELETE FROM bookmarks WHERE user_id = ? AND resource_id = ?', [userId, id]);
      return res.json({ bookmarked: false, message: 'Removed from bookmarks.' });
    } else {
      query.run('INSERT INTO bookmarks (user_id, resource_id) VALUES (?, ?)', [userId, id]);
      return res.json({ bookmarked: true, message: 'Saved to bookmarks.' });
    }
  } catch (err) {
    next(err);
  }
};

export const recordDownload = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = query.get('SELECT 1 FROM downloads WHERE user_id = ? AND resource_id = ?', [userId, id]);

    if (!existing) {
      query.run('INSERT INTO downloads (id, user_id, resource_id) VALUES (?, ?, ?)', [`dl-${Date.now()}`, userId, id]);
      query.run('UPDATE resources SET download_count = download_count + 1 WHERE id = ?', [id]);

      // Check for Scholar Explorer milestone (5 downloads)
      const countRes = query.get('SELECT COUNT(*) as count FROM downloads WHERE user_id = ?', [userId]);
      if (countRes && countRes.count >= 5) {
        query.run(`
          INSERT OR IGNORE INTO user_badges (id, user_id, badge_key, name, description, icon)
          VALUES (?, ?, 'scholar-explorer', 'Scholar Explorer', 'Read or download 5 different study resources.', '📚')
        `, [`ub-se-${userId}`, userId]);
      }
    }

    const updated = query.get('SELECT download_count FROM resources WHERE id = ?', [id]);
    res.json({ success: true, downloadCount: updated ? updated.download_count : 0 });
  } catch (err) {
    next(err);
  }
};

export const rateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, review } = req.body;

    const numRating = parseFloat(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1.0 and 5.0' });
    }

    query.run(`
      INSERT INTO ratings (id, user_id, resource_id, rating, review)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, resource_id) DO UPDATE SET
        rating = excluded.rating,
        review = excluded.review,
        updated_at = CURRENT_TIMESTAMP
    `, [`rate-${Date.now()}`, userId, id, numRating, review || null]);

    // Recalculate average rating
    const agg = query.get('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM ratings WHERE resource_id = ?', [id]);
    if (agg) {
      const newRating = Math.round(agg.avg_rating * 10) / 10;
      query.run('UPDATE resources SET rating = ?, rating_count = ? WHERE id = ?', [newRating, agg.count, id]);
    }

    res.json({ message: 'Rating submitted successfully.' });
  } catch (err) {
    next(err);
  }
};

export const deleteUserRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const current = query.get('SELECT rating FROM ratings WHERE user_id = ? AND resource_id = ?', [userId, id]);
    if (!current) {
      return res.status(404).json({ error: 'No rating found to delete.' });
    }

    query.run('DELETE FROM ratings WHERE user_id = ? AND resource_id = ?', [userId, id]);

    const agg = query.get('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM ratings WHERE resource_id = ?', [id]);
    if (agg && agg.count > 0) {
      const newRating = Math.round(agg.avg_rating * 10) / 10;
      query.run('UPDATE resources SET rating = ?, rating_count = ? WHERE id = ?', [newRating, agg.count, id]);
    } else {
      query.run('UPDATE resources SET rating = 5.0, rating_count = 0 WHERE id = ?', [id]);
    }

    return res.json({ success: true, message: 'Rating removed successfully.' });
  } catch (err) {
    return next(err);
  }
};

export const reportResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reporterId = req.user.id;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Report reason is required.' });
    }

    query.run(`
      INSERT INTO reports (id, reporter_id, target_type, target_id, reason)
      VALUES (?, ?, 'resource', ?, ?)
    `, [`rep-${Date.now()}`, reporterId, id, reason]);

    res.json({ message: 'Resource has been reported and queued for administrator moderation review.' });
  } catch (err) {
    next(err);
  }
};
