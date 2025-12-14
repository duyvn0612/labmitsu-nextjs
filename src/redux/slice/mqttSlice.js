import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  isConnecting: false,
  error: null,
  messages: [],
  subscribedTopics: [],
};

const mqttSlice = createSlice({
  name: "mqtt",
  initialState,
  reducers: {
    setConnecting: (state) => {
      state.isConnecting = true;
      state.error = null;
    },
    setConnected: (state) => {
      state.isConnected = true;
      state.isConnecting = false;
      state.error = null;
    },
    setDisconnected: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isConnecting = false;
      state.isConnected = false;
    },
    addMessage: (state, action) => {
      state.messages.push({
        topic: action.payload.topic,
        message: action.payload.message,
        timestamp: Date.now(),
      });
      // Giới hạn số lượng messages để tránh memory leak
      if (state.messages.length > 100) {
        state.messages = state.messages.slice(-100);
      }
    },
    addSubscribedTopic: (state, action) => {
      if (!state.subscribedTopics.includes(action.payload)) {
        state.subscribedTopics.push(action.payload);
      }
    },
    removeSubscribedTopic: (state, action) => {
      state.subscribedTopics = state.subscribedTopics.filter(
        (topic) => topic !== action.payload
      );
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setConnecting,
  setConnected,
  setDisconnected,
  setError,
  addMessage,
  addSubscribedTopic,
  removeSubscribedTopic,
  clearMessages,
} = mqttSlice.actions;

export default mqttSlice.reducer;
