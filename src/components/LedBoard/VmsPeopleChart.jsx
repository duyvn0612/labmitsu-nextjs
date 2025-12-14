"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function VmsPeopleBarChart({ data }) {
  if (!data || data.length === 0) return <p>Không có dữ liệu thống kê.</p>;

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Legend />

          <Bar dataKey="in" name="Người vào" fill="#00e676" barSize={20} />
          <Bar dataKey="out" name="Người ra" fill="#ff5252" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
