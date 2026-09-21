import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'notesphere.db');
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Initialize schema
const schemaPath = path.join(__dirname, 'schema.sql');
if (fs.existsSync(schemaPath)) {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
}

// Normalize parameters: DatabaseSync expects (param1, param2, ...) rather than ([param1, param2])
const normalizeParams = (params) => {
  if (Array.isArray(params)) {
    return params.map(p => (p === undefined ? null : p));
  }
  return params !== undefined ? [params] : [];
};

// Helper methods with parameterized queries to prevent SQL injection
export const query = {
  all: (sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      const normalized = normalizeParams(params);
      return stmt.all(...normalized);
    } catch (err) {
      console.error('Database query error:', err.message, 'SQL:', sql);
      throw err;
    }
  },
  get: (sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      const normalized = normalizeParams(params);
      return stmt.get(...normalized);
    } catch (err) {
      console.error('Database query error:', err.message, 'SQL:', sql);
      throw err;
    }
  },
  run: (sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      const normalized = normalizeParams(params);
      return stmt.run(...normalized);
    } catch (err) {
      console.error('Database run error:', err.message, 'SQL:', sql);
      throw err;
    }
  },
  exec: (sql) => {
    return db.exec(sql);
  }
};

export default db;
