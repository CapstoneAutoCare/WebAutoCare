import axiosApi from "./AxiosApi";

const CustomerCareApi = {
  getAll(token) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/CustomerCares/GetAll";
    return axiosApi.get(url, config);
  },
  getListByCenter({ centerId, token }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/CustomerCares/GetListByCenter?centerId=" + centerId;

    return axiosApi.get(url, config);
  },
};
export default CustomerCareApi;
