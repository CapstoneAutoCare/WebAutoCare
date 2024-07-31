import axiosApi from "./AxiosApi";

const PaymentApi = {
  async CreateVnPayPaymentUrl({ token, data }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/Payments/CreateVnPayPaymentUrl";
    return await axiosApi.post(url, data,config);
  },
  async PaymentExecute({ token, data }) {
    const config = {
      headers: {
        accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = "/PaymentExecute";

    return await axiosApi.post(url, data, config);
  },
};
export default PaymentApi;
