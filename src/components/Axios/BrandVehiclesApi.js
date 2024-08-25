import axiosApi from "./AxiosApi";

const BrandVehiclesApi = {
  async getAll(token) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/VehicleBrand/GetAll";
    return await axiosApi.get(url, config);
  },
  async getById(id) {
    const url = "/VehicleBrand/GetById?id=" + id;
    return await axiosApi.get(url);
  },
  async vehiclesMaintenancesByCenter(id) {
    const url = "/VehiclesMaintenances/GetListByCenter?id=" + id;
    return await axiosApi.get(url);
  },
  async vehiclesMaintenancesDifByCenter(id) {
    const url = "/VehicleBrand/GetNotInCenter?id=" + id;
    return await axiosApi.get(url);
  },
  async vehiclesMaintenancesPost({token,data}) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/VehiclesMaintenances/Post";
    return await axiosApi.post(url, data, config);
  },
  //   getListByCenter({ token, centerId }) {
  //     const config = {
  //       headers: {
  //         accept: "text/plain",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };
  //     const url = "/SparePart/GetListByCenter?centerId=" + centerId;

  //     return axiosApi.get(url, config);
  //   },

  async post({ token, data }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/VehicleBrand/Post";
    return await axiosApi.post(url, data, config);
  },
};
export default BrandVehiclesApi;
