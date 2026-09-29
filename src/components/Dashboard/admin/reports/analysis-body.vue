<template>
  <div class="flex-1 min-w-0">
    <main
      class="flex-1 min-h-screen min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 lg:px-8 py-6 print:bg-white print:px-0 print:py-0"
    >
      <div class="p-6 bg-gray-50 dark:bg-[#0C1326] min-h-screen">
        <!-- Header & Date Filter Controls -->
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Sales Report - Day By Day
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Daily sales/payment performance overview
            </p>
          </div>

          <!-- Date Filter Panel -->
          <div
            class="flex flex-wrap items-center gap-2 bg-white dark:bg-[#111827] p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/60"
          >
            <!-- Quick Presets -->
            <button
              v-for="preset in presets"
              :key="preset.value"
              @click="applyPreset(preset.value)"
              :class="[
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                selectedPreset === preset.value
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
              ]"
            >
              {{ preset.label }}
            </button>

            <div
              class="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"
            ></div>

            <!-- Custom Range Inputs -->
            <div class="flex items-center gap-2">
              <input
                type="date"
                v-model="startDate"
                @change="onCustomDateChange"
                class="px-2.5 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0C1326] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span class="text-xs text-gray-400">to</span>
              <input
                type="date"
                v-model="endDate"
                @change="onCustomDateChange"
                class="px-2.5 py-1 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0C1326] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <!-- Summary Cards -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <!-- Total Sales -->
          <div
            class="bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/60 p-5 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Total Sales
                </p>
                <h2
                  class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1"
                >
                  ৳{{ formatNumber(summary.totalAmount) }}
                </h2>
              </div>
              <div
                class="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center"
              >
                <i
                  class="fa-solid fa-money-bill-trend-up text-emerald-600 dark:text-emerald-400 text-lg"
                ></i>
              </div>
            </div>
          </div>

          <!-- Total Payments -->
          <div
            class="bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/60 p-5 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Total Payments
                </p>
                <h2
                  class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1"
                >
                  {{ summary.totalPayments }}
                </h2>
              </div>
              <div
                class="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center"
              >
                <i
                  class="fa-solid fa-receipt text-blue-600 dark:text-blue-400 text-lg"
                ></i>
              </div>
            </div>
          </div>

          <!-- Total Days -->
          <div
            class="bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/60 p-5 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Total Days
                </p>
                <h2
                  class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1"
                >
                  {{ summary.totalDays }}
                </h2>
              </div>
              <div
                class="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center"
              >
                <i
                  class="fa-solid fa-calendar-days text-amber-600 dark:text-amber-400 text-lg"
                ></i>
              </div>
            </div>
          </div>

          <!-- Average -->
          <div
            class="bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/60 p-5 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Average Per Day
                </p>
                <h2
                  class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1"
                >
                  ৳{{ formatNumber(summary.averagePerDay) }}
                </h2>
              </div>
              <div
                class="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center"
              >
                <i
                  class="fa-solid fa-chart-line text-indigo-600 dark:text-indigo-400 text-lg"
                ></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section (Side-by-Side or Stacked) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Bar Chart (Takes 2 columns on large screens) -->
          <div
            class="lg:col-span-2 bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/60 p-6 transition-colors"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
            >
              <div>
                <h2
                  class="text-lg font-bold text-gray-800 dark:text-gray-100"
                >
                  Daily Sales Trend
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Revenue trend for selected period
                </p>
              </div>
              <div
                v-if="orders.length"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800/80 text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>{{ orders.length }} Records</span>
              </div>
            </div>

            <div
              v-if="!loading && orders.length"
              class="h-[360px] relative w-full"
            >
              <Bar :data="chartData" :options="chartOptions" />
            </div>
            <div
              v-else-if="loading"
              class="h-[360px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 gap-3"
            >
              <svg
                class="animate-spin h-8 w-8 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span class="text-sm font-medium">Loading sales data...</span>
            </div>
            <div
              v-else
              class="h-[360px] flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-2"
            >
              <i class="fa-solid fa-chart-simple text-4xl opacity-50"></i>
              <span class="text-sm"
                >No sales records found for this date range</span
              >
            </div>
          </div>

          <!-- Doughnut Chart (Takes 1 column) -->
          <div
            class="bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/60 p-6 transition-colors"
          >
            <div class="mb-6">
              <h2
                class="text-lg font-bold text-gray-800 dark:text-gray-100"
              >
                Distribution
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Share of top performing dates
              </p>
            </div>

            <div
              v-if="!loading && orders.length"
              class="h-[360px] relative w-full flex items-center justify-center"
            >
              <Doughnut :data="pieChartData" :options="pieChartOptions" />
              <div
                class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                <span
                  class="text-[10px] uppercase font-semibold text-gray-400 dark:text-gray-500 tracking-wider"
                  >Total</span
                >
                <span
                  class="text-base font-extrabold text-gray-800 dark:text-gray-100"
                  >৳{{ formatNumber(summary.totalAmount) }}</span
                >
              </div>
            </div>
            <div
              v-else-if="loading"
              class="h-[360px] flex items-center justify-center text-gray-500 dark:text-gray-400"
            >
              Loading visual breakdown...
            </div>
            <div
              v-else
              class="h-[360px] flex items-center justify-center text-gray-400 dark:text-gray-500"
            >
              No data available
            </div>
          </div>
        </div>

        <!-- Daily Data Table -->
        <div
          class="bg-white dark:bg-[#111827] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/60 overflow-hidden transition-colors"
        >
          <div
            class="p-5 border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between"
          >
            <h2
              class="text-lg font-semibold text-gray-800 dark:text-gray-100"
            >
              Daily Sales Details
            </h2>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Showing data from {{ formatDate(startDate) }} to
              {{ formatDate(endDate) }}
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-[#0C1326]">
                <tr>
                  <th
                    class="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300"
                  >
                    #
                  </th>
                  <th
                    class="px-5 py-3 text-left font-semibold text-gray-600 dark:text-gray-300"
                  >
                    Date
                  </th>
                  <th
                    class="px-5 py-3 text-right font-semibold text-gray-600 dark:text-gray-300"
                  >
                    Payments
                  </th>
                  <th
                    class="px-5 py-3 text-right font-semibold text-gray-600 dark:text-gray-300"
                  >
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in orders"
                  :key="item.date"
                  class="border-t border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td class="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {{ index + 1 }}
                  </td>
                  <td
                    class="px-5 py-4 font-medium text-gray-800 dark:text-gray-100"
                  >
                    {{ formatDate(item.date) }}
                  </td>
                  <td
                    class="px-5 py-4 text-right text-gray-600 dark:text-gray-300"
                  >
                    {{ item.total_payments }}
                  </td>
                  <td
                    class="px-5 py-4 text-right font-semibold text-emerald-600 dark:text-emerald-400"
                  >
                    ৳{{ formatNumber(item.total_amount) }}
                  </td>
                </tr>
                <tr v-if="!loading && !orders.length">
                  <td
                    colspan="4"
                    class="px-5 py-10 text-center text-gray-400 dark:text-gray-500"
                  >
                    No daily sales data available for this range
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMsg"
          class="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40"
        >
          {{ errorMsg }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "vue-chartjs";
import api from "../../../../services/api.js";

const mobileMenu = ref(false);

function toggleMenu() {
  mobileMenu.value = !mobileMenu.value;
}

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
);

// --------------------------------------------------
// State & Date Management
// --------------------------------------------------
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const orders = ref([]);
const isDark = ref(false);

const getTodayString = () => new Date().toISOString().split("T")[0];

const startDate = ref(getTodayString());
const endDate = ref(getTodayString());
const selectedPreset = ref("today");

const presets = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
];

