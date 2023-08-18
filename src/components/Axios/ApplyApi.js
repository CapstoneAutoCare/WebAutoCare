import axiosApi from "./AxiosApi";

const ApplyApi = {
  getAllApply() {
    const url = "/Operations/GetOperations";
    return axiosApi.get(url);
  },
};
export default ApplyApi;
