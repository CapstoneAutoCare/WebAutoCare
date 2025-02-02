import axiosApi from "./AxiosApi";

const AccountApi = {
  async getAllAccounts(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
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
  getNotificationByAccountId: async ({ token, id }) => {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/Notifications/GetListByAccount?id=${id}`;
    return await axiosApi.get(url, config);
  },
  updateNotificationById: async ({ token, id }) => {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/Notifications/UpdateRead?id=${id}`;
    return await axiosApi.patch(url, config);
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
