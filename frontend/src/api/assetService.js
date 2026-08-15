import axiosClient from './axiosClient';

const assetService = {
  getAll: () => axiosClient.get('/assets'),
  create: (payload) => axiosClient.post('/assets', payload),
  update: (id, payload) => axiosClient.put(`/assets/${id}`, payload),
  delete: (id) => axiosClient.delete(`/assets/${id}`),
};

export default assetService;
