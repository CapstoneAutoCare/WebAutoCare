import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  ButtonBase,
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
} from "@mui/material";
import { makeStyle } from "../Booking/Booking";
import { useDispatch, useSelector } from "react-redux";
import { ChangeStatusMi } from "../../redux/maintenanceInformationsSlice";
import { useEffect, useState } from "react";
import { formatDate } from "../../Data/Pagination";
import { TaskGetById, TaskPatchStatus } from "../../redux/tasksSlice";

const token = localStorage.getItem("localtoken");

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

const TableComponent = ({
  image,
  name,
  date,
  note,
  quantity,
  actualCost,
  status,
  money,
}) => (
  <StyledCard>
    <CardContent>
      <Box display="flex" alignItems="center">
        <Image src={image} alt={name} />
        <ContentWrapper>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            {name}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableBody>
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
                  <TableCell>{actualCost}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </ContentWrapper>
      </Box>
    </CardContent>
    <Box style={{ paddingRight: "50px" }}>
      <Typography
        variant="h6"
        style={{
          ...makeStyle(status),
          borderRadius: "10px",
          width: "125px",
          fontSize: "15px",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {status}
      </Typography>
      <Typography
        variant="h6"
        style={{
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        ${money}
      </Typography>
    </Box>
  </StyledCard>
);

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
      <div>
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
              width: "125px",
              fontSize: "20px",
              height: "50px",
            }}
          >
            {data.status}
          </span>
        )}

        <Typography
          variant="h2"
          style={{
            paddingTop: "10px",
            paddingRight: "50px",
            fontWeight: "bold",
          }}
        >
          ${data.totalPrice}
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
                Name: {data.sparePartsItemName}
              </Typography>
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                {data?.clientId}
              </Typography>
              <Typography variant="h6">#{data?.sparePartsItemId}</Typography>
            </ContentWrapper>
          </Box>
        </CardContent>

        <Typography
          variant="h2"
          style={{ paddingRight: "50px", fontWeight: "bold" }}
        >
          ${cost?.acturalCost}
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
          variant="h2"
          style={{ paddingRight: "50px", fontWeight: "bold" }}
        >
          ${cost?.acturalCost}
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
          <TableComponent
            image={item.image}
            name={item.maintenanceServiceInfoName}
            date={item.createdDate}
            note={item.note}
            quantity={item.quantity}
            actualCost={item.actualCost}
            status={item.status}
            money={item.totalCost}
          />
        </Card>
      ))}
      {data.responseMaintenanceSparePartInfos.map((item, index) => (
        <Card variant="outlined" key={index}>
          <TableComponent
            image={item.image}
            name={item.maintenanceSparePartInfoName}
            date={item.createdDate}
            note={item.note}
            quantity={item.quantity}
            actualCost={item.actualCost}
            status={item.status}
            money={item.totalCost}
          />
        </Card>
      ))}
    </Box>
  );
};
export const OutlinedCardBooking = ({ data }) => {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <TableBookingComponent data={data}></TableBookingComponent>
      </Card>
    </Box>
  );
};

const TableBookingComponent = ({ data }) => (
  <StyledCard>
    <CardContent>
      <Box display="flex" alignItems="center">
        <Image src={data.image} alt={data.image} />
        <ContentWrapper>
          {/* <Typography variant="h5" style={{ fontWeight: "bold" }}>
            {data.image}
          </Typography> */}
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Booking Date:</TableCell>
                  <TableCell>{data.bookingDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Vehicle:</TableCell>
                  <TableCell>
                    {data.responseVehicles.vehiclesBrandName}{" "}
                    {data.responseVehicles.vehicleModelName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>License Plate:</TableCell>
                  <TableCell>{data.responseVehicles.licensePlate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Odo:</TableCell>
                  <TableCell>{data.responseVehicles.odo} Km</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </ContentWrapper>
      </Box>
    </CardContent>
    <Box style={{ paddingRight: "50px" }}>
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
      {/* <Typography variant="h6" style={{ fontWeight: "bold" }}>
        ${money}
      </Typography> */}
    </Box>
  </StyledCard>
);

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

export const OutlinedCardReceipt = ({ data, setReload }) => {
  useEffect(() => {}, [setReload]);
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <MainComponent data={data} setReload={setReload}></MainComponent>
      </Card>
      <Card variant="outlined">
        <MainComponent data={data} setReload={setReload}></MainComponent>
      </Card>

      {data.responseMaintenanceServiceInfos.map((item, index) => (
        <Card variant="outlined" key={index}>
          <TableComponent
            image={item.image}
            name={item.maintenanceServiceInfoName}
            date={item.createdDate}
            note={item.note}
            quantity={item.quantity}
            actualCost={item.actualCost}
            status={item.status}
            money={item.totalCost}
          />
        </Card>
      ))}
      {data.responseMaintenanceSparePartInfos.map((item, index) => (
        <Card variant="outlined" key={index}>
          <TableComponent
            image={item.image}
            name={item.maintenanceSparePartInfoName}
            date={item.createdDate}
            note={item.note}
            quantity={item.quantity}
            actualCost={item.actualCost}
            status={item.status}
            money={item.totalCost}
          />
        </Card>
      ))}
    </Box>
  );
};
