import axios from "axios";

const axiosApi = axios.create({
  baseURL: "https://autocareversion2.tryasp.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});
axios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default axiosApi;
