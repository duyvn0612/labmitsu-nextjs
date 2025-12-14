"use client";
import React from "react";

const WeatherHeader = ({ temp, humidity, icon, city = "Hà Nội" }) => {
  const iconUrl = icon
    ? `https://openweathermap.org/img/wn/${icon}@2x.png`
    : null;

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        background: "#fff",
        padding: "6px 14px",
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        fontSize: 15,
        fontWeight: 500,
      }}
    >
      {iconUrl && (
        <img
          src={iconUrl}
          alt="weather-icon"
          style={{ width: 42, height: 42 }}
        />
      )}

      <span>{temp ?? "--"}°C</span>
      <span>Độ ẩm {humidity ?? "--"}%</span>
      <span style={{ opacity: 0.6 }}>({city})</span>
    </div>
  );
};

export default WeatherHeader;
