// Comprehensive mock data for NoteSphere platform

export const categories = {
  classes: ["School", "PUC", "Diploma", "UG", "PG", "PhD", "Competitive Exams", "Certifications"],
  degrees: [
    "BTech", "BE", "BCA", "MCA", "BSc", "MSc", "BBA", "MBA", "BCom", "MCom", 
    "BA", "MA", "Polytechnic", "MBBS", "BDS", "Nursing", "Law", "Architecture", 
    "Data Science", "AI & ML", "Cybersecurity", "Cloud Computing", "DevOps", 
    "UI/UX", "CA", "CS", "CMA"
  ],
  branches: [
    "Computer Science", "Information Science", "AI & ML", "Data Science", 
    "Cybersecurity", "Electronics", "Electrical", "Mechanical", "Civil", 
    "Chemical", "Biotechnology", "Aerospace", "Robotics", "IoT", "Mechatronics", 
    "Automobile", "Finance", "Marketing", "HR", "Physics", "Chemistry", 
    "Mathematics", "Commerce", "Economics", "English", "History", "Political Science"
  ],
  semesters: [
    "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", 
    "Semester 6", "Semester 7", "Semester 8", "Semester 9", "Semester 10", 
    "Semester 11", "Semester 12", "Year 1", "Year 2", "Year 3", "Year 4", 
    "Final Year", "Internship", "Research"
  ],
  subjects: [
    "Physics", "Chemistry", "Mathematics", "Python", "C Programming", "Java", 
    "JavaScript", "DBMS", "Operating Systems", "ADA", "Computer Networks", 
    "Machine Learning", "Deep Learning", "AI", "Software Engineering", 
    "Cloud Computing", "Cybersecurity", "Blockchain", "IoT", "Data Structures", 
    "Algorithms", "Digital Electronics", "Microprocessors", "Web Development", 
    "Mobile App Development", "Compiler Design", "Unix", "Statistics", "Economics", 
    "Accounting", "Finance", "Marketing", "HR Management", "Thermodynamics", 
    "Fluid Mechanics", "Structural Analysis", "CAD", "Engineering Graphics", 
    "Aptitude", "Quantitative Reasoning", "Verbal Ability", "UPSC", "GATE", 
    "NEET", "JEE", "CET", "CAT", "IELTS", "TOEFL"
  ],
  resourceTypes: [
    { value: "PDFs", label: "PDF Documents" },
    { value: "Handwritten Notes", label: "Handwritten Notes" },
    { value: "PPTs", label: "Presentation Slides (PPT)" },
    { value: "Lab Manuals", label: "Lab Manuals" },
    { value: "Question Papers", label: "Question Papers (PYQs)" },
    { value: "Assignments", label: "Assignments & Solutions" },
    { value: "Mini Projects", label: "Mini Projects" },
    { value: "Research Papers", label: "Research Papers" },
    { value: "YouTube Videos", label: "Video Lectures" },
    { value: "Playlists", label: "Playlists" },
    { value: "Cheat Sheets", label: "Cheat Sheets" },
    { value: "E-books", label: "E-books" },
    { value: "Audio Notes", label: "Audio Notes" }
  ]
};

// School specific categories
categories.schoolGrades = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

categories.boards = [
  'CBSE', 'ICSE', 'State Board', 'IGCSE', 'Other'
];

