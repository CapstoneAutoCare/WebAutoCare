import axiosApi from "./AxiosApi";

const MaintenanceServicesApi = {
  async getAll() {
    const url = "/MaintenanceServices/GetAll";
    return await axiosApi.get(url);
  },
  async GetById({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { id },
    };
    const url = "/MaintenanceServices/GetById";

    return await axiosApi.get(url, config);
  },
  async getListByCenter({ token, centerId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceServices/GetListByCenter";

    return await axiosApi.get(url, config);
  },
  async addMaintenanceServicesItem({token, data}) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceServices/Post";

    return await axiosApi
      .post(url, data, config)
      .then((response) => {
        console.log("AddMaintenanceServices success:", response.data);
      })
      .catch((error) => {
        console.error("AddMaintenanceServices error:", error);
        throw error;
      });
  },
  async updateMaintenanceServicesItem({ token, id, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/MaintenanceServices/Update?id=${id}`;
    return await axiosApi
      .put(url, data, config)
      .then((response) => {
        console.log("Update SparePartItem success:", response.data);
      })
      .catch((error) => {
        console.error("Update SparePartItem error:", error);
      });
  },
  
};
export default MaintenanceServicesApi;
