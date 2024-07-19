import axiosApi from "./AxiosApi";

const MaintenanceSparePartInfoesApi = {
  async getAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceSparePartInfoes/GetAll";
    return await axiosApi.get(url, config);
  },
  async Post({ token, data }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceSparePartInfoes/Post";

    return await axiosApi.post(url, data, config);
  },
};
export default MaintenanceSparePartInfoesApi;
