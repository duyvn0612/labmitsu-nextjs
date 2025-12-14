import { rand } from "./random";

export function updateRealtime(vmsList) {
  return vmsList.map((item) => {
    const now = new Date();

    let { temp, humidity, in: inc, out: outc } = item;

    if (item.status === "Active") {
      // tăng giảm nhẹ
      temp += rand(-0.2, 0.2);
      humidity += rand(-1, 1);

      temp = Math.round(temp * 10) / 10;
      humidity = Math.round(humidity);

      if (Math.random() < 0.3) inc++;
      if (Math.random() < 0.25 && outc < inc) outc++;
    }

    if (item.status === "Inactive") {
      temp = humidity = null;
      inc = outc = 0;
    }

    if (item.status === "Maintenance") {
      temp = humidity = null;
      inc = outc; // bằng nhau
    }

    return {
      ...item,
      temp,
      humidity,
      in: inc,
      out: outc,
      time: now.toLocaleTimeString("vi-VN"),
      date: now.toLocaleDateString("vi-VN"),
    };
  });
}
