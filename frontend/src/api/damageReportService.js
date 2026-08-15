import axiosClient from './axiosClient';

const damageReportService = {
  getAll: () => axiosClient.get('/damage-reports'),
  create: (payload) => axiosClient.post('/damage-reports', payload),
  update: (id, payload) => axiosClient.put(`/damage-reports/${id}`, payload),
  delete: (id) => axiosClient.delete(`/damage-reports/${id}`),
};

export default damageReportService;
