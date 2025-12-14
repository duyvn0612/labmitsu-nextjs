import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  typeVms: "vms",
  nameVms: null,
  titleVms1: null,
  titleVms2: null,
  titleVms3: null,
  locationVms: { lat: 21.036646867757106, lng: 105.7806270072183 },
  routeVms: null,
  scheduleVms: {
    schStart: null,
    schEnd: null,
  },
  camVms: null,
  provincesVms: null,
  districtVms: null,
  wardVms: null,
  modeVms: true,
};

const formVmsSlice = createSlice({
  name: "formVmsData",
  initialState,
  reducers: {
    updateNameVms(state, action) {
      state.nameVms = action.payload;
    },
    updateTitleVms1(state, action) {
      state.titleVms1 = action.payload;
    },
    updateTitleVms2(state, action) {
      state.titleVms2 = action.payload;
    },
    updateTitleVms3(state, action) {
      state.titleVms3 = action.payload;
    },
    updateLocationVms(state, action) {
      state.locationVms = action.payload;
    },
    updateRouteVms(state, action) {
      state.routeVms = action.payload;
    },
    updateCamVms(state, action) {
      state.camVms = action.payload;
    },
    updateProvincesVms(state, action) {
      state.provincesVms = action.payload;
    },
    updateDistrictVms(state, action) {
      state.districtVms = action.payload;
    },
    updateWardVms(state, action) {
      state.wardVms = action.payload;
    },
    updateScheduleVms(state, action) {
      state.scheduleVms = action.payload;
    },
    updateModeVms(state, action) {
      state.modeVms = action.payload;
    },
  },
});

export const {
  updateNameVms,
  updateTitleVms1,
  updateTitleVms2,
  updateTitleVms3,
  updateRouteVms,
  updateCamVms,
  updateLocationVms,
  updateProvincesVms,
  updateDistrictVms,
  updateWardVms,
  updateScheduleVms,
  updateModeVms,
} = formVmsSlice.actions;
export default formVmsSlice;
