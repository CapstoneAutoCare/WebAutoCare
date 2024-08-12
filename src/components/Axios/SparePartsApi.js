import axiosApi from "./AxiosApi";

const SparePartsApi = {
  async getAll(token) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/SparePart/GetAll";
    return await axiosApi.get(url, config);
  },
  async getById({ token, id }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/SparePart/GetById?id=" + id;
    return await axiosApi.get(url, config);
  },
  async GetListNotSparePartItemId({ token, id }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/SparePart/GetSpartPartNotSparePartItemId?id=" + id;
    return await axiosApi.get(url, config);
  },
  async updateSparePart({ token, id, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/SparePart/Update?id=${id}`;
    return await axiosApi.put(url, data, config);
  },
  async post({ token, data }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/SparePart/Post";
    return await axiosApi.post(url, data, config);
  },
};
export default SparePartsApi;
