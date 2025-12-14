import fs from "fs";
import path from "path";

// Đường dẫn tới file db.json
const dbPath = path.join(process.cwd(), "server", "db.json");

// Hàm đọc dữ liệu từ db.json
const readDatabase = () => {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
};

// Hàm lấy toàn bộ Cameras từ dữ liệu, bỏ qua VMS
const getCamerasOnly = (data) => {
  const result = {};

  // Duyệt qua các cấp thành phố -> quận -> phường
  Object.keys(data.TrafficAddress).forEach((city) => {
    result[city] = {};

    Object.keys(data.TrafficAddress[city]).forEach((district) => {
      result[city][district] = {};

      Object.keys(data.TrafficAddress[city][district]).forEach((ward) => {
        const wardData = data.TrafficAddress[city][district][ward];

        // Chỉ giữ lại Cameras
        result[city][district][ward] = {
          Cameras: wardData.Cameras,
        };
      });
    });
  });

  return result;
};

// Xử lý yêu cầu GET để lấy dữ liệu Cameras (lọc bỏ VMS)
export async function GET(req) {
  try {
    const db = readDatabase(); // Đọc dữ liệu từ file db.json
    const treeCameras = getCamerasOnly(db); // Lọc chỉ lấy Cameras

    return new Response(JSON.stringify(treeCameras), {
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
