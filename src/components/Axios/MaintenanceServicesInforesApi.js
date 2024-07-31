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
  async changeStatus({ token, id, status }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { id, status },
    };
    const url = "MaintenanceServiceInfoes/PatchStatus";

    return await axiosApi.patch(url, null, config);
  },
};
export default MaintenanceServicesInforesApi;
