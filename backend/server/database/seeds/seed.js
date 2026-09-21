import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabase = async () => {
  console.log('🌱 Seeding NoteSphere database...');

  // Ensure uploads directory exists
  const uploadsDir = path.resolve(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create sample PDF files with readable binary structure for PDF parser
  const samplePdfPath = path.join(uploadsDir, 'dsa-guide-sample.pdf');
  if (!fs.existsSync(samplePdfPath)) {
    const minimalPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 444 >> stream
BT
/F1 18 Tf
50 720 Td
(Data Structures and Algorithms Study Guide) Tj
/F1 12 Tf
0 -30 Td
(1. Binary Search Trees: A BST satisfies the binary search property where left child key <= node key <= right child key.) Tj
0 -20 Td
(2. Time Complexity: In a balanced BST (AVL or Red-Black), search, insertion, and deletion operate in O(log n) time.) Tj
0 -20 Td
(3. Graph Algorithms: Dijkstra algorithm finds the shortest path in non-negative weighted graphs using a min-priority queue in O((V + E) log V).) Tj
0 -20 Td
(4. Dynamic Programming: Optimal substructure and overlapping subproblems are the hallmarks of DP solutions.) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000740 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
811
%%EOF`;
    fs.writeFileSync(samplePdfPath, minimalPdf);
  }

  const defaultPasswordHash = bcrypt.hashSync('password123', 10);

  // 1. Users
  const users = [
    {
      id: 'usr-student-1',
      role: 'Student',
      name: 'Dharamraj',
      email: 'student@notesphere.edu',
      password_hash: defaultPasswordHash,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      college: 'National Institute of Technology (NIT)',
      degree: 'BTech',
      branch: 'Computer Science',
      semester: 'Semester 6',
      bio: 'Passionate Computer Science student exploring AI, Cloud Computing, and Algorithmic Design.',
      streak: 5,
      xp: 450
    },
    {
      id: 'usr-faculty-1',
      role: 'Faculty',
      name: 'Dr. Priya Patel',
      email: 'faculty@notesphere.edu',
      password_hash: defaultPasswordHash,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      college: 'IIT Bombay',
      degree: 'PhD',
      branch: 'Computer Science',
      semester: 'Faculty',
      bio: 'Associate Professor specializing in Operating Systems, Distributed Architecture, and Database Systems.',
      streak: 15,
      xp: 1200
    },
    {
      id: 'usr-admin-1',
      role: 'Admin',
      name: 'NoteSphere Admin',
      email: 'admin@notesphere.edu',
      password_hash: defaultPasswordHash,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      college: 'NoteSphere Academic Network',
      degree: 'MTech',
      branch: 'Computer Science',
      semester: 'Staff',
      bio: 'System Administrator and Academic Integrity Officer.',
      streak: 30,
      xp: 2500
    }
  ];

  for (const u of users) {
    query.run(`
      INSERT OR REPLACE INTO users (id, role, name, email, password_hash, avatar, college, degree, branch, semester, bio, streak, xp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [u.id, u.role, u.name, u.email, u.password_hash, u.avatar, u.college, u.degree, u.branch, u.semester, u.bio, u.streak, u.xp]);
  }

  // 2. Subjects
  const subjects = [
    { id: 'sub-dsa', name: 'Data Structures', code: 'CS301', branch: 'Computer Science', semester: 'Semester 3', description: 'Arrays, Stacks, Queues, Trees, Graphs, Sorting and Search Algorithms' },
    { id: 'sub-os', name: 'Operating Systems', code: 'CS402', branch: 'Computer Science', semester: 'Semester 4', description: 'Process synchronization, CPU scheduling, Memory management, Paging, Deadlocks' },
    { id: 'sub-dbms', name: 'DBMS', code: 'CS303', branch: 'Computer Science', semester: 'Semester 3', description: 'Relational algebra, SQL, Normalization, Transactions, ACID properties, Indexing' },
    { id: 'sub-ml', name: 'Machine Learning', code: 'AI501', branch: 'AI & ML', semester: 'Semester 6', description: 'Supervised and unsupervised learning, Regression, Classification, Neural Networks' },
    { id: 'sub-cn', name: 'Computer Networks', code: 'CS502', branch: 'Computer Science', semester: 'Semester 5', description: 'OSI 7 Layers, TCP/IP, Routing algorithms, Socket programming' },
    { id: 'sub-math', name: 'Mathematics', code: 'MA101', branch: 'Computer Science', semester: 'Semester 1', description: 'Linear algebra, Calculus, Differential equations, Probability' }
  ];

  for (const s of subjects) {
    query.run(`
      INSERT OR REPLACE INTO subjects (id, name, code, branch, semester, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [s.id, s.name, s.code, s.branch, s.semester, s.description]);
  }

  // 3. Resources
  const resources = [
    {
      id: 'note-1',
      owner_id: 'usr-student-1',
      title: 'Data Structures & Algorithms - Complete Guide',
      description: 'Comprehensive handwritten and digital notes covering arrays, lists, trees, graphs, sorting algorithms, and complexity analysis. Perfect for mid-semester and placements preparation.',
      degree: 'BTech',
      branch: 'Computer Science',
      semester: 'Semester 3',
      subject: 'Data Structures',
      resource_type: 'Handwritten Notes',
      file_name: 'dsa-guide-sample.pdf',
      file_path: 'dsa-guide-sample.pdf',
      file_hash: 'dsa-hash-sample-123',
      file_size: '12.4 MB',
      mime_type: 'application/pdf',
      download_count: 1420,
      like_count: 382,
      rating: 4.9,
      rating_count: 45,
      status: 'approved',
      visibility: 'public',
      verified: 1
    },
    {
      id: 'note-2',
      owner_id: 'usr-faculty-1',
      title: 'Operating Systems Lecture Slides & Paging Models',
      description: 'Vivid slides covering process management, CPU scheduling, deadlocks prevention, virtual memory, and inverted page tables. Verified lecture notes from top institute faculty.',
      degree: 'BTech',
      branch: 'Computer Science',
      semester: 'Semester 4',
      subject: 'Operating Systems',
      resource_type: 'PPTs',
      file_name: 'dsa-guide-sample.pdf',
      file_path: 'dsa-guide-sample.pdf',
      file_hash: 'os-hash-sample-456',
      file_size: '8.1 MB',
      mime_type: 'application/pdf',
      download_count: 890,
      like_count: 201,
      rating: 4.8,
      rating_count: 29,
      status: 'approved',
      visibility: 'public',
      verified: 1
    },
    {
      id: 'note-3',
      owner_id: 'usr-student-1',
      title: 'DBMS SQL Cheat Sheet & Practical Lab Manual',
      description: 'Hands-on query scripts covering DDL, DML, joins, nested subqueries, PL/SQL blocks, and triggers. Highly recommended for SQL practical exams.',
      degree: 'BE',
      branch: 'Computer Science',
      semester: 'Semester 3',
      subject: 'DBMS',
      resource_type: 'Cheat Sheets',
      file_name: 'dsa-guide-sample.pdf',
      file_path: 'dsa-guide-sample.pdf',
      file_hash: 'dbms-hash-sample-789',
      file_size: '2.1 MB',
      mime_type: 'application/pdf',
      download_count: 2310,
      like_count: 654,
      rating: 4.9,
      rating_count: 84,
      status: 'approved',
      visibility: 'public',
      verified: 1
    },
    {
      id: 'note-4',
      owner_id: 'usr-faculty-1',
      title: 'Introduction to Machine Learning & Neural Networks',
      description: 'Clear explanations on supervised learning, SVMs, decision trees, logistic regression, gradient descent, and loss optimization. Includes practical Python snippets.',
      degree: 'BTech',
      branch: 'AI & ML',
      semester: 'Semester 6',
      subject: 'Machine Learning',
      resource_type: 'PDFs',
      file_name: 'dsa-guide-sample.pdf',
      file_path: 'dsa-guide-sample.pdf',
      file_hash: 'ml-hash-sample-101',
      file_size: '15.6 MB',
      mime_type: 'application/pdf',
      download_count: 720,
      like_count: 190,
      rating: 4.6,
      rating_count: 18,
      status: 'approved',
      visibility: 'public',
      verified: 1
    },
    {
      id: 'note-5',
      owner_id: 'usr-admin-1',
      title: 'GATE Computer Science Previous Years Solved Papers',
      description: 'Fully solved questions for GATE CSE with step-by-step mathematical reasoning, algorithmic shortcuts, and syllabus mapping.',
      degree: 'BTech',
      branch: 'Computer Science',
      semester: 'Semester 6',
      subject: 'Data Structures',
      resource_type: 'Question Papers',
      file_name: 'dsa-guide-sample.pdf',
      file_path: 'dsa-guide-sample.pdf',
      file_hash: 'gate-hash-sample-202',
      file_size: '6.8 MB',
      mime_type: 'application/pdf',
      download_count: 3450,
      like_count: 1105,
      rating: 4.9,
      rating_count: 130,
      status: 'approved',
      visibility: 'public',
      verified: 1
    }
  ];

  for (const r of resources) {
    query.run(`
      INSERT OR REPLACE INTO resources (
        id, owner_id, title, description, degree, branch, semester, subject,
        resource_type, file_name, file_path, file_hash, file_size, mime_type,
        download_count, like_count, rating, rating_count, status, visibility, verified
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      r.id, r.owner_id, r.title, r.description, r.degree, r.branch, r.semester, r.subject,
      r.resource_type, r.file_name, r.file_path, r.file_hash, r.file_size, r.mime_type,
      r.download_count, r.like_count, r.rating, r.rating_count, r.status, r.visibility, r.verified
    ]);
  }

  // 4. Initial Bookmarks & Likes for Student
  query.run(`INSERT OR IGNORE INTO bookmarks (user_id, resource_id) VALUES (?, ?)`, ['usr-student-1', 'note-1']);
  query.run(`INSERT OR IGNORE INTO bookmarks (user_id, resource_id) VALUES (?, ?)`, ['usr-student-1', 'note-3']);
  query.run(`INSERT OR IGNORE INTO likes (user_id, resource_id) VALUES (?, ?)`, ['usr-student-1', 'note-1']);
  query.run(`INSERT OR IGNORE INTO downloads (id, user_id, resource_id) VALUES (?, ?, ?)`, ['dl-1', 'usr-student-1', 'note-1']);
  query.run(`INSERT OR IGNORE INTO downloads (id, user_id, resource_id) VALUES (?, ?, ?)`, ['dl-2', 'usr-student-1', 'note-2']);

  // Ratings
  query.run(`
    INSERT OR REPLACE INTO ratings (id, user_id, resource_id, rating, review)
    VALUES (?, ?, ?, ?, ?)
  `, ['rate-1', 'usr-student-1', 'note-1', 5.0, 'Incredible resource! The recursion trees and AVL rotation diagrams helped me ace my midterm!']);

  // 5. Videos
  const videos = [
    {
      id: 'vid-1',
      owner_id: 'usr-faculty-1',
      subject: 'Data Structures',
      module: 'Dynamic Programming',
      degree: 'BTech',
      branch: 'Computer Science',
      semester: 'Semester 3',
      title: 'Dynamic Programming Complete Course (0-1 Knapsack, LIS, LCS)',
      description: 'Deep dive lecture on solving complex recursion problems using memoization and tabulation.',
      youtube_id: 'Hdr64lKQ3e4',
      video_url: 'https://www.youtube.com/embed/Hdr64lKQ3e4',
      duration: '45 mins',
      like_count: 4500,
      view_count: 120000
    },
    {
      id: 'vid-2',
      owner_id: 'usr-faculty-1',
      subject: 'DBMS',
      module: 'SQL Queries & Joins',
      degree: 'BTech',
      branch: 'Computer Science',
      semester: 'Semester 3',
      title: 'SQL Joins, Indexing and Subqueries Masterclass',
      description: 'Learn Inner, Left, Right, Full Outer Joins along with B-Tree index lookups in PostgreSQL and MySQL.',
      youtube_id: '7S_tz1z_5bA',
      video_url: 'https://www.youtube.com/embed/7S_tz1z_5bA',
      duration: '28 mins',
      like_count: 2300,
      view_count: 65000
    },
    {
      id: 'vid-3',
      owner_id: 'usr-faculty-1',
      subject: 'Machine Learning',
      module: 'Neural Networks',
      degree: 'BTech',
      branch: 'AI & ML',
      semester: 'Semester 6',
      title: 'Neural Networks & Backpropagation Visual Intuition',
      description: 'Visual and mathematical intuition behind gradient descent, cost functions, and weight matrix calculus.',
      youtube_id: 'aircAruvnKk',
      video_url: 'https://www.youtube.com/embed/aircAruvnKk',
      duration: '20 mins',
      like_count: 9400,
      view_count: 420000
    }
  ];

  for (const v of videos) {
    query.run(`
      INSERT OR REPLACE INTO videos (id, owner_id, subject, module, degree, branch, semester, title, description, youtube_id, video_url, duration, like_count, view_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [v.id, v.owner_id, v.subject, v.module, v.degree, v.branch, v.semester, v.title, v.description, v.youtube_id, v.video_url, v.duration, v.like_count, v.view_count]);
  }

  // 6. Discussions & Replies
  query.run(`
    INSERT OR REPLACE INTO discussions (id, user_id, title, description, tags, upvotes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    'disc-1',
    'usr-student-1',
    'How to understand the Backpropagation algorithm mathematically?',
    'I am having a hard time understanding the chain rule applications and partial derivatives calculation for updating weight matrices in a Multi-Layer Perceptron. Can anyone break it down simple?',
    'Deep Learning,Mathematics,AI',
    42,
    'active'
  ]);

  query.run(`
    INSERT OR REPLACE INTO replies (id, discussion_id, user_id, content, upvotes, is_best_answer)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    'rep-1',
    'disc-1',
    'usr-faculty-1',
    'The main intuition is computing the gradient of the loss function with respect to each parameter. Using the chain rule: dLoss/dWeight = (dLoss/dActivation) * (dActivation/dWeightedInput) * (dWeightedInput/dWeight). In vector form, this propagates backward layer by layer.',
    12,
    1
  ]);

  query.run(`
    INSERT OR REPLACE INTO discussions (id, user_id, title, description, tags, upvotes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    'disc-2',
    'usr-student-1',
    'Why do relational databases choose B+ Trees over B-Trees for primary indexing?',
    'I am confused about why indexing engines prefer B+ Trees over standard B-Trees for database range queries. Is fan-out the main reason?',
    'DBMS,Indexing,Data Structures',
    28,
    'active'
  ]);

  // 7. Study Groups
  const groups = [
    {
      id: 'grp-1',
      owner_id: 'usr-student-1',
      name: 'UPSC Civil Services Academic Circle 2026',
      description: 'Study group focusing on General Studies, History optional, and current affairs analysis.',
      category: 'Competitive Exams',
      next_session: 'Today, 08:00 PM (IST)'
    },
    {
      id: 'grp-2',
      owner_id: 'usr-faculty-1',
      name: 'Machine Learning & AI Research Circle',
      description: 'Discussing recent paper publications, PyTorch architectures, and deep learning algorithms.',
      category: 'AI & ML',
      next_session: 'Tomorrow, 06:30 PM (IST)'
    },
    {
      id: 'grp-3',
      owner_id: 'usr-student-1',
      name: 'GATE CSE Complete Preparation 2027',
      description: 'Cooperative circle solving PYQs, algorithms, computer architecture, and taking timed mock tests.',
      category: 'Competitive Exams',
      next_session: 'Saturday, 04:00 PM (IST)'
    }
  ];

  for (const g of groups) {
    query.run(`
      INSERT OR REPLACE INTO groups (id, owner_id, name, description, category, next_session)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [g.id, g.owner_id, g.name, g.description, g.category, g.next_session]);

    query.run(`
      INSERT OR REPLACE INTO group_members (id, group_id, user_id, role)
      VALUES (?, ?, ?, ?)
    `, [`gm-${g.id}-owner`, g.id, g.owner_id, 'owner']);
  }

  // Join student to ML group
  query.run(`
    INSERT OR REPLACE INTO group_members (id, group_id, user_id, role)
    VALUES (?, ?, ?, ?)
  `, ['gm-grp-2-student', 'grp-2', 'usr-student-1', 'member']);

  // 8. Question Banks & Academic Exam Questions
  const qbId = 'qb-cs-midterm';
  query.run(`
    INSERT OR REPLACE INTO question_banks (id, owner_id, subject, module, title, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [qbId, 'usr-faculty-1', 'Computer Science', 'Core Concepts', 'CS Midterm Question Bank', 'High yield questions for Data Structures, OS, and DBMS']);

  const questions = [
    {
      id: 'q-1',
      question_bank_id: qbId,
      subject: 'Data Structures',
      topic: 'Binary Search Trees',
      type: 'MCQ',
      question: 'What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?',
      options_json: JSON.stringify(['O(1)', 'O(log n)', 'O(n)', 'O(n log n)']),
      answer: 'O(n)',
      explanation: 'In the worst case, an unbalanced BST degenerates into a linear singly-linked list (skewed tree), making the search complexity O(n).',
      difficulty: 'easy',
      marks: 1
    },
    {
      id: 'q-2',
      question_bank_id: qbId,
      subject: 'Operating Systems',
      topic: 'CPU Scheduling',
      type: 'MCQ',
      question: 'Which CPU scheduling algorithm is non-preemptive and provably achieves the minimum average waiting time for a given set of processes?',
      options_json: JSON.stringify(['Round Robin (RR)', 'Shortest Job First (SJF)', 'Priority Scheduling', 'First Come First Served (FCFS)']),
      answer: 'Shortest Job First (SJF)',
      explanation: 'Shortest Job First (SJF) is optimal because moving a short job before a long one decreases the waiting time of the short job more than it increases the waiting time of the long job.',
      difficulty: 'medium',
      marks: 1
    },
    {
      id: 'q-3',
      question_bank_id: qbId,
      subject: 'DBMS',
      topic: 'Transactions & ACID',
      type: 'MCQ',
      question: 'In database management systems, which ACID property ensures that transactions execute concurrently without seeing intermediate states of one another?',
      options_json: JSON.stringify(['Atomicity', 'Consistency', 'Isolation', 'Durability']),
      answer: 'Isolation',
      explanation: 'Isolation ensures that concurrent execution of transactions results in a system state that would be obtained if transactions were executed serially.',
      difficulty: 'easy',
      marks: 1
    },
    {
      id: 'q-4',
      question_bank_id: qbId,
      subject: 'Data Structures',
      topic: 'Graph Algorithms',
      type: 'MCQ',
      question: 'Dijkstra algorithm for single-source shortest path is not guaranteed to work correctly in graphs containing:',
      options_json: JSON.stringify(['Cycles', 'Negative weight edges', 'Disconnected components', 'Undirected edges']),
      answer: 'Negative weight edges',
      explanation: 'Dijkstra greedy assumption fails when negative edge weights exist because once a node is marked visited, its distance is never reconsidered. Bellman-Ford must be used instead.',
      difficulty: 'medium',
      marks: 1
    },
    {
      id: 'q-5',
      question_bank_id: qbId,
      subject: 'Operating Systems',
      topic: 'Deadlocks',
      type: 'MCQ',
      question: 'Which of the following conditions is NOT one of Coffman four necessary conditions for a deadlock to occur?',
      options_json: JSON.stringify(['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait']),
      answer: 'Preemption Allowed',
      explanation: 'The necessary condition is No Preemption. If preemption is allowed, resources can be forcibly reclaimed, breaking the deadlock.',
      difficulty: 'medium',
      marks: 1
    },
    {
      id: 'q-6',
      question_bank_id: qbId,
      subject: 'Data Structures',
      topic: 'Sorting & Complexity',
      type: 'MCQ',
      question: 'What is the tight lower bound on the comparison-based sorting of n elements in the worst case?',
      options_json: JSON.stringify(['Omega(n)', 'Omega(n log n)', 'Omega(n^2)', 'Omega(log n)']),
      answer: 'Omega(n log n)',
      explanation: 'Using the decision tree model, any comparison-based sort has at least n! leaves, meaning tree height is at least log2(n!) = Omega(n log n).',
      difficulty: 'hard',
      marks: 1
    },
    {
      id: 'q-7',
      question_bank_id: qbId,
      subject: 'DBMS',
      topic: 'Normalization',
      type: 'MCQ',
      question: 'A relational table is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:',
      options_json: JSON.stringify(['Y is a prime attribute', 'X is a superkey', 'X is a foreign key', 'Both X and Y are candidate keys']),
      answer: 'X is a superkey',
      explanation: 'BCNF is a stricter version of 3NF. In BCNF, for every functional dependency X -> Y, X must be a superkey of the table.',
      difficulty: 'hard',
      marks: 1
    },
    {
      id: 'q-8',
      question_bank_id: qbId,
      subject: 'Operating Systems',
      topic: 'Virtual Memory',
      type: 'MCQ',
      question: 'Belady anomaly in page replacement occurs primarily in which algorithm?',
      options_json: JSON.stringify(['Least Recently Used (LRU)', 'Optimal Page Replacement', 'First In First Out (FIFO)', 'Least Frequently Used (LFU)']),
      answer: 'First In First Out (FIFO)',
      explanation: 'Belady anomaly is the phenomenon where increasing the number of page frames results in an increase in page faults. It occurs in FIFO because FIFO does not possess the stack property.',
      difficulty: 'medium',
      marks: 1
    }
  ];

  for (const q of questions) {
    query.run(`
      INSERT OR REPLACE INTO questions (id, question_bank_id, subject, topic, type, question, options_json, answer, explanation, difficulty, marks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [q.id, q.question_bank_id, q.subject, q.topic, q.type, q.question, q.options_json, q.answer, q.explanation, q.difficulty, q.marks]);
  }

  // 9. Timed Mock Test
  const testId = 'test-cs-mock-1';
  query.run(`
    INSERT OR REPLACE INTO tests (id, owner_id, title, description, subject, duration_minutes, total_marks, passing_marks, negative_marking, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    testId,
    'usr-faculty-1',
    'CS Engineering Midterm Mock Examination 2026',
    'Comprehensive timed assessment covering Data Structures, Operating Systems, and Database Management. Contains randomized questions with negative marking.',
    'Computer Science',
    15,
    8,
    4,
    0.25,
    'published'
  ]);

  // Map test questions
  for (let i = 0; i < questions.length; i++) {
    query.run(`
      INSERT OR REPLACE INTO test_questions (id, test_id, question_id, order_index, marks)
      VALUES (?, ?, ?, ?, ?)
    `, [`tq-${testId}-${i}`, testId, questions[i].id, i + 1, 1]);
  }

  // Sample student completed attempt for analytics
  query.run(`
    INSERT OR REPLACE INTO attempts (id, test_id, user_id, score, total_marks, accuracy, time_spent_seconds, weak_topics_json, passed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'att-demo-1',
    testId,
    'usr-student-1',
    6.75,
    8.0,
    87.5,
    420,
    JSON.stringify(['Virtual Memory Belady Anomaly', 'Normalization BCNF']),
    1
  ]);

  // 10. Gamification Badges
  const badgesList = [
    { key: 'scholar-explorer', name: 'Scholar Explorer', description: 'Read or download 5 different study resources.', icon: '📚' },
    { key: 'knowledge-contributor', name: 'Knowledge Contributor', description: 'Upload your first study notes material.', icon: '🚀' },
    { key: 'deep-focus-master', name: 'Deep Focus Master', description: 'Complete a 4-cycle Pomodoro focus session.', icon: '⏱️' },
    { key: 'community-helper', name: 'Community Helper', description: 'Provide a helpful answer in the discussion forum.', icon: '🤝' },
    { key: 'exam-warrior', name: 'Exam Warrior', description: 'Score 80%+ on an academic timed mock test.', icon: '🎯' },
    { key: 'consistent-thinker', name: 'Consistent Thinker', description: 'Maintain a 5-day continuous study streak.', icon: '🔥' }
  ];

  for (const b of badgesList) {
    query.run(`
      INSERT OR REPLACE INTO user_badges (id, user_id, badge_key, name, description, icon)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [`ub-${b.key}-student`, 'usr-student-1', b.key, b.name, b.description, b.icon]);
  }

  // 11. Initial Notifications
  const notifs = [
    { id: 'notif-1', user_id: 'usr-student-1', type: 'download', title: 'Download Complete', message: '"Data Structures & Algorithms - Complete Guide" is now available offline.', target_url: '/downloads' },
    { id: 'notif-2', user_id: 'usr-student-1', type: 'upload', title: 'New Faculty Resource', message: 'Dr. Priya Patel uploaded "Operating Systems Lecture Slides".', target_url: '/browse' },
    { id: 'notif-3', user_id: 'usr-student-1', type: 'test', title: 'Mock Test Available', message: 'CS Engineering Midterm Mock Examination 2026 is live for practice.', target_url: '/exams' }
  ];

  for (const n of notifs) {
    query.run(`
      INSERT OR REPLACE INTO notifications (id, user_id, type, title, message, target_url, read)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [n.id, n.user_id, n.type, n.title, n.message, n.target_url, 0]);
  }

  console.log('✅ NoteSphere database successfully seeded with users, resources, tests, and community data!');
};

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}
