import axiosApi from "./AxiosApi";

const AuthenApi = {
  Login(data) {
    const url = "/Authentication/Validate/Login";
    return axiosApi.post(url, data);
  },
};
export default AuthenApi;
