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

            <!-- Content -->
            <div class="flex-1 min-w-0">
                <main
                class="flex-1 min-h-screen min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 lg:px-8 py-6 print:bg-white print:px-0 print:py-0"
                >
                <!-- ==================== REPORT LETTERHEAD ==================== -->
                <div
                    class="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between print:rounded-none print:border-0 print:border-b-2 print:border-slate-900 print:p-0 print:pb-4 print:shadow-none"
                >
                    <div class="flex items-center gap-4">
                    <div
                        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 print:bg-white print:text-slate-900 print:border print:border-slate-900"
                    >
                        <i class="fa-solid fa-calendar-days text-lg"></i>
                    </div>
                    <div>
                        <p
                        class="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400"
                        >
                        Sales Report
                        </p>
                        <h1
                        class="text-2xl font-black tracking-tight text-slate-900 dark:text-white"
                        >
                        Day-by-Day Sales
                        </h1>
                        <p
                        class="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400"
                        >
                        <span v-if="startDate || endDate">
                            Period:
                            <span class="text-slate-700 dark:text-slate-200">{{
                            startDate ? formatDate(startDate) : "Beginning"
                            }}</span>
                            &rarr;
                            <span class="text-slate-700 dark:text-slate-200">{{
                            endDate ? formatDate(endDate) : "Today"
                            }}</span>
                        </span>
                        <span v-else
                            >All-time record &middot; Generated
                            {{ formatDate(today) }}</span
                        >
                        </p>
                    </div>
                    </div>

                    <div class="flex items-center gap-3">
                    <div class="hidden text-right sm:block">
                        <p
                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                        >
                        Days Matched
                        </p>
                        <p class="text-lg font-black text-slate-900 dark:text-white">
                        {{ days.length }}
                        <span class="text-xs font-medium text-slate-400"
                            >/ {{ pagination.total }}</span
                        >
                        </p>
                    </div>
                    <button
                        type="button"
                        @click="window.print()"
                        class="print:hidden flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        <i class="fa-solid fa-print text-xs"></i>
                        Print / Export
                    </button>
                    </div>
                </div>

                <!-- ==================== SUMMARY CARDS ==================== -->
                <div
                    class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 print:grid-cols-4 print:gap-2"
                >
                    <!-- TOTAL AMOUNT -->
                    <div
                    class="relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4 shadow-sm transition-all hover:shadow-md dark:border-emerald-800/50 dark:bg-emerald-950/20 print:rounded-lg print:border-slate-900 print:bg-white print:p-3 print:shadow-none"
                    >
                    <p
                        class="text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500"
                    >
                        Total Amount
                    </p>
                    <h4
                        class="mt-1 truncate text-lg font-black text-emerald-700 dark:text-emerald-400"
                    >
                        ৳ {{ formatCurrency(summary.total_amount) }}
                    </h4>
                    <p
                        class="mt-0.5 text-[10px] font-medium text-emerald-600/70 dark:text-emerald-500/60"
                    >
                        For selected period
                    </p>
                    </div>

                    <!-- TOTAL PAYMENTS -->
                    <div
                    class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none"
                    >
                    <p
                        class="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400"
                    >
                        Total Payments
                    </p>
                    <h4
                        class="mt-1 truncate text-lg font-black text-indigo-600 dark:text-indigo-400"
                    >
                        {{ formatNumber(summary.total_payments) }}
                    </h4>
                    <p
                        class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500"
                    >
                        Total transactions
                    </p>
                    </div>

                    <!-- TOTAL DAYS -->
                    <div
                    class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none"
                    >
                    <p
                        class="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400"
                    >
                        Active Days
                    </p>
                    <h4
                        class="mt-1 truncate text-lg font-black text-blue-600 dark:text-blue-400"
                    >
                        {{ formatNumber(summary.total_days) }}
                    </h4>
                    <p
                        class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500"
                    >
                        Days with sales
                    </p>
                    </div>

                    <!-- AVERAGE PER DAY -->
                    <div
                    class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none"
                    >
                    <p
                        class="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400"
                    >
                        Average / Day
                    </p>
                    <h4
                        class="mt-1 truncate text-lg font-black text-amber-600 dark:text-amber-400"
                    >
                        ৳ {{ formatCurrency(summary.average_per_day) }}
                    </h4>
                    <p
                        class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500"
                    >
                        Daily average revenue
                    </p>
                    </div>
                </div>

                <!-- ==================== FILTER PANEL (hidden on print) ==================== -->
                <div
                    class="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 print:hidden"
                >
                    <div class="space-y-5">
                    <div
                        class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/60"
                    >
                        <div class="flex items-center gap-2">
                        <div
                            class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                        >
                            <i class="fa-solid fa-sliders text-xs"></i>
                        </div>
                        <h3
                            class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider"
                        >
                            Filter Report
                        </h3>
                        </div>
                        <span
                        v-if="isFilterActive"
                        class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40"
                        >
                        <span
                            class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"
                        ></span>
                        Filter Active
                        </span>
                    </div>

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
                        <div class="md:col-span-4">
                        <label
                            class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            >Start Date</label
                        >
                        <div class="relative">
                            <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500"
                            >
                            <i class="fa-solid fa-calendar-days text-sm"></i>
                            </div>
                            <input
                            type="date"
                            v-model="startDate"
                            :max="endDate || today"
                            class="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:hover:bg-slate-800/60 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                            />
                        </div>
                        </div>

                        <div class="md:col-span-4">
                        <label
                            class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                            >End Date</label
                        >
                        <div class="relative">
                            <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500"
                            >
                            <i class="fa-solid fa-calendar-check text-sm"></i>
                            </div>
                            <input
                            type="date"
                            v-model="endDate"
                            :min="startDate || undefined"
                            :max="today"
                            class="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:hover:bg-slate-800/60 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                            />
                        </div>
                        </div>

                        <div class="md:col-span-2">
                        <button
                            type="button"
                            @click="applyFilters"
                            :disabled="loading"
                            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-600 bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:border-indigo-700 focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <i
                            v-if="!loading"
                            class="fa-solid fa-magnifying-glass text-xs"
                            ></i>
                            <i
                            v-else
                            class="fa-solid fa-spinner animate-spin text-xs"
                            ></i>
                            <span>{{ loading ? "Filtering..." : "Apply" }}</span>
                        </button>
                        </div>

                        <div class="md:col-span-2">
                        <button
                            type="button"
                            @click="resetFilters"
                            :disabled="loading"
                            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <i class="fa-solid fa-rotate-left text-xs"></i>
                            <span>Reset</span>
                        </button>
                        </div>
                    </div>
                    </div>
                </div>

                <!-- ==================== DAY-BY-DAY TABLE ==================== -->
                <div
                    class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden print:rounded-none print:border print:border-slate-400 print:shadow-none"
                >
                    <div
                    class="overflow-x-auto max-h-[1080px] print:max-h-none print:overflow-visible"
                    >
                    <table class="w-full text-left border-collapse">
                        <thead
                        class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-md print:static print:bg-slate-100 print:border-slate-400"
                        >
                        <tr>
                            <th
                            class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2"
                            >
                            #
                            </th>
                            <th
                            class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2"
                            >
                            Date
                            </th>
                            <th
                            class="px-6 py-4 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2"
                            >
                            Total Payments
                            </th>
                            <th
                            class="px-6 py-4 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2"
                            >
                            Total Amount
                            </th>
                        </tr>
                        </thead>

                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                        <template v-if="days && days.length > 0">
                            <tr
                            v-for="(day, index) in days"
                            :key="day.date"
                            class="transition-colors group hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                            :class="
                                index % 2 === 1
                                ? 'bg-slate-50/40 dark:bg-slate-800/20 print:bg-slate-50'
                                : ''
                            "
                            >
                            <td
                                class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2"
                            >
                                <div
                                class="text-xs font-bold text-slate-500 dark:text-slate-400"
                                >
                                {{ (pagination.from || 1) + index }}
                                </div>
                            </td>

                            <td
                                class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2"
                            >
                                <div
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-800/50 dark:bg-indigo-950/50 dark:text-indigo-400 print:hidden float-left mr-3"
                                >
                                <i class="fa-solid fa-calendar-day text-xs"></i>
                                </div>
                                <div
                                class="text-xs font-bold text-slate-800 dark:text-slate-100"
                                >
                                {{ formatDate(day.date) }}
                                </div>
                                <div
                                class="text-[10px] text-slate-400 dark:text-slate-500"
                                >
                                {{ day.date }}
                                </div>
                            </td>

                            <td class="px-6 py-4 text-center print:px-3 print:py-2">
                                <span
                                class="inline-flex min-w-[42px] items-center justify-center rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-black text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                                >
                                {{ formatNumber(day.total_payments) }}
                                </span>
                            </td>

                            <td
                                class="px-6 py-4 whitespace-nowrap text-right print:px-3 print:py-2"
                            >
                                <div
                                class="text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono"
                                >
                                ৳ {{ formatCurrency(day.total_amount) }}
                                </div>
                            </td>
                            </tr>
                        </template>

                        <tr v-else>
                            <td colspan="4" class="px-6 py-12 text-center">
                            <div
                                v-if="loading"
                                class="w-full flex flex-col items-center justify-center py-10"
                            >
                                <div
                                class="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full"
                                ></div>
                                <p
                                class="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium"
                                >
                                Loading sales report...
                                </p>
                            </div>
                            <div
                                v-else
                                class="flex flex-col items-center justify-center max-w-xs mx-auto py-6"
                            >
                                <div
                                class="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-3 ring-8 ring-slate-50 dark:ring-slate-900/50 flex items-center justify-center w-12 h-12"
                                >
                                <i class="fas fa-calendar-xmark text-lg"></i>
                                </div>
                                <h3
                                class="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1"
                                >
                                No sales record found
                                </h3>
                                <p
                                class="text-[11px] text-slate-400 dark:text-slate-500"
                                >
                                {{ errorMsg || "Try adjusting your date filter." }}
                                </p>
                            </div>
                            </td>
                        </tr>
                        </tbody>

                        <!-- Report Totals Footer -->
                        <tfoot
                        v-if="days && days.length > 0"
                        class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 print:bg-slate-100 print:border-slate-400"
                        >
                        <tr>
                            <td
                            colspan="2"
                            class="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                            >
                            Page Total ({{ days.length }} days)
                            </td>
                            <td
                            class="px-6 py-4 text-center text-sm font-black text-indigo-700 dark:text-indigo-400 print:px-3 print:py-2"
                            >
                            {{ formatNumber(pageTotals.payments) }}
                            </td>
                            <td
                            class="px-6 py-4 text-right text-sm font-black text-slate-900 dark:text-white font-mono print:px-3 print:py-2"
                            >
                            ৳ {{ formatCurrency(pageTotals.amount) }}
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                    </div>
                </div>

                <!-- Pagination -->
                <div
                    class="flex flex-col gap-2 border-slate-200 bg-white dark:bg-slate-900 shadow-sm px-4 py-3 sm:flex-row sm:items-center sm:justify-between print:hidden"
                >
                    <p class="text-xs text-slate-500">
                    Showing
                    <span class="font-semibold text-slate-700">{{
                        pagination.from
                    }}</span>
                    –
                    <span class="font-semibold text-slate-700">{{
                        pagination.to
                    }}</span>
                    of
                    <span class="font-semibold text-slate-700">{{
                        pagination.total
                    }}</span>
                    </p>

                    <div class="flex flex-wrap items-center justify-end gap-2">
                    <button
                        @click="changePage(1)"
                        :disabled="pagination.page === 1 || loading"
                        class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                        <i class="fa-solid fa-angles-left"></i>
                    </button>
                    <button
                        @click="changePage(pagination.page - 1)"
                        :disabled="pagination.page === 1 || loading"
                        class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                        v-for="page in visiblePages"
                        :key="String(page)"
                        @click="page !== '...' && changePage(page)"
                        class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                        :disabled="page === '...' || loading"
                        :class="[
                        page === pagination.page
                            ? 'border-slate-900 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                            : 'border-slate-200 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 hover:bg-slate-50',
                        ]"
                    >
                        {{ page }}
                    </button>
                    <button
                        @click="changePage(pagination.page + 1)"
                        :disabled="pagination.page === pagination.lastPage || loading"
                        class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                        <i class="fa-solid fa-angle-right"></i>
                    </button>
                    <button
                        @click="changePage(pagination.lastPage)"
                        :disabled="pagination.page === pagination.lastPage || loading"
                        class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                        <i class="fa-solid fa-angles-right"></i>
                    </button>
                    </div>
                </div>
                </main>
            </div>
        </div>
        <FooterSection />
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import api from "../../../../services/api.js";

