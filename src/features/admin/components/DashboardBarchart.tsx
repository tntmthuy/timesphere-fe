import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchChartData } from "../dashboardSlice";
import type { AppDispatch, RootState } from "../../../state/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const getWeekRangeFromDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0 = Chủ nhật → về Thứ Hai
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const format = (d: Date) => d.toISOString().slice(0, 10);
  return { fromDate: format(monday), toDate: format(sunday) };
};

const DashboardBarChart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { chartData, loadingChart, error } = useSelector(
    (state: RootState) => state.dashboard,
  );

  const [range, setRange] = useState("week");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  useEffect(() => {
    if (range === "day" && selectedDate) {
      dispatch(
        fetchChartData({
          range: "day",
          fromDate: selectedDate,
          toDate: selectedDate,
        }),
      );
    } else if (range === "week" && selectedDate) {
      const { fromDate, toDate } = getWeekRangeFromDate(selectedDate);
      dispatch(fetchChartData({ range: "week", fromDate, toDate }));
    } else if (range === "month") {
      dispatch(
        fetchChartData({
          range: "month",
          month: selectedMonth,
          year: selectedYear,
        }),
      );
    }
  }, [dispatch, range, selectedDate, selectedMonth, selectedYear]);

  const labels = chartData.map((point) => {
    const d = new Date(point.date);
    return d.getDate().toString().padStart(2, "0");
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Users",
        data: chartData.map((p) => p.totalUsers),
        backgroundColor: "#f87171",
      },
      {
        label: "Teams",
        data: chartData.map((p) => p.totalTeams),
        backgroundColor: "#60a5fa",
      },
      {
        label: "Focus Sessions",
        data: chartData.map((p) => p.totalFocusSessions),
        backgroundColor: "#facc15",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: `📊 Biểu đồ theo ${range}`,
      },
    },
  };

  return (
    <div className="mt-10 rounded-lg bg-yellow-100 p-6 shadow-md">
      <div className="mb-4 flex flex-wrap items-center gap-6">
        {/* Select kiểu thống kê */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Thống kê theo:
          </label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded border bg-white px-3 py-1 text-sm text-gray-700"
          >
            <option value="day">Ngày</option>
            <option value="week">Tuần (qua ngày)</option>
            <option value="month">Tháng</option>
          </select>
        </div>

        {/* Nếu là day/week → chọn ngày */}
        {(range === "day" || range === "week") && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">
              {range === "day" ? "Chọn ngày:" : "Chọn ngày bất kỳ trong tuần:"}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded border bg-white px-3 py-1 text-sm text-gray-700"
            />
          </div>
        )}

        {/* Nếu là tháng → chọn tháng + năm */}
        {range === "month" && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Tháng:
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="rounded border bg-white px-3 py-1 text-sm text-gray-700"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Năm:
              </label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-[80px] rounded border bg-white px-2 py-1 text-sm text-gray-700"
              />
            </div>
          </>
        )}
      </div>

      {/* Biểu đồ */}
      {loadingChart ? (
        <p className="text-yellow-600">Đang tải biểu đồ...</p>
      ) : error ? (
        <p className="text-red-600">Lỗi: {error}</p>
      ) : chartData.length === 0 ? (
        <p>Không có dữ liệu biểu đồ.</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default DashboardBarChart;
