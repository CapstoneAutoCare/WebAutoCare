import axiosApi from "./AxiosApi";

const TechinicanApi = {
  async getAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Technicians/GetAll";
    return await axiosApi.get(url, config);
  },
  async getListByCenter({ centerId, token }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Technicians/GetListByCenter?centerId=" + centerId;

    return await axiosApi.get(url, config);
  },
  async CreateTech({ token, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "Technicians/Post";
    return axiosApi.post(url, data, config);
  },
};
export default TechinicanApi;
