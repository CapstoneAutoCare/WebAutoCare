import axiosApi from "./AxiosApi";

const MaintenanceInformationsApi = {
  getAll() {
    const url = "/MaintenanceInformations/GetAll";
    return axiosApi.get(url);
  },
  getById(token,id) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceInformations/GetById?id=" + id;
    return axiosApi.get(url, config);
  },
  getListByCenter({ token, centerId }) {
    const config = {
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${token}`,
        },
      };
      const url = "/MaintenanceInformations/GetListByCenter";
  
      return axiosApi.get(url, config);
  },
  addMaintenanceInformationsItem(token, data) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceInformations/Post";

    return axiosApi
      .post(url, data, config)
      .then((response) => {
        console.log("AddMaintenanceInformations success:", response.data);
        return response.data; 
      })
      .catch((error) => {
        console.error("AddMaintenanceInformations error:", error);
        throw error; 
      });
  },
};
export default MaintenanceInformationsApi;
