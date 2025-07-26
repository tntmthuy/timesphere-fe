type PaymentItem = {
  id: number;
  user: string;
  amount: number;
  status: "Đã thanh toán" | "Chưa thanh toán" | "Hoàn tiền";
  date: string;
};

const payments: PaymentItem[] = [
  { id: 1, user: "Nguyễn Văn A", amount: 500000, status: "Đã thanh toán", date: "2025-07-25" },
  { id: 2, user: "Trần Bích Vân", amount: 320000, status: "Chưa thanh toán", date: "2025-07-24" },
  { id: 3, user: "Lê Hoàng", amount: 700000, status: "Hoàn tiền", date: "2025-07-23" }
];

// 👉 Lọc ra chỉ những khoản "Đã thanh toán"
const paidPayments = payments.filter((p) => p.status === "Đã thanh toán");

export const PaymentsLite = () => {
  return (
    <div className="min-h-screen bg-yellow-50 p-8 text-yellow-900">
      <h1 className="text-3xl font-bold mb-2">💳 Giao dịch đã thanh toán</h1>
      <p className="text-yellow-700 mb-6 text-sm">
        Chỉ hiển thị những khoản đã được xử lý thành công.
      </p>

      <div className="overflow-x-auto rounded-md shadow bg-white">
        <table className="w-full text-sm">
          <thead className="bg-yellow-200 text-yellow-900 font-semibold">
            <tr>
              <th className="px-4 py-2">👤 Người dùng</th>
              <th className="px-4 py-2">💰 Số tiền</th>
              <th className="px-4 py-2">📅 Ngày</th>
              <th className="px-4 py-2">⚠️ Trạng thái</th>
              <th className="px-4 py-2">🔧 Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paidPayments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 italic text-gray-500">
                  Chưa có giao dịch nào được thanh toán.
                </td>
              </tr>
            ) : (
              paidPayments.map((item) => (
                <tr key={item.id} className="border-b hover:bg-yellow-50 transition">
                  <td className="px-4 py-2">{item.user}</td>
                  <td className="px-4 py-2">{item.amount.toLocaleString()} ₫</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button className="text-blue-600 hover:underline text-sm">Chi tiết</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};