import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'https://shared-house-app-back-test.onrender.com/',
  headers: {
    post: {
      'Content-Type': 'application/json',
    },
  },
});

export default axiosInstance;
