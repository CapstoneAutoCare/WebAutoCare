import axiosApi from "./AxiosApi";

const MaintenanceServicesApi = {
  getAll() {
    const url = "/MaintenanceServices/GetAll";
    return axiosApi.get(url);
  },
  getById(id) {
    const url = "/MaintenanceServices/GetById?id=" + id;
    return axiosApi.get(url);
  },
  getListByCenter({ token, centerId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceServices/GetListByCenter";

    return axiosApi.get(url, config);
  },
  addMaintenanceServicesItem(token, data) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceServices/Post";

    return axiosApi
      .post(url, data, config)
      .then((response) => {
        console.log("AddMaintenanceServices success:", response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("AddMaintenanceServices error:", error);
        throw error;
      });
  },
};
export default MaintenanceServicesApi;
