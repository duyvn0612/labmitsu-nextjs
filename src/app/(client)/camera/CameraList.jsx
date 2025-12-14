import React from "react";
import Link from "next/link";
import { Button } from "antd";

export default function CameraList() {
  return (
    <div>
      <Button type="primary">
        <Link href="/camera/addCamera">Thêm Camera</Link>
      </Button>
    </div>
  );
}
