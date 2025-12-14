import fs from "fs";
import path from "path";

// Đường dẫn tới file db.json
const dbPath = path.join(process.cwd(), "server", "db.json");

// Hàm đọc file db.json
const readDatabase = () => {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
};

// Hàm ghi vào file db.json
const writeDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 4), "utf8");
};

// Xử lý yêu cầu API
export async function POST(req) {
  try {
    const newCamera = await req.json();

    // Đọc dữ liệu hiện tại
    const db = readDatabase();

    const { provinces, district, ward } = newCamera;

    // Kiểm tra và tạo cấu trúc nếu không tồn tại
    if (!db.TrafficAddress[provinces]) {
      db.TrafficAddress[provinces] = {};
    }
    if (!db.TrafficAddress[provinces][district]) {
      db.TrafficAddress[provinces][district] = {};
    }
    if (!db.TrafficAddress[provinces][district][ward]) {
      db.TrafficAddress[provinces][district][ward] = { Cameras: [], VMS: [] };
    }

    // Thêm camera mới vào phường
    db.TrafficAddress[provinces][district][ward].Cameras.push(newCamera);

    // Ghi lại dữ liệu vào file
    writeDatabase(db);

    return new Response(
      JSON.stringify({
        message: "Camera added successfully",
        camera: newCamera,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to add Camera" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
