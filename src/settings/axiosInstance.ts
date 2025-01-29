import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://social-residence-shakujiikoen.online/api',
  headers: {
    post: {
      'Content-Type': 'application/json',
    },
  },
});

export default axiosInstance;
