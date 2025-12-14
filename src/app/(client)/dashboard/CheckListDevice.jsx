"use client";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, ConfigProvider } from "antd";
import {
  updateCheckList,
  setActive,
} from "@/redux/slice/dboardCListDeviceSlice";
import { useEffect } from "react";
const CheckboxGroup = Checkbox.Group;

export default function CheckListDevice() {
  const dispatch = useDispatch();
  const { optsCheckListDevice, checkedList } = useSelector(
    (state) => state.checkListDevice
  );
  const onChange = (list) => {
    // console.log("list", list);
    dispatch(updateCheckList(list));
  };
  // console.log(checkedList);
  useEffect(() => {
    dispatch(setActive(true));
    return () => {
      dispatch(setActive(false));
    };
  }, []);
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "orange" } }}>
      <CheckboxGroup
        value={checkedList}
        onChange={onChange}
        options={optsCheckListDevice}
        // style={{
        //   display: "flex",
        //   flexDirection: "column",
        // }}
      />
    </ConfigProvider>
  );
}
