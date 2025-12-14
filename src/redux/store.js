import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import markerPositionSlice from "./slice/positionMarkSlice";
import formVmsSlice from "./slice/formVmsSlice";
import formCamSlice from "./slice/formCamSlice";
import formCabSlice from "./slice/formCabSlice";
import apiCamSlice from "./middlewares/apiCamSlice";
import apiVmsSlice from "./middlewares/apiVmsSlice";
import { mqttMiddleware } from "./middlewares/mqttMiddleware";
import mqttReducer from "./slice/mqttSlice";
import cctvSlice from "./slice/cctvSlice";
import addDeviceSlice from "./slice/addDeviceSlice";
import dboardCListDeviceSlice from "./slice/dboardCListDeviceSlice";
import dboardViewVideo from "./slice/dboardViewVideo";

export const store = configureStore({
  reducer: {
    mqtt: mqttReducer,
    markerPosition: markerPositionSlice.reducer,
    addDevice: addDeviceSlice.reducer,
    formVmsData: formVmsSlice.reducer,
    formCamData: formCamSlice.reducer,
    formCabData: formCabSlice.reducer,
    checkListDevice: dboardCListDeviceSlice.reducer,
    cctv: cctvSlice.reducer,
    apiCamera: apiCamSlice.reducer,
    apiVms: apiVmsSlice.reducer,
    dboardViewVideo: dboardViewVideo.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "mqtt/connect",
          "mqtt/disconnect",
          "mqtt/publish",
          "mqtt/subscribe",
          "mqtt/unsubscribe",
        ],
      },
    }).concat(mqttMiddleware),
});
