import React from "react";
import Link from "next/link";
import { Button } from "antd";
export default function CabinetList() {
  return (
    <div>
      <Button type="primary">
        <Link href="/trafficLight/addCabinet">Thêm mới</Link>
      </Button>
    </div>
  );
}
