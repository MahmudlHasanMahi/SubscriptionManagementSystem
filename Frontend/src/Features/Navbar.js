import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  active: "Dashboard",
};
const navBarSlice = createSlice({
  name: "NavbarSlice",
  initialState,
  reducers: {
    updateNavbar: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const NavbarState = (state) => state.navbarState.active;
export const { updateNavbar } = navBarSlice.actions;
export default navBarSlice.reducer;
