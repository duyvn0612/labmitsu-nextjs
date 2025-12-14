const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function generateFakeVms(count = 12) {
  const rooms = [
    "Phòng Lab Mitsu",
    "Phòng họp Ban giám hiệu",
    "Hành lang tầng 2",
    "Thư viện trung tâm",
    "Nhà ăn sinh viên",
    "Phòng kỹ thuật",
    "Hội trường lớn",
    "Thang máy khu B",
    "Phòng máy lạnh",
    "Phòng IoT",
    "Phòng thí nghiệm tự động hóa",
    "Phòng server",
  ];

  const statuses = ["Active", "Inactive", "Maintenance"];

  const result = [];

  for (let i = 1; i <= count; i++) {
    const status = randomItem(statuses);

    let temp = null;
    let humidity = null;
    let inCount = 0;
    let outCount = 0;

    if (status === "Active") {
      temp = Math.floor(Math.random() * 10) + 20; // 20–30°C
      humidity = Math.floor(Math.random() * 40) + 40; // 40–80%
      inCount = Math.floor(Math.random() * 20) + 5; // 5–25
      outCount = Math.floor(Math.random() * inCount); // <= in
    }

    if (status === "Maintenance") {
      temp = null;
      humidity = null;
      inCount = Math.floor(Math.random() * 3); // 0–2
      outCount = inCount;
    }

    // Inactive
    if (status === "Inactive") {
      temp = null;
      humidity = null;
      inCount = 0;
      outCount = 0;
    }

    result.push({
      id: i,
      name: `VMS-${100 + i}`,
      location: rooms[i - 1] || randomItem(rooms),
      mode: randomItem(["auto", "normal"]),
      status,
      title: "TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI",
      time: new Date().toLocaleTimeString("vi-VN"),
      date: new Date().toLocaleDateString("vi-VN"),
      temp,
      humidity,
      in: inCount,
      out: outCount,
    });
  }

  return result;
}
