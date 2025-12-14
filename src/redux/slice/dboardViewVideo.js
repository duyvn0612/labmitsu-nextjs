import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  viewCameras: [],
  viewVmss: [],
};

const dboardViewVideo = createSlice({
  name: "dboardViewVideo",
  initialState,
  reducers: {
    setViewCameras(state, action) {
      state.viewCameras = action.payload;
      // console.log(state.viewCameras);
    },
    updateStatusViewCam(state, action) {
      const idx = state.viewCameras.findIndex(
        (camera) => camera.camId === action.payload
      );
      state.viewCameras[idx].status = !state.viewCameras[idx].status;
      // console.log(state.viewCameras);
    },

    updateFirstStatusViewCam(state, action) {
      const idx = state.viewCameras.findIndex(
        (camera) => camera.camId === action.payload
      );
      state.viewCameras[idx].status = true;
      // console.log(state.viewCameras);
    },
  },
});

export const { setViewCameras, updateStatusViewCam, updateFirstStatusViewCam } =
  dboardViewVideo.actions;
export default dboardViewVideo;
