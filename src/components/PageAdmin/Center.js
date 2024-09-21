import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  Grid,
  MenuItem,
  Pagination,
  Paper,
  Rating,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyle, truncateNote } from "../Booking/Booking";
import { CenterGetAll, ChangeStatusPut } from "../../redux/centerSlice";
import { formatDate } from "../../Data/Pagination";
import { RegisterDialog } from "../../Data/DialogAdmin";
import { DetailCenter } from "./DetailCenter";
import Navbar from "../Navbar";
const statusOptions = ["ACTIVE", "INACTIVE"];

const Center = () => {
  const dispatch = useDispatch();
  const { centerlists, statuscenter } = useSelector((state) => state.centers);
  const [reload, setReload] = useState(false);
  const token = localStorage.getItem("localtoken");

  const [page, setPage] = useState(1);
  const itemsPerPage = 7;
  const pageCount = Math.ceil(centerlists.length / itemsPerPage);
  const [open, setOpen] = useState(false);
  const [openDetail, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterPhone, setFilterPhone] = useState("");

  const handleClickDetailOpen = (item) => {
    console.log(item);
    setDetailOpen(true);
    setSelectedItem(item)
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setReload(!reload);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setReload(!reload);
  };
  const handleStatusChange = async (maintenanceCenterId, newStatus) => {
    try {
      await dispatch(
        ChangeStatusPut({ id: maintenanceCenterId, status: newStatus, token })
      );
      dispatch(CenterGetAll(token));
      setReload(!reload);
    } catch (error) {
    }
  };

  useEffect(() => {
    dispatch(CenterGetAll(token));
  }, [dispatch, token, reload]);

  const filteredcenterlists = centerlists.filter((center) => {
    const statusMatch = filterStatus ? center.status === filterStatus : true;

    const districtMatch = filterDistrict
      ? center.district?.toLowerCase().includes(filterDistrict.toLowerCase())
      : true;
    const cityMatch = filterCity
      ? center.city?.toLowerCase().includes(filterCity.toLowerCase())
      : true;
    const phoneMatch = filterPhone
      ? center.phone?.toLowerCase().includes(filterPhone.toLowerCase())
      : true;

    return (
      statusMatch &&
      districtMatch &&
      cityMatch &&
      phoneMatch
    );
  });

  return (
    <Box>
      <Navbar />
      <h3>Danh Sách Trung Tâm</h3>
      <Button variant="contained" color="success" onClick={handleClickOpen}>
        Tạo Trung Tâm
      </Button>
      <RegisterDialog
        open={open}
        handleClose={handleClose}
        token={token}
        setReload={setReload}
      />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Select
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
          displayEmpty
        >
          <MenuItem value="">
            <em>Trạng Thái</em>
          </MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Quận"
          value={filterDistrict}
          onChange={(event) => setFilterDistrict(event.target.value)}
        />
        <TextField
          label="Thành Phố"
          value={filterCity}
          onChange={(event) => setFilterCity(event.target.value)}
        />
        <TextField
          label="Số Điện Thoại"
          value={filterPhone}
          onChange={(event) => setFilterPhone(event.target.value)}
        />
      </Box>
      {statuscenter === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statuscenter === "succeeded" &&
        filteredcenterlists &&
        centerlists.length > 0 && (
          <Grid>
            <TableContainer
              component={Paper}
              style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell>Mã Đặt Lịch</TableCell> */}
                    <TableCell>Avatart </TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mật Khẩu</TableCell>
                    <TableCell>Tên Trung Tâm</TableCell>
                    <TableCell>Số Điện Thoại</TableCell>
                    <TableCell>Địa Chỉ</TableCell>
                    <TableCell>Quận</TableCell>
                    <TableCell>Thành Phố</TableCell>
                    <TableCell>Mô Tả</TableCell>
                    {/* <TableCell>Giới Tính</TableCell> */}
                    <TableCell>Đánh Giá</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Chi Tiết</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredcenterlists
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((item) => (
                      <TableRow
                        key={item.maintenanceCenterId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          {item?.logo ? (
                            <img
                              src={item?.logo}
                              alt="Item Logo"
                              className="item-logo"
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f0f0f0",
                              }}
                            />
                          ) : (
                            <div
                              className="no-image-placeholder"
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f0f0f0",
                              }}
                            >
                              No Image Available
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.password}</TableCell>
                        <TableCell>{item.maintenanceCenterName}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>
                          <Tooltip title={item?.address} arrow>
                            <span>{truncateNote(item?.address)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={item?.district} arrow>
                            <span>{truncateNote(item?.district)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={item?.city} arrow>
                            <span>{truncateNote(item?.city)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={item?.maintenanceCenterDescription}
                            arrow
                          >
                            <span>
                              {truncateNote(item?.maintenanceCenterDescription)}
                            </span>
                          </Tooltip>
                        </TableCell>
                        {/* <TableCell>{item.gender}</TableCell> */}
                        <TableCell>
                          <Rating
                            name="size-medium"
                            value={item?.rating}
                            precision={0.1}
                            readOnly={item?.rating}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item?.status}
                            onChange={(event) => {
                              const newStatus = event.target.value;
                              handleStatusChange(
                                item?.maintenanceCenterId,
                                newStatus
                              );
                            }}
                            style={{
                              ...makeStyle(item?.status),
                              borderRadius: "10px",
                              width: "125px",
                              fontSize: "10px",
                              height: "50px",
                            }}
                          >
                            {statusOptions?.map((status) => (
                              <MenuItem key={status} value={status}>
                                {status}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell className="Details">
                          <Button
                            onClick={() => handleClickDetailOpen(item)}
                            variant="contained"
                            color="success"
                          >
                            Chi Tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handleChangePage}
              variant="outlined"
              shape="rounded"
              style={{ marginTop: "20px", paddingBottom: "30px" }}
            />
          </Grid>
        )}
      {selectedItem && (
        <DetailCenter
          open={openDetail}
          handleClose={handleDetailClose}
          token={token}
          item={selectedItem}
          setReload={setReload}
        />
      )}
    </Box>
  );
};

export default Center;
