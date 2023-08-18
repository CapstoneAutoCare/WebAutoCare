import axios from "axios";

const axiosApi = axios.create({
  baseURL: "https://localhost:7223/api",
  Headers: { "Content-Type": "application/json" },
});

// Add a request interceptor
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("localtoken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
export default axiosApi;
