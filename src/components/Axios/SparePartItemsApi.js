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
    const url = "/SparePartItem/GetListByCenter";

    return axiosApi.get(url, config);
  },
  addSpartPartItem(token, data) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/SparePartItem/Post";

    return axiosApi
      .post(url, data, config)
      .then((response) => {
        console.log("AddSpartPartItem success:", response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("AddSpartPartItem error:", error);
        throw error;
      });
  },
  updateSparePartItem(token, id, data) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/api/SparePartItem/Update/${id}`;
    return axiosApi
      .put(url, data, config)
      .then((response) => {
        console.log("Update SparePartItem success:", response.data);
      })
      .catch((error) => {
        console.error("Update SparePartItem error:", error);
      });
  },
};
export default SparePartItemsApi;
