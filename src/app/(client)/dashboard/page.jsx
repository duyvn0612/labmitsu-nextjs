"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import DeviceStatus from "./DeviceStatus";
import CheckListDevice from "./CheckListDevice";

const Map = dynamic(
  () =>
    import("@/components/Maps/MapsLeaflet").then((component) => component.Map),
  { ssr: false }
);

export default function DashboardPage() {
  console.log("dashboard");

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button>
          <Image
            className="transition-transform hover:scale-125"
            src={"/images/fullScreen.svg"}
            width={0}
            height={0}
            style={{
              width: "25px",
              height: "auto",
            }}
            alt="fullScreen"
          />
        </button>
      </div>

      <div className="w-full h-[calc(100%-32px)]">
        <div className="grid grid-cols-12 gap-1 w-full h-full">
          <div className="relative col-span-12 md:col-span-9 row-span-6 h-full">
            <div className="absolute inset-0">
              <Image src="/images/sodoutc.jpg" alt="Sơ đồ UTC" fill />
            </div>
            {/* <div className="z-[999] absolute bottom-3 left-5 p-2 rounded opacity-75 bg-[#232f3d]">
              <CheckListDevice />
            </div> */}
          </div>
          <div className="col-span-12 md:col-span-3 md:col-start-10">
            <DeviceStatus />
          </div>
          <div className="col-span-12 md:col-span-3 row-span-2 md:col-start-10 md:row-start-2 bg-white rounded">
            3
          </div>
          <div className="col-span-12 md:col-span-3 row-span-3 md:col-start-10 md:row-start-4 bg-white rounded">
            4
          </div>
          <div className="col-span-12 md:col-span-3 row-span-3 md:row-start-7 bg-white rounded">
            5
          </div>
          <div className="col-span-12 md:col-span-3 row-span-3 md:col-start-4 md:row-start-7 bg-white rounded">
            6
          </div>
          <div className="col-span-12 md:col-span-3 row-span-3 md:col-start-7 md:row-start-7 bg-white rounded">
            7
          </div>
          <div className="col-span-12 md:col-span-3 row-span-3 md:col-start-10 md:row-start-7 bg-white rounded">
            8
          </div>
        </div>
      </div>
    </>
  );
}
