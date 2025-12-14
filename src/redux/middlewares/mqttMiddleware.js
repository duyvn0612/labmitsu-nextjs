// src/redux/middlewares/mqttMiddleware.js
import mqtt from "mqtt";
import {
  setConnecting,
  setConnected,
  setDisconnected,
  setError,
  addMessage,
  addSubscribedTopic,
  removeSubscribedTopic,
} from "@/redux/slice/mqttSlice";

let mqttClient = null;

// MQTT Actions
export const MQTT_CONNECT = "mqtt/connect";
export const MQTT_DISCONNECT = "mqtt/disconnect";
export const MQTT_PUBLISH = "mqtt/publish";
export const MQTT_SUBSCRIBE = "mqtt/subscribe";
export const MQTT_UNSUBSCRIBE = "mqtt/unsubscribe";

// Action Creators
export const connectMqtt = (config = {}) => ({
  type: MQTT_CONNECT,
  payload: config,
});

export const disconnectMqtt = () => ({
  type: MQTT_DISCONNECT,
});

export const publishMessage = (topic, message, options = {}) => ({
  type: MQTT_PUBLISH,
  payload: { topic, message, options },
});

export const subscribeToTopic = (topic, options = {}) => ({
  type: MQTT_SUBSCRIBE,
  payload: { topic, options },
});

export const unsubscribeFromTopic = (topic) => ({
  type: MQTT_UNSUBSCRIBE,
  payload: { topic },
});

// Middleware
export const mqttMiddleware = (store) => (next) => (action) => {
  const { dispatch } = store;

  switch (action.type) {
    case MQTT_CONNECT: {
      if (mqttClient && mqttClient.connected) {
        console.warn("⚠️ MQTT already connected");
        return next(action);
      }

      dispatch(setConnecting());

      const defaultConfig = {
        username: "uavhexa",
        password: "Adminuav1",
        connectTimeout: 5000,
        clean: true,
        reconnectPeriod: 3000, // thử lại sau 3s
        keepalive: 30, // ping mỗi 30s
        clientId: `vms-client-${Math.random().toString(16).slice(2, 10)}`,
      };

      const config = { ...defaultConfig, ...action.payload };
      const brokerUrl =
        "wss://623f7565a69042acabb12f9723658b7e.s1.eu.hivemq.cloud:8884/mqtt";

      try {
        mqttClient = mqtt.connect(brokerUrl, config);

        mqttClient.on("connect", () => {
          console.log("✅ MQTT Connected");
          dispatch(setConnected());
        });

        mqttClient.on("reconnect", () => {
          console.log("🔄 MQTT Reconnecting...");
          dispatch(setConnecting());
        });

        mqttClient.on("offline", () => {
          console.log("⚠️ MQTT Offline");
          dispatch(setDisconnected());
        });

        mqttClient.on("close", () => {
          console.log("🔌 MQTT Disconnected");
          dispatch(setDisconnected());
        });

        mqttClient.on("error", (err) => {
          console.error("❌ MQTT Error:", err);
          dispatch(setError(err.message || "Connection failed"));
        });

        mqttClient.on("message", (topic, message) => {
          try {
            const messageStr = message.toString();
            console.log(`📨 Received on ${topic}:`, messageStr);
            dispatch(addMessage({ topic, message: messageStr }));
          } catch (err) {
            console.error("Error processing message:", err);
          }
        });
      } catch (err) {
        console.error("❌ Failed to create MQTT client:", err);
        dispatch(setError(err.message));
      }
      break;
    }

    case MQTT_DISCONNECT: {
      if (mqttClient) {
        mqttClient.end(true); // force close
        mqttClient = null;
        dispatch(setDisconnected());
      }
      break;
    }

    case MQTT_PUBLISH: {
      if (!mqttClient || !mqttClient.connected) {
        console.warn("⚠️ MQTT not connected");
        dispatch(setError("Not connected to MQTT broker"));
        return next(action);
      }
      const { topic, message, options } = action.payload;
      mqttClient.publish(topic, message, options, (err) => {
        if (err) {
          console.error("❌ Publish failed:", err);
          dispatch(setError(`Failed to publish: ${err.message}`));
        } else {
          console.log(`📤 Published to ${topic}:`, message);
        }
      });
      break;
    }

    case MQTT_SUBSCRIBE: {
      if (!mqttClient || !mqttClient.connected) {
        console.warn("⚠️ MQTT not connected");
        dispatch(setError("Not connected to MQTT broker"));
        return next(action);
      }
      const { topic: subTopic, options: subOptions } = action.payload;
      mqttClient.subscribe(subTopic, subOptions, (err) => {
        if (err) {
          console.error("❌ Subscribe failed:", err);
          dispatch(setError(`Failed to subscribe: ${err.message}`));
        } else {
          console.log(`📥 Subscribed to ${subTopic}`);
          dispatch(addSubscribedTopic(subTopic));
        }
      });
      break;
    }

    case MQTT_UNSUBSCRIBE: {
      if (!mqttClient || !mqttClient.connected) {
        console.warn("⚠️ MQTT not connected");
        return next(action);
      }
      const { topic: unsubTopic } = action.payload;
      mqttClient.unsubscribe(unsubTopic, (err) => {
        if (err) {
          console.error("❌ Unsubscribe failed:", err);
          dispatch(setError(`Failed to unsubscribe: ${err.message}`));
        } else {
          console.log(`📤 Unsubscribed from ${unsubTopic}`);
          dispatch(removeSubscribedTopic(unsubTopic));
        }
      });
      break;
    }

    default:
      break;
  }

  return next(action);
};
