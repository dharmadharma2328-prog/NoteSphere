import { query } from '../../database/index.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = query.all(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 30
    `, [userId]);

    const unreadCount = query.get('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0', [userId]);

    res.json({
      notifications: notifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        targetUrl: n.target_url,
        read: !!n.read,
        date: n.created_at ? n.created_at.split('T')[0] : 'Today'
      })),
      unreadCount: unreadCount ? unreadCount.count : 0
    });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    query.run('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?', [id, userId]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    query.run('UPDATE notifications SET read = 1 WHERE user_id = ?', [userId]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const clearNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    query.run('DELETE FROM notifications WHERE user_id = ?', [userId]);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
