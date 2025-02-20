import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  title1: null,
  title2: null,
  logo: null,
};

const headerStateSlice = createSlice({
  name: "headerState",
  initialState,
  reducers: {
    updateHeaderState: (state, action) => {
      state.title1 = action.payload.title1;
      state.title2 = action.payload.title2;
      state.logo = action.payload.logo;
    },
  },
});

export const {updateHeaderState} = headerStateSlice.actions

export default headerStateSlice.reducer