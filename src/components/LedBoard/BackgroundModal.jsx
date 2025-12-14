"use client";
import React from "react";
import { Modal, Row, Col, message } from "antd";

// Danh sách ảnh nền có sẵn — phải nằm trong thư mục public/images/
const BACKGROUNDS = [
  "/images/backutc.jpg",
  "/images/backhanoi.jpg",
  "/images/backdanang.jpg",
  "/images/backsaigon.jpg",
];

export default function BackgroundModal({ open, onClose, onSelect }) {
  const handleSelect = (bg) => {
    // Kiểm tra ảnh có tồn tại trước khi set
    const img = new Image();
    img.src = bg;
    img.onload = () => {
      onSelect(bg);
      onClose();
    };
    img.onerror = () => {
      message.error(`Ảnh ${bg} không tồn tại trong thư mục /public/images/`);
    };
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Chọn ảnh nền có sẵn"
      width={720}
    >
      <Row gutter={[16, 16]}>
        {BACKGROUNDS.map((bg, index) => (
          <Col span={6} key={index}>
            <div
              onClick={() => handleSelect(bg)}
              style={{
                position: "relative",
                cursor: "pointer",
                borderRadius: 10,
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              className="bg-item"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <img
                src={bg}
                alt={`background-${index}`}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  background: "rgba(0,0,0,0.4)",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: 12,
                  padding: "2px 0",
                }}
              >
                {bg.split("/").pop().replace(".jpg", "")}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Modal>
  );
}
