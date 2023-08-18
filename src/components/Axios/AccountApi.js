import axiosApi from "./AxiosApi";

const AccountApi = {
  getAllAccounts(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      // Các thông tin cấu hình khác của Axios nếu cần
      // Ví dụ: params, timeout, response type, v.v.
    };
    const url = "/Accounts/GetAccounts";

    return axiosApi.get(url, config);
  },
  getAccountById: async (id, token) => {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/Accounts/GetAccountsById?id=${id}`;
    return axiosApi.get(url, config);
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
};
export default AccountApi;
