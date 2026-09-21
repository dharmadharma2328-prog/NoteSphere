import api from './client.js';

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getResources: () => api.get('/admin/resources'),
  updateResourceModeration: (id, status) => api.patch(`/admin/resources/${id}/moderation`, { status }),
  getReports: () => api.get('/admin/reports'),
  resolveReport: (id, resolution, notes = '') => api.patch(`/admin/reports/${id}/resolve`, { resolution, notes })
};

export default adminApi;
