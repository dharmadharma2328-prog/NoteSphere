import api from './client.js';

export const aiApi = {
  chat: async (message, context = '', level = 'intermediate', history = []) => {
    return api.post('/ai/chat', { message, context, level, history });
  },

  summarize: async (text, topic = '') => {
    return api.post('/ai/summarize', { text, topic });
  },

  generateQuestions: async (topic, count = 5) => {
    return api.post('/ai/generate-questions', { topic, count });
  },

  generateMcqs: async (topic, count = 4, difficulty = 'medium') => {
    return api.post('/ai/generate-mcq', { topic, count, difficulty });
  },

  generateFlashcards: async (topic, count = 6) => {
    return api.post('/ai/flashcards', { topic, count });
  },

  generateStudyPlan: async (subject, daysRemaining = 7, hoursPerDay = 3) => {
    return api.post('/ai/study-plan', { subject, daysRemaining, hoursPerDay });
  }
};

export default aiApi;
