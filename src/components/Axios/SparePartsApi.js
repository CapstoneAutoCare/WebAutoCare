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
  //   getListByCenter({ token, centerId }) {
  //     const config = {
  //       headers: {
  //         accept: "text/plain",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };
  //     const url = "/SparePart/GetListByCenter?centerId=" + centerId;

  //     return axiosApi.get(url, config);
  //   },
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
