import { query } from '../../database/index.js';

// --- STUDY GROUPS ---
export const getGroups = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const userId = req.user ? req.user.id : null;

    let sql = `
      SELECT g.*, 
             u.name as owner_name,
             (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count
      FROM groups g
      LEFT JOIN users u ON g.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      sql += ' AND g.category = ?';
      params.push(category);
    }
    if (search && search.trim()) {
      sql += ' AND (LOWER(g.name) LIKE ? OR LOWER(g.description) LIKE ?)';
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY g.created_at DESC';
    const groups = query.all(sql, params);

    const enriched = groups.map(g => {
      let isJoined = false;
      if (userId) {
        const mem = query.get('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?', [g.id, userId]);
        isJoined = !!mem;
      }
      return {
        id: g.id,
        name: g.name,
        description: g.description,
        category: g.category,
        members: g.member_count || 1,
        onlineCount: Math.max(2, Math.floor((g.member_count || 1) * 0.2)),
        nextSession: g.next_session || 'Schedule pending',
        isJoined,
        owner: {
          id: g.owner_id,
          name: g.owner_name
        }
      };
    });

    res.json({ groups: enriched });
  } catch (err) {
    next(err);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description, category, nextSession } = req.body;

    if (!name) return res.status(400).json({ error: 'Group name is required.' });

    const id = `grp-${Date.now()}`;
    query.run(`
      INSERT INTO groups (id, owner_id, name, description, category, next_session)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, userId, name, description || '', category || 'General', nextSession || 'Schedule pending']);

    query.run(`
      INSERT INTO group_members (id, group_id, user_id, role)
      VALUES (?, ?, ?, 'owner')
    `, [`gm-${id}-${userId}`, id, userId]);

    // Award XP
    query.run('UPDATE users SET xp = xp + 20 WHERE id = ?', [userId]);

    const created = query.get('SELECT * FROM groups WHERE id = ?', [id]);
    res.status(201).json({ group: created });
  } catch (err) {
    next(err);
  }
};

export const toggleJoinGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = query.get('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?', [id, userId]);

    if (existing) {
      query.run('DELETE FROM group_members WHERE group_id = ? AND user_id = ?', [id, userId]);
      return res.json({ joined: false });
    } else {
      query.run(`
        INSERT INTO group_members (id, group_id, user_id, role)
        VALUES (?, ?, ?, 'member')
      `, [`gm-${id}-${userId}`, id, userId]);
      return res.json({ joined: true });
    }
  } catch (err) {
    next(err);
  }
};

// --- DISCUSSION FORUM ---
export const getDiscussions = async (req, res, next) => {
  try {
    const { tag, search, sort = 'newest' } = req.query;
    const userId = req.user ? req.user.id : null;

    let sql = `
      SELECT d.*, 
             u.name as author_name, 
             u.avatar as author_avatar,
             (SELECT COUNT(*) FROM replies WHERE discussion_id = d.id) as reply_count
      FROM discussions d
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.status = 'active'
    `;
    const params = [];

    if (tag) {
      sql += ' AND d.tags LIKE ?';
      params.push(`%${tag}%`);
    }
    if (search && search.trim()) {
      sql += ' AND (LOWER(d.title) LIKE ? OR LOWER(d.description) LIKE ?)';
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term);
    }

    if (sort === 'popular') {
      sql += ' ORDER BY d.upvotes DESC';
    } else {
      sql += ' ORDER BY d.created_at DESC';
    }

    const discussions = query.all(sql, params);

    const enriched = discussions.map(d => {
      let userVote = 0;
      if (userId) {
        const v = query.get("SELECT value FROM votes WHERE user_id = ? AND target_type = 'discussion' AND target_id = ?", [userId, d.id]);
        if (v) userVote = v.value;
      }

      // Load replies for each thread
      const replies = query.all(`
        SELECT r.*, u.name as author_name, u.avatar as author_avatar
        FROM replies r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.discussion_id = ?
        ORDER BY r.is_best_answer DESC, r.upvotes DESC, r.created_at ASC
      `, [d.id]);

      const tagsArray = d.tags ? d.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

      return {
        id: d.id,
        title: d.title,
        description: d.description,
        tags: tagsArray,
        upvotes: d.upvotes,
        replyCount: d.reply_count,
        date: d.created_at ? d.created_at.split('T')[0] : '2026-05-01',
        userVote,
        uploader: {
          id: d.user_id,
          name: d.author_name || 'Anonymous Scholar',
          avatar: d.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
        },
        replies: replies.map(rep => ({
          id: rep.id,
          author: rep.author_name,
          avatar: rep.author_avatar,
          content: rep.content,
          date: rep.created_at ? rep.created_at.split('T')[0] : 'Just now',
          upvotes: rep.upvotes,
          isBestAnswer: !!rep.is_best_answer
        }))
      };
    });

    res.json({ discussions: enriched });
  } catch (err) {
    next(err);
  }
};

