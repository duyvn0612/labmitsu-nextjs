// src/app/api/vms/detail/route.js
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "server", "vms_100_days_data.json");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    const found = data.find((vms) => vms.id.toString() === id);
    if (!found)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(found);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi đọc file VMS" }, { status: 500 });
  }
}
