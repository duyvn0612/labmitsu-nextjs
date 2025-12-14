"use client";
import React from "react";
import { Activity, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Area,
  AreaChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartDataWeek = [
  { Week: "Monday", "Ổn định": 186, "Ùn cục bộ": 80 },
  { Week: "Tuesday", "Ổn định": 305, "Ùn cục bộ": 200 },
  { Week: "Wednesday", "Ổn định": 237, "Ùn cục bộ": 120 },
  { Week: "Thursday", "Ổn định": 73, "Ùn cục bộ": 190 },
  { Week: "Friday", "Ổn định": 209, "Ùn cục bộ": 130 },
  { Week: "Saturday", "Ổn định": 214, "Ùn cục bộ": 140 },
  { Week: "Sunday", "Ổn định": 50, "Ùn cục bộ": 165 },
];
const chartDataDay = [
  { Day: "Ổn định", number: 173, fill: "var(--color-onDinh)" },
  { Day: "Ùn cục bộ", number: 90, fill: "var(--color-unCucBo)" },
];
const chartDataHour = [
  { Hour: "00h", "Ổn định": 186, "Ùn cục bộ": 0 },
  { Hour: "03h", "Ổn định": 305, "Ùn cục bộ": 0 },
  { Hour: "06h", "Ổn định": 237, "Ùn cục bộ": 111 },
  { Hour: "09h", "Ổn định": 73, "Ùn cục bộ": 190 },
  { Hour: "12h", "Ổn định": 209, "Ùn cục bộ": 130 },
  { Hour: "15h", "Ổn định": 214, "Ùn cục bộ": 140 },
  { Hour: "18h", "Ổn định": 135, "Ùn cục bộ": 210 },
  { Hour: "21h", "Ổn định": 55, "Ùn cục bộ": 255 },
  { Hour: "24h", "Ổn định": 188, "Ùn cục bộ": 106 },
];
const chartConfig = {
  onDinh: {
    label: "ondinh",
    color: "hsl(var(--chart-2))",
  },
  unCucBo: {
    label: "uncucbo",
    color: "hsl(var(--chart-1))",
  },
  icon: Activity,
};

function ChartVmsDataWeek() {
  return (
    <Card className="flex flex-col justify-center max-h-[250px]">
      <CardHeader>
        <CardTitle className="text-center">Dữ liệu VMS theo tuần</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="mx-auto max-h-[180px] pb-0"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartDataWeek}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="Ổn định" fill="var(--color-onDinh)" radius={4} />
            <Bar dataKey="Ùn cục bộ" fill="var(--color-unCucBo)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
function ChartVmsDataDay() {
  return (
    <Card className="flex flex-col justify-center max-h-[250px]">
      <CardHeader className="items-center">
        <CardTitle>Dữ liệu VMS theo ngày</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartDataDay} dataKey="number" label nameKey="Day" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function ChartVmsDataHour() {
  return (
    <Card className="flex flex-col justify-center max-h-[250px]">
      <CardHeader className="items-center">
        <CardTitle>Dữ liệu VMS theo giờ</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="mx-auto max-h-[180px] pb-0"
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={chartDataHour}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="Ổn định"
              type="step"
              fill="var(--color-onDinh)"
              fillOpacity={0.4}
              stroke="var(--color-onDinh)"
            />
            <Area
              dataKey="Ùn cục bộ"
              type="step"
              fill="var(--color-unCucBo)"
              fillOpacity={0.4}
              stroke="var(--color-unCucBo)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
export { ChartVmsDataWeek, ChartVmsDataDay, ChartVmsDataHour };
