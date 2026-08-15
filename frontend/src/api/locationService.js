import axiosClient from './axiosClient';

const locationService = {
  getAll: () => axiosClient.get('/locations'),
  create: (payload) => axiosClient.post('/locations', payload),
  update: (id, payload) => axiosClient.put(`/locations/${id}`, payload),
  delete: (id) => axiosClient.delete(`/locations/${id}`),
};

export default locationService;
