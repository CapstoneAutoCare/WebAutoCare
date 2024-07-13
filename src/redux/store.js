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
  },
});

export default store;