import Navbar from "../../admin/admin-navbar.vue";
import HeaderSection from "../../admin/admin-header.vue";
import Message from "../../../Message/message.vue";
import FooterSection from "../../../footer.vue";

const mobileMenu = ref(false);
function toggleMenu() {
  mobileMenu.value = !mobileMenu.value;
}

const sidebarOpen = ref(false);
const successMsg = ref("");
const errorMsg = ref("");
const loading = ref(false);

/* =============================================================
   State — matches ReportController::dayByDaySaleReport() response
============================================================= */
const summary = ref({
  total_amount: 0,
  total_payments: 0,
  total_days: 0,
  average_per_day: 0,
});

const days = ref([]); // data.days.data

const pagination = ref({
  page: 1,
  lastPage: 1,
  total: 0,
  perPage: 20,
  from: 0,
  to: 0,
});

/* =============================================================
   Filters
============================================================= */
const today = new Date().toISOString().split("T")[0];
const startDate = ref(today);
const endDate = ref(today);

const isFilterActive = computed(
  () => startDate.value !== today || endDate.value !== today,
);

/* =============================================================
   Fetch Day-by-Day Sales Report
============================================================= */
async function fetchData(page = 1) {
  try {
    loading.value = true;
    errorMsg.value = "";
    successMsg.value = "";

    const res = await api.get("/reports/day-by-day", {
      params: {
        page,
        start_date: startDate.value || undefined,
        end_date: endDate.value || undefined,
      },
    });

    const data = res.data?.data;

    summary.value = {
      total_amount: Number(data?.summary?.total_amount ?? 0),
      total_payments: Number(data?.summary?.total_payments ?? 0),
      total_days: Number(data?.summary?.total_days ?? 0),
      average_per_day: Number(data?.summary?.average_per_day ?? 0),
    };

    days.value = Array.isArray(data?.days?.data) ? data.days.data : [];

    pagination.value = {
      page: data?.days?.current_page ?? 1,
      lastPage: data?.days?.last_page ?? 1,
      total: data?.days?.total ?? 0,
      perPage: data?.days?.per_page ?? 20,
      from: data?.days?.from ?? 0,
      to: data?.days?.to ?? 0,
    };
  } catch (error) {
    console.error(
      "Day-by-day report fetch error:",
      error?.response?.data || error,
    );

    errorMsg.value =
      error?.response?.data?.message || "Failed to fetch sales report.";

    days.value = [];
    summary.value = {
      total_amount: 0,
      total_payments: 0,
      total_days: 0,
      average_per_day: 0,
    };
    pagination.value = {
      page: 1,
      lastPage: 1,
      total: 0,
      perPage: 20,
      from: 0,
      to: 0,
    };
  } finally {
    loading.value = false;
  }
}

