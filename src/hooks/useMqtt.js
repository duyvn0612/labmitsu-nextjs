// src/hooks/useMqtt.js
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  connectMqtt,
  disconnectMqtt,
  publishMessage,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "@/redux/middlewares/mqttMiddleware";

export const useMqtt = () => {
  const dispatch = useDispatch();
  const mqttState = useSelector((state) => state.mqtt);

  // Hàm connect: nếu chưa kết nối thì gọi middleware
  const connect = useCallback(
    (config = {}) => {
      dispatch(connectMqtt(config));
    },
    [dispatch]
  );

  const disconnect = useCallback(() => {
    dispatch(disconnectMqtt());
  }, [dispatch]);

  const publish = useCallback(
    (topic, message, options) => {
      dispatch(publishMessage(topic, message, options));
    },
    [dispatch]
  );

  const subscribe = useCallback(
    (topic, options) => {
      dispatch(subscribeToTopic(topic, options));
    },
    [dispatch]
  );

  const unsubscribe = useCallback(
    (topic) => {
      dispatch(unsubscribeFromTopic(topic));
    },
    [dispatch]
  );

  // 🔑 Tự động kết nối khi hook được dùng lần đầu
  useEffect(() => {
    // config kết nối mặc định (nếu không truyền từ component)
    connect({
      username: "uavhexa",
      password: "Adminuav1",
      clientId: `vms-client-${Math.random().toString(16).substr(2, 8)}`,
    });

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...mqttState, // trong mqttSlice có: isConnected, isConnecting, error, messages, ...
    connect,
    disconnect,
    publish,
    subscribe,
    unsubscribe,
  };
};
