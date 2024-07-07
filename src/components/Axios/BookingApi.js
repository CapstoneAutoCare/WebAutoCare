import axiosApi from "./AxiosApi";

const BookingApi = {
  getAll() {
    const url = "/Bookings/GetAll";
    return axiosApi.get(url);
  },
  getById(token, bookingId) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Bookings/GetById?id=" + bookingId;
    return axiosApi.get(url, config);
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
