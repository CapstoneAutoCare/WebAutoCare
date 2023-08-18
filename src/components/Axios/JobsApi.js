import axiosApi from "./AxiosApi";

const JobsApi = {
  getAllJobs(page) {
    const url = "/Jobs/GetAllJobs";

    return axiosApi.get(url);
  },
};
export default JobsApi;
