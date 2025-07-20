import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPlansThunk = createAsyncThunk("subscription/fetchPlans", async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("/api/plans", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
});

const slice = createSlice({
  name: "subscription",
  initialState: {
    plans: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPlansThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPlansThunk.fulfilled, (state, action) => {
      state.plans = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchPlansThunk.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default slice.reducer;