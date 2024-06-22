import axiosApi from "./AxiosApi";

const BookingApi = {
  getAll() {
    const url = "/Bookings/GetAll";
    return axiosApi.get(url);
  },
  getById(id) {
    const url = "/Bookings/GetById?id=" + id;
    return axiosApi.get(url);
  },
  getListByCenter({ token }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Bookings/GetListByCenter";

    return axiosApi.get(url, config);
  },
};
export default BookingApi;
