import axiosApi from "./AxiosApi";

const PlanApi = {
  async getAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenancePlans/GetAll";
    return await axiosApi.get(url, config);
  },
  async getbyId({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenancePlans/GetById?id=" + id;

    return await axiosApi.get(url, config);
  },
  async getbyInforId({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenancePlans/GetByInforId?id=" + id;

    return await axiosApi.get(url, config);
  },
  async getListByCenterAndVehicle({ token, id,vehicleId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: {id,vehicleId},
    };
    const url = "/MaintenancePlans/GetListFilterCenterAndVehicle"

    return await axiosApi.get(url, config);
  },
  async createpost({ token, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenancePlans/Post";

    return await axiosApi.post(url, data, config);
  },
};
export default PlanApi;