export const initialNotes = [
  {
    id: "note-1",
    title: "Data Structures & Algorithms - Complete Guide",
    description: "Comprehensive handwritten and digital notes covering arrays, lists, trees, graphs, sorting algorithms, and complexity analysis. Perfect for mid-semester and placements preparation.",
    subject: "Data Structures",
    semester: "Semester 3",
    branch: "Computer Science",
    degree: "BTech",
    resourceType: "Handwritten Notes",
    uploader: {
      name: "Aarav Sharma",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
      reputation: 4.8
    },
    downloadCount: 1420,
    likeCount: 382,
    rating: 4.9,
    fileSize: "12.4 MB",
    uploadDate: "2026-04-12",
    isPremium: false,
    offlineAvailable: true,
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "note-2",
    title: "Operating Systems Lecture Slides",
    description: "Vivid slides covering process management, scheduling, deadlocks, memory management, and file systems. Used in top autonomous institutions.",
    subject: "Operating Systems",
    semester: "Semester 4",
    branch: "Computer Science",
    degree: "BCA",
    resourceType: "PPTs",
    uploader: {
      name: "Dr. Priya Patel",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      reputation: 4.9
    },
    downloadCount: 890,
    likeCount: 201,
    rating: 4.7,
    fileSize: "8.1 MB",
    uploadDate: "2026-05-02",
    isPremium: false,
    offlineAvailable: true,
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "note-3",
    title: "DBMS SQL Cheat Sheet & Lab Manual",
    description: "Hands-on guide with query scripts covering DDL, DML, joins, subqueries, PL/SQL blocks, and triggers. Highly recommended for SQL practical exams.",
    subject: "DBMS",
    semester: "Semester 3",
    branch: "Information Science",
    degree: "BE",
    resourceType: "Cheat Sheets",
    uploader: {
      name: "Rohit Deshmukh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      reputation: 4.5
    },
    downloadCount: 2310,
    likeCount: 654,
    rating: 4.8,
    fileSize: "2.1 MB",
    uploadDate: "2026-05-10",
    isPremium: false,
    offlineAvailable: false,
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "note-4",
    title: "Introduction to Machine Learning Notes",
    description: "Clear explanations on supervised learning, unsupervised learning, SVMs, decision trees, and linear regression models. Includes basic python code blocks.",
    subject: "Machine Learning",
    semester: "Semester 6",
    branch: "AI & ML",
    degree: "Data Science",
    resourceType: "PDFs",
    uploader: {
      name: "Sneha Nair",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      reputation: 4.7
    },
    downloadCount: 720,
    likeCount: 190,
    rating: 4.6,
    fileSize: "15.6 MB",
    uploadDate: "2026-05-18",
    isPremium: true,
    offlineAvailable: true,
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "note-5",
    title: "GATE CSE 2025 Previous Year Solved Paper",
    description: "Fully solved question paper for GATE Computer Science with detailed section-wise explanations, shortcuts, and references.",
    subject: "GATE",
    semester: "Final Year",
    branch: "Computer Science",
    degree: "BE",
    resourceType: "Question Papers",
    uploader: {
      name: "NoteSphere Admin",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
      reputation: 5.0
    },
    downloadCount: 3450,
    likeCount: 1105,
    rating: 4.9,
    fileSize: "6.8 MB",
    uploadDate: "2026-02-28",
    isPremium: false,
    offlineAvailable: false,
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "note-6",
    title: "Organic Chemistry Reactions Quick Revision Guide",
    description: "Summarized chart sheet of named reactions, mechanisms (SN1, SN2, E1, E2), and electrophilic additions. Great for quick exam revisions.",
    subject: "Chemistry",
    semester: "Year 1",
    branch: "Chemistry",
    degree: "BSc",
    resourceType: "Cheat Sheets",
    uploader: {
      name: "Karan Mehta",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      reputation: 4.4
    },
    downloadCount: 1890,
    likeCount: 512,
    rating: 4.8,
    fileSize: "3.4 MB",
    uploadDate: "2026-05-12",
    isPremium: false,
    offlineAvailable: true,
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "note-7",
    title: "Engineering Thermodynamics Notes",
    description: "Covers First and Second Laws of Thermodynamics, entropy, Carnot cycle, and pure substance behavior. Contains step-by-step numerical solutions.",
    subject: "Thermodynamics",
    semester: "Semester 3",
    branch: "Mechanical",
    degree: "BTech",
    resourceType: "Handwritten Notes",
    uploader: {
      name: "Vikram R.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      reputation: 4.6
    },
    downloadCount: 540,
    likeCount: 110,
    rating: 4.5,
    fileSize: "18.2 MB",
    uploadDate: "2026-05-15",
    isPremium: false,
    offlineAvailable: false,
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

export const initialVideos = [
  {
    id: "vid-1",
    title: "Dynamic Programming Complete Course (0-1 Knapsack, LIS, Matrix Chain)",
    description: "Deep dive lecture on solving complex competitive programming recursion problems using dynamic programming (Memoization & Tabulation approach).",
    subject: "Algorithms",
    semester: "Semester 4",
    branch: "Computer Science",
    degree: "BTech",
    uploader: "Abdul Bari (Simulated)",
    youtubeId: "Hdr64lKQ3e4", // Example YT code (placeholder video for DP)
    videoUrl: "https://www.youtube.com/embed/Hdr64lKQ3e4",
    duration: "45 mins",
    likeCount: 4500,
    viewCount: 120000,
    playlist: [
      { id: "p1", title: "Introduction to Dynamic Programming", duration: "12 mins" },
      { id: "p2", title: "Memoization vs Tabulation explained", duration: "18 mins" },
      { id: "p3", title: "0/1 Knapsack Problem Tutorial", duration: "25 mins" },
      { id: "p4", title: "Longest Common Subsequence (LCS)", duration: "22 mins" }
    ],
    chapters: [
      { time: "00:00", title: "Overview and Motivation" },
      { time: "05:15", title: "Revisiting Fibonacci Recursion" },
      { time: "15:30", title: "Understanding the DP Table Structure" },
      { time: "30:45", title: "Trace analysis of 0/1 Knapsack" }
    ]
  },
  {
    id: "vid-2",
    title: "SQL Joins and Subqueries Crash Course",
    description: "Learn Inner, Left, Right, Full Outer Joins along with Nested & Correlated Queries in PostgreSQL/MySQL database server.",
    subject: "DBMS",
    semester: "Semester 3",
    branch: "Computer Science",
    degree: "BCA",
    uploader: "CodewithHarry (Simulated)",
    youtubeId: "7S_tz1z_5bA",
    videoUrl: "https://www.youtube.com/embed/7S_tz1z_5bA",
    duration: "28 mins",
    likeCount: 2300,
    viewCount: 65000,
    playlist: [
      { id: "s1", title: "DBMS Intro & SQL Basics", duration: "15 mins" },
      { id: "s2", title: "SQL Select, Insert, Update statements", duration: "10 mins" },
      { id: "s3", title: "Understanding SQL Joins (This Video)", duration: "28 mins" },
      { id: "s4", title: "Database Normalization (1NF, 2NF, 3NF)", duration: "32 mins" }
    ],
    chapters: [
      { time: "00:00", title: "Introduction to Joins" },
      { time: "04:20", title: "Inner Join demonstration" },
      { time: "11:10", title: "Left & Right Outer Joins" },
      { time: "20:00", title: "Nested Subqueries" }
    ]
  },
  {
    id: "vid-3",
    title: "Neural Networks & Deep Learning Intuition",
    description: "Visual and mathematical intuition behind neural networks, cost functions, forward propagation, backward propagation, and gradient descent optimization.",
    subject: "Deep Learning",
    semester: "Semester 7",
    branch: "AI & ML",
    degree: "BTech",
    uploader: "3Blue1Brown (Simulated)",
    youtubeId: "aircAruvnKk",
    videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
    duration: "20 mins",
    likeCount: 9400,
    viewCount: 420000,
    playlist: [
      { id: "d1", title: "What is a Neural Network?", duration: "20 mins" },
      { id: "d2", title: "Gradient Descent and Backpropagation Math", duration: "25 mins" },
      { id: "d3", title: "CNNs and Image Recognition Basics", duration: "18 mins" }
    ],
    chapters: [
      { time: "00:00", title: "Neurons and Activations" },
      { time: "06:30", title: "Weights and Biases Visualized" },
      { time: "12:15", title: "Cost Function & Goal of Learning" }
    ]
  }
];

export const initialDiscussions = [
  {
    id: "disc-1",
    title: "How to understand the Backpropagation algorithm mathematically?",
    description: "I am having a hard time understanding the chain rule applications and partial derivatives calculation for updating weight matrices in a Multi-Layer Perceptron. Can anyone break it down simple or recommend a visual guide?",
    tags: ["Deep Learning", "Mathematics", "AI"],
    upvotes: 42,
    uploader: {
      name: "Tushar Gupta",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150"
    },
    replies: [
      {
        id: "r-1",
        author: "Sneha Nair",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        content: "Check out Calculus Volume 3 or the 3Blue1Brown neural networks series. The main idea is that you're computing the gradient of the loss function with respect to each weight. Using chain rule, dLoss/dWeight = (dLoss/dActivation) * (dActivation/dWeightedInput) * (dWeightedInput/dWeight).",
        date: "2026-05-24",
        upvotes: 12
      }
    ],
    date: "2026-05-23"
  },
  {
    id: "disc-2",
    title: "What is the difference between B-Trees and B+ Trees in Databases?",
    description: "I'm studying for my DBMS midterms and I am confused about why indexing engines prefer B+ Trees over B-Trees for database range queries. Isn't a B-Tree shorter in depth?",
    tags: ["DBMS", "Data Structures", "Indexing"],
    upvotes: 28,
    uploader: {
      name: "Ananya Roy",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    replies: [
      {
        id: "r-2",
        author: "Aarav Sharma",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
        content: "In B+ Trees, data pointers are stored only in the leaf nodes, while the internal nodes contain only key indexing values. This means internal nodes are smaller, allowing a much higher branching factor (fan-out), which makes depth smaller. Crucially, the leaves in a B+ Tree are linked together in a linked list, allowing highly efficient sequential/range scanning.",
        date: "2026-05-25",
        upvotes: 8
      }
    ],
    date: "2026-05-24"
  }
];

export const initialGroups = [
  {
    id: "grp-1",
    name: "UPSC Civil Services Prep 2026",
    description: "Study circle focusing on General Studies, History optional, and Current Affairs discussion.",
    category: "Competitive Exams",
    members: 142,
    onlineCount: 18,
    isJoined: false,
    nextSession: "Today, 08:00 PM (IST)"
  },
  {
    id: "grp-2",
    name: "Machine Learning & AI Research Circle",
    description: "Discussing recent paper publications, ML project architectures, and learning PyTorch/TensorFlow.",
    category: "AI & ML",
    members: 310,
    onlineCount: 32,
    isJoined: true,
    nextSession: "Tomorrow, 06:30 PM (IST)"
  },
  {
    id: "grp-3",
    name: "GATE CSE Preparation 2027",
    description: "Cooperative group solving PYQs, discussing syllabus schedules, and taking weekly mock quizzes.",
    category: "Competitive Exams",
    members: 580,
    onlineCount: 74,
    isJoined: false,
    nextSession: "May 29, 04:00 PM (IST)"
  },
  {
    id: "grp-4",
    name: "Web Developers Hack Space",
    description: "Frontend & Backend development study group. Exploring React, NextJS, Node, and Tailwind UI designs.",
    category: "Computer Science",
    members: 245,
    onlineCount: 22,
    isJoined: false,
    nextSession: "May 30, 07:00 PM (IST)"
  }
];

export const badges = [
  { id: "b-1", name: "Scholar Explorer", description: "Read or download 5 different study resources.", icon: "📚", unlocked: true },
  { id: "b-2", name: "Knowledge Contributor", description: "Upload your first study notes material.", icon: "🚀", unlocked: false },
  { id: "b-3", name: "Deep Focus Master", description: "Complete a 4-cycle Pomodoro study session.", icon: "⏱️", unlocked: true },
  { id: "b-4", name: "Community Helper", description: "Get an upvote on your replies in the forum.", icon: "🤝", unlocked: false },
  { id: "b-5", name: "Consistent Thinker", description: "Maintain a 5-day study streak on NoteSphere.", icon: "🔥", unlocked: true }
];

export const testimonials = [
  {
    quote: "NoteSphere has transformed my study schedule. Finding high-quality handwritten notes for engineering subjects used to take hours. Now it's instant!",
    student: "Aditya Verma",
    college: "IIT Bombay - Computer Science",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120"
  },
  {
    quote: "The interactive video player with side notes integration is amazing. I can watch algorithms lectures and read cheat sheets simultaneously.",
    student: "Ritu Kapoor",
    college: "Delhi Technological University - IT",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120"
  },
  {
    quote: "Offline mode and PWA capability are lifesavers when studying on the train where network is unstable. Highly recommended!",
    student: "Siddharth Sen",
    college: "RV College of Engineering - ECE",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120"
  }
];

export const defaultUserProfile = {
  name: "Dharamraj",
  college: "National Institute of Technology (NIT)",
  degree: "BTech",
  branch: "Computer Science",
  semester: "Semester 6",
  bio: "Passionate Computer Science student exploring AI, Cloud Computing, and Algorithmic Design. NoteSphere editor and library collector.",
  streak: 5,
  skills: ["React.js", "Java", "Python", "Data Structures", "Machine Learning"],
  followers: 124,
  following: 89,
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  banner: "linear-gradient(135deg, #0284c7 0%, #6366f1 100%)",
  uploadsCount: 4,
  downloadsCount: 18,
  savedCount: 9
};
