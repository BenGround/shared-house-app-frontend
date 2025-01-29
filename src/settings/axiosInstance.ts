import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    'https://api.social-residence-shakujiikoen.online',
  headers: {
    post: {
      'Content-Type': 'application/json',
    },
  },
});

export default axiosInstance;
