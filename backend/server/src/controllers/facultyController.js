import { query } from '../../database/index.js';

export const getFacultyDashboard = async (req, res, next) => {
  try {
    const facultyId = req.user.id;

    // Faculty specific stats
    const myUploads = query.get('SELECT COUNT(*) as count FROM resources WHERE owner_id = ?', [facultyId]);
    const myVerified = query.get('SELECT COUNT(*) as count FROM resources WHERE owner_id = ? AND verified = 1', [facultyId]);
    const myTests = query.get('SELECT COUNT(*) as count FROM tests WHERE owner_id = ?', [facultyId]);
    const totalStudentAttempts = query.get(`
      SELECT COUNT(*) as count, AVG(score) as avg_score, AVG(accuracy) as avg_accuracy
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      WHERE t.owner_id = ?
    `, [facultyId]);

    // Pending student resources for review
    const unverifiedResources = query.all(`
      SELECT r.id, r.title, r.subject, r.degree, r.branch, r.created_at, u.name as uploader_name
      FROM resources r
      JOIN users u ON r.owner_id = u.id
      WHERE r.verified = 0 AND r.status = 'approved'
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

    res.json({
      stats: {
        myUploads: myUploads ? myUploads.count : 0,
        myVerified: myVerified ? myVerified.count : 0,
        myTests: myTests ? myTests.count : 0,
        studentAttempts: totalStudentAttempts ? totalStudentAttempts.count : 0,
        averageClassScore: totalStudentAttempts && totalStudentAttempts.avg_score ? Math.round(totalStudentAttempts.avg_score * 10) / 10 : 7.2,
        averageAccuracy: totalStudentAttempts && totalStudentAttempts.avg_accuracy ? Math.round(totalStudentAttempts.avg_accuracy) : 85
      },
      unverifiedResources
    });
  } catch (err) {
    next(err);
  }
};

export const verifyResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    query.run('UPDATE resources SET verified = 1 WHERE id = ?', [id]);
    res.json({ message: 'Resource verified and awarded the Faculty Quality Badge.' });
  } catch (err) {
    next(err);
  }
};

export const createFacultyTest = async (req, res, next) => {
  try {
    const facultyId = req.user.id;
    const { title, description, subject, durationMinutes = 20, passingMarks = 5, negativeMarking = 0.25, questions = [] } = req.body;

    if (!title || !subject || questions.length === 0) {
      return res.status(400).json({ error: 'Title, subject, and at least 1 question are required.' });
    }

    const testId = `test-${Date.now()}`;
    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

    query.run(`
      INSERT INTO tests (id, owner_id, title, description, subject, duration_minutes, total_marks, passing_marks, negative_marking, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')
    `, [testId, facultyId, title, description || '', subject, durationMinutes, totalMarks, passingMarks, negativeMarking]);

    // Insert questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qId = `q-fac-${Date.now()}-${i}`;
      query.run(`
        INSERT INTO questions (id, subject, topic, type, question, options_json, answer, explanation, difficulty, marks)
        VALUES (?, ?, ?, 'MCQ', ?, ?, ?, ?, ?, ?)
      `, [qId, subject, q.topic || subject, q.question, JSON.stringify(q.options || []), q.answer, q.explanation || '', q.difficulty || 'medium', q.marks || 1]);

      query.run(`
        INSERT INTO test_questions (id, test_id, question_id, order_index, marks)
        VALUES (?, ?, ?, ?, ?)
      `, [`tq-${testId}-${i}`, testId, qId, i + 1, q.marks || 1]);
    }

    res.status(201).json({ message: 'Mock test created and published for students!', testId });
  } catch (err) {
    next(err);
  }
};
