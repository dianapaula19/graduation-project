import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { ApiStatus, API_URL_COURSE, API_URL_USER } from "../../Utils";

interface ISendAnnouncementState {
  status: ApiStatus;
  showModal: boolean;
  code: null | string;
}

const initialState: ISendAnnouncementState = {
  status: ApiStatus.idle,
  showModal: false,
  code: null
}

interface ISendAnnouncementRequest {
  subject: string;
  message: string;
  recipient_list: string[];
}

interface ISendAnnouncementResponse {
  code: string; 
}

interface ISendAnnouncementError {
  code: string; 
}

export const sendAnnouncementAsync = createAsyncThunk(
  'user/admin/sendAnnouncement',
  async (request: ISendAnnouncementRequest, {rejectWithValue}) => await axios
    .post(
      API_URL_USER + "/teacher/send_announcement",
      request
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return rejectWithValue(error.response.data);
    })
)

export const sendAnnouncementSlice = createSlice({
  name: 'sendAnnouncement',
  initialState,
  reducers: {
    revertSendAnnouncement: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(sendAnnouncementAsync.pending, (state, action) => {
      state.status = ApiStatus.loading;
    })
    .addCase(sendAnnouncementAsync.fulfilled, (state, action) => {
      const res = action.payload as ISendAnnouncementResponse;
      state.code = res.code;
      state.showModal = true;
      state.status = ApiStatus.success;
    })
    .addCase(sendAnnouncementAsync.rejected, (state, action) => {
      const res = action.payload as ISendAnnouncementError;
      state.code = res.code;
      state.showModal = true;
      state.status = ApiStatus.failed;
    })
  }
});

export const { revertSendAnnouncement } = sendAnnouncementSlice.actions;

export const sendAnnouncementStatus = (root: RootState) => root.sendAnnouncement.status;
export const sendAnnouncementShowModal = (root: RootState) => root.sendAnnouncement.showModal;
export const sendAnnouncementCode = (root: RootState) => root.sendAnnouncement.code;

export default sendAnnouncementSlice.reducer; 