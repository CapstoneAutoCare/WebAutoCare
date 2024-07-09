import axiosApi from "./AxiosApi";

const AuthenApi = {
  Login(data) {
    const config = {
      headers: {
        accept: "text/plain",
      },
    };
    const result = axiosApi.post(
      `/Accounts/Login?email=${data.email}&password=${data.password}`,
      "",
      config
    );
    return result;
  },
  Authen(data) {
    const config = {
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json",
      },
    };
    const result = axiosApi.post(`/Accounts/Authen`, data, config);
    return result;
  },
};
export default AuthenApi;
