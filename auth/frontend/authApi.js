import api from '../../frontend/src/services/api/client.js';

export const authApi = {
  login: async (credentials) => {
    const data = await api.post('/auth/login', credentials);
    if (data.token) {
      api.setToken(data.token);
    }
    return data;
  },

  signup: async (userData) => {
    const data = await api.post('/auth/signup', userData);
    if (data.token) {
      api.setToken(data.token);
    }
    return data;
  },

  getMe: async () => {
    return api.get('/auth/me');
  },

  updateProfile: async (profileData) => {
    return api.put('/auth/profile', profileData);
  },

  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (email, newPassword) => {
    return api.post('/auth/reset-password', { email, newPassword });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      api.setToken(null);
    }
  }
};

export default authApi;
