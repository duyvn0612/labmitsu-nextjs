import fs from "fs";
import path from "path";

// Đường dẫn tới file db.json
const dbPath = path.join(process.cwd(), "server", "db.json");

// Hàm đọc dữ liệu từ db.json
const readDatabase = () => {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
};

// Xử lý yêu cầu GET để lấy dữ liệu từ db.json
export async function GET(req) {
  try {
    const db = readDatabase(); // Đọc dữ liệu từ file db.json
    return new Response(JSON.stringify(db), {
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
