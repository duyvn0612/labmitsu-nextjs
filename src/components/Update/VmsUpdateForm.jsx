"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Card,
  Alert,
  Spin,
  Divider,
  Select,
} from "antd";
import {
  UploadOutlined,
  WifiOutlined,
  DisconnectOutlined,
  BugOutlined,
} from "@ant-design/icons";
import { useMqtt } from "@/hooks/useMqtt";
import { useDispatch, useSelector } from "react-redux";
import { saveVmsData, resetSaveStatus } from "@/redux/middlewares/apiVmsSlice";

const { Option } = Select;

export default function VmsUpdateForm({ vmsId }) {
  const [form] = Form.useForm();
  const [imageBase64, setImageBase64] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);

  // Redux
  const dispatch = useDispatch();
  const { saveStatus, saveError, lastSaved } = useSelector(
    (state) => state.apiVms
  );

  const {
    isConnected,
    isConnecting,
    error,
    messages,
    subscribedTopics,
    connect,
    disconnect,
    publish,
  } = useMqtt();

  // Debug logging function
  const addDebugLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo((prev) => [...prev.slice(-9), `[${timestamp}] ${message}`]);
    console.log(`[MQTT Debug ${timestamp}] ${message}`);
  };

  useEffect(() => {
    addDebugLog("Component mounted");
    addDebugLog(
      `Initial state - Connected: ${isConnected}, Connecting: ${isConnecting}`
    );

    // Force connection attempt
    if (!isConnected && !isConnecting) {
      addDebugLog("Attempting to connect to MQTT...");
      connect();
    }
  }, []);

  // Log state changes
  useEffect(() => {
    addDebugLog(
      `State changed - Connected: ${isConnected}, Connecting: ${isConnecting}, Error: ${
        error || "none"
      }`
    );
  }, [isConnected, isConnecting, error]);

  // Test MQTT connection manually
  const testConnection = () => {
    addDebugLog("Manual connection test initiated");

    // Disconnect first if connected
    if (isConnected) {
      addDebugLog("Disconnecting existing connection...");
      disconnect();
      setTimeout(() => {
        addDebugLog("Reconnecting...");
        connect();
      }, 1000);
    } else {
      addDebugLog("Starting fresh connection...");
      connect();
    }
  };

  // Monitor Redux save status
  useEffect(() => {
    if (saveStatus === "succeeded") {
      addDebugLog("Redux save completed successfully");
      dispatch(resetSaveStatus());
    } else if (saveStatus === "failed") {
      addDebugLog(`Redux save failed: ${saveError}`);
    }
  }, [saveStatus, saveError, dispatch]);

  // Function to save data using Redux
  const saveToJsonFile = async (data) => {
    try {
      addDebugLog("Dispatching saveVmsData to Redux...");
      addDebugLog(`VMS ID: ${vmsId}`);
      addDebugLog(`Data: ${JSON.stringify(data, null, 2)}`);

      const result = await dispatch(saveVmsData({ vmsId, data })).unwrap();

      addDebugLog(`Redux save result: ${JSON.stringify(result)}`);
      addDebugLog("Data saved via Redux successfully");
      return result;
    } catch (error) {
      addDebugLog(`Redux save error: ${error}`);
      console.error("Redux save error:", error);
      throw error;
    }
  };

  const onFinish = async (values) => {
    addDebugLog("Form submission started");

    if (!isConnected) {
      message.error("Chưa kết nối được MQTT broker!");
      addDebugLog("Form submission failed - MQTT not connected");
      return;
    }

    setIsSubmitting(true);
    addDebugLog("Setting submitting state to true");

    try {
      const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Prepare data for JSON file (matching your existing structure)
      const jsonData = {
        date: currentDate,
        content1: values.content1 || "",
        content2: values.content2 || "",
        content3: values.content3 || "",
        type: values.category || "",
        priority:
          values.category === "canh-bao"
            ? 1
            : values.category === "thong-bao"
            ? 2
            : 3,
        note: values.note || "",
        image: imageBase64 || "",
        timestamp: new Date().toISOString(),
        // Add default values for fields that might exist in your structure
        peopleIn: 0,
        peopleOut: 0,
      };

      // Prepare payload for MQTT (keeping original structure)
      const mqttPayload = {
        content1: values.content1,
        content2: values.content2,
        content3: values.content3,
        category: values.category,
        note: values.note,
        image: imageBase64,
        timestamp: new Date().toISOString(),
        vmsId: vmsId,
      };

      // Save to JSON file via Redux first
      try {
        await saveToJsonFile(jsonData);
        addDebugLog("Redux save completed successfully");
      } catch (jsonError) {
        addDebugLog(`Redux save failed: ${jsonError.message}`);
        message.warning(
          "MQTT"
          // "Lưu vào file JSON thất bại, nhưng sẽ tiếp tục gửi MQTT"
        );
      }

      // Then publish to MQTT
      const topic = `vms${vmsId}`;
      addDebugLog(`Publishing to topic: ${topic}`);
      addDebugLog(
        `Payload size: ${JSON.stringify(mqttPayload).length} characters`
      );

      publish(topic, JSON.stringify(mqttPayload));

      addDebugLog("Publish command sent");
      message.success(
        "Gửi thành công! Dữ liệu đã được lưu vào Redux store và gửi lên MQTT."
      );

      // Reset form
      form.resetFields();
      setImageBase64("");
      addDebugLog("Form reset completed");
    } catch (err) {
      addDebugLog(`Form submission error: ${err.message}`);
      console.error("Error sending MQTT message:", err);
      message.error("Gửi thất bại!");
    } finally {
      setIsSubmitting(false);
      addDebugLog("Setting submitting state to false");
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const handleImageUpload = (file) => {
    addDebugLog(`Image upload started: ${file.name}, size: ${file.size} bytes`);

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      addDebugLog("Image upload failed - file too large");
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageBase64(e.target.result);
      addDebugLog(
        `Image converted to base64, length: ${e.target.result?.length}`
      );
      message.success("Ảnh đã được tải lên!");
    };
    reader.onerror = () => {
      addDebugLog("Image reader error");
      message.error("Lỗi khi đọc file ảnh!");
    };
    reader.readAsDataURL(file);
    return false;
  };

  const renderConnectionStatus = () => {
    if (isConnected) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#52c41a",
            fontSize: "16px",
          }}
        >
          <WifiOutlined style={{ marginRight: 8 }} />
          <span>Connected</span>
        </div>
      );
    }

    if (isConnecting) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#1890ff",
            fontSize: "16px",
          }}
        >
          <Spin size="small" style={{ marginRight: 8 }} />
          <span>Đang kết nối...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#ff4d4f",
            fontSize: "16px",
          }}
        >
          <DisconnectOutlined style={{ marginRight: 8 }} />
          <span>Lỗi kết nối</span>
          <Button
            size="small"
            onClick={testConnection}
            style={{ marginLeft: 8 }}
          >
            Thử lại
          </Button>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "#faad14",
          fontSize: "16px",
        }}
      >
        <DisconnectOutlined style={{ marginRight: 8 }} />
        <span>Chưa kết nối</span>
        <Button size="small" onClick={testConnection} style={{ marginLeft: 8 }}>
          Kết nối
        </Button>
      </div>
    );
  };

  return (
    <div>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{`Cập nhật bảng điện tử ${vmsId}`}</span>
            {renderConnectionStatus()}
          </div>
        }
        className="max-w-xl mx-auto"
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Nội dung 1"
            name="content1"
            rules={[
              { max: 300, message: "Nội dung 1 không được quá 300 ký tự!" },
            ]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập nội dung 1..."
              showCount
              maxLength={300}
            />
          </Form.Item>

          <Form.Item
            label="Nội dung 2"
            name="content2"
            rules={[
              { max: 300, message: "Nội dung 2 không được quá 300 ký tự!" },
            ]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập nội dung 2..."
              showCount
              maxLength={300}
            />
          </Form.Item>

          <Form.Item
            label="Nội dung 3"
            name="content3"
            rules={[
              { max: 300, message: "Nội dung 3 không được quá 300 ký tự!" },
            ]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập nội dung 3..."
              showCount
              maxLength={300}
            />
          </Form.Item>

          <Form.Item
            label="Phân loại"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn phân loại!" }]}
          >
            <Select placeholder="Chọn phân loại">
              <Option value="huong-dan">Hướng dẫn</Option>
              <Option value="thong-bao">Thông báo</Option>
              <Option value="canh-bao">Cảnh báo</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ghi chú"
            name="note"
            rules={[{ required: true, message: "Vui lòng chọn ghi chú!" }]}
          >
            <Select placeholder="Chọn loại ghi chú">
              <Option value="bao-hanh-dinh-ki">Bảo hành định kì</Option>
              <Option value="binh-thuong">Bình thường</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ảnh nền"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              beforeUpload={handleImageUpload}
              maxCount={1}
              accept="image/*"
              onRemove={() => {
                setImageBase64("");
                addDebugLog("Image removed");
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh (tối đa 2MB)</Button>
            </Upload>
            {imageBase64 && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={imageBase64}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    border: "1px solid #d9d9d9",
                    borderRadius: 4,
                  }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting || saveStatus === "loading"}
              disabled={
                !isConnected || isSubmitting || saveStatus === "loading"
              }
              block
            >
              {isSubmitting || saveStatus === "loading"
                ? "Đang gửi..."
                : "Gửi lên VMS"}
            </Button>
          </Form.Item>

          {/* Hiển thị trạng thái save từ Redux */}
          {saveStatus === "loading" && (
            <Alert
              message="Đang lưu dữ liệu..."
              type="info"
              showIcon
              style={{ marginTop: 8 }}
            />
          )}

          {/* {saveStatus === "failed" && saveError && (
            <Alert
              message="Lỗi lưu dữ liệu"
              description={saveError}
              type="error"
              showIcon
              closable
              onClose={() => dispatch(resetSaveStatus())}
              style={{ marginTop: 8 }}
            />
          )} */}

          {lastSaved && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
              Lần lưu cuối: {new Date(lastSaved).toLocaleString("vi-VN")}
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
}
