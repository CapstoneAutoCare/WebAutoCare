import axiosApi from "./AxiosApi";

const SparePartItemsApi = {
  getAll() {
    const url = "/SparePartItem/GetAll";
    return axiosApi.get(url);
  },
  getById(id) {
    const url = "/SparePartItem/GetById?id=" + id;
    return axiosApi.get(url);
  },
  getListByCenter({ token, centerId }) {
    const config = {
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${token}`,
        },
      };
      const url = "/SparePartItem/GetListByCenter?centerId=" + centerId;
  
      return axiosApi.get(url, config);
  },
};
export default SparePartItemsApi;
