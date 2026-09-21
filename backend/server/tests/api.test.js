import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import app from '../src/app.js';
import { seedDatabase } from '../database/seeds/seed.js';

let server;
let baseUrl;
let token;

before(async () => {
  await seedDatabase();
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  server.close();
});

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  return { response, body };
};

test('health endpoint reports a running NoteSphere API', async () => {
  const { response, body } = await request('/api/health');

  assert.equal(response.status, 200);
  assert.equal(body.status, 'healthy');
  assert.equal(body.version, '2.0.0');
});

test('student can authenticate and read seeded resources', async () => {
  const login = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@notesphere.edu',
      password: 'password123'
    })
  });

  assert.equal(login.response.status, 200);
  assert.ok(login.body.token);
  assert.equal(login.body.user.role, 'Student');
  token = login.body.token;

  const resources = await request('/api/resources?limit=5', {
    headers: { Authorization: `Bearer ${token}` }
  });

  assert.equal(resources.response.status, 200);
  assert.ok(Array.isArray(resources.body.resources));
  assert.ok(resources.body.resources.length > 0);
  assert.ok(resources.body.resources[0].title);
});

test('authenticated session returns the current user profile', async () => {
  const me = await request('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });

  assert.equal(me.response.status, 200);
  assert.equal(me.body.user.email, 'student@notesphere.edu');
  assert.ok(Number.isInteger(me.body.user.uploadsCount));
});

test('authenticated user can read community and notification feeds', async () => {
  const headers = { Authorization: `Bearer ${token}` };
  const [groups, discussions, notifications] = await Promise.all([
    request('/api/community/groups', { headers }),
    request('/api/community/discussions', { headers }),
    request('/api/notifications', { headers })
  ]);

  assert.equal(groups.response.status, 200);
  assert.ok(groups.body.groups.length > 0);
  assert.equal(discussions.response.status, 200);
  assert.ok(discussions.body.discussions.length > 0);
  assert.equal(notifications.response.status, 200);
  assert.ok(Array.isArray(notifications.body.notifications));
});

test('admin can access moderation data while students are denied', async () => {
  const adminLogin = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@notesphere.edu',
      password: 'password123'
    })
  });
  assert.equal(adminLogin.response.status, 200);

  const adminHeaders = { Authorization: `Bearer ${adminLogin.body.token}` };
  const dashboard = await request('/api/admin/dashboard', { headers: adminHeaders });
  assert.equal(dashboard.response.status, 200);
  assert.ok(Number.isInteger(dashboard.body.stats.totalUsers));

  const resources = await request('/api/admin/resources', { headers: adminHeaders });
  assert.equal(resources.response.status, 200);
  assert.ok(Array.isArray(resources.body.resources));

  const invalidModeration = await request('/api/admin/resources/note-1/moderation', {
    method: 'PATCH',
    headers: { ...adminHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'published' })
  });
  assert.equal(invalidModeration.response.status, 400);

  const studentAttempt = await request('/api/admin/dashboard', {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(studentAttempt.response.status, 403);
});

test('v1 api exposes the PRD-compatible auth and docs routes', async () => {
  const uniqueEmail = `prd.tester.${Date.now()}@example.com`;
  const registerAttempt = await request('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'PRD Tester',
      email: uniqueEmail,
      password: 'Password123!',
      role: 'Student',
      college: 'PRD College',
      degree: 'BTech',
      branch: 'Computer Science',
      semester: 'Semester 4'
    })
  });

  assert.equal(registerAttempt.response.status, 201);
  assert.ok(registerAttempt.body.token);

  const docs = await request('/api/v1/docs');
  assert.equal(docs.response.status, 200);
  assert.ok(docs.body.openapi || docs.body.paths);

  const me = await request('/api/v1/users/me', {
    headers: { Authorization: `Bearer ${registerAttempt.body.token}` }
  });

  assert.equal(me.response.status, 200);
  assert.equal(me.body.user.email, uniqueEmail);
});

test('v1 resource interaction endpoints support bookmark and rating lifecycle actions', async () => {
  const login = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@notesphere.edu',
      password: 'password123'
    })
  });

  const headers = { Authorization: `Bearer ${login.body.token}` };

  const bookmarkCreate = await request('/api/v1/resources/note-1/bookmark', {
    method: 'POST',
    headers
  });
  assert.equal(bookmarkCreate.response.status, 200);

  const bookmarkDelete = await request('/api/v1/resources/note-1/bookmark', {
    method: 'DELETE',
    headers
  });
  assert.equal(bookmarkDelete.response.status, 200);

  const ratingCreate = await request('/api/v1/resources/note-1/rating', {
    method: 'POST',
    headers: { Authorization: `Bearer ${login.body.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating: 5, review: 'Excellent notes and very helpful.' })
  });
  assert.equal(ratingCreate.response.status, 200);

  const ratingDelete = await request('/api/v1/resources/note-1/rating', {
    method: 'DELETE',
    headers
  });
  assert.equal(ratingDelete.response.status, 200);
});
