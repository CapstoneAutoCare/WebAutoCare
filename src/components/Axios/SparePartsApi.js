import axiosApi from "./AxiosApi";

const SparePartsApi = {
  getAll() {
    const url = "/SparePart/GetAll";
    return axiosApi.get(url);
  },
  getById(id) {
    const url = "/SparePart/GetById?id=" + id;
    return axiosApi.get(url);
  },
  //   getListByCenter({ token, centerId }) {
  //     const config = {
  //       headers: {
  //         accept: "text/plain",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };
  //     const url = "/SparePart/GetListByCenter?centerId=" + centerId;

  //     return axiosApi.get(url, config);
  //   },
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
};
export default SparePartsApi;
