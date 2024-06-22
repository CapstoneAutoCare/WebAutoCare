// import axiosApi from "./AxiosApi";
// const CompanyApi = {
//   getCompanyById: async (id, token) => {
//     const config = {
//       headers: {
//         accept: "text/plain",
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const url = `/Companies/GetCompanyByAccountId?id=${id}`;
//     return axiosApi.get(url, config);
//   },
//   getAllHrCompanyByCompanyId: async (id, token) => {
//     const config = {
//       headers: {
//         accept: "text/plain",
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const url = `/Hrs/GetALLHrByCompanyId?companyId=${id}`;
//     return axiosApi.get(url, config);
//   },
//   getAllInterviewerCompanyByCompanyId: async (id, token) => {
//     const config = {
//       headers: {
//         accept: "text/plain",
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const url = `/Interviewers/GetALLInterviewerByCompanyId?companyId=${id}`;
//     return axiosApi.get(url, config);
//   },
//   updateStatusHr: async (form, token) => {
//     const config = {
//       headers: {
//         accept: "text/plain",
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const url = `/Companies/UpdateStatusHr`;
//     return axiosApi.patch(url, form, config);
//   },
//   updateStatusInterviewer: async (form, token) => {
//     const config = {
//       headers: {
//         accept: "text/plain",
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     const url = `/Companies/UpdateStatusInterviewer`;
//     return axiosApi.patch(url, form, config);
//   },
// };
// export default CompanyApi;
