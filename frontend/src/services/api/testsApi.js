import api from './client.js';

export const testsApi = {
  getTests: async (subject = '') => {
    return api.get('/tests', subject ? { subject } : undefined);
  },

  getTestById: async (id) => {
    return api.get(`/tests/${id}`);
  },

  submitTest: async (id, answers, timeSpentSeconds) => {
    return api.post(`/tests/${id}/submit`, { answers, timeSpentSeconds });
  },

  getAttemptById: async (attemptId) => {
    return api.get(`/tests/attempts/${attemptId}`);
  },

  getPracticeQuestions: async (subject = '', difficulty = '', limit = 10) => {
    return api.get('/tests/practice', { subject, difficulty, limit });
  }
};

export default testsApi;
