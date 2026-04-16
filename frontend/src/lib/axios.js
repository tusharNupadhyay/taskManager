import config from "./config"
import axios from 'axios';


axios.defaults.withCredentials = true;
const api = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true, 
});

export default api;