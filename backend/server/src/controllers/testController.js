import { query } from '../../database/index.js';

export const getTests = async (req, res, next) => {
  try {
    const { subject } = req.query;
    let sql = `
      SELECT t.*, 
             u.name as creator_name,
             (SELECT COUNT(*) FROM test_questions WHERE test_id = t.id) as question_count
      FROM tests t
      LEFT JOIN users u ON t.owner_id = u.id
      WHERE t.status = 'published'
    `;
    const params = [];

    if (subject) {
      sql += ` AND t.subject = ?`;
      params.push(subject);
    }

    sql += ` ORDER BY t.created_at DESC`;
    const tests = query.all(sql, params);

    res.json({ tests });
  } catch (err) {
    next(err);
  }
};

export const getTestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const test = query.get(`
      SELECT t.*, u.name as creator_name
      FROM tests t
      LEFT JOIN users u ON t.owner_id = u.id
      WHERE t.id = ?
    `, [id]);

    if (!test) {
      return res.status(404).json({ error: 'Mock test not found.' });
    }

    // Get test questions WITHOUT revealing correct answer for integrity during the test!
    const questions = query.all(`
      SELECT q.id, q.subject, q.topic, q.type, q.question, q.options_json, q.marks, tq.order_index
      FROM test_questions tq
      JOIN questions q ON tq.question_id = q.id
      WHERE tq.test_id = ?
      ORDER BY tq.order_index ASC
    `, [id]);

    const parsedQuestions = questions.map(q => ({
      ...q,
      options: JSON.parse(q.options_json || '[]')
    }));

    res.json({
      test: {
        ...test,
        questions: parsedQuestions
      }
    });
  } catch (err) {
    next(err);
  }
};

export const submitTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { answers = {}, timeSpentSeconds = 0 } = req.body;

    const test = query.get('SELECT * FROM tests WHERE id = ?', [id]);
    if (!test) {
      return res.status(404).json({ error: 'Test not found.' });
    }

    const testQuestions = query.all(`
      SELECT q.id, q.topic, q.answer, q.marks, q.explanation
      FROM test_questions tq
      JOIN questions q ON tq.question_id = q.id
      WHERE tq.test_id = ?
    `, [id]);

    let score = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let attemptedCount = 0;
    const weakTopics = [];
    const attemptId = `att-${Date.now()}`;

    // Evaluate answers
    for (const q of testQuestions) {
      totalMarks += q.marks;
      const selected = answers[q.id];

      if (selected !== undefined && selected !== null && selected !== '') {
        attemptedCount += 1;
        const isCorrect = selected.trim().toLowerCase() === q.answer.trim().toLowerCase();

        if (isCorrect) {
          score += q.marks;
          correctCount += 1;
        } else {
          // Negative marking deduction
          score = Math.max(0, score - (test.negative_marking || 0));
          if (q.topic && !weakTopics.includes(q.topic)) {
            weakTopics.push(q.topic);
          }
        }

        // Record attempt answer
        query.run(`
          INSERT INTO attempt_answers (id, attempt_id, question_id, selected_answer, is_correct, time_spent_seconds)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [`aa-${Date.now()}-${q.id}`, attemptId, q.id, selected, isCorrect ? 1 : 0, Math.round(timeSpentSeconds / testQuestions.length)]);
      } else {
        // Unattempted
        query.run(`
          INSERT INTO attempt_answers (id, attempt_id, question_id, selected_answer, is_correct, time_spent_seconds)
          VALUES (?, ?, ?, NULL, 0, 0)
        `, [`aa-${Date.now()}-${q.id}`, attemptId, q.id]);
      }
    }

    const accuracy = testQuestions.length > 0 ? Math.round((correctCount / testQuestions.length) * 100) : 0;
    const passed = score >= test.passing_marks ? 1 : 0;
    score = Math.round(score * 100) / 100;

    // Save attempt
    query.run(`
      INSERT INTO attempts (id, test_id, user_id, score, total_marks, accuracy, time_spent_seconds, weak_topics_json, passed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [attemptId, id, userId, score, totalMarks, accuracy, timeSpentSeconds, JSON.stringify(weakTopics), passed]);

    // Gamification rewards: XP and Badges
    if (passed) {
      query.run('UPDATE users SET xp = xp + 40 WHERE id = ?', [userId]);
      query.run(`
        INSERT INTO xp_events (id, user_id, action_type, xp_amount, description)
        VALUES (?, ?, 'test_pass', 40, ?)
      `, [`xp-${Date.now()}`, userId, `Passed mock test: ${test.title}`]);
    }

    if (accuracy >= 80) {
      query.run(`
        INSERT OR IGNORE INTO user_badges (id, user_id, badge_key, name, description, icon)
        VALUES (?, ?, 'exam-warrior', 'Exam Warrior', 'Scored 80%+ on an academic timed mock test.', '🎯')
      `, [`ub-ew-${userId}`, userId]);
    }

    res.json({
      message: 'Exam submitted successfully.',
      attemptId,
      score,
      totalMarks,
      accuracy,
      passed: !!passed,
      weakTopics
    });
  } catch (err) {
    next(err);
  }
};

export const getAttemptById = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const attempt = query.get(`
      SELECT a.*, t.title as test_title, t.subject, t.duration_minutes
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      WHERE a.id = ?
    `, [attemptId]);

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    // Get detailed question review with true answers and explanations
    const answers = query.all(`
      SELECT aa.selected_answer, aa.is_correct, 
             q.id as question_id, q.question, q.options_json, q.answer as correct_answer, 
             q.explanation, q.topic, q.difficulty, q.marks
      FROM attempt_answers aa
      JOIN questions q ON aa.question_id = q.id
      WHERE aa.attempt_id = ?
    `, [attemptId]);

    const parsedAnswers = answers.map(a => ({
      ...a,
      options: JSON.parse(a.options_json || '[]')
    }));

    let weakTopics = [];
    try {
      weakTopics = JSON.parse(attempt.weak_topics_json || '[]');
    } catch {
      weakTopics = [];
    }

    // Recommended revision resources matching weak topics or subject
    const recommendations = query.all(`
      SELECT id, title, subject, resource_type as resourceType, rating
      FROM resources
      WHERE subject = ? AND status = 'approved'
      LIMIT 3
    `, [attempt.subject]);

    res.json({
      attempt: {
        ...attempt,
        weakTopics,
        passed: !!attempt.passed,
        answers: parsedAnswers,
        recommendations
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getPracticeQuestions = async (req, res, next) => {
  try {
    const { subject, difficulty, limit = 10 } = req.query;
    let sql = 'SELECT * FROM questions WHERE 1=1';
    const params = [];

    if (subject) {
      sql += ' AND subject = ?';
      params.push(subject);
    }
    if (difficulty) {
      sql += ' AND difficulty = ?';
      params.push(difficulty);
    }

    sql += ' ORDER BY RANDOM() LIMIT ?';
    params.push(parseInt(limit));

    const questions = query.all(sql, params);
    const parsed = questions.map(q => ({
      ...q,
      options: JSON.parse(q.options_json || '[]')
    }));

    res.json({ questions: parsed });
  } catch (err) {
    next(err);
  }
};
