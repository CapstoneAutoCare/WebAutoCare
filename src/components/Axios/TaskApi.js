import axiosApi from "./AxiosApi";

const TaskApi = {
  async getAll() {
    const url = "/MaintenanceTasks/GetAll";
    return await axiosApi.get(url);
  },
  async GetById({ token, id }) {
    const url = `/MaintenanceTasks/GetById`;
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { id },
    };
    try {
      return await axiosApi.get(url, config);
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      throw error;
    }
  },
  async GetListByCenter(token) {
    const url = `/MaintenanceTasks/GetListByCenter`;
    const config = {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axiosApi.get(url, config);
      return response;
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      throw error;
    }
  },
  async PostTask({ token, data }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceTasks/Post";
    return await axiosApi.post(url, data, config);
  },

  async Patch({ token, id, status }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/MaintenanceTasks/Patch?id=${id}&status=${status}`;

    try {
      return await axiosApi.patch(url, null, config);
    } catch (error) {
      console.error("Error changing status:", error);
      throw error;
    }
  },
};
export default TaskApi;
