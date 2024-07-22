import { createSlice } from "@reduxjs/toolkit";

export const ERROR = "error";
export const ALERT = "alert";
export const SUCCESS = "success";

const initialState = {
  type: "",
  message: "",
  status: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    notify(state, action) {
      state.message = action.payload;
    },
  },
});

export const { notify } = notificationSlice.actions;
export default notificationSlice;
