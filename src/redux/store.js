import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import accountSelect from "../redux/accountSlice";
import customercareReducer from "./customercareSlice";
import sparepartitemsReducer from "./sparepartItemsSlice";
import maintenanceservicesReducer from "./mainserviceSlice";
import bookingReducer from "./bookingSlice";
import sparepartsReducer from "./sparepartsSlice";
import technicianReducer from "./techinicansSlice";
import maintenanceInformationsReducer from "./maintenanceInformationsSlice";
import servicesReducer from "./servicesSlice";
import tasksReducer from "./tasksSlice";
import receiptSlice from "./receiptSlice";
import maintenanceSparePartInfoesReducer from "./maintenanceSparePartInfoesSlice";
import maintenanceServicetInfoesReducer from "./maintenanceServiceInfoesSlice";
import paymentsReducer from "./paymentSlice";
import centersReducer from "./centerSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountSelect,
    customercare: customercareReducer,
    sparepartitem: sparepartitemsReducer,
    maintenanceservice: maintenanceservicesReducer,
    booking: bookingReducer,
    spareparts: sparepartsReducer,
    technician: technicianReducer,
    maintenanceInformation: maintenanceInformationsReducer,
    services: servicesReducer,
    tasks:tasksReducer,
    receipts:receiptSlice,
    maintenanceSparePartInfoes: maintenanceSparePartInfoesReducer,
    maintenanceServicetInfoes :maintenanceServicetInfoesReducer,
    payments: paymentsReducer,
    centers: centersReducer,
  },
});

export default store;
