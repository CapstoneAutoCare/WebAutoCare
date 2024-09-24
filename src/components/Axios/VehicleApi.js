import axiosApi from "./AxiosApi";

const VehicleApi = {
    async getAll(token) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const url = "/Vehicles/GetAll";
        return await axiosApi.get(url, config);
    },
    async getById(id) {
        const url = "/Vehicles/GetById?id=" + id;
        return await axiosApi.get(url);
    },
    async getListByCenterWhenBuyPackage({ token, centerId }) {
        const config = {
            headers: {
                accept: "text/plain",
                Authorization: `Bearer ${token}`,
            },
        };
        const url = "/Vehicles/GetListByCenterWhenBuyPackage?centerId=" + centerId;

        return await axiosApi.get(url, config);
    },

    async post({ token, data }) {
        token = token || "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const url = "/Vehicles/Post";
        return await axiosApi.post(url, data, config);
    },
};
export default VehicleApi;
