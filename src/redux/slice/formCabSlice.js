import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  typeCab: "cab",
  nameCab: null,
  modeCab: "Tự động",
  locationCab: { lat: 21.036646867757106, lng: 105.7806270072183 },
  phaseCab: null,
  numberLightsCab: null,
  provincesCab: null,
  districtCab: null,
  wardCab: null,
  routeCab: null,
};

const formCabSlice = createSlice({
  name: "formCabData",
  initialState,
  reducers: {
    updateNameCab(state, action) {
      state.nameCab = action.payload;
    },
    updateModeCab(state, action) {
      state.modeCab = action.payload;
    },
    updateLocationCab(state, action) {
      state.locationCab = action.payload;
    },
    updateNumberLightsCab(state, action) {
      state.numberLightsCab = action.payload;
    },
    updatePhaseCab(state, action) {
      state.phaseCab = action.payload;
    },
    updaterouteCab(state, action) {
      state.routeCab = action.payload;
    },
    updateProvincesCab(state, action) {
      state.provincesCab = action.payload;
    },
    updateDistrictCab(state, action) {
      state.districtCab = action.payload;
    },
    updateWardCab(state, action) {
      state.wardCab = action.payload;
    },
  },
});

export const {
  updateNameCab,
  updateModeCab,
  updateLocationCab,
  updateNumberLightsCab,
  updatePhaseCab,
  updaterouteCab,
  updateProvincesCab,
  updateDistrictCab,
  updateWardCab,
} = formCabSlice.actions;
export default formCabSlice;