const summary = ref({
  totalAmount: 0,
  totalPayments: 0,
  totalDays: 0,
  averagePerDay: 0,
});

const pagination = ref({
  page: 1,
  lastPage: 1,
  total: 0,
  perPage: 30,
  from: 0,
  to: 0,
});

// --------------------------------------------------
// Date Preset Handlers
// --------------------------------------------------
function applyPreset(presetKey) {
  selectedPreset.value = presetKey;
  const today = new Date();

  if (presetKey === "today") {
    startDate.value = getTodayString();
    endDate.value = getTodayString();
  } else if (presetKey === "yesterday") {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    const yStr = y.toISOString().split("T")[0];
    startDate.value = yStr;
    endDate.value = yStr;
  } else if (presetKey === "7days") {
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    startDate.value = start.toISOString().split("T")[0];
    endDate.value = getTodayString();
  } else if (presetKey === "30days") {
    const start = new Date(today);
    start.setDate(start.getDate() - 29);
    startDate.value = start.toISOString().split("T")[0];
    endDate.value = getTodayString();
  }

  fetchOrders();
}

function onCustomDateChange() {
  selectedPreset.value = "custom";
  fetchOrders();
}

// --------------------------------------------------
// Fetch API
// --------------------------------------------------
async function fetchOrders(page = 1) {
  loading.value = true;
  errorMsg.value = "";

  try {
    const response = await api.get("/reports/day-by-day", {
      params: {
        page,
        per_page: pagination.value.perPage,
        start_date: startDate.value,
        end_date: endDate.value,
      },
    });

    const result = response?.data;
    const report = result?.data;
    const days = report?.days;

    orders.value = Array.isArray(days?.data) ? days.data : [];

    summary.value = {
      totalAmount: Number(report?.summary?.total_amount ?? 0),
      totalPayments: Number(report?.summary?.total_payments ?? 0),
      totalDays: Number(report?.summary?.total_days ?? 0),
      averagePerDay: Number(report?.summary?.average_per_day ?? 0),
    };

    pagination.value = {
      page: days?.current_page ?? 1,
      lastPage: days?.last_page ?? 1,
      total: days?.total ?? 0,
      perPage: days?.per_page ?? 30,
      from: days?.from ?? 0,
      to: days?.to ?? 0,
    };
  } catch (err) {
    console.error("Day-by-day report error:", err);
    errorMsg.value =
      err?.response?.data?.message ??
      "Failed to fetch day-by-day sales report.";
    orders.value = [];
    summary.value = {
      totalAmount: 0,
      totalPayments: 0,
      totalDays: 0,
      averagePerDay: 0,
    };
  } finally {
    loading.value = false;
  }
}

