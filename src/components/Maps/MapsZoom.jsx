import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useMap } from "react-leaflet";
const maxZoom = 20;
export default function MapsZoom() {
  const map = useMap();
  const [zoom, setZoom] = useState(14);
  const onZoomOut = () => {
    setZoom((prevV) => {
      if (prevV < maxZoom) {
        return (prevV += 1);
      }
      return (prevV = maxZoom);
    });
  };
  const onZoomIn = () => {
    const minZoom = 4;
    setZoom((prevV) => {
      if (prevV > minZoom) {
        return (prevV -= 1);
      } else {
        return (prevV = minZoom);
      }
    });
  };
  useEffect(() => {
    if (zoom) {
      map.setZoom(zoom);
    }
  }, [map, zoom]);
  console.log("zoommaps");

  return (
    <div
      style={{
        position: "absolute",
        right: 10,
        bottom: 10,
        zIndex: 999,
        padding: "10px 5px",
        borderRadius: "99px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        backgroundColor: "#232f3d",
        opacity: "0.70",
      }}
    >
      <button onClick={onZoomOut}>
        <Image
          src={"/images/zoomOut.svg"}
          width={0}
          height={0}
          style={{ width: "20px", height: "20px" }}
          alt="zoomOut"
        />
      </button>
      <button onClick={onZoomIn}>
        <Image
          src={"/images/zoomIn.svg"}
          width={0}
          height={0}
          style={{ width: "20px", height: "20px" }}
          alt="zoomIn"
        />
      </button>
    </div>
  );
}
