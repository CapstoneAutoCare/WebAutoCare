import axiosApi from "./AxiosApi";

const MaintenanceServicesInforesApi = {
  async getAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceServiceInfoes/GetAll";
    return await axiosApi.get(url, config);
  },
  async Post({ token, data }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceServiceInfoes/Post";

    return await axiosApi.post(url, data, config);
  },
};
export default MaintenanceServicesInforesApi;
