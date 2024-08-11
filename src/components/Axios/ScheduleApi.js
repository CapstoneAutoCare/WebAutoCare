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
  //   async ReceiptRemove({ token, id }) {
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       params: { id },
  //     };
  //     const url = "/MaintenanceSchedule/Remove";

  //     return await axiosApi.delete(url, config);
  //   },
  //   async ChangeStatusReceipt({ token, id, status }) {
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       params: { id, status },
  //     };
  //     const url = "/MaintenanceSchedule/ChangeStatus";

  //     return await axiosApi.patch(url, null,config);
  //   },
};
export default ScheduleApi;
