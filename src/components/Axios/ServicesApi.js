import axiosApi from "./AxiosApi";

const ServicesApi = {
  async getAll(token) {
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
  async updateService({ token, id, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/Services/Update?id=${id}`;
    return await axiosApi.put(url, data, config);
  },
  async GetServiceCaresNotInMaintenanceServices({ token, centerId }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url =
      "/Services/GetServiceCaresNotInMaintenanceServices?id=" + centerId;
    return await axiosApi.get(url, config);
  },
  async post({ token, data }) {
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
