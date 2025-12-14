import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const dataFilePath = path.join(
  process.cwd(),
  "server",
  "vms_100_days_data.json"
);

export async function POST(request, { params }) {
  try {
    const { id } = params;

    // Validate ID
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid VMS ID" }, { status: 400 });
    }

    const newEvent = await request.json();

    // Validate required fields
    if (!newEvent.date) {
      return NextResponse.json(
        { error: "Date field is required" },
        { status: 400 }
      );
    }

    // Đọc và parse dữ liệu
    let rawData;
    try {
      rawData = await fs.readFile(dataFilePath, "utf-8");
    } catch (err) {
      if (err.code === "ENOENT") {
        // File không tồn tại - tạo mới
        await fs.writeFile(dataFilePath, "[]");
        rawData = "[]";
      } else {
        throw err;
      }
    }

    const vmsList = JSON.parse(rawData);

    // Tìm VMS
    const vmsIndex = vmsList.findIndex((vms) => vms.id === idNum);
    if (vmsIndex === -1) {
      return NextResponse.json({ error: "VMS not found" }, { status: 404 });
    }

    // Tạo event mới
    const filteredEvent = {};
    const validFields = [
      "date",
      "content1",
      "content2",
      "content3",
      "type",
      "priority",
      "note",
      "peopleIn",
      "peopleOut",
    ];

    validFields.forEach((field) => {
      if (newEvent[field] !== undefined && newEvent[field] !== "") {
        filteredEvent[field] = newEvent[field];
      }
    });

    // Khởi tạo dailyData nếu cần
    if (!Array.isArray(vmsList[vmsIndex].dailyData)) {
      vmsList[vmsIndex].dailyData = [];
    }

    // Thêm event vào đầu mảng (mới nhất lên đầu)
    vmsList[vmsIndex].dailyData.unshift(filteredEvent);

    // Ghi file
    await fs.writeFile(dataFilePath, JSON.stringify(vmsList, null, 2));

    return NextResponse.json(
      {
        success: true,
        vms: vmsList[vmsIndex],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
