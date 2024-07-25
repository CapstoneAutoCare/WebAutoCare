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
  async GetListByCenter() {
    try {
      const url = `/MaintenanceTasks/GetListByCenter`;
      return await axiosApi.get(url);
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
};

export default TaskApi;
