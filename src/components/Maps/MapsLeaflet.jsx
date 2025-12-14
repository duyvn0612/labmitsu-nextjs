"use Client";
import { memo } from "react";
import dynamic from "next/dynamic";
const MapContainerWithNoSSR = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useSelector } from "react-redux";
import MapsZoom from "./MapsZoom";
import MapsType from "./MapsType";
import SearchMapAddress from "./SearchMapAddress";
import MapsDragMarkerD from "./MapsDragMarkerD";
import RenderVmsMarks from "./viewVmsMaps/RenderVmsMarks";
import RenderCamMarks from "./viewCamMarks/RenderCamMarks";

export const Map = memo(() => {
  const center = useSelector((state) => state.markerPosition.position);
  const isAddingDevice = useSelector((state) => state.addDevice.isAddingDevice);
  const { checkedList, active } = useSelector((state) => state.checkListDevice);
  // console.log(isAddingDevice);
  console.log("map render", active);

  return (
    <>
      <MapContainerWithNoSSR
        center={center}
        zoom={14}
        minZoom={4}
        maxZoom={20}
        zoomControl={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        {isAddingDevice && <MapsDragMarkerD />}
        <MapsType />
        <MapsZoom />
        <SearchMapAddress />
        {active && (
          <>
            {checkedList.includes("vms") && <RenderVmsMarks />}
            {checkedList.includes("cam") && <RenderCamMarks />}
            {}
          </>
        )}
      </MapContainerWithNoSSR>
    </>
  );
});
// Add display name
Map.displayName = "Map";
