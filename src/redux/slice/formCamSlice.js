import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nameCam: null,
  classCam: null,
  provincesCam: null,
  districtCam: null,
  wardCam: null,
  rtspCam: null,
  typeCam: "camFixed",
  featureCam: ["Hoạt động", "Ghi hình"],
  urlLanCam: null,
  routeCam: null,
  angleCam: 0,
  locationCam: { lat: 21.036646867757106, lng: 105.7806270072183 },
};

const formCamSlice = createSlice({
  name: "formCamData",
  initialState,
  reducers: {
    updateAngleCam(state, action) {
      console.log(action.payload);

      state.angleCam = action.payload;
    },
    updateNameCam(state, action) {
      state.nameCam = action.payload;
    },
    updateClassCam(state, action) {
      state.classCam = action.payload;
    },
    updateProvincesCam(state, action) {
      state.provincesCam = action.payload;
    },
    updateDistrictCam(state, action) {
      state.districtCam = action.payload;
    },
    updateWardCam(state, action) {
      state.wardCam = action.payload;
    },
    updateRtspCam(state, action) {
      state.rtspCam = action.payload;
    },
    updateTypeCam(state, action) {
      state.typeCam = action.payload;
    },
    updateFeatureCam(state, action) {
      state.featureCam = action.payload;
    },
    updateUrlLanCam(state, action) {
      state.urlLanCam = action.payload;
    },
    updateRouteCam(state, action) {
      state.routeCam = action.payload;
    },
    updateLocationCam(state, action) {
      state.locationCam = action.payload;
    },
  },
});

export const {
  updateAngleCam,
  updateNameCam,
  updateClassCam,
  updateProvincesCam,
  updateDistrictCam,
  updateWardCam,
  updateRtspCam,
  updateTypeCam,
  updateFeatureCam,
  updateUrlLanCam,
  updateRouteCam,
  updateLocationCam,
} = formCamSlice.actions;

export default formCamSlice;
