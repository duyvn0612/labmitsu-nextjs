"use client";
import React, { useEffect, useState, useRef } from "react";
import { fetchVmsDetail } from "@/redux/middlewares/apiVmsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
  Typography,
  Spin,
  Tag,
  Descriptions,
  Card,
  Button,
  Form,
  Input,
  ColorPicker,
  Upload,
  message,
  Slider,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMqtt } from "@/hooks/useMqtt";
import { fetchWeather } from "@/services/weather";
import BackgroundModal from "@/components/LedBoard/BackgroundModal";
import VmsMiniBoard from "@/components/LedBoard/VmsMiniBoard";
import VmsPeopleChart from "@/components/LedBoard/VmsPeopleChart";
import WeatherHeader from "@/components/LedBoard/WeatherHeader";

const { Title } = Typography;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 250;

// ==== HÀM LẤY WEATHER (đặt ở đây) ====
const loadWeather = async (loc, setWeather) => {
  const CITY_COORDS = {
    "Hà Nội": { lat: 21.02818617819269, lon: 105.80285824281233 },
    "Đà Nẵng": { lat: 16.0471, lon: 108.2068 },
    "Hồ Chí Minh": { lat: 10.8231, lon: 106.6297 },
  };

  const coords = CITY_COORDS[loc];
  if (!coords) return;

  const data = await fetchWeather(coords.lat, coords.lon);

  setWeather({
    temp: data.temp,
    humidity: data.humidity,
    icon: data.icon,
  });
};

// ==== KẾT THÚC loadWeather ====

/**
 * Vẽ ảnh nền + chữ lên canvas, trả về base64 PNG
 * KHÔNG dùng DOM, chỉ dùng textPos & centerText.
 */
const renderVmsImage = async ({
  bgImage,
  text,
  textColor,
  fontSize,
  textPos,
  centerText,
}) => {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Không tạo được context canvas");
  }

  // FONT + MÀU CHỮ
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = textColor; // MÀU CHỮ  ✔
  ctx.textBaseline = "top";

  // KHÔNG SHADOW
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const lines = String(text || "").split("\n");
  const lineHeight = fontSize * 1.2;

  let baseX, baseY;
  let textWidth = 0;
  lines.forEach((line) => {
    const w = ctx.measureText(line).width;
    if (w > textWidth) textWidth = w;
  });
  if (centerText) {
    ctx.textAlign = "center";
    baseX = CANVAS_WIDTH / 2;
    baseY = (CANVAS_HEIGHT - lines.length * lineHeight) / 2;
  } else {
    ctx.textAlign = "center"; // ❗ GIỮ CĂN GIỮA TRÊN TRỤC X
    baseX = textPos.x + textWidth / 2; // ❗ CĂN LẠI TÂM NHƯ DOM
    baseY = textPos.y;
  }

  const drawText = () => {
    lines.forEach((line, idx) => {
      ctx.fillText(line, baseX, baseY + idx * lineHeight);
    });
    return canvas.toDataURL("image/png");
  };

  if (bgImage) {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          resolve(drawText());
        } catch (e) {
          reject(e);
        }
      };

      img.onerror = reject;
      img.src = bgImage;
    });
  }

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = textColor; // Vẽ lại màu chữ sau nền
  return drawText();
};

