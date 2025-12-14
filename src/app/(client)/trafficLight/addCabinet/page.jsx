"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import FormAddCabinet from "../FormAddCabinet";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddingDeviceStatus,
  updateDevice,
} from "@/redux/slice/addDeviceSlice";
import { updateMarkerPosition } from "@/redux/slice/positionMarkSlice";
const Map = dynamic(
  () =>
    import("@/components/Maps/MapsLeaflet").then((component) => component.Map),
  { ssr: false }
);
export default function AddCabinetPage() {
  const dispatch = useDispatch();
  const { typeCab, locationCab } = useSelector((state) => state.formCabData);
  useEffect(() => {
    dispatch(updateMarkerPosition(locationCab));
    dispatch(setAddingDeviceStatus(true));
    dispatch(updateDevice({ type: typeCab, position: locationCab }));
    return () => {
      dispatch(setAddingDeviceStatus(false));
      dispatch(updateDevice({ type: null, position: null }));
    };
  }, []);
  return (
    <div className="grid grid-cols-2 grid-rows-1 gap-4">
      <div>
        <FormAddCabinet />
      </div>
      <div className="w-full min-h-[450px]">
        <Map />
      </div>
    </div>
  );
}
