import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ClearIcon from "@mui/icons-material/Clear";
import * as Yup from "yup";

import {
  Button,
  ButtonBase,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { makeStyle } from "../Booking/Booking";
import { useDispatch, useSelector } from "react-redux";
import { ChangeStatusMi } from "../../redux/maintenanceInformationsSlice";
import { useEffect, useState } from "react";
import { formatDate } from "../../Data/Pagination";
import {
  TaskGetById,
  TaskListGetByInforId,
  TaskListStatusDifCancelledByInfor,
  TaskPatchStatus,
} from "../../redux/tasksSlice";
import { PatchStatusBookingByCenter } from "../../redux/bookingSlice";
import { ReceiptChangeStatus, ReceiptRemove } from "../../redux/receiptSlice";
import { MaintenanceSparePartInfoesChangeStatus } from "../../redux/maintenanceSparePartInfoesSlice";
import { MaintenanceServiceInfoesChangeStatus } from "../../redux/maintenanceServiceInfoesSlice";
import PaymentApi from "../Axios/PaymentApi";
import { useFormik } from "formik";
import axios from "axios";
import {
  ClearPaymentData,
  PaymentCreateVnPayPaymentUrl,
} from "../../redux/paymentSlice";
import { set } from "firebase/database";

const token = localStorage.getItem("localtoken");
export const formatNumberWithDots = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);
// const makeStyle = (status) => {
//   if (status === "ACCEPTED") {
//     return {
//       background: "green",
//       color: "white",
//     };
//   } else if (status === "WAITING") {
//     return {
//       background: "#0099CC",
//       color: "white",
//     };
//   } else if (status === "CANCELLED" || status === "DENIED") {
//     return {
//       background: "#990000",
//       color: "white",
//     };
//   } else {
//     return {
//       background: "#0099CC",
//       color: "white",
//     };
//   }
// };
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  // width: "100%",
}));
const Image = styled("img")(({ theme }) => ({
  width: 150,
  height: 150,
  objectFit: "cover",
  marginRight: theme.spacing(2),
  borderRadius: "8px",
}));
export const ImageMainTask = styled("img")(({ theme }) => ({
  width: 100,
  height: 100,
  objectFit: "cover",
  marginRight: theme.spacing(2),
  borderRadius: "8px",
}));
const ImageBooking = styled("img")(({ theme }) => ({
  width: 100,
  height: 100,
  objectFit: "cover",
  marginRight: theme.spacing(5),
  borderRadius: "8px",
  // marginLeft: theme.spacing(2),
}));
const ContentWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginLeft: theme.spacing(2),
}));
const statusOptions = ["ACTIVE", "INACTIVE", "DONE"];
const statusOptionMi = ["WAITINGBYCAR", "CHECKIN"];
const statusTask = ["ACCEPTED", "DONE"];
const statusPayment = ["YETPAID", "PAID"];
const statusBooking = ["WAITING", "ACCEPTED", "CANCELLED"];
const statusInforItem = ["ACTIVE", "INACTIVE"];
export const TableComponent = ({
  id,
  image,
  name,
  date,
  note,
  quantity,
  actualCost,
  status,
  money,
  costId,
  itemId,
  setReload,
}) => {
  const dispatch = useDispatch();
  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(
        MaintenanceSparePartInfoesChangeStatus({
          token,
          id: id,
          status: newStatus,
        })
      );
      setReload((p) => !p);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {}, [dispatch, setReload]);
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Image src={image} alt={name} />
          <ContentWrapper>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              {name}
            </Typography>
            <Typography variant="h6">#{id}</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell> CostId:</TableCell>
                    <TableCell>{costId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ItemId:</TableCell>
                    <TableCell>{itemId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date:</TableCell>
                    <TableCell>{date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Note:</TableCell>
                    <TableCell>{note}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Quantity:</TableCell>
                    <TableCell>{quantity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Actual Cost:</TableCell>
                    <TableCell>{formatNumberWithDots(actualCost)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </ContentWrapper>
        </Box>
      </CardContent>
      <Box style={{ paddingRight: "50px" }}>
        <Button
          style={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            width: "125px",
            fontSize: "10px",
            backgroundColor: "green",
            color: "white",
          }}
        >
          Chỉnh Sửa
        </Button>
        <Select
          value={status}
          onChange={(event) => {
            const newStatus = event.target.value;
            handleStatusChange(id, newStatus);
          }}
          style={{
            ...makeStyle(status),
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            width: "125px",
            fontSize: "10px",
            height: "50px",
          }}
        >
          {statusInforItem.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
        <Typography
          variant="h6"
          style={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {formatNumberWithDots(money)} VND
        </Typography>
      </Box>
    </StyledCard>
  );
};
export const TableMainSparePartInforComponent = ({
  id,
  image,
  name,
  date,
  note,
  quantity,
  actualCost,
  status,
  money,
  costId,
  itemId,
  discount,
  setReload,
}) => {
  const dispatch = useDispatch();
  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(
        MaintenanceSparePartInfoesChangeStatus({
          token,
          id: id,
          status: newStatus,
        })
      );
      setReload((p) => !p);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {}, [dispatch, setReload]);
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Image src={image} alt={name} />
          <ContentWrapper>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              {name}
            </Typography>
            <Typography variant="h6">#{id}</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell> CostId:</TableCell>
                    <TableCell>{costId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ItemId:</TableCell>
                    <TableCell>{itemId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date:</TableCell>
                    <TableCell>{date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Note:</TableCell>
                    <TableCell>{note}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Quantity:</TableCell>
                    <TableCell>{quantity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Discount:</TableCell>
                    <TableCell>{discount}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Actual Cost:</TableCell>
                    <TableCell>{formatNumberWithDots(actualCost)} VND</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </ContentWrapper>
        </Box>
      </CardContent>
      <Box style={{ paddingRight: "50px" }}>
        {/* <Button
          style={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            width: "125px",
            fontSize: "10px",
            backgroundColor: "green",
            color: "white",
          }}
        >
          Edit
        </Button> */}
        <Select
          value={status}
          onChange={(event) => {
            const newStatus = event.target.value;
            handleStatusChange(id, newStatus);
          }}
          style={{
            ...makeStyle(status),
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            width: "125px",
            fontSize: "10px",
            height: "50px",
          }}
        >
          {statusInforItem.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
        <Typography
          variant="h6"
          style={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {formatNumberWithDots(money)} VND
        </Typography>
      </Box>
    </StyledCard>
  );
};
export const TableMainServiceInforComponent = ({
  id,
  image,
  name,
  date,
  note,
  quantity,
  actualCost,
  status,
  money,
  costId,
  itemId,
  discount,
  setReload,
}) => {
  const dispatch = useDispatch();
  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(
        MaintenanceServiceInfoesChangeStatus({
          token,
          id: id,
          status: newStatus,
        })
      );
      setReload((p) => !p);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {}, [dispatch, setReload]);
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Image src={image} alt={name} />
          <ContentWrapper>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              {name}
            </Typography>
            <Typography variant="h6">#{id}</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell> CostId:</TableCell>
                    <TableCell>{costId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ItemId:</TableCell>
                    <TableCell>{itemId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date:</TableCell>
                    <TableCell>{date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Note:</TableCell>
                    <TableCell>{note}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Quantity:</TableCell>
                    <TableCell>{quantity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Discount:</TableCell>
                    <TableCell>{discount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Actual Cost:</TableCell>
                    <TableCell>{formatNumberWithDots(actualCost)} VND</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </ContentWrapper>
        </Box>
      </CardContent>
      <Box style={{ paddingRight: "50px" }}>
        <Button
          style={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            width: "125px",
            fontSize: "10px",
            backgroundColor: "green",
            color: "white",
          }}
          // onClick={() => handleclick(id)}
        >
          Chỉnh Sửa
        </Button>
        <Select
          value={status}
          onChange={(event) => {
            const newStatus = event.target.value;
            handleStatusChange(id, newStatus);
          }}
          style={{
            ...makeStyle(status),
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            width: "125px",
            fontSize: "10px",
            height: "50px",
          }}
        >
          {statusInforItem.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
        <Typography
          variant="h6"
          style={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {formatNumberWithDots(money)} VND
        </Typography>
      </Box>
    </StyledCard>
  );
};
export const MainComponent = ({ data, setReload }) => {
  const dispatch = useDispatch();
  const handleStatusChange = async ({ id, status }) => {
    try {
      await dispatch(
        ChangeStatusMi({
          token,
          id: id,
          status,
        })
      );
      setReload((p) => !p);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  useEffect(() => {}, [dispatch, setReload]);
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center">
          <ImageBooking src={data.image} alt={data.image} />
          <ContentWrapper>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              {data.informationMaintenanceName}
            </Typography>
            <Typography variant="h6">
              #{data.informationMaintenanceId}
            </Typography>
          </ContentWrapper>
        </Box>
      </CardContent>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data.status === "WAITINGBYCAR" ? (
          <Typography>
            <Select
              value={data.status}
              onChange={(event) => {
                const newStatus = event.target.value;
                handleStatusChange({
                  id: data.informationMaintenanceId,
                  status: newStatus,
                });
              }}
              className="status"
              style={{
                ...makeStyle(data.status),
                borderRadius: "10px",
                width: "125px",
                fontSize: "10px",
                height: "50px",
              }}
            >
              {statusOptionMi.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </Typography>
        ) : (
          <span
            className="status"
            style={{
              ...makeStyle(data.status),
              borderRadius: "10px",
              fontSize: "20px",
            }}
          >
            {data.status}
          </span>
        )}

        <Typography
          variant="h3"
          style={{
            fontWeight: "bold",
          }}
        >
          {formatNumberWithDots(data.totalPrice)} VND
        </Typography>
      </div>
    </StyledCard>
  );
};
export const CardCostComponent = ({ data, cost }) => {
  return (
    data &&
    cost && (
      <StyledCard>
        <CardContent>
          <Box display="flex" alignItems="center">
            <ImageBooking src={data.image} alt={data.image} />
            <ContentWrapper style={{ alignItems: "flex-start" }}>
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                Tên: {data.sparePartsItemName}
              </Typography>
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                {data?.clientId}
              </Typography>
              <Typography variant="h6">#{data?.sparePartsItemId}</Typography>
            </ContentWrapper>
          </Box>
        </CardContent>

        <Typography
          variant="h3"
          style={{ paddingRight: "50px", fontWeight: "bold" }}
        >
          {formatNumberWithDots(cost?.acturalCost)} VND
        </Typography>
      </StyledCard>
    )
  );
};
export const CardMainServiceCostComponent = ({ data, cost }) => {
  return (
    data &&
    cost && (
      <StyledCard>
        <CardContent>
          <Box display="flex" alignItems="center">
            <ImageBooking src={data.image} alt={data.image} />
            <ContentWrapper style={{ alignItems: "flex-start" }}>
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                Name: {data.maintenanceServiceName}
              </Typography>
              {/* <Typography variant="h5" style={{ fontWeight: "bold" }}>
                {data?.clientId}
              </Typography> */}
              <Typography variant="h6">
                #{data?.maintenanceServiceId}
              </Typography>
            </ContentWrapper>
          </Box>
        </CardContent>

        <Typography
          variant="h3"
          style={{ paddingRight: "50px", fontWeight: "bold" }}
        >
          {formatNumberWithDots(cost?.acturalCost)} VND
        </Typography>
      </StyledCard>
    )
  );
};
export const OutlinedCardMain = ({ data, setReload }) => {
  useEffect(() => {}, [setReload]);
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <MainComponent data={data} setReload={setReload}></MainComponent>
      </Card>
      {data.responseMaintenanceServiceInfos.map((item, index) => (
        <Card variant="outlined" key={index}>
          <TableMainServiceInforComponent
            id={item.maintenanceServiceInfoId}
            image={item.image}
            name={item.maintenanceServiceInfoName}
            date={item.createdDate}
            note={item.note}
            quantity={item.quantity}
            actualCost={item.actualCost}
            status={item.status}
            money={item.totalCost}
            costId={item.maintenanceServiceCostId}
            itemId={item.maintenanceServiceId}
            discount={item.discount}
            setReload={setReload}
          />
        </Card>
      ))}

      {data.responseMaintenanceSparePartInfos.map((item, index) => (
        <Card variant="outlined" key={index}>
          <TableMainSparePartInforComponent
            id={item.maintenanceSparePartInfoId}
            image={item.image}
            name={item.maintenanceSparePartInfoName}
            date={item.createdDate}
            note={item.note}
            quantity={item.quantity}
            actualCost={item.actualCost}
            status={item.status}
            money={item.totalCost}
            costId={item.sparePartsItemCostId}
            itemId={item.sparePartsItemId}
            discount={item.discount}
            setReload={setReload}
          />
        </Card>
      ))}
    </Box>
  );
};
export const OutlinedCardBooking = ({ data, setReload }) => {
  useEffect(() => {}, [setReload]);
  return (
    <Box sx={{ minWidth: 275 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined">
            <TableBookingComponent
              data={data}
              setReload={setReload}
            ></TableBookingComponent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined">
            <TableClientComponent
              data={data}
              setReload={setReload}
            ></TableClientComponent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export const TableClientComponent = ({ data, setReload }) => {
  useEffect(() => {}, [setReload]);

  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Image
            src={data.responseClient.logo}
            alt={data.responseClient.logo}
          />
          <ContentWrapper>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              Infor Client
            </Typography>
            <Typography variant="h8">
              #{data.responseClient.clientId}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Client Name:
                    </TableCell>
                    <TableCell>
                      {data.responseClient.firstName}{" "}
                      {data.responseClient.lastName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Email:</TableCell>
                    <TableCell>{data.responseClient.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Gender:
                    </TableCell>
                    <TableCell>{data.responseClient.gender}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Phone:</TableCell>
                    <TableCell>{data.responseClient.phone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Address:
                    </TableCell>
                    <TableCell>{data.responseClient.address}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </ContentWrapper>
        </Box>
      </CardContent>
    </StyledCard>
  );
};
export const TableBookingComponent = ({ data, setReload }) => {
  const dispatch = useDispatch();

  const handleStatusChange = async (bookingId, newStatus) => {
    const token = localStorage.getItem("localtoken");
    try {
      await dispatch(
        PatchStatusBookingByCenter({
          bookingId,
          status: newStatus,
          token,
        })
      );
      // dispatch(BookingByCenter({ token: token }));
      setReload((p) => !p);
    } catch (error) {
      // console.error("Error updating status:", errors);
    }
  };

  useEffect(() => {}, [dispatch, token, setReload]);
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center">
          {/* <Image src={data.image} alt={data.image} /> */}
          <ContentWrapper>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              Infor Booking
            </Typography>
            <Typography variant="h8">#{data.bookingId}</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Vehicle:
                    </TableCell>
                    <TableCell>
                      {data.responseVehicles.vehiclesBrandName}{" "}
                      {data.responseVehicles.vehicleModelName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Booking Date:
                    </TableCell>
                    <TableCell>{data.bookingDate}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      License Plate:
                    </TableCell>
                    <TableCell>{data.responseVehicles.licensePlate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Note:</TableCell>
                    <TableCell>{data.note} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Address:
                    </TableCell>
                    <TableCell>{data.responseCenter.address} </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </ContentWrapper>
          {data.status === "WAITING" ? (
            <Select
              value={data.status}
              onChange={(event) => {
                const newStatus = event.target.value;
                handleStatusChange(data.bookingId, newStatus);
              }}
              style={{
                ...makeStyle(data.status),
                borderRadius: "10px",
                width: "125px",
                fontSize: "10px",
                height: "50px",
              }}
            >
              {statusBooking.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography
              variant="h6"
              style={{
                ...makeStyle(data.status),
                borderRadius: "10px",
                width: "125px",
                fontSize: "15px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {data.status}
            </Typography>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export const TaskDetailComponent = ({ data, setReload }) => {
  const dispatch = useDispatch();

  const handleStatusChange = async (taskid, newStatus) => {
    try {
      await dispatch(
        TaskPatchStatus({
          token,
          id: taskid,
          status: newStatus,
        })
      );
      // dispatch(BookingByCenter({ token: token }));
      setReload((p) => !p);
    } catch (error) {
      // console.error("Error updating status:", errors);
    }
  };
  return (
    data && (
      <StyledCard>
        <CardContent>
          <Box display="flex" alignItems="center">
            <ImageBooking src={data.image} alt={data.image} />
            <ContentWrapper style={{ alignItems: "flex-start" }}>
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                Name: {data.maintenanceTaskName}
              </Typography>
              <Typography variant="h6">#{data.maintenanceTaskId}</Typography>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Date: {formatDate(data.createdDate)}
              </Typography>
            </ContentWrapper>
          </Box>
        </CardContent>
        <Box style={{ paddingRight: "50px" }}>
          {data.status === "ACCEPTED" ? (
            <Select
              value={data.status}
              onChange={(event) => {
                const newStatus = event.target.value;
                handleStatusChange(data.maintenanceTaskId, newStatus);
              }}
              style={{
                ...makeStyle(data.status),
                borderRadius: "10px",
                width: "125px",
                fontSize: "10px",
                height: "50px",
              }}
            >
              {statusTask.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography
              variant="h6"
              style={{
                ...makeStyle(data.status),
                borderRadius: "10px",
                width: "125px",
                fontSize: "15px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {data.status}
            </Typography>
          )}
        </Box>
      </StyledCard>
    )
  );
};

export const TableReceiptComponent = ({ data, setReload }) => {
  const dispatch = useDispatch();
  const { load, setload } = useState(false);
  const handleClear = ({ item }) => {
    dispatch(ReceiptRemove({ token: token, id: item }));
    setReload((p) => !p);
  };

  const handleStatusChange = async ({ id, status }) => {
    try {
      await dispatch(
        ReceiptChangeStatus({
          token,
          id: id,
          status: status,
        })
      );
      setReload((p) => !p);
      setload(!load);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const { payment, errorpayments, statuspayments } = useSelector(
    (state) => state.payments
  );
  const createPayment = async ({ item }) => {
    try {
      const dataitem = {
        receiptId: item.receiptId,
        fullName: item.receiptName,
        description: item.description,
        createdDate: new Date().toISOString(),
      };
      await dispatch(PaymentCreateVnPayPaymentUrl({ token, data: dataitem }));
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  useEffect(() => {}, [dispatch, setReload, data, load]);
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/codeui-node.appspot.com/o/images%2Fimage.png?alt=media&token=2ade0f8b-d89b-436f-898c-23ebf51587af"
            alt={data.image}
          />
          <ContentWrapper>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              {data.receiptName}
            </Typography>
            <Typography variant="h6">#{data.receiptId}</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody key={data.receiptId}>
                  <TableRow>
                    <TableCell>CreatedDate:</TableCell>
                    <TableCell>{formatDate(data.createdDate)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Description :</TableCell>
                    <TableCell>{data.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>VAT :</TableCell>
                    <TableCell>{data.vat}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SubTotal :</TableCell>
                    <TableCell>{data.subTotal} VND</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TotalAmount :</TableCell>
                    <TableCell>{formatNumberWithDots(data.totalAmount)} VND</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </ContentWrapper>
        </Box>
      </CardContent>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data.status === "YETPAID" && (
          <>
            <Button onClick={() => createPayment({ item: data })}>
              Tạo Thanh Toán
            </Button>
            {payment && statuspayments === "succeeded" && (
              <a href={payment} target="_blank" rel="noopener noreferrer">
                Chuyển Đến VNPay
              </a>
            )}
          </>
        )}

        {data.status === "YETPAID" ? (
          <Typography>
            <Select
              value={data.status}
              onChange={(event) => {
                const newStatus = event.target.value;
                handleStatusChange({
                  id: data.receiptId,
                  status: newStatus,
                });
              }}
              className="status"
              style={{
                ...makeStyle(data.status),
                borderRadius: "10px",
                width: "125px",
                fontSize: "10px",
                height: "50px",
              }}
            >
              {statusPayment.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            <IconButton
              onClick={() => handleClear({ item: data.receiptId })}
              size="small"
            >
              <ClearIcon />
            </IconButton>
          </Typography>
        ) : (
          <Typography
            className="status"
            style={{
              ...makeStyle(data.status),
              borderRadius: "10px",
              fontSize: "20px",
            }}
          >
            {data.status}
          </Typography>
        )}
        <Typography
          variant="h3"
          style={{
            // paddingTop: "10px",
            // paddingRight: "50px",
            fontWeight: "bold",
          }}
        >
          {formatNumberWithDots(data.totalAmount)} VND
        </Typography>
      </div>
    </StyledCard>
  );
};
export const ReceiptComponent = ({ data, setReload }) => {
  const dispatch = useDispatch();

  useEffect(() => {}, [dispatch, setReload]);
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <TableReceiptComponent
          data={data}
          setReload={setReload}
        ></TableReceiptComponent>
      </Card>
    </Box>
  );
};

export const OutlinedCardReceipt = ({ data, setReload, main }) => {
  useEffect(() => {
    console.log("OutlinedCardReceipt", data);
  }, [data, setReload, main]);
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <ReceiptComponent data={data} setReload={setReload}></ReceiptComponent>
      </Card>

      {main.responseMaintenanceServiceInfos.map((item, index) => (
        <Card variant="outlined" key={index}>
          <TableMainServiceInforComponent
            image={item.image}
            name={item.maintenanceServiceInfoName}
            date={item.createdDate}
            note={item.note}
            quantity={item.quantity}
            actualCost={item.actualCost}
            status={item.status}
            money={item.totalCost}
            costId={item.maintenanceServiceCostId}
            itemId={item.maintenanceServiceId}
            id={item.maintenanceServiceInfoId}
          />
        </Card>
      ))}
      {main.responseMaintenanceSparePartInfos.map((item, index) => (
        <Card variant="outlined" key={index}>
          <TableMainSparePartInforComponent
            image={item.image}
            name={item.maintenanceSparePartInfoName}
            date={item.createdDate}
            note={item.note}
            quantity={item.quantity}
            actualCost={item.actualCost}
            status={item.status}
            money={item.totalCost}
            costId={item.sparePartsItemCostId}
            itemId={item.sparePartsItemId}
            id={item.maintenanceSparePartInfoId}
          />
        </Card>
      ))}
    </Box>
  );
};

export const OutlinedCardListTask = ({ data, setReload }) => {
  const dispatch = useDispatch();
  const { tasks, statustasks } = useSelector((state) => state.tasks);
  useEffect(() => {
    console.log("OutlinedCardListTask", data);
    if (data) {
      dispatch(
        TaskListStatusDifCancelledByInfor({
          token,
          id: data.informationMaintenanceId,
        })
      );
    }
  }, [dispatch, data, setReload]);
  return (
    <Box sx={{ minWidth: 275 }}>
      <Grid container spacing={2}>
        {tasks.length > 1
          ? tasks.map((task) => (
              <Grid item xs={12} sm={6} key={task.maintenanceTaskId}>
                <Card key={task.maintenanceTaskId}>
                  <TaskDetailComponent data={task} setReload={setReload} />
                </Card>
              </Grid>
            ))
          : tasks.map((task) => (
              <Grid item xs={12} key={task.maintenanceTaskId}>
                <Card key={task.maintenanceTaskId}>
                  <TaskDetailComponent data={task} setReload={setReload} />
                </Card>
              </Grid>
            ))}
      </Grid>
    </Box>
  );
};

export const TableMainTaskSparePartsComponent = ({ data, setReload }) => {
  const dispatch = useDispatch();

  const handleStatusChange = async (bookingId, newStatus) => {
    const token = localStorage.getItem("localtoken");
    try {
      await dispatch(
        PatchStatusBookingByCenter({
          bookingId,
          status: newStatus,
          token,
        })
      );
      // dispatch(BookingByCenter({ token: token }));
      setReload((p) => !p);
    } catch (error) {
      // console.error("Error updating status:", errors);
    }
  };

  useEffect(() => {
    console.log("TableMainTaskSparePartsComponent Data:", data);
  }, [dispatch, token, setReload]);
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center">
          {/* <Image src={data.image} alt={data.image} /> */}
          <ContentWrapper>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              Infor Booking
            </Typography>
            <Typography variant="h8">#{data.bookingId}</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>e:</TableCell>
                    <TableCell>
                      {data?.responseVehicles?.vehiclesBrandName}{" "}
                      {data?.responseVehicles?.vehicleModelName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Booking Date:
                    </TableCell>
                    <TableCell>{data?.bookingDate}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      License Plate:
                    </TableCell>
                    <TableCell>
                      {data?.responseVehicles?.licensePlate}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Note :</TableCell>
                    <TableCell>{data?.note} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Address :
                    </TableCell>
                    <TableCell>{data?.responseCenter?.address} </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </ContentWrapper>
          {data?.status === "WAITING" ? (
            <Select
              value={data.status}
              onChange={(event) => {
                const newStatus = event.target.value;
                handleStatusChange(data.bookingId, newStatus);
              }}
              style={{
                ...makeStyle(data.status),
                borderRadius: "10px",
                width: "125px",
                fontSize: "10px",
                height: "50px",
              }}
            >
              {statusBooking.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography
              variant="h6"
              style={{
                ...makeStyle(data.status),
                borderRadius: "10px",
                width: "125px",
                fontSize: "15px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {data.status}
            </Typography>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};
export const TableMainTaskServicesComponent = ({ data, setReload }) => {
  const dispatch = useDispatch();

  const handleStatusChange = async (bookingId, newStatus) => {
    const token = localStorage.getItem("localtoken");
    try {
      await dispatch(
        PatchStatusBookingByCenter({
          bookingId,
          status: newStatus,
          token,
        })
      );
      // dispatch(BookingByCenter({ token: token }));
      setReload((p) => !p);
    } catch (error) {
      // console.error("Error updating status:", errors);
    }
  };

  useEffect(() => {}, [dispatch, token, setReload]);
  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center">
          {/* <Image src={data.image} alt={data.image} /> */}
          <ContentWrapper>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              Infor Booking
            </Typography>
            <Typography variant="h8">#{data.bookingId}</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Vehicle:
                    </TableCell>
                    <TableCell>
                      {data.responseVehicles.vehiclesBrandName}{" "}
                      {data.responseVehicles.vehicleModelName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Booking Date:
                    </TableCell>
                    <TableCell>{data.bookingDate}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      License Plate:
                    </TableCell>
                    <TableCell>{data.responseVehicles.licensePlate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>Note :</TableCell>
                    <TableCell>{data.note} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Address :
                    </TableCell>
                    <TableCell>{data.responseCenter.address} </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </ContentWrapper>
          {data.status === "WAITING" ? (
            <Select
              value={data.status}
              onChange={(event) => {
                const newStatus = event.target.value;
                handleStatusChange(data.bookingId, newStatus);
              }}
              style={{
                ...makeStyle(data.status),
                borderRadius: "10px",
                width: "125px",
                fontSize: "10px",
                height: "50px",
              }}
            >
              {statusBooking.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography
              variant="h6"
              style={{
                ...makeStyle(data.status),
                borderRadius: "10px",
                width: "125px",
                fontSize: "15px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {data.status}
            </Typography>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};
