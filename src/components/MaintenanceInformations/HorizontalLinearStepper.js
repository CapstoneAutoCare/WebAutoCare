import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  OutlinedCardBooking,
  OutlinedCardMain,
  OutlinedCardReceipt,
} from "./OutlinedCard";
import { Fragment, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ReceiptById, ReceiptByInforId } from "../../redux/receiptSlice";

export default function HorizontalLinearStepper({
  mainData,
  bookingData,
  setReload,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const dispatch = useDispatch();
  const token = localStorage.getItem("localtoken");
  const { receipt, errorreceipt, statureceipt } = useSelector(
    (state) => state.receipts
  );

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

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const stepLabels = mainData.responseMaintenanceHistoryStatuses.map(
    (step) => step.status
  );
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
          // if (isStepOptional(index)) {
          //   labelProps.optional = (
          //     <Typography variant="caption">Optional</Typography>
          //   );
          // }
          // if (isStepSkipped(index)) {
          //   stepProps.completed = false;
          // }
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
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>

            <Box sx={{ flex: "1 1 auto" }}>
              {activeStep === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      color="inherit"
                      // onClick={handleAddItems}
                      sx={{ width: "100%" }}
                    >
                      Add Maintenance SparePart Infor
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      color="inherit"
                      // onClick={handleAddService}
                      sx={{ width: "100%" }}
                    >
                      Add Maintenance Service Infor
                    </Button>
                  </Grid>
                </Grid>
              )}
              {activeStep === 4 && (
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Button
                      color="inherit"
                      // onClick={handleAddItems}
                      sx={{ width: "100%" }}
                    >
                      Receipt
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
            <Button onClick={handleNext}>
              {activeStep === stepLabels.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
          {activeStep === 0 && <OutlinedCardBooking data={bookingData} />}
          {activeStep === 1 && (
            <OutlinedCardMain data={mainData} setReload={setReload} />
          )}
          {activeStep === 2 && (
            <OutlinedCardMain data={mainData} setReload={setReload} />
          )}
          {activeStep === 3 && (
            <OutlinedCardMain data={mainData} setReload={setReload} />
          )}
          {activeStep === 4 && (
            <OutlinedCardReceipt data={mainData} setReload={setReload} />
          )}
        </Fragment>
      )}
    </Box>
  );
}
