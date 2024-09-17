import axiosApi from "./AxiosApi";

const TransactionsApi = {
  async getAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Transactions/GetAll";
    return await axiosApi.get(url, config);
  },
  async getbyId({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Transactions/GetById?id=" + id;

    return await axiosApi.get(url, config);
  },
  async getListByCenterAndStatusTransferred({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Transactions/GetListByCenterAndStatusTransferred?id=" + id;

    return await axiosApi.get(url, config);
  },
  async getListByClientRECEIVED({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Transactions/GetListByClientRECEIVED?id=" + id;

    return await axiosApi.get(url, config);
  },
  async createpost({ token, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Transactions/Post";

    return await axiosApi.post(url, data, config);
  },
};
export default TransactionsApi;
