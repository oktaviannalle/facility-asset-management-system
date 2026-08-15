import axiosClient from './axiosClient';

const maintenanceLogService = {
  getAll: () => axiosClient.get('/maintenance-logs'),
  create: (payload) => axiosClient.post('/maintenance-logs', payload),
  update: (id, payload) => axiosClient.put(`/maintenance-logs/${id}`, payload),
  delete: (id) => axiosClient.delete(`/maintenance-logs/${id}`),
};

export default maintenanceLogService;
