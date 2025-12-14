import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  device: {
    type: null,
    position: null,
    typeAndFeature: null,
  },
  isAddingDevice: false,
};

const addDeviceSlice = createSlice({
  name: "addDevice",
  initialState,
  reducers: {
    updateDevice(state, action) {
      const isCameraAI =
        (action.payload.feature &&
          action.payload.feature.includes("Camera AI")) ||
        null;
      state.device.typeAndFeature = isCameraAI
        ? (action.payload.type === "camFixed" && "camAIFixed") || "camAIDome"
        : action.payload.type;
      state.device.type = action.payload.type;
      state.device.position = action.payload.position;
    },
    updatePositionDevice(state, action) {
      state.device.position = action.payload;
    },
    setAddingDeviceStatus(state, action) {
      state.isAddingDevice = action.payload;
    },
  },
});

export const { updateDevice, setAddingDeviceStatus, updatePositionDevice } =
  addDeviceSlice.actions;
export default addDeviceSlice;
