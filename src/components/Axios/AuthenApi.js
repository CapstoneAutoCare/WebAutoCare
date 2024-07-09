import axiosApi from "./AxiosApi";

const AuthenApi = {
  Login(data) {
    const config = {
      headers: {
        "accept": "text/plain",
      },
    };
    const result = axiosApi.post(
      `/Accounts/Login?email=${data.email}&password=${data.password}`,
      '',
      config
    );
    return result;
  },
};
export default AuthenApi;
