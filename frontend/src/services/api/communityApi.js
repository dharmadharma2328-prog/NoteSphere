import api from './client.js';

export const communityApi = {
  getGroups: (params) => api.get('/community/groups', params),
  createGroup: (group) => api.post('/community/groups', group),
  toggleJoinGroup: (id) => api.post(`/community/groups/${id}/join`),
  getDiscussions: (params) => api.get('/community/discussions', params),
  createDiscussion: (discussion) => api.post('/community/discussions', discussion),
  addReply: (id, content) => api.post(`/community/discussions/${id}/reply`, { content }),
  voteDiscussion: (id, value = 1) => api.post(`/community/discussions/${id}/vote`, { value }),
  getLeaderboard: () => api.get('/community/leaderboard')
};

export default communityApi;
