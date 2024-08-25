import axios from "axios";

const axiosApi = axios.create({
  baseURL: "http://localhost:5299/api",
  headers: {
    "Content-Type": "application/json",
  },
});
axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("localtoken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosApi;
