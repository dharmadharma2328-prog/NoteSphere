import api from './client.js';

export const resourcesApi = {
  getAll: async (params) => {
    return api.get('/resources', params);
  },

  getById: async (id) => {
    return api.get(`/resources/${id}`);
  },

  create: async (formData) => {
    return api.post('/resources', formData, { isFormData: true });
  },

  toggleLike: async (id) => {
    return api.post(`/resources/${id}/like`);
  },

  toggleBookmark: async (id) => {
    return api.post(`/resources/${id}/bookmark`);
  },

  recordDownload: async (id) => {
    return api.post(`/resources/${id}/download`);
  },

  rate: async (id, rating, review) => {
    return api.post(`/resources/${id}/rate`, { rating, review });
  },

  report: async (id, reason) => {
    return api.post(`/resources/${id}/report`, { reason });
  },

  getFileUrl: (id) => {
    return `${api.baseUrl}/resources/${id}/file`;
  }
};

export default resourcesApi;
