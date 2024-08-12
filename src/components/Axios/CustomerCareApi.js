import axiosApi from "./AxiosApi";

const CustomerCareApi = {
  async getAll(token) {
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
  async CreateCustomerCare({ token, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
    };
    const url = "CustomerCares/Post";
    return axiosApi.post(url, data, config);
  },
};
export default CustomerCareApi;
