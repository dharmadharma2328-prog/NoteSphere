import api from './client.js';

export const ragApi = {
  index: async (resourceId) => {
    return api.post(`/rag/${resourceId}/index`);
  },

  getStatus: async (resourceId) => {
    return api.get(`/rag/${resourceId}/status`);
  },

  chat: async (resourceId, question) => {
    return api.post(`/rag/${resourceId}/chat`, { question });
  }
};

export default ragApi;
