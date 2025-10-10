import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getCookie from "../../Utils/extractCSRFToken";
import { notifySuccess, notifyError } from "../../Utils/nofify";
import {
  INVALID_CREDENTIAL,
  PASSWORD_CHANGED,
  LOGIN_SUCCESSFULL,
} from "../../Utils/types";
const initialState = {
  user: null,
  isLoading: false,
};
import { API_ROOT } from "../../Utils/enviroment";
export const SignIn = createAsyncThunk(
  "UserAuth/sign",
  async (signInCredentials) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    };
    try {
      const res = await fetch(`${API_ROOT}/user/signup`, {
        method: "POST",
        headers,
        body: JSON.stringify(signInCredentials),
      });
      const data = await res.json();
      if (!res.ok) {
        notifyError(INVALID_CREDENTIAL);
        return null;
      }
      if (data.last_login) {
        return data;
      }
      return { ...data, password: signInCredentials.password };
    } catch (err) {
      return null;
    }
  }
);

export const Signout = createAsyncThunk("UserAuth/signout", async () => {
  try {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    };

    const res = await fetch(`${API_ROOT}/user/signOut`, {
      method: "POST",
      headers,
    });
  } catch (err) {}
});

export const IsAuthenticated = createAsyncThunk(
  "UserAuth/IsAuthenticated",
  async () => {
    try {
      const res = await fetch(`${API_ROOT}/user/checkAuthentication`);
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }
);

export const ChangePassword = createAsyncThunk(
  "UserAuth/ChangePassword",
  async (newPasswords, { getState }) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    };
    const { password, id } = getState().auth.user;
    const body = {
      id: id,
      old_password: password,
      password: newPasswords.password,
      re_password: newPasswords.re_password,
    };
    try {
      const res = await fetch(`${API_ROOT}/user/resetPassword`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const data = res.json();
      if (res.ok) {
        notifySuccess(PASSWORD_CHANGED);
        notifySuccess(LOGIN_SUCCESSFULL);
      }
    } catch (err) {}
  }
);

export const userAuthSlice = createSlice({
  name: "UserAuth",
  initialState,
  reducers: {
    resetState: (state, action) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SignIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SignIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(SignIn.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      })

      .addCase(IsAuthenticated.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(IsAuthenticated.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(IsAuthenticated.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      });
  },
});
export const { resetState } = userAuthSlice.actions;
export const user = (state) => state.auth.user;
export const isLoading = (state) => state.auth.isLoading;
export default userAuthSlice.reducer;
