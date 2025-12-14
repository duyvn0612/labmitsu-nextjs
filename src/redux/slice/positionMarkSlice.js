import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  position: { lat: 21.036646867757106, lng: 105.7806270072183 },
};

const markerPositionSlice = createSlice({
  name: "markerPosition",
  initialState,
  reducers: {
    updateMarkerPosition(state, action) {
      state.position = action.payload; // Cập nhật vị trí của marker
    },
  },
});

export const { updateMarkerPosition } = markerPositionSlice.actions;
export default markerPositionSlice;
