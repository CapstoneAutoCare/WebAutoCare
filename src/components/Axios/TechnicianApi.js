import axiosApi from "./AxiosApi";

const TechinicanApi = {
  getAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Technicians/GetAll";
    return axiosApi.get(url, config);
  },
  getListByCenter({ centerId, token }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Technicians/GetListByCenter?centerId=" + centerId;

    return axiosApi.get(url, config);
  },
};
export default TechinicanApi;
