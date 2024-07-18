import axiosApi from "./AxiosApi";

const SparePartItemsApi = {
  async getAll() {
    const url = "/SparePartItem/GetAll";
    return await axiosApi.get(url);
  },
  async getById({ token, id }) {
    const url = `/SparePartItem/GetById?id=${id}`;

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
  async getListByCenter({ token, centerId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/SparePartItem/GetListByCenter";

    return await axiosApi.get(url, config);
  },
  async addSpartPartItem({ token, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/SparePartItem/Post";

    return await axiosApi.post(url, data, config);
  },
  async updateSparePartItem({ token, id, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/SparePartItem/Update?id=${id}`;
    return await axiosApi.put(url, data, config);
  },
};
export default SparePartItemsApi;