function changePage(page) {
  if (
    page === "..." ||
    page < 1 ||
    page > pagination.value.lastPage ||
    page === pagination.value.page
  )
    return;
  fetchData(page);
}

function applyFilters() {
  fetchData(1);
}

function resetFilters() {
  startDate.value = today;
  endDate.value = today;
  fetchData(1);
}

/* =============================================================
   Page-level totals (sum of currently loaded rows)
============================================================= */
const pageTotals = computed(() => {
  let amount = 0;
  let payments = 0;

  for (const d of days.value) {
    amount += Number(d.total_amount || 0);
    payments += Number(d.total_payments || 0);
  }

  return { amount, payments };
});

/* =============================================================
   Pagination visible pages
============================================================= */
const visiblePages = computed(() => {
  const pages = [];
  const last = pagination.value.lastPage;
  const cur = pagination.value.page;

  if (last <= 5) {
    for (let i = 1; i <= last; i++) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (cur > 3) pages.push("...");

  const start = Math.max(2, cur - 1);
  const end = Math.min(last - 1, cur + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (cur < last - 2) pages.push("...");
  pages.push(last);

  return pages;
});

/* =============================================================
   Display helpers
============================================================= */
function formatDate(date) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(value) {
  return Number(value ?? 0).toLocaleString("en-US");
}

function formatCurrency(value) {
  return Number(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* =============================================================
   Dark / light mode
============================================================= */
const isDark = ref(false);
function applyTheme(dark) {
  isDark.value = dark;
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}
function toggleDarkMode() {
  applyTheme(!isDark.value);
}

onMounted(() => {
  fetchData(1);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") sidebarOpen.value = false;
  });

  const saved = localStorage.getItem("theme");
  if (saved === "dark") applyTheme(true);
  else if (saved === "light") applyTheme(false);
  else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
});
</script>

<style></style>
