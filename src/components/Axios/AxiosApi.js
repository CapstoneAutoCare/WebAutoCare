import axios from "axios";

const axiosApi = axios.create({
    baseURL: "http://autocare.runasp.net/api",
    Headers: { "Content-Type": "application/json" },
});
axios.interceptors.response.use(
    function(response) {
        return response.data;
    },
    function(error) {
        return Promise.reject(error);
    }
);
export default axiosApi;