import axiosApi from "./AxiosApi";

const AccountApi = {
  async getAllAccounts(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      // Các thông tin cấu hình khác của Axios nếu cần
      // Ví dụ: params, timeout, response type, v.v.
    };
    const url = "/Accounts/GetAccounts";

    return await axiosApi.get(url, config);
  },
  getAccountById: async (id, token) => {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/Accounts/GetAccountsById?id=${id}`;
    return await axiosApi.get(url, config);
  },
  updateStatusAccount: async (form, token) => {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/Accounts/ChangeStatusAccount`;
    return axiosApi.patch(url, form, config);
  },
  getProfile: async (token) => {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/Accounts/Profile`;
    return await axiosApi.get(url, config);
  },
};
export default AccountApi;