export default function VmsDetailPage() {
  const [form] = Form.useForm();
  const [bgImage, setBgImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [bgModalOpen, setBgModalOpen] = useState(false);
  const [weather, setWeather] = useState({
    temp: null,
    humidity: null,
  });

  const liveInfo = {
    title: "Phòng Lab Mitsu – Đang hoạt động",
    peopleIn: 2,
    peopleOut: 1,
    temp: 27.4,
    datetime: new Date().toISOString(),
  };

  const mockChart = [
    { time: "10:00", in: 3, out: 1 },
    { time: "10:05", in: 5, out: 2 },
    { time: "10:10", in: 4, out: 3 },
    { time: "10:15", in: 7, out: 4 },
    { time: "10:20", in: 6, out: 2 },
  ];

  const jetsonStatus = {
    temp: 54,
    ram: 62,
    uptime: "3h 21m",
    fps: 18,
  };

  // ============== DRAG TEXT + CĂN GIỮA ===============
  const previewRef = useRef(null);
  const textRef = useRef(null);

  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(28);

  const handleMouseDown = (e) => {
    if (!textRef.current) return;
    setDragging(true);
    setHasDragged(true);

    const rect = textRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging || !previewRef.current || !textRef.current) return;

    const containerRect = previewRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();

    let left = e.clientX - containerRect.left - dragOffset.current.x;
    let top = e.clientY - containerRect.top - dragOffset.current.y;

    left = Math.max(0, Math.min(left, containerRect.width - textRect.width));
    top = Math.max(0, Math.min(top, containerRect.height - textRect.height));

    setTextPos({ x: left, y: top });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const text = Form.useWatch("text", form) || "Nhập nội dung...";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Căn giữa text trong preview khi chưa kéo
  useEffect(() => {
    if (!mounted) return;
    if (hasDragged) return;
    if (!previewRef.current || !textRef.current) return;

    const container = previewRef.current;
    const textEl = textRef.current;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const textWidth = textEl.offsetWidth;
    const textHeight = textEl.offsetHeight;

    const newX = Math.max(0, (containerWidth - textWidth) / 2);
    const newY = Math.max(0, (containerHeight - textHeight) / 2);

    setTextPos({ x: newX, y: newY });
  }, [mounted, text, fontSize, bgImage, hasDragged]);
  // ========================================

  const dispatch = useDispatch();
  const { id } = useParams();
  const { vmsDetail, detailStatus } = useSelector((state) => state.apiVms);
  const { isConnected, publish } = useMqtt();
  const meta = vmsDetail || {};

  useEffect(() => {
    dispatch(fetchVmsDetail(id));
  }, [dispatch, id]);
  // Lấy weather khi vmsDetail đã load xong
  useEffect(() => {
    if (!vmsDetail) return;

    const loc = vmsDetail.location || "Hà Nội";

    // Gọi lần đầu
    loadWeather(loc, setWeather);

    // Cập nhật mỗi 5 phút
    const timer = setInterval(() => {
      loadWeather(loc, setWeather);
    }, 300000);

    return () => clearInterval(timer);
  }, [vmsDetail]);

  const handleBgChange = (info) => {
    const newList = info.fileList;
    setFileList(newList);

    if (newList.length > 0) {
      const file = newList[newList.length - 1].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => setBgImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setBgImage(null);
    }
  };

  const clearBgImage = () => {
    setBgImage(null);
    setFileList([]);
  };

  const onFinish = async (values) => {
    if (!isConnected) {
      return message.error("Chưa kết nối server!");
    }

    try {
      const imageBase64 = await renderVmsImage({
        bgImage,
        text: values.text,
        textColor,
        fontSize,
        textPos,
        centerText: !hasDragged,
      });

      publish(
        `vms${id}`,
        JSON.stringify({
          vmsId: id,
          text: values.text,
          textColor,
          fontSize,
          image: imageBase64,
          timestamp: new Date().toISOString(),
        })
      );

      message.success("Đã gửi nội dung lên bảng điện tử!");
    } catch (err) {
      console.error("renderVmsImage error:", err);
      message.error("Lỗi khi vẽ ảnh để gửi lên bảng!");
    }
  };

  if (detailStatus === "loading") {
    return <Spin fullscreen tip="Đang tải dữ liệu..." />;
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Title level={3}>Chi tiết bảng điện tử</Title>
        <WeatherHeader
          city={meta.location || "Hà Nội"}
          temp={weather.temp}
          humidity={weather.humidity}
          icon={weather.icon}
        />
      </div>

      {/* ===== 3 KHỐI TRÊN ===== */}
      <div style={{ display: "flex", gap: 16 }}>
        {/* Thông tin VMS */}
        <Card
          title={`Bảng điện tử: ${meta.name}`}
          style={{ flex: 1 }}
          extra={
            <div
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                background: isConnected ? "#f6ffed" : "#fff2f0",
                border: `1px solid ${isConnected ? "#b7eb8f" : "#ffccc7"}`,
                color: isConnected ? "#389e0d" : "#cf1322",
                fontWeight: "bold",
              }}
            >
              {isConnected ? "Đã kết nối server" : "Chưa kết nối server"}
            </div>
          }
        >
          <Descriptions column={1}>
            <Descriptions.Item label="Vị trí">
              {meta.location}
            </Descriptions.Item>
            <Descriptions.Item label="Chế độ">{meta.mode}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={meta.status === "Maintenance" ? "orange" : "green"}>
                {meta.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <Card
            size="small"
            title="Trạng thái Jetson Nano"
            style={{ marginTop: 16 }}
          >
            <Descriptions column={2} size="small">
              <Descriptions.Item label="CPU Temp">
                {jetsonStatus.temp}°C
              </Descriptions.Item>
              <Descriptions.Item label="RAM">
                {jetsonStatus.ram}%
              </Descriptions.Item>
              <Descriptions.Item label="Uptime">
                {jetsonStatus.uptime}
              </Descriptions.Item>
              <Descriptions.Item label="FPS">
                {jetsonStatus.fps} FPS
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Card>

        {/* Hiển thị LED thật */}
        <Card title="Hiển thị bảng LED thực" style={{ width: 550 }}>
          {mounted && (
            <VmsMiniBoard
              data={{
                ...liveInfo,
                temp: weather.temp,
                humidity: weather.humidity,
              }}
            />
          )}
        </Card>

        {/* Chart */}
        <Card title="Thống kê người ra - vào" style={{ flex: 1 }}>
          <VmsPeopleChart data={mockChart} />
        </Card>
      </div>

      {/* ===== FORM ===== */}
      <Card title="Cập nhật nội dung bảng điện tử" style={{ marginTop: 24 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Chọn ảnh nền + màu chữ + kích thước */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Upload
              beforeUpload={() => false}
              onChange={handleBgChange}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh nền</Button>
            </Upload>

            <Button onClick={() => setBgModalOpen(true)}>Chọn từ mẫu</Button>

            {bgImage && (
              <Button danger icon={<DeleteOutlined />} onClick={clearBgImage}>
                Xóa ảnh nền
              </Button>
            )}

            <ColorPicker
              value={textColor}
              onChange={(color) => {
                const hex =
                  typeof color === "string" ? color : color.toHexString();
                setTextColor(hex);
              }}
            />

            <div style={{ width: 150 }}>
              <Slider
                min={12}
                max={72}
                value={fontSize}
                onChange={(value) => setFontSize(value)}
              />
            </div>
          </div>

          {/* Nội dung */}
          <Form.Item
            label="Nội dung hiển thị"
            name="text"
            rules={[{ required: true, message: "Hãy nhập nội dung hiển thị" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập nội dung..."
              style={{ whiteSpace: "pre-wrap" }}
            />
          </Form.Item>

          {/* PREVIEW */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <div
              id="vms-preview"
              ref={previewRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                position: "relative",
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                backgroundImage: bgImage ? `url(${bgImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: bgImage ? "transparent" : "#000000",
                border: "6px solid #222",
                borderRadius: 12,
                boxShadow: "0 0 25px rgba(0,0,0,0.6)",
                overflow: "hidden",
              }}
            >
              <div
                ref={textRef}
                onMouseDown={handleMouseDown}
                style={{
                  position: "absolute",
                  top: textPos.y,
                  left: textPos.x,
                  fontSize: fontSize,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: textColor,
                  textShadow: `0 0 6px ${textColor}, 0 0 12px ${textColor}`,
                  whiteSpace: "pre-wrap",
                  letterSpacing: 2,
                  padding: "0 12px",
                  cursor: dragging ? "grabbing" : "grab",
                  userSelect: "none",
                  maxWidth: "100%",
                }}
              >
                {text}
              </div>
            </div>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Gửi lên bảng điện tử
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <BackgroundModal
        open={bgModalOpen}
        onClose={() => setBgModalOpen(false)}
        onSelect={setBgImage}
      />
    </div>
  );
}
