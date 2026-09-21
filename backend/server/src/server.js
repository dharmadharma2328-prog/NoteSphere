import 'dotenv/config';
import app from './app.js';
import { query } from '../database/index.js';
import { seedDatabase } from '../database/seeds/seed.js';

const PORT = process.env.PORT || 5000;

// Auto-seed database if empty
try {
  const userCount = query.get('SELECT COUNT(*) as count FROM users');
  if (!userCount || userCount.count === 0) {
    console.log('Database empty, automatically running seed...');
    await seedDatabase();
  }
} catch (err) {
  console.error('Database initialization check warning:', err.message);
}

app.listen(PORT, () => {
  console.log(`🚀 NoteSphere 2.0 Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 REST API Health: http://localhost:${PORT}/api/health`);
});
