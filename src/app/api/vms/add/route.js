import fs from "fs";
import path from "path";

// Đường dẫn tới file db.json
const dbPath = path.join(process.cwd(), "server", "db.json");

// Hàm đọc dữ liệu từ db.json
const readDatabase = () => {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
};

// Hàm ghi dữ liệu vào db.json
const writeDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 4), "utf8");
};

// Xử lý yêu cầu POST để thêm VMS vào mảng VMS
export async function POST(req) {
  try {
    const newVMS = await req.json(); // Dữ liệu VMS gửi từ yêu cầu POST
    const db = readDatabase(); // Đọc dữ liệu hiện tại từ db.json

    const { provinces, district, ward } = newVMS; // Lấy thông tin từ request body

    // Kiểm tra và tạo cấu trúc dữ liệu nếu không tồn tại
    if (!db.TrafficAddress[provinces]) {
      db.TrafficAddress[provinces] = {};
    }
    if (!db.TrafficAddress[provinces][district]) {
      db.TrafficAddress[provinces][district] = {};
    }
    if (!db.TrafficAddress[provinces][district][ward]) {
      db.TrafficAddress[provinces][district][ward] = {
        Cameras: [],
        VMS: [],
      };
    }

    // Kiểm tra xem mảng VMS có tồn tại không, nếu không thì tạo mới
    if (!db.TrafficAddress[provinces][district][ward].VMS) {
      db.TrafficAddress[provinces][district][ward].VMS = [];
    }

    // Thêm VMS mới vào mảng VMS
    db.TrafficAddress[provinces][district][ward].VMS.push(newVMS);

    // Ghi lại dữ liệu mới vào file db.json
    writeDatabase(db);

    return new Response(
      JSON.stringify({ message: "VMS added successfully", vms: newVMS }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add VMS" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
