import axiosApi from "./AxiosApi";

const AuthenApi = {
  async Login(data) {
    const config = {
      headers: {
        accept: "text/plain",
      },
    };
    const result = await axiosApi.post(
      `/Accounts/Login?email=${data.email}&password=${data.password}`,
      "",
      config
    );
    return result;
  },
 async Authen(data) {
    const config = {
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json",
      },
    };
    const result = await axiosApi.post(`/Accounts/Authen`, data, config);
    return result;
  },
};
export default AuthenApi;
