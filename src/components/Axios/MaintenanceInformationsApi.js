import axiosApi from "./AxiosApi";

const MaintenanceInformationsApi = {
  async getAll() {
    const url = "/MaintenanceInformations/GetAll";
    return await axiosApi.get(url);
  },
  async getById(token, id) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceInformations/GetById?id=" + id;
    return await axiosApi.get(url, config);
  },
  async getListByCenter({ token, centerId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/MaintenanceInformations/GetListByCenterId?id=${centerId}`;

    return await axiosApi.get(url, config);
  },
  async getListGetMonthlyRevenueByCenterId({ token, centerId, year }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/MaintenanceInformations/GetListGetMonthlyRevenueByCenterId?id=${centerId}&year=${year}`;

    return await axiosApi.get(url, config);
  },
  async getInformationsByMonthInYearByCenterId({ token, id, year }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { id, year },
    };
    const url = "/MaintenanceInformations/GetListGetMonthlyBookingSummaryPAIDByCenterId";

    return axiosApi.get(url, config);
  },
  async getListByCenterAndStatus({ token, status }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { status },
    };
    const url = "/MaintenanceInformations/GetListByCenter";

    return await axiosApi.get(url, config);
  },
  async GetListByCenterAndStatusCheckinAndTaskInactive({ token, centerId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { centerId },
    };
    const url =
      "/MaintenanceInformations/GetListByCenterAndStatusCheckinAndAnyTaskCancel";

    return await axiosApi.get(url, config);
  },
  async getListByPlanAndVehicleAndCenterAndStatusWatingbycar({ token, planId,vehicleId,centerId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { planId,vehicleId,centerId },
    };
    const url =
      "/MaintenanceInformations/GetListByPlanAndVehicleAndCenterAndStatusCREATEDBYClIENT";

    return await axiosApi.get(url, config);
  },
  
  async addMaintenanceInformationsItem(token, data) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceInformations/Post";

    return await axiosApi
      .post(url, data, config)
      .then((response) => {
        console.log("AddMaintenanceInformations success:", response.data);
      })
      .catch((error) => {
        console.error("AddMaintenanceInformations error:", error);
        throw error;
      });
  },

  async addMaintenPost({ token, data }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url =
      "/MaintenanceInformations/PostMaintenance";
    return await axiosApi
      .post(url, data, config);
  },
  async changeStatus({ token, id, status }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { id, status },
    };
    const url = "MaintenanceInformations/CHANGESTATUS";

    return await axiosApi.patch(url, null, config);
  },
};

export default MaintenanceInformationsApi;
