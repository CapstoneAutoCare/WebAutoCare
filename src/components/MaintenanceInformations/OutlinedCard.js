import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  ButtonBase,
  makeStyles,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

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
      <Typography variant="h6">{status}</Typography>
      <Typography variant="h6" style={{ fontWeight: "bold" }}>
        ${money}
      </Typography>
    </Box>
  </StyledCard>
);

const BookingComponent = ({ data }) => (
  <StyledCard>
    <CardContent>
      <Box display="flex" alignItems="center">
        <ImageBooking src={data.image} alt={data.image} />
        <ContentWrapper>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            {data.informationMaintenanceName}
          </Typography>
          <Typography variant="h6">#{data.informationMaintenanceId}</Typography>
          {/* <Typography variant="h6">{data.note}</Typography> */}
          {/* <Typography variant="h6">{data.createdDate}</Typography> */}
          {/* <Typography variant="h6">{data.finishedDate}</Typography> */}
        </ContentWrapper>
      </Box>
    </CardContent>

    <Typography
      variant="h2"
      style={{ paddingRight: "50px", fontWeight: "bold" }}
    >
      ${data.totalPrice}
    </Typography>
  </StyledCard>
);
export default function OutlinedCard({ data }) {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <BookingComponent data={data}></BookingComponent>
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
}
