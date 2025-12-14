import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// thunk để fetch khi thêm một vms mới
export const addVms = createAsyncThunk("vms/addVms", async (vmsData) => {
  const res = await fetch("http://localhost:3000/api/vms/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vmsData),
  });
  if (!res.ok) {
    throw new Error("Failed to add vms");
  }
  return await res.json();
});

// thunk để fetch khi lấy dữ liệu list vms
export const fetchListVms = createAsyncThunk("vms/fetchListVms", async () => {
  const res = await fetch("http://localhost:3000/api/vms/listVms");
  if (!res.ok) {
    throw new Error("Failed to list vms");
  }
  return await res.json();
});

// thunk để fetch khi lấy dữ liệu detail vms theo id
export const fetchVmsDetail = createAsyncThunk(
  "vms/fetchVmsDetail",
  async (id) => {
    const res = await fetch(`http://localhost:3000/api/vms/detailVms?id=${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch VMS detail");
    }
    return await res.json(); // Trả về array dailyData[]
  }
);

// thunk để lưu dữ liệu VMS (cập nhật nội dung)
export const saveVmsData = createAsyncThunk(
  "vms/saveVmsData",
  async ({ vmsId, data }, { rejectWithValue }) => {
    console.log(vmsId, data);

    try {
      const res = await fetch("http://localhost:3000/api/vms/addEventVms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vmsId, data }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const apiVmsSlice = createSlice({
  name: "apiVms",
  initialState: {
    vms: [],
    listVms: [],
    vmsDetail: [],
    detailStatus: "idle",
    status: "idle",
    saveStatus: "idle", // Thêm trạng thái cho save operation
    error: null,
    saveError: null, // Thêm error riêng cho save operation
    lastSaved: null, // Thời gian save cuối cùng
  },
  reducers: {
    // Reset save status
    resetSaveStatus: (state) => {
      state.saveStatus = "idle";
      state.saveError = null;
    },
    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    // xử lý trạng thái khi add vms
    builder
      .addCase(addVms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vms.push(action.payload.vms);
      })
      .addCase(addVms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // xử lý trạng thái khi lấy list vms
    builder
      .addCase(fetchListVms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchListVms.fulfilled, (state, action) => {
        state.listVms = action.payload;
        state.status = "idle";
      })
      .addCase(fetchListVms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

    // xử lý trạng thái khi lấy detail vms theo id
    builder
      .addCase(fetchVmsDetail.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchVmsDetail.fulfilled, (state, action) => {
        state.vmsDetail = action.payload;
        state.detailStatus = "succeeded";
      })
      .addCase(fetchVmsDetail.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.error.message;
      });

    // xử lý trạng thái khi lưu dữ liệu VMS
    builder
      .addCase(saveVmsData.pending, (state) => {
        state.saveStatus = "loading";
        state.saveError = null;
      })
      .addCase(saveVmsData.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.lastSaved = new Date().toISOString();

        // Cập nhật dữ liệu trong vmsDetail nếu đang xem detail của VMS này
        if (state.vmsDetail && state.vmsDetail.length > 0) {
          const savedData = action.payload;
          const today = action.meta.arg.data.date;

          // Tìm và cập nhật hoặc thêm mới record cho ngày hôm nay
          const existingIndex = state.vmsDetail.findIndex(
            (item) => item.date === today
          );

          if (existingIndex !== -1) {
            // Cập nhật record hiện có
            state.vmsDetail[existingIndex] = {
              ...state.vmsDetail[existingIndex],
              ...action.meta.arg.data,
              updatedAt: new Date().toISOString(),
            };
          } else {
            // Thêm record mới và sắp xếp lại theo ngày
            state.vmsDetail.unshift({
              ...action.meta.arg.data,
              createdAt: new Date().toISOString(),
            });
            // Sắp xếp theo ngày (mới nhất trước)
            state.vmsDetail.sort((a, b) => new Date(b.date) - new Date(a.date));
          }
        }
      })
      .addCase(saveVmsData.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.payload || action.error.message;
      });
  },
});

// Export actions
export const { resetSaveStatus, clearErrors } = apiVmsSlice.actions;

export default apiVmsSlice;
