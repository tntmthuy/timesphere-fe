import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

// 🎯 Thunk: lấy số liệu tổng quan
export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/admin/summary");
      return res.data.data;
    } catch {
      return thunkAPI.rejectWithValue("Không thể lấy dữ liệu tổng quan");
    }
  }
);

// 🎯 Thunk: lấy dữ liệu biểu đồ
interface ChartParams {
  range?: string;
  fromDate?: string;
  toDate?: string;
  month?: number;
  year?: number;
}


export const fetchChartData = createAsyncThunk(
  "dashboard/fetchChartData",
  async (params: ChartParams, thunkAPI) => {
    try {
      const res = await api.get("/api/admin/chart", { params });
      return res.data.data;
    } catch {
      return thunkAPI.rejectWithValue("Không thể lấy dữ liệu biểu đồ");
    }
  }
);


// 🧩 Type dữ liệu từng điểm biểu đồ
type ChartPoint = {
  date: string;
  totalUsers: number;
  totalTeams: number;
  totalFocusSessions: number;
};

// 🧩 State toàn cục
type DashboardState = {
  totalUsers: number;
  totalTeams: number;
  totalFocusSessions: number;
  chartData: ChartPoint[];
  loadingSummary: boolean;
  loadingChart: boolean;
  error: string | null;
};

// 🔰 Khởi tạo state ban đầu
const initialState: DashboardState = {
  totalUsers: 0,
  totalTeams: 0,
  totalFocusSessions: 0,
  chartData: [],
  loadingSummary: false,
  loadingChart: false,
  error: null
};

// 🍰 Slice chính
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ⚙️ Summary
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loadingSummary = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action: PayloadAction<DashboardState>) => {
        state.totalUsers = action.payload.totalUsers;
        state.totalTeams = action.payload.totalTeams;
        state.totalFocusSessions = action.payload.totalFocusSessions;
        state.loadingSummary = false;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.error = action.payload as string;
      })

      // ⚙️ Chart data
      .addCase(fetchChartData.pending, (state) => {
        state.loadingChart = true;
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action: PayloadAction<ChartPoint[]>) => {
        state.chartData = action.payload;
        state.loadingChart = false;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loadingChart = false;
        state.error = action.payload as string;
      });
  }
});

export default dashboardSlice.reducer;