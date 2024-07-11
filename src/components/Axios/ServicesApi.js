import axiosApi from "./AxiosApi";

const ServicesApi = {
  getAll() {
    const url = "/Services/GetAll";
    return axiosApi.get(url);
  },
  getById(id) {
    const url = "/Services/GetById?id=" + id;
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
    const url = "/Services/Post";
    return axiosApi.post(url, data, config);
  },
};
export default ServicesApi;
