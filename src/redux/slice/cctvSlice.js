import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gridSize: "3",
  selectCameras: [],
};

const cctvSlice = createSlice({
  name: "cctv",
  initialState: initialState,
  reducers: {
    updateGridSize(state, action) {
      state.gridSize = action.payload;
    },
    updateSelectCamera(state, action) {
      const cameraIndex = state.selectCameras.findIndex(
        (camera) => camera && camera.key === action.payload.key
      );
      if (cameraIndex !== -1) {
        state.selectCameras[cameraIndex] = action.payload;
      } else {
        const emptyIndex = state.selectCameras.findIndex(
          (camera) => camera == null
        );
        if (emptyIndex !== -1) {
          const listCamera = [...state.selectCameras];
          listCamera[emptyIndex] = action.payload;
          state.selectCameras = [...listCamera];
          // state.selectCameras[emptyIndex] = action.payload;
        } else {
          state.selectCameras = [...state.selectCameras, action.payload];
        }
      }
      // console.log(state.selectCameras);
    },
    updateDeleteCamera(state, action) {
      // console.log("action.payload", action.payload);
      const index = state.selectCameras.findIndex(
        (camera) => camera && camera.key === action.payload
      );
      state.selectCameras[index] = null;
    },
    resetSelectCamera(state, action) {
      state.selectCameras = [];
    },
    updateActiveVideo(state, action) {
      const index = state.selectCameras.findIndex(
        (camera) => camera.key === action.payload
      );

      state.selectCameras[index].active = !state.selectCameras[index].active;
      // console.log("active", state.selectCameras[index].active);
    },
  },
});

export const {
  updateGridSize,
  updateSelectCamera,
  updateDeleteCamera,
  resetSelectCamera,
  updateActiveVideo,
} = cctvSlice.actions;
export default cctvSlice;
