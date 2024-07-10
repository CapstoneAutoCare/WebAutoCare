import axios from "axios";

const axiosApi = axios.create({
  baseURL: "https://autocareversion2.tryasp.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});
axios.interceptors.response.use(
  function (response) {
    console.log("Response:", response);
    return response.data;
  },
  function (error) {
    console.error("Error:", error);
    if (error.response) {
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject("Network error"); 
    } else {
      return Promise.reject(error.message);
    }
  }
);
export default axiosApi;
