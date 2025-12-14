"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
);
import { CaretDownFilled } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { map } from "leaflet";
const items = [
  {
    label: "Roadmap",
    key: "Roadmap",
    style: { color: "white", fontSize: "14px" },
  },
  {
    label: "Satellite",
    key: "Satellite",
    style: { color: "white", fontSize: "14px" },
  },
  {
    label: "Hybrid",
    key: "Hybrid",
    style: { color: "white", fontSize: "14px" },
  },
  {
    label: "Terrain",
    key: "Terrain",
    style: { color: "white", fontSize: "14px" },
  },

  {
    type: "divider",
    style: { backgroundColor: "white" },
  },
  {
    label: "3D Maps",
    key: "3D Maps",
    style: { color: "white", fontSize: "14px" },
  },
];
const style = { backgroundColor: "#232f3d" };

export default function MapsType() {
  const [mapType, setMapType] = useState("Roadmap");
  const getUrl = () => {
    const mapTypeUrls = {
      Roadmap: "http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}",
      Satellite: "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
      Hybrid: "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
      Terrain: "http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}",
    };
    return mapTypeUrls[mapType];
  };
  const onClick = ({ key }) => {
    setMapType(key);
  };

  return (
    <>
      <TileLayer detectRetina={true} url={getUrl()} maxZoom={21} />
      <div
        style={{
          position: "absolute",
          right: "10%",
          bottom: 10,
          zIndex: 999,
          backgroundColor: "#232f3d",
          opacity: "0.75",
          borderRadius: "10px",
        }}
      >
        <Dropdown
          menu={{
            items,
            onClick,
            style,
          }}
          trigger={["click"]}
        >
          <button>
            <Space
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 15px",
                color: "white",
                fontSize: "14px",
              }}
            >
              <span>{mapType}</span>
              <CaretDownFilled style={{ fontSize: "16px", color: "white" }} />
            </Space>
          </button>
        </Dropdown>
      </div>
    </>
  );
}
