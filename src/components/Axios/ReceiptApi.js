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
  async ReceiptRemove({ token, id }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { id },
    };
    const url = "/Receipts/Remove";

    return await axiosApi.delete(url, config);
  },
  async ChangeStatusReceipt({ token, id, status }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { id, status },
    };
    const url = "/Receipts/ChangeStatus";

    return await axiosApi.patch(url, null,config);
  },
};
export default ReceiptApi;
