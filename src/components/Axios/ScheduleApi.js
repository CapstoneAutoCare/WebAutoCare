import axiosApi from "./AxiosApi";

const ScheduleApi = {
  async getAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceSchedule/GetAll";
    return await axiosApi.get(url, config);
  },
  async getbyId({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },

    };
    const url = "/MaintenanceSchedule/GetById?id=" + id;

    return await axiosApi.get(url, config);
  },
  async getbyInforId({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceSchedule/GetByInforId?id=" + id;

    return await axiosApi.get(url, config);
  },
  async getListPackageCenterId({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },

    };
    const url = "/MaintenanceSchedule/GetListPackageCenterId?id=" + id;

    return await axiosApi.get(url, config);
  },
  async getListPlanIdAndPackageCenterIdBookingId({ token, planId, id, bookingId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { planId, id, bookingId },

    };

    const url = "/MaintenanceSchedule/GetListPlanIdAndPackageCenterIdBookingId";

    return await axiosApi.get(url, config);
  },
  async createpost({ token, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceSchedule/Post";

    return await axiosApi.post(url, data, config);
  },
  async updateschedule({ token, id, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { id },
    };
    const url = "/MaintenanceSchedule/Update";

    return await axiosApi.put(url, data, config);
  },
};
export default ScheduleApi;
