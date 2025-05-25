import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { USER_DOESNOT_EXISTS, USER_UPDATED, USER_EXIST } from "../Utils/types";
import getCookie from "../Utils/extractCSRFToken";
import { notifyError, notifySuccess } from "../Utils/nofify";
const initialState = {
  staffState: null,
  isLoading: false,
};
// const initialState = {
// staffState:{
// statffList:[],

//staffcount:0;
// }
// }

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": getCookie("csrftoken"),
};

export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async ({ pageParam, count }) => {
    try {
      const url = count
        ? "http://127.0.0.1:8000/user/staff-list?count=true"
        : pageParam;
      const res = await fetch(url, { headers });
      const data = await res.json();
      return data;
    } catch (err) {}
  }
);

export const getGroups = createAsyncThunk("groups/role", async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/user/groups", headers);
    const data = await res.json();
    return data;
  } catch (err) {}
});

export const getStaff = createAsyncThunk("staff/get-staff", async (id) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/user/staff/${id}`, headers);
    const data = await res.json();
    if (res.ok) return data;
    else return notifyError(USER_DOESNOT_EXISTS);
  } catch (err) {
    notifyError(err);
  }
});

export const editStaff = createAsyncThunk(
  "staff/edit",
  async ({ staffId, body }) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/user/staff/${staffId}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (res.ok) return notifySuccess(USER_UPDATED);
      else return notifyError(USER_EXIST);
    } catch (err) {
      notifyError(err);
    }
  }
);

const staffSlice = createSlice({
  name: "user/staff",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.count) {
          state.staffState = action.payload;
        }
      })
      .addCase(fetchStaff.rejected, (state) => {
        state.isLoading = false;
        state.staffs = null;
      })
      .addCase(getStaff.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staffState = action.payload;
      })
      .addCase(getStaff.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(editStaff.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editStaff.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(editStaff.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staffState = action.payload;
      })
      .addCase(getGroups.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const staffState = (state) => state.staffState;
export default staffSlice.reducer;
