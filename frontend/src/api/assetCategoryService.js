import axiosClient from './axiosClient';

const assetCategoryService = {
  getAll: () => axiosClient.get('/asset-categories'),
  create: (payload) => axiosClient.post('/asset-categories', payload),
  update: (id, payload) => axiosClient.put(`/asset-categories/${id}`, payload),
  delete: (id) => axiosClient.delete(`/asset-categories/${id}`),
};

export default assetCategoryService;
