import axiosApi from "./AxiosApi";

const MaintenanceVehiclesDetailsApi = {
  async getAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceVehiclesDetails/GetAll";
    return await axiosApi.get(url, config);
  },
  async getbyId({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },

    };
    const url = "/MaintenanceVehiclesDetails/GetById?id=" + id;

    return await axiosApi.get(url, config);
  },
  async getListByVehicleId({ token, vehicleId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceVehiclesDetails/GetListByVehicleId?vehicleId=" + vehicleId;

    return await axiosApi.get(url, config);
  },

  async getListByPlanAndVehicleAndCenter({ token, planId, vehicleId, centerId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { planId, vehicleId, centerId },

    };
    
    const url = "/MaintenanceVehiclesDetails/GetListByPlanAndVehicleAndCenter";
    return await axiosApi.get(url, config);
  },
  
};
export default MaintenanceVehiclesDetailsApi;
