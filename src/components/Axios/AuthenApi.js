import axiosApi from "./AxiosApi";

const AuthenApi = {
  async Login(data) {
    const result = await axiosApi.post(
      `/Accounts/Login?email=${data.email}&password=${data.password}`
    );
    return result.data;
  },
};
export default AuthenApi;
