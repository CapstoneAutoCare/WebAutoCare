import axiosApi from "./AxiosApi";

const CostItemApi = {
  async getAll() {
    const url = "/SparePart/GetAll";
    return await axiosApi.get(url);
  },
  async getByIdSparePartActiveCost(token, id) {
    const url = `/SparePartsItemCosts/GetByIdSparePartActive?id=${id}`;

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
  async postSparePartItemCost({ token, data }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/SparePartsItemCosts/Post";
    return await axiosApi.post(url, data, config);
  },
  async post(token, data) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/SparePart/Post";
    return await axiosApi.post(url, data, config);
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
      return response;
    } catch (error) {
      console.error("Error changing status:", error);
      throw error;
    }
  },
};
export default CostItemApi;
