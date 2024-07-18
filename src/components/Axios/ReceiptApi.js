import axiosApi from "./AxiosApi";

const ReceiptApi = {
  async getAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Receipts/GetAll";
    return await axiosApi.get(url, config);
  },
  async getbyId({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Receipts/GetById?id=" + id;

    return await axiosApi.get(url, config);
  },
  async getbyInforId({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Receipts/GetByInforId?id=" + id;

    return await axiosApi.get(url, config);
  },
  async CreateReceiptPost({ token, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Receipts/Post";

    return await axiosApi.post(url, data, config);
  },
};
export default ReceiptApi;
