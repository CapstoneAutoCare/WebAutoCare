import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  OutlinedCardBooking,
  OutlinedCardListTask,
  OutlinedCardMain,
  OutlinedCardOdoHisotry,
  OutlinedCardReceipt,
} from "./OutlinedCard";
import { Fragment, useEffect, useState } from "react";
import { Fade, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ReceiptByInforId } from "../../redux/receiptSlice";
import {
  AddMaintenanceServiceInfoesDialog,
  AddMaintenanceSparePartInfoesDialog,
  UseFormikCreateReceipt,
} from "../../Data/DialogComponent";
import { OdoHistoriesByInforId } from "../../redux/odohistory";
import { UseFormikCreateOdoHisotry } from "../../Data/DialogAdmin";

const statusTranslations = {
  "CREATEDBYClIENT": "Tạo bởi khách hàng",
  "WAITINGBYCAR": "Chờ xe",
  "CHECKIN": "Nhận xe",
  "REPAIRING": "Đang sửa chữa",
  "PAYMENT": "Thanh toán",
  "YETPAID": "Chưa thanh toán",
  "PAID": "Đã thanh toán",
};

export default function HorizontalLinearStepper({
  mainData,
  bookingData,
  setReload,
}) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("localtoken");
  const [inforId, setInforId] = useState(null);
  const [vehicle, setVehicle] = useState(null);

  const { receipt, statusreceipt } = useSelector((state) => state.receipts);
  const { odohistory, statusodohisotries } = useSelector((state) => state.odohistories);

  const [open, setOpen] = useState(false);
  const [openAddOdo, setOpenAddOdo] = useState(false);
  const [openAddMainSparePartInfor, setOpenAddMainSparePartInfor] =
    useState(false);
  const [openAddMainServiceInfor, setOpenAddMainServiceInfor] = useState(false);

  const statusOptions = [
    "CREATEDBYClIENT",
    "WAITINGBYCAR",
    "CHECKIN",
    "REPAIRING",
    "PAYMENT",
    "YETPAID",
    "PAID",
  ];

  const HandleAddOdoHisotry = ({ informationMaintenanceId, vehicleId }) => {
    setInforId(informationMaintenanceId);
    setVehicle(vehicleId);
    setOpenAddOdo(true);
  };

  const HandleAddReceipt = ({ informationMaintenanceId }) => {
    setInforId(informationMaintenanceId);
    setOpen(true);
  };

  const HandleAddMainServiceInfor = ({ informationMaintenanceId }) => {
    setInforId(informationMaintenanceId);
    setOpenAddMainServiceInfor(true);
  };

  const HandleAddMainServiceInforClose = () => {
    setOpenAddMainServiceInfor(false);
    setReload((p) => !p);
    setInforId(null);
  };

  const HandleAddSparePartInfor = ({ informationMaintenanceId }) => {
    setInforId(informationMaintenanceId);
    setOpenAddMainSparePartInfor(true);
  };

  const HandleAddSparePartInforClose = () => {
    setOpenAddMainSparePartInfor(false);
    setReload((p) => !p);
    setInforId(null);
  };

  const handleClose = () => {
    setOpen(false);
    setReload((p) => !p);
    setInforId(null);
  };

  useEffect(() => {
    dispatch(
      ReceiptByInforId({ token, id: mainData.informationMaintenanceId })
    );
    dispatch(OdoHistoriesByInforId({ token, id: mainData.informationMaintenanceId }))
  }, [dispatch, token,]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}>
        {statusOptions.map((status) => (
          <Typography
            key={status}
            sx={{
              color:
                mainData.status === status ? "primary.main" : "text.secondary",
              fontWeight: mainData.status === status ? "bold" : "normal",
            }}
          >
            {/* {statusTranslations[status]} */}
          </Typography>
        ))}
      </Box>

      <Stepper
        activeStep={statusOptions.indexOf(mainData.status)}
        alternativeLabel
      >
        {statusOptions.map((label, index) => (
          <Step
            key={label}
            completed={index <= statusOptions.indexOf(mainData.status)}
          >
            <StepLabel>{statusTranslations[label]}</StepLabel>
            
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={2}>
          {["CHECKIN", "REPAIRING"].includes(mainData.status) && (
            <>
              <Grid item xs={6}>
                <Button
                  onClick={() =>
                    HandleAddSparePartInfor({
                      informationMaintenanceId:
                        mainData.informationMaintenanceId,
                    })
                  }
                  sx={{ width: "100%" }}
                  variant="outlined"
                  color="success"
                >
                  Thêm Phụ Tùng Mới
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  onClick={() =>
                    HandleAddMainServiceInfor({
                      informationMaintenanceId:
                        mainData.informationMaintenanceId,
                    })
                  }
                  sx={{ width: "100%" }}
                  variant="outlined"
                  color="success"
                >
                  Thêm Dịch Vụ Mới
                </Button>
              </Grid>
            </>
          )}
          {statusodohisotries === "failed" && ["CHECKIN", "REPAIRING"].includes(mainData.status) && (
            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Button
                  onClick={() =>
                    HandleAddOdoHisotry({
                      informationMaintenanceId: mainData.informationMaintenanceId,
                      vehicleId: mainData.responseVehicles.vehiclesId
                    })
                  }
                  sx={{ width: "100%" }}
                  variant="outlined"
                  color="success"
                >
                  Lưu Lịch Sử Odo Hiện Tại
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>

        {statusreceipt === "failed" && mainData.status === "PAYMENT" && (
          <Grid container spacing={1} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Button
                onClick={() =>
                  HandleAddReceipt({
                    informationMaintenanceId: mainData.informationMaintenanceId,
                  })
                }
                sx={{ width: "100%" }}
                variant="outlined"
                color="success"
              >
                Tạo Biên Lai
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Fade in={true}>
          <Box>
            <OutlinedCardBooking data={bookingData} setReload={setReload} />
          </Box>
        </Fade>

        <OutlinedCardMain data={mainData} setReload={setReload} />
        {odohistory && statusodohisotries === "succeeded" && (
          <OutlinedCardOdoHisotry
            data={odohistory}
            main={mainData}
            setReload={setReload}
          />
        )}
        <OutlinedCardListTask data={mainData} setReload={setReload} />

        {receipt && statusreceipt === "succeeded" && (
          <OutlinedCardReceipt
            data={receipt}
            main={mainData}
            setReload={setReload}
          />
        )}
      </Box>

      <UseFormikCreateReceipt
        open={open}
        handleClose={handleClose}
        token={token}
        informationMaintenanceId={inforId}
      />
      <UseFormikCreateOdoHisotry
        open={openAddOdo}
        handleClose={handleClose}
        token={token}
        informationMaintenanceId={inforId}
        vehicleId={vehicle}
      />
      <AddMaintenanceSparePartInfoesDialog
        open={openAddMainSparePartInfor}
        handleClose={HandleAddSparePartInforClose}
        token={token}
        informationMaintenanceId={inforId}
      />
      <AddMaintenanceServiceInfoesDialog
        open={openAddMainServiceInfor}
        handleClose={HandleAddMainServiceInforClose}
        token={token}
        informationMaintenanceId={inforId}
      />
    </Box>
  );
}
