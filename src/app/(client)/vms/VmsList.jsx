"use client";

import React from "react";
import { Row, Col, Card, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useVmsRealtime } from "@/hooks/useVmsRealtime";

export default function VmsList() {
  const router = useRouter();
  const listVms = useVmsRealtime(10); // dữ liệu tự thay đổi mỗi giây

  const getStatusTag = (status) => {
    switch (status) {
      case "Active":
        return <Tag color="green">Hoạt động</Tag>;
      case "Inactive":
        return <Tag color="red">Không hoạt động</Tag>;
      case "Maintenance":
        return <Tag color="orange">Bảo trì</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#00ff55";
      case "Inactive":
        return "#ff3b3b";
      case "Maintenance":
        return "#ffa500";
      default:
        return "#888";
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {listVms.map((vms) => {
        // ⭐ ALWAYS ACTIVE FOR PHÒNG LAB MITSU ⭐
        if (vms.location === "Phòng Lab Mitsu") {
          vms.status = "Active";
          vms.temp = vms.temp ?? 24;
          vms.humidity = vms.humidity ?? 55;
        }

        return (
          <Col key={vms.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => router.push(`/vms/${vms.id}`)}
              style={{
                background: "#000",
                color: "#0f0",
                borderRadius: "10px",
                boxShadow: "0 0 12px #00ff99",
                fontFamily: "monospace",
                padding: 10,
              }}
              bodyStyle={{ padding: 12 }}
            >
              <h3
                style={{
                  color: "#00eaff",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                Bảng điện tử
              </h3>

              <p
                style={{
                  color: getStatusColor(vms.status),
                  fontWeight: "bold",
                }}
              >
                • {vms.status === "Active" ? "Đang hoạt động" : ""}
                {vms.status === "Inactive" ? "Không hoạt động" : ""}
                {vms.status === "Maintenance" ? "Bảo trì" : ""}
              </p>

              <p>
                <strong style={{ color: "#00eaff" }}>Vị trí:</strong>{" "}
                {vms.location}
              </p>
              <p>
                <strong style={{ color: "#00eaff" }}>Thời gian:</strong>{" "}
                {vms.time}
              </p>

              <p>
                <strong style={{ color: "#00eaff" }}>Nhiệt độ:</strong>{" "}
                {vms.temp ?? "--"}°C
              </p>

              <p>
                <strong style={{ color: "#00eaff" }}>Độ ẩm:</strong>{" "}
                {vms.humidity ?? "--"}%
              </p>

              <p>
                <strong style={{ color: "#00eaff" }}>Vào:</strong> {vms.in}{" "}
                <strong style={{ color: "#00eaff" }}>Ra:</strong> {vms.out}
              </p>

              <div style={{ marginTop: 8 }}>{getStatusTag(vms.status)}</div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
