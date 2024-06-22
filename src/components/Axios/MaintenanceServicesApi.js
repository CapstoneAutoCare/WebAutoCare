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
      const url = "/MaintenanceServices/GetListByCenter?centerId=" + centerId;
  
      return axiosApi.get(url, config);
  },
};
export default MaintenanceServicesApi;
