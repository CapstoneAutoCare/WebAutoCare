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
};
export default TechinicanApi;
