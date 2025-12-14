import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  optsCheckListDevice: [
    {
      label: "None AI Camera",
      value: "cam",
      style: { color: "white" },
    },
    { label: "AI Camera", value: "aic", style: { color: "white" } },
    { label: "VMS", value: "vms", style: { color: "white" } },
    { label: "Cabinet", value: "cab", style: { color: "white" } },
  ],
  checkedList: ["cam", "aic", "vms", "cab"],
  active: false,
};

const dboardCListDeviceSlice = createSlice({
  name: "CheckListDevice",
  initialState,
  reducers: {
    updateCheckList(state, action) {
      state.checkedList = action.payload;
    },
    setActive(state, action) {
      state.active = action.payload;
    },
  },
});

export const { updateCheckList, setActive } = dboardCListDeviceSlice.actions;
export default dboardCListDeviceSlice;