// --------------------------------------------------
// Bar Chart Data & Options
// --------------------------------------------------
const chartData = computed(() => {
  const data = [...orders.value].reverse();

  return {
    labels: data.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Daily Revenue",
        data: data.map((item) => Number(item.total_amount)),
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return isDark.value ? "#6366f1" : "#4f46e5";

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top,
          );
          if (isDark.value) {
            gradient.addColorStop(0, "rgba(99, 102, 241, 0.2)");
            gradient.addColorStop(1, "rgba(129, 140, 248, 0.95)");
          } else {
            gradient.addColorStop(0, "rgba(79, 70, 229, 0.25)");
            gradient.addColorStop(1, "rgba(99, 102, 241, 0.95)");
          }
          return gradient;
        },
        hoverBackgroundColor: isDark.value ? "#a5b4fc" : "#4338ca",
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
        maxBarThickness: 40,
      },
    ],
  };
});

const chartOptions = computed(() => {
  const textColor = isDark.value ? "#94a3b8" : "#64748b";
  const gridColor = isDark.value
    ? "rgba(51, 65, 85, 0.4)"
    : "rgba(226, 232, 240, 0.8)";
  const tooltipBg = isDark.value ? "#0f172a" : "#ffffff";
  const tooltipText = isDark.value ? "#f8fafc" : "#0f172a";

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: isDark.value
          ? "rgba(51, 65, 85, 0.8)"
          : "rgba(203, 213, 225, 0.8)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          title: (tooltipItems) => `Date: ${tooltipItems[0].label}`,
          label: (context) =>
            ` Sales: ৳${Number(context.raw).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { dash: [5, 5], display: false },
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: "Inter, sans-serif", size: 11 },
          callback: (value) =>
            value >= 1000 ? `৳${(value / 1000).toFixed(1)}k` : `৳${value}`,
        },
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: {
          color: textColor,
          font: { family: "Inter, sans-serif", size: 11 },
        },
      },
    },
  };
});

// --------------------------------------------------
// Pie / Doughnut Chart Data & Options
// --------------------------------------------------
const pieChartData = computed(() => {
  const data = [...orders.value];

  const sorted = [...data].sort(
    (a, b) => Number(b.total_amount) - Number(a.total_amount),
  );
  const topDays = sorted.slice(0, 5);
  const remaining = sorted.slice(5);

  const labels = topDays.map((item) => formatDate(item.date));
  const values = topDays.map((item) => Number(item.total_amount));

  if (remaining.length) {
    labels.push("Other Days");
    values.push(
      remaining.reduce((acc, curr) => acc + Number(curr.total_amount), 0),
    );
  }

  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#6366f1", // Indigo
          "#10b981", // Emerald
          "#f59e0b", // Amber
          "#ec4899", // Pink
          "#06b6d4", // Cyan
          "#94a3b8", // Gray for others
        ],
        borderColor: isDark.value ? "#111827" : "#ffffff",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };
});

const pieChartOptions = computed(() => {
  const tooltipBg = isDark.value ? "#0f172a" : "#ffffff";
  const tooltipText = isDark.value ? "#f8fafc" : "#0f172a";
  const legendColor = isDark.value ? "#cbd5e1" : "#475569";

  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: legendColor,
          usePointStyle: true,
          padding: 12,
          font: { family: "Inter, sans-serif", size: 11 },
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: isDark.value
          ? "rgba(51, 65, 85, 0.8)"
          : "rgba(203, 213, 225, 0.8)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = Number(context.raw);
            const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            return ` ৳${value.toLocaleString("en-BD")} (${percentage}%)`;
          },
        },
      },
    },
  };
});

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function applyTheme(dark) {
  isDark.value = dark;
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}

function toggleDarkMode() {
  applyTheme(!isDark.value);
}

// --------------------------------------------------
// Lifecycle
// --------------------------------------------------
onMounted(() => {
  // Initial fetch defaults to "Today"
  applyPreset("today");

  const saved = localStorage.getItem("theme");
  if (saved === "dark") applyTheme(true);
  else if (saved === "light") applyTheme(false);
  else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
});
</script>
