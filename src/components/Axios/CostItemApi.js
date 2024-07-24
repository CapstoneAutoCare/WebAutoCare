import axiosApi from "./AxiosApi";

const CostItemApi = {
  async getAll() {
    const url = "/SparePart/GetAll";
    return await axiosApi.get(url);
  },

  // MaintenanceServiceCosts/PatchStatus
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
  async getByIdMaintenanceServiceActiveCost({ token, id }) {
    const url = `/MaintenanceServiceCosts/GetByIdMaintenanceServiceActive?id=${id}`;

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
  async postMaintenanceServiceCost({ token, data }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/MaintenanceServiceCosts/Post";
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
  async changestatusCostMaintenanceService({ token, id, status }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { id, status },
    };
    const url = "/MaintenanceServiceCosts/PatchStatus";

    try {
      const response = await axiosApi.patch(url, null, config);
      return response;
    } catch (error) {
      console.error("Error changing status:", error);
      throw error;
    }
  },
  async changestatusCostMaintenanceService({ token, id, status }) {
    token = token || "";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { id, status },
    };
    const url = "/MaintenanceServiceCosts/PatchStatus";

    try {
      const response = await axiosApi.patch(url, null, config);
      return response;
    } catch (error) {
      console.error("Error changing status:", error);
      throw error;
    }
  },
  async GetListByDifSparePartAndInforId({ token, centerId, inforId }) {
    const url = "/SparePartsItemCosts/GetListByDifSparePartAndInforId";

    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { centerId: centerId, inforId: inforId },
    };
    try {
      const response = await axiosApi.get(url, config);
      return response;
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      throw error;
    }
  },
  async GetListByDifMainServiceAndInforId({ token, centerId, inforId }) {
    const url =
      "/MaintenanceServiceCosts/GetListByDifMaintenanceServiceAndInforId";

    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${{ token: token }}`,
      },
      params: { centerId: centerId, inforId: inforId },
    };
    try {
      const response = await axiosApi.get(url, config);
      return response;
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      throw error;
    }
  },
};
export default CostItemApi;
