import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
const axiosInstance = axios.create({
  baseURL: apiUrl,  
  headers: {
    post: {
      'Content-Type': 'application/json',
    },
  },
});

export default axiosInstance;
