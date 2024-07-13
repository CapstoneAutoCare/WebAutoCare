import axiosApi from "./AxiosApi";

const TaskApi = {
  getAll() {
    const url = "/MaintenanceTasks/GetAll";
    return axiosApi.get(url);
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
      return response.data;
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      throw error;
    }
  },
  postSparePartItemCost({ token, data }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/SparePartsItemCosts/Post";
    return axiosApi.post(url, data, config);
  },
  post(token, data) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/SparePart/Post";
    return axiosApi.post(url, data, config);
  },
  async changestatusCostSpartPartItem({ token, id, status }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/SparePartsItemCosts/PatchStatus?id=${id}&status=${status}`;

    try {
      const response = await axiosApi.patch(url, null, config);
      return response.data;
    } catch (error) {
      console.error("Error changing status:", error);
      throw error;
    }
  },
};
export default TaskApi;
