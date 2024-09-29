import axiosApi from "./AxiosApi";

const VehicleModelApi = {
  async getAll(token) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/VehicleModel/GetAll";
    return await axiosApi.get(url, config);
  },
  async getById(id) {
    const url = "/VehicleModel/GetById?id=" + id;
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

  async post({ token, data }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/VehicleModel/Post";
    return await axiosApi.post(url, data, config);
  },

  async update({ token, id, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/VehicleModel/Update?id=${id}`;
    return await axiosApi.put(url, data, config);
  },
};
export default VehicleModelApi;
