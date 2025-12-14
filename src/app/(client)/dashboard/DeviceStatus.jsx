import React from "react";
import Image from "next/image";
export default function DeviceStatus() {
  return (
    <div className="h-full flex justify-center gap-2 bg-white rounded overflow-x-auto flex-wrap">
      <div className="flex flex-row items-center gap-2">
        <Image
          src={"/images/vms.svg"}
          width={0}
          height={0}
          style={{ width: "40px", height: "auto" }}
          alt="cam"
        />
        <div>
          <p>Trực tuyến: 1</p>
          <p>Mất kết nối: 0</p>
        </div>
      </div>

      {/* <div className="flex flex-row items-center gap-2">
        <Image
          src={"/images/vms.svg"}
          width={0}
          height={0}
          style={{ width: "40px", height: "auto" }}
          alt="vms"
        />
        <div>
          <p>Trực tuyến: 0</p>
          <p>Mất kết nối: 0</p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2">
        <Image
          src={"/images/vms.svg"}
          width={0}
          height={0}
          style={{ width: "40px", height: "auto" }}
          alt="vms"
        />
        <div>
          <p>Trực tuyến: 0</p>
          <p>Mất kết nối: 0</p>
        </div>
      </div> */}
    </div>
  );
}
