import { query } from '../../database/index.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const userCount = query.get('SELECT COUNT(*) as count FROM users');
    const resourceCount = query.get('SELECT COUNT(*) as count FROM resources');
    const downloadCount = query.get('SELECT COUNT(*) as count FROM downloads');
    const reportCount = query.get("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'");
    const testCount = query.get('SELECT COUNT(*) as count FROM tests');

    res.json({
      stats: {
        totalUsers: userCount ? userCount.count : 0,
        totalResources: resourceCount ? resourceCount.count : 0,
        totalDownloads: downloadCount ? downloadCount.count : 0,
        pendingReports: reportCount ? reportCount.count : 0,
        totalMockTests: testCount ? testCount.count : 0
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = query.all(`
      SELECT id, name, email, role, college, degree, branch, semester, status, streak, xp, created_at
      FROM users
      ORDER BY created_at DESC
    `);
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['Student', 'Faculty', 'Admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be Student, Faculty, or Admin.' });
    }

    query.run('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [role, id]);

    // Record audit log
    query.run(`
      INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, metadata_json)
      VALUES (?, ?, 'update_role', 'user', ?, ?)
    `, [`log-${Date.now()}`, req.user.id, id, JSON.stringify({ newRole: role })]);

    res.json({ message: `User role updated to ${role}.` });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // active, suspended, banned
    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    query.run('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
    res.json({ message: `User status updated to ${status}.` });
  } catch (err) {
    next(err);
  }
};

export const getModerationResources = async (req, res, next) => {
  try {
    const resources = query.all(`
      SELECT r.*, u.name as uploader_name, u.email as uploader_email
      FROM resources r
      LEFT JOIN users u ON r.owner_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.json({ resources });
  } catch (err) {
    next(err);
  }
};

export const updateResourceModeration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved, rejected, flagged, archived

    if (!['approved', 'rejected', 'flagged', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid resource moderation status.' });
    }

    query.run('UPDATE resources SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
    res.json({ message: `Resource status updated to ${status}.` });
  } catch (err) {
    next(err);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const reports = query.all(`
      SELECT rep.*, u.name as reporter_name, u.email as reporter_email
      FROM reports rep
      LEFT JOIN users u ON rep.reporter_id = u.id
      ORDER BY rep.created_at DESC
    `);
    res.json({ reports });
  } catch (err) {
    next(err);
  }
};

export const resolveReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolution = 'dismissed', notes = '' } = req.body;

    query.run(`
      UPDATE reports 
      SET status = ?, reviewed_by = ?, resolution_notes = ?
      WHERE id = ?
    `, [resolution, req.user.id, notes, id]);

    res.json({ message: 'Report resolved.' });
  } catch (err) {
    next(err);
  }
};
