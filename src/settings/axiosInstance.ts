import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:3000/',
  headers: {
    post: {
      'Content-Type': 'application/json',
    },
  },
});

export default axiosInstance;
