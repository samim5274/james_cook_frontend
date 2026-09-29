<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200"
  >
    <HeaderSection
      :is-dark="isDark"
      @toggle-dark="toggleDarkMode"
      @toggle-menu="toggleMenu"
    />

    <div class="flex min-h-[calc(100vh-56px)]">
      <Navbar :mobile-menu="mobileMenu" @close="mobileMenu = false" />

      <Message
        :successMsg="successMsg"
        :errorMsg="errorMsg"
        @update:successMsg="successMsg = $event"
        @update:errorMsg="errorMsg = $event"
      />

      <analysisBody />
    </div>

    <FooterSection />
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

import Navbar from "../../admin/admin-navbar.vue";
import HeaderSection from "../../admin/admin-header.vue";
import Message from "../../../Message/message.vue";
import FooterSection from "../../../footer.vue";
import analysisBody from "./analysis-body.vue";

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
