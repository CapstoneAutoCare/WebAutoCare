import axiosApi from "./AxiosApi";

const ServicesApi = {
  async getAll({ token }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Services/GetAll";
    return await axiosApi.get(url, config);
  },
  async getById(id) {
    const url = "/Services/GetById?id=" + id;
    return await axiosApi.get(url);
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
  async post(token, data) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Services/Post";
    return await axiosApi.post(url, data, config);
  },
};
export default ServicesApi;
