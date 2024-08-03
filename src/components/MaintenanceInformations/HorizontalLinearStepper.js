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
  OutlinedCardReceipt,
} from "./OutlinedCard";
import { Fragment, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ReceiptByInforId } from "../../redux/receiptSlice";
import {
  AddMaintenanceServiceInfoesDialog,
  AddMaintenanceSparePartInfoesDialog,
  UseFormikCreateReceipt,
} from "../../Data/DialogComponent";

export default function HorizontalLinearStepper({
  mainData,
  bookingData,
  setReload,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const dispatch = useDispatch();
  const token = localStorage.getItem("localtoken");
  const [inforId, setInforId] = useState(null);
  const { receipt, errorreceipt, statusreceipt } = useSelector(
    (state) => state.receipts
  );
  const [open, setOpen] = useState(false);
  const [openAddMainSparePartInfor, setOpenAddMainSparePartInfor] =
    useState(false);
  const [openAddMainServiceInfor, setOpenAddMainServiceInfor] = useState(false);
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const HandleAddReceipt = ({ informationMaintenanceId }) => {
    console.log("HandleAddReceipt", informationMaintenanceId);
    setInforId(informationMaintenanceId);
    setOpen(true);
  };

  const HandleAddMainServiceInfor = ({ informationMaintenanceId }) => {
    setInforId(informationMaintenanceId);
    console.log("HandleAddMainServiceInfor", informationMaintenanceId);
    setOpenAddMainServiceInfor(true);
  };

  const HandleAddMainServiceInforClose = () => {
    setOpenAddMainServiceInfor(false);
    setReload((p) => !p);
    setInforId(null);
  };
  const HandleAddSparePartInfor = ({ informationMaintenanceId }) => {
    setInforId(informationMaintenanceId);
    console.log("HandleAddSparePartInfor", informationMaintenanceId);
    setOpenAddMainSparePartInfor(true);
  };

  const HandleAddSparePartInforClose = () => {
    setOpenAddMainSparePartInfor(false);
    setReload((p) => !p);
    setInforId(null);
  };
  const stepLabels = mainData.responseMaintenanceHistoryStatuses.map(
    (step) => step.status
  );
  const handleClose = () => {
    setOpen(false);
    setReload((p) => !p);
    setInforId(null);
  };
  useEffect(() => {
    dispatch(
      ReceiptByInforId({ token, id: mainData.informationMaintenanceId })
    );
  }, [dispatch, setReload]);
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {stepLabels.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === stepLabels.length ? (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you're finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="info"
              disabled={activeStep === 0}
              variant="outlined"
              onClick={handleBack}
              sx={{ mr: 0 }}
            >
              Trả Về
            </Button>

            <Box sx={{ flex: "1 1 auto" }}>
              {activeStep === 2 &&
                (mainData.status === "CHECKIN" ||
                  mainData.status === "REPAIRING") && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        // color="inherit"
                        onClick={() => {
                          HandleAddSparePartInfor({
                            informationMaintenanceId:
                              mainData.informationMaintenanceId,
                          });
                        }}
                        sx={{ width: "100%" }}
                        variant="outlined"
                        color="success"
                      >
                        Thêm Phụ Tùng Mới
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        // color="inherit"
                        onClick={() => {
                          HandleAddMainServiceInfor({
                            informationMaintenanceId:
                              mainData.informationMaintenanceId,
                          });
                        }}
                        sx={{ width: "100%" }}
                        variant="outlined"
                        color="success"
                      >
                        Thêm Dịch Vụ Mới
                      </Button>
                    </Grid>
                  </Grid>
                )}
              {activeStep === 4 && statusreceipt === "failed" && (
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Button
                      onClick={() => {
                        HandleAddReceipt({
                          informationMaintenanceId:
                            mainData.informationMaintenanceId,
                        });
                      }}
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
            <Button onClick={handleNext} variant="outlined" color="primary">
              {activeStep === stepLabels.length - 1 ? "Finish" : "Tiếp Tục"}
            </Button>
          </Box>
          {activeStep === 0 && (
            <OutlinedCardBooking data={bookingData} setReload={setReload} />
          )}
          {activeStep === 1 && (
            <OutlinedCardMain data={mainData} setReload={setReload} />
          )}
          {activeStep === 2 && (
            <OutlinedCardMain data={mainData} setReload={setReload} />
          )}
          {activeStep === 3 && (
            <OutlinedCardListTask data={mainData} setReload={setReload} />
          )}
          {activeStep === 4 && receipt && statusreceipt === "succeeded" && (
            <OutlinedCardReceipt
              data={receipt}
              main={mainData}
              setReload={setReload}
            />
          )}
        </Fragment>
      )}
      <UseFormikCreateReceipt
        open={open}
        handleClose={handleClose}
        token={token}
        informationMaintenanceId={inforId}
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
        s
      />
    </Box>
  );
}
