import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Features/UserAuth/UserAuth";
import navbarReducer from "../Features/Navbar";
import headerReducer from "../Features/headerState";
import staffSlice from "../Features/staff";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    navbarState: navbarReducer,
    headerState: headerReducer,
    staffState: staffSlice,
  },
});

export default store;
