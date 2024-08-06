import axiosApi from "./AxiosApi";

const TaskApi = {
  async getAll() {
    try {
      const url = "/MaintenanceTasks/GetAll";
      return await axiosApi.get(url);
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      throw error;
    }
  },

  async GetById({ id }) {
    try {
      const url = `/MaintenanceTasks/GetById`;
      const config = { params: { id } };
      return await axiosApi.get(url, config);
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      throw error;
    }
  },
  async GetListByInforId({ token, id }) {
    try {
      token = token || "";
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: { id },
      };
      const url = "/MaintenanceTasks/GetListByInfor";
      return await axiosApi.get(url, config);
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      throw error;
    }
  },
  async GetListStatusDifCancelledByInfor({ token, id }) {
    try {
      token = token || "";
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: { id },
      };
      const url = "/MaintenanceTasks/GetListStatusDifCancelledByInfor";
      return await axiosApi.get(url, config);
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      throw error;
    }
  },
  async GetListByCenter({ token, id }) {
    try {
      const url = `/MaintenanceTasks/GetListByCenterId?id=${id}`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      return await axiosApi.get(url, config);
    } catch (error) {
      console.error("Error fetching tasks by center:", error);
      throw error;
    }
  },

  async PostTask({ data }) {
    try {
      const url = "/MaintenanceTasks/Post";
      return await axiosApi.post(url, data);
    } catch (error) {
      console.error("Error posting task:", error);
      throw error;
    }
  },

  async Patch({ id, status }) {
    try {
      const url = `/MaintenanceTasks/Patch`;
      const config = {
        params: { id, status },
      };
      return await axiosApi.patch(url, null, config);
    } catch (error) {
      console.error("Error changing status:", error);
      throw error;
    }
  },

  async ChangeStatusMTSparePartInfor({ token, id, status }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { id, status },
    };
    const url = "/MaintenanceTaskSparePartInfoes/PatchStatus";
    return await axiosApi.patch(url, null, config);
  },
  async ChangeStatusMTServiceInfor({ token, id, status }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { id, status },
    };
    const url = "/MaintenanceTaskServiceInfoes/PatchStatus";
    return await axiosApi.patch(url, null, config);
  },
};

export default TaskApi;
