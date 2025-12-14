"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import FormAddCamera from "../FormAddCamera";
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
export default function AddCameraPage() {
  const dispatch = useDispatch();
  const { typeCam, featureCam, locationCam } = useSelector(
    (state) => state.formCamData
  );
  useEffect(() => {
    dispatch(updateMarkerPosition(locationCam));
    dispatch(setAddingDeviceStatus(true));
    dispatch(
      updateDevice({
        type: typeCam,
        feature: featureCam,
        position: locationCam,
      })
    );
    return () => {
      dispatch(setAddingDeviceStatus(false));
      dispatch(
        updateDevice({
          type: null,
          feature: [],
          position: null,
        })
      );
    };
  }, [typeCam, featureCam, locationCam, dispatch]);
  // console.log();

  return (
    <div className="grid grid-cols-2 grid-rows-1 gap-4">
      <div>
        <FormAddCamera />
      </div>
      <div className="w-full min-h-[450px]">
        <Map />
      </div>
    </div>
  );
}
