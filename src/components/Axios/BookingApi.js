import axiosApi from "./AxiosApi";

const BookingApi = {
  async getAll() {
    const url = "/Bookings/GetAll";
    return axiosApi.get(url);
  },
  async getById({ token, id }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { id },
    };
    const url = "/Bookings/GetById";
    return axiosApi.get(url, config);
  },
  async getListByCenter({ token }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Bookings/GetListByCenter";

    return await axiosApi.get(url, config);
  },
  async patchStatus({ bookingId, status, token }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
      params: { bookingId, status },
    };
    const url = "/Bookings/UpdateStatus";

    return await axiosApi.patch(url, null, config);
  },
};
export default BookingApi;
