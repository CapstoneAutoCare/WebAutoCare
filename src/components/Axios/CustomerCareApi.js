import axiosApi from "./AxiosApi";

const CustomerCareApi = {
  async  getAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/CustomerCares/GetAll";
    return await axiosApi.get(url, config);
  },
  async getListByCenter({ centerId, token }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/CustomerCares/GetListByCenter?centerId=" + centerId;

    return await axiosApi.get(url, config);
  },
};
export default CustomerCareApi;
