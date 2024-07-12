import axiosApi from "./AxiosApi";

const SparePartItemsApi = {
  getAll() {
    const url = "/SparePartItem/GetAll";
    return axiosApi.get(url);
  },
  async getById({ token, id }) {
    const url = `/SparePartItem/GetById?id=${id}`;

    const config = {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axiosApi.get(url, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      throw error;
    }
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
  updateSparePartItem({ token, id, data }) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `/SparePartItem/Update?id=${id}`;
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
