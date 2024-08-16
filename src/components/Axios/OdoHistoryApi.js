import axiosApi from "./AxiosApi";

const OdoHistoryApi = {
    async getAll(token) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const url = "/OdoHistories/GetAll";
        return await axiosApi.get(url, config);
    },
    async getById({ token, id }) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const url = "/OdoHistories/GetById?id=" + id;
        return await axiosApi.get(url, config);
    },
    async getByinforId({ token, id }) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const url = "/OdoHistories/GetOdoByInforId?id=" + id;
        return await axiosApi.get(url, config);
    },
    async updateService({ token, id, data }) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const url = `/OdoHistories/Update?id=${id}`;
        return await axiosApi.put(url, data, config);
    },
    async GetServiceCaresNotInMaintenanceServices({ token, centerId }) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        const url =
            "/OdoHistories/GetServiceCaresNotInMaintenanceServices?id=" + centerId;
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
        const url = "/OdoHistories/Post";
        return await axiosApi.post(url, data, config);
    },

};
export default OdoHistoryApi;
