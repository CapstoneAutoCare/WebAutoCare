import axiosApi from "./AxiosApi";

const PostApi = {
  getAllPost() {
    const url = "/Posts/GetAllPost";
    return axiosApi.get(url);
  },
};
export default PostApi;
