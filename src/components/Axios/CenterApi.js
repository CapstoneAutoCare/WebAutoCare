import axiosApi from "./AxiosApi";

const CenterApi = {
  async TotalGetListByStatusAndStatusCostService({ token, centerId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { centerId },
    };
    const url = "/DashboardCenters/TotalGetListByStatusAndStatusCostService";
    return axiosApi.get(url, config);
  },
  async TotalGetListByStatusAndStatusCostSparePart({ token, centerId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { centerId },
    };
    const url = "/DashboardCenters/TotalGetListByStatusAndStatusCostSparePart";
    return axiosApi.get(url, config);
  },
  async TotalGetListByStatusPaidReceipt({ token, centerId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { centerId },
    };
    const url = "/DashboardCenters/TotalGetListByStatusPaidReceipt";
    return axiosApi.get(url, config);
  },
  async TotalGetListByMainInfor({ token, centerId }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { centerId },
    };
    const url = "/DashboardCenters/TotalGetListByMainInfor";
    return axiosApi.get(url, config);
  },
  async CreateCenter(data) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const url = "MaintenanceCenters/Post";
    return axiosApi.post(url, data, config);
  },
  async GetAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "MaintenanceCenters/GetAll";
    return axiosApi.get(url, config);
  },
};
export default CenterApi;