export const createDiscussion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, tags = [] } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const id = `disc-${Date.now()}`;
    const tagsStr = Array.isArray(tags) ? tags.join(',') : tags;

    query.run(`
      INSERT INTO discussions (id, user_id, title, description, tags, upvotes)
      VALUES (?, ?, ?, ?, ?, 0)
    `, [id, userId, title, description, tagsStr]);

    // Award XP
    query.run('UPDATE users SET xp = xp + 15 WHERE id = ?', [userId]);

    res.status(201).json({ message: 'Discussion posted successfully.', id });
  } catch (err) {
    next(err);
  }
};

export const addReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: 'Reply content cannot be empty.' });

    const replyId = `rep-${Date.now()}`;
    query.run(`
      INSERT INTO replies (id, discussion_id, user_id, content, upvotes)
      VALUES (?, ?, ?, ?, 0)
    `, [replyId, id, userId, content]);

    // Award XP for answering questions
    query.run('UPDATE users SET xp = xp + 10 WHERE id = ?', [userId]);

    res.status(201).json({ message: 'Reply added successfully.', replyId });
  } catch (err) {
    next(err);
  }
};

export const voteDiscussion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { value = 1 } = req.body; // 1 for upvote, -1 for downvote

    const existing = query.get("SELECT id, value FROM votes WHERE user_id = ? AND target_type = 'discussion' AND target_id = ?", [userId, id]);

    if (existing) {
      if (existing.value === value) {
        // Toggle off
        query.run('DELETE FROM votes WHERE id = ?', [existing.id]);
        query.run('UPDATE discussions SET upvotes = upvotes - ? WHERE id = ?', [value, id]);
        return res.json({ upvotes: query.get('SELECT upvotes FROM discussions WHERE id = ?', [id]).upvotes, userVote: 0 });
      } else {
        // Reverse vote
        query.run('UPDATE votes SET value = ? WHERE id = ?', [value, existing.id]);
        query.run('UPDATE discussions SET upvotes = upvotes + ? WHERE id = ?', [value * 2, id]);
        return res.json({ upvotes: query.get('SELECT upvotes FROM discussions WHERE id = ?', [id]).upvotes, userVote: value });
      }
    } else {
      query.run(`
        INSERT INTO votes (id, user_id, target_type, target_id, value)
        VALUES (?, ?, 'discussion', ?, ?)
      `, [`v-${Date.now()}`, userId, id, value]);
      query.run('UPDATE discussions SET upvotes = upvotes + ? WHERE id = ?', [value, id]);
      return res.json({ upvotes: query.get('SELECT upvotes FROM discussions WHERE id = ?', [id]).upvotes, userVote: value });
    }
  } catch (err) {
    next(err);
  }
};

// --- LEADERBOARD & GAMIFICATION ---
export const getLeaderboard = async (req, res, next) => {
  try {
    const leaders = query.all(`
      SELECT id, name, role, avatar, college, branch, streak, xp,
             (SELECT COUNT(*) FROM user_badges WHERE user_id = users.id) as badge_count,
             (SELECT COUNT(*) FROM resources WHERE owner_id = users.id) as upload_count
      FROM users
      ORDER BY xp DESC, streak DESC
      LIMIT 20
    `);

    res.json({ leaderboard: leaders });
  } catch (err) {
    next(err);
  }
};
