import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import accountSelect from "../redux/accountSlice";
import customercareReducer from "./customercareSlice";
import sparepartitemsReducer from "./sparepartItemsSlice";
import maintenanceservicesReducer from "./mainserviceSlice";
import bookingReducer from "./bookingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountSelect,
    customercare: customercareReducer,
    sparepartitem: sparepartitemsReducer,
    maintenanceservice: maintenanceservicesReducer,
    booking: bookingReducer,
  },
});

export default store;
