"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import FormAddVms from "../FormAddVms";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddingDeviceStatus,
  updateDevice,
} from "@/redux/slice/addDeviceSlice";
const Map = dynamic(
  () =>
    import("@/components/Maps/MapsLeaflet").then((component) => component.Map),
  { ssr: false }
);
export default function AddVmsPage() {
  const dispatch = useDispatch();
  const { typeVms, locationVms } = useSelector((state) => state.formVmsData);
  useEffect(() => {
    dispatch(setAddingDeviceStatus(true));
    dispatch(updateDevice({ type: typeVms, position: locationVms }));
    return () => {
      dispatch(setAddingDeviceStatus(false));
      dispatch(updateDevice({ type: null, position: null }));
    };
  }, []);
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div>
        <FormAddVms />
      </div>
      <div className="w-full min-h-[450px] relative">
        <Image src="/images/sodoutcd.jpg" alt="Sơ đồ UTC" fill />
      </div>
    </div>
  );
}
