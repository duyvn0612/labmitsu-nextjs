import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk để thêm camera vào API
export const addCamera = createAsyncThunk(
  "camera/addCamera",
  async (cameraData) => {
    // console.log(cameraData);

    const response = await fetch("http://localhost:3000/api/cameras/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cameraData),
    });
    if (!response.ok) {
      throw new Error("Failed to add camera");
    }
    // console.log(await response.json());

    return await response.json();
  }
);

// Thunk để fetch tree camera từ API
export const fetchTreeCameras = createAsyncThunk(
  "camera/fetchTreeCameras",
  async () => {
    const response = await fetch(
      "http://localhost:3000/api/cameras/treeCameras"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tree cameras");
    }
    // console.log(await response.json());

    return await response.json();
  }
);

// Thunk để fetch dữ liệu camera từ API
export const fetchListCamera = createAsyncThunk(
  "camera/fetchListCamera",
  async () => {
    const res = await fetch("http://localhost:3000/api/cameras/listCam");
    if (!res.ok) {
      throw new Error("Failed to fetch list camera");
    }
    return await res.json();
  }
);

const apiCamSlice = createSlice({
  name: "apiCamera",
  initialState: {
    camera: {},
    treeCameras: [],
    listCamera: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Xử lý trạng thái khi thêm camera
    builder
      .addCase(addCamera.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.camera = { ...action.payload.camera };
        state.status = "idle";
      })
      .addCase(addCamera.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // Xử lý trạng thái khi fetch tree camera
    builder
      .addCase(fetchTreeCameras.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTreeCameras.fulfilled, (state, action) => {
        state.treeCameras = action.payload;
        state.status = "idle";
      })
      .addCase(fetchTreeCameras.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    // Xử lý trạng thái khi fetch list camera
    builder
      .addCase(fetchListCamera.pending(), (state) => {
        state.status = "loading";
      })
      .addCase(fetchListCamera.fulfilled(), (state, action) => {
        // console.log(action.payload);
        // state.status = "succeeded";
        state.listCamera = action.payload;
        state.status = "idle";
      })
      .addCase(fetchListCamera.rejected(), (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default apiCamSlice;
