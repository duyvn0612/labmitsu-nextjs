import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "server", "vms_100_days_data.json");

export async function GET() {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error reading VMS data:", error);
    return new Response(JSON.stringify({ error: "Unable to load VMS data." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
// import fs from "fs";
// import path from "path";

// // Đường dẫn tới file db.json
// const dbPath = path.join(process.cwd(), "server", "db.json");

// // Hàm đọc dữ liệu từ db.json
// const readDatabase = () => {
//   const data = fs.readFileSync(dbPath, "utf8");
//   return JSON.parse(data);
// };

// // Xử lý yêu cầu GET để lấy toàn bộ dữ liệu vms
// export async function GET(req) {
//   try {
//     const db = readDatabase(); // Đọc dữ liệu từ file db.json
//     const listVms = [];

//     // Lấy tất cả các vms từ các cấp Thành phố -> Quận -> Phường
//     Object.values(db.TrafficAddress).forEach((city) => {
//       Object.values(city).forEach((district) => {
//         Object.values(district).forEach((ward) => {
//           if (ward.VMS) {
//             listVms.push(...ward.VMS);
//           }
//         });
//       });
//     });

//     // Trả về danh sách tất cả các camera
//     return new Response(JSON.stringify(listVms), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: "Failed to read database" }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
// }
