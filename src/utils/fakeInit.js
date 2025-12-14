import { pick, randInt } from "./random";

export function generateFakeVms(count = 10) {
  const rooms = [
    "Phòng Lab Mitsu",
    "Phòng họp Ban giám hiệu",
    "Hành lang tầng 2",
    "Thư viện trung tâm",
    "Nhà ăn sinh viên",
    "Phòng kỹ thuật",
    "Hội trường lớn",
    "Phòng IoT",
  ];

  const statuses = ["Active", "Inactive", "Maintenance"];

  return Array.from({ length: count }).map((_, i) => {
    const status = pick(statuses);

    let temp = null;
    let humidity = null;
    let inc = 0;
    let outc = 0;

    if (status === "Active") {
      temp = randInt(20, 28);
      humidity = randInt(45, 75);
      inc = randInt(5, 20);
      outc = randInt(0, inc);
    }

    if (status === "Maintenance") {
      inc = outc = randInt(0, 2);
    }

    return {
      id: i + 1,
      name: `VMS-${100 + i + 1}`,
      location: rooms[i % rooms.length],
      mode: pick(["auto", "normal"]),
      status,
      temp,
      humidity,
      in: inc,
      out: outc,
      time: new Date().toLocaleTimeString("vi-VN"),
      date: new Date().toLocaleDateString("vi-VN"),
    };
  });
}
