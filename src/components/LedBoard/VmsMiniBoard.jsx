"use client";
import React, { useEffect, useState } from "react";

export default function VmsMiniBoard({ data }) {
  const { title, peopleIn, peopleOut, temp, humidity, status } = data;

  const [timeString, setTimeString] = useState("");
  const [dateString, setDateString] = useState("");

  const WEEKDAY_MAP = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];

  const updateTime = () => {
    const now = new Date();

    const t =
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0") +
      ":" +
      String(now.getSeconds()).padStart(2, "0");

    const weekday = WEEKDAY_MAP[now.getDay()];
    const d =
      weekday +
      ", ngày " +
      String(now.getDate()).padStart(2, "0") +
      "/" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "/" +
      now.getFullYear();

    setTimeString(t);
    setDateString(d);
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: 300,
        background:
          "radial-gradient(#111 1px, transparent 1px), radial-gradient(#111 1px, transparent 1px)",
        backgroundSize: "6px 6px",
        backgroundColor: "#000",
        borderRadius: 16,
        border: "6px solid #222",
        boxShadow: "0 0 25px rgba(0,0,0,0.6)",
        color: "#fff",
        padding: "18px 22px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ======== TRƯỜNG / PHÒNG ======== */}
      <div
        style={{
          fontSize: 21,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 4,
          textShadow: "0 0 6px #fff, 0 0 12px #fff",
        }}
      >
        TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI
      </div>
      <div
        style={{
          fontSize: 19,
          textAlign: "center",
          marginBottom: 14,
          fontWeight: "bold",
        }}
      >
        PHÒNG THÍ NGHIỆM MITSUBISHI ELECTRIC FA
      </div>

      {/* ======== TÌNH TRẠNG ======== */}
      <div style={{ fontSize: 18, marginBottom: 10 }}>
        Tình trạng:{" "}
        <span style={{ color: "#0f0", fontWeight: "bold" }}>
          {status || "Đang hoạt động"}
        </span>
      </div>

      {/* ======== THỜI GIAN ======== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          marginBottom: 12,
        }}
      >
        <span>Thời gian: {timeString}</span>
        <span>{dateString}</span>
      </div>

      {/* ======== NHIỆT ĐỘ / ĐỘ ẨM ======== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          marginBottom: 12,
        }}
      >
        <span>Nhiệt độ: {temp ?? "--"}°C</span>
        <span>Độ ẩm: {humidity ?? "--"}%</span>
      </div>

      {/* ======== NGƯỜI VÀO – RA ======== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          marginTop: 10,
        }}
      >
        <span>Người vào: {peopleIn}</span>
        <span>Người ra: {peopleOut}</span>
      </div>
    </div>
  );
}
