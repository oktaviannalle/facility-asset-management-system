import axiosClient from './axiosClient';

const dashboardService = {
  getStats: () => axiosClient.get('/dashboard/stats'),
};

export default dashboardService;
