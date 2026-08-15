import axiosClient from './axiosClient';

const maintenanceScheduleService = {
  getAll: () => axiosClient.get('/maintenance-schedules'),
  create: (payload) => axiosClient.post('/maintenance-schedules', payload),
  update: (id, payload) => axiosClient.put(`/maintenance-schedules/${id}`, payload),
  delete: (id) => axiosClient.delete(`/maintenance-schedules/${id}`),
};

export default maintenanceScheduleService;
