import { useState, useEffect } from "react";
import { TrendingUp, Award, DollarSign, Calendar } from "lucide-react";

interface DashboardDailyReport {
  date: string;
  total_auctions: number;
  total_revenue: number;
}

export default function Dashboard() {
  const [reports, setReports] = useState<DashboardDailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    const token = getToken();

    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("start_date", startDate);
      if (endDate) queryParams.append("end_date", endDate);

      const response = await fetch(
        `http://localhost:8080/admin/auctions/dashboard-report?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard analytical report");
      }

      const res = await response.json();
      setReports(res.data || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [startDate, endDate]);

  const grandTotalAuctions = reports.reduce(
    (sum, item) => sum + item.total_auctions,
    0,
  );
  const grandTotalRevenue = reports.reduce(
    (sum, item) => sum + Number(item.total_revenue),
    0,
  );
  const averageRevenuePerDay =
    reports.length > 0 ? grandTotalRevenue / reports.length : 0;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section & Filter Tanggal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">
              Dashboard Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor daily auction metrics and platforms financial revenue.
            </p>
          </div>

          {/* Date Picker Filters */}
          <div className="flex items-center gap-3 bg-white p-2 border border-gray-200/80 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 px-2 text-xs font-semibold uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-gray-400" />
              Period:
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-1.5 outline-none transition-colors"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-1.5 outline-none transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* 3 Summary Cards Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Total Revenue */}
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Revenue (Fee)
              </p>
              <h3 className="text-2xl font-bold text-[#0F172A] mt-2">
                {loading ? "..." : formatCurrency(grandTotalRevenue)}
              </h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-xl border border-green-100">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Completed Auctions */}
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Completed Auctions
              </p>
              <h3 className="text-2xl font-bold text-[#0F172A] mt-2">
                {loading ? "..." : `${grandTotalAuctions} Closed`}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Average Daily Return */}
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Avg. Daily Revenue
              </p>
              <h3 className="text-2xl font-bold text-[#0F172A] mt-2">
                {loading ? "..." : formatCurrency(averageRevenuePerDay)}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 text-gray-400">
            No report records found for the selected date range.
          </div>
        ) : (
          /* Table Report Section */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-semibold text-[14px]">
                    <th className="py-4 px-6 font-medium w-20">No</th>
                    <th className="py-4 px-6 font-medium">Activity Date</th>
                    <th className="py-4 px-6 font-medium">
                      Total Completed Auctions
                    </th>
                    <th className="py-4 px-6 font-medium">
                      Daily Platform Revenue (Fee Collected)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[14px] text-gray-700">
                  {reports.map((report, index) => (
                    <tr
                      key={report.date}
                      className="hover:bg-gray-50/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-800">
                        {formatDate(report.date)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold">
                          {report.total_auctions} Auctions
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold text-green-600">
                        {formatCurrency(Number(report.total_revenue))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
