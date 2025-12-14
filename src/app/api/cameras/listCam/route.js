import fs from "fs";
import path from "path";

// Đường dẫn tới file db.json
const dbPath = path.join(process.cwd(), "server", "db.json");

// Hàm đọc dữ liệu từ db.json
const readDatabase = () => {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
};

// Xử lý yêu cầu GET để lấy toàn bộ dữ liệu camera
export async function GET(req) {
  try {
    const db = readDatabase(); // Đọc dữ liệu từ file db.json
    const cameras = [];

    // Lấy tất cả các camera từ các cấp Thành phố -> Quận -> Phường
    Object.values(db.TrafficAddress).forEach((city) => {
      Object.values(city).forEach((district) => {
        Object.values(district).forEach((ward) => {
          if (ward.Cameras) {
            cameras.push(...ward.Cameras);
          }
        });
      });
    });

    // Trả về danh sách tất cả các camera
    return new Response(JSON.stringify(cameras), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to read database" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
