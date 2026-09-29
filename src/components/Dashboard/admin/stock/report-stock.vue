<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <AdminHeader
            :is-dark="isDark"
            @toggle-dark="toggleDarkMode"
            @toggle-menu="toggleMenu" />

        <div class="flex">
            <AdminNavbar
                :mobile-menu="mobileMenu"
                @close="mobileMenu = false" />

            <Message
                :successMsg="successMsg"
                :errorMsg="errorMsg"
                @update:successMsg="successMsg = $event"
                @update:errorMsg="errorMsg = $event"
            />

            <div class="flex-1 min-w-0 flex flex-col">
                <div class="min-h-screen bg-slate-50/60 dark:bg-[#0f172e]">
                    <div class="mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">

                        <!-- ==================== STOCK SUMMARY CARDS ==================== -->
                        <div class="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5 print:grid-cols-5 print:gap-2">

                            <!-- TOTAL STOCK IN -->
                            <div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none print:hover:translate-y-0">
                                <p class="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500">Total Stock In</p>
                                <h4 class="mt-1 truncate text-lg font-black text-emerald-700 dark:text-emerald-400">{{ Number(summary.total_stock_in || 0).toLocaleString('en-BD') }}</h4>
                                <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Units received</p>
                            </div>

                            <!-- TOTAL STOCK OUT -->
                            <div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none print:hover:translate-y-0">
                                <p class="text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500">Total Stock Out</p>
                                <h4 class="mt-1 truncate text-lg font-black text-rose-700 dark:text-rose-400">{{ Number(summary.total_stock_out || 0).toLocaleString('en-BD') }}</h4>
                                <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Units sold / removed</p>
                            </div>

                            <!-- NET STOCK -->
                            <div class="group relative overflow-hidden rounded-2xl border-2 border-indigo-200/80 bg-indigo-50/40 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-indigo-800/50 dark:bg-indigo-950/20 print:rounded-lg print:border-slate-900 print:bg-white print:p-3 print:shadow-none print:hover:translate-y-0">
                                <p class="text-[9px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Net Stock</p>
                                <h4 class="mt-1 truncate text-lg font-black text-indigo-700 dark:text-indigo-400">{{ Number(summary.net_stock || 0).toLocaleString('en-BD') }}</h4>
                                <p class="mt-0.5 text-[10px] font-medium text-indigo-600/70 dark:text-indigo-500/60">Stock in − Stock out</p>
                            </div>

                            <!-- TOTAL PURCHASE VALUE -->
                            <div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none print:hover:translate-y-0">
                                <p class="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">Purchase Value</p>
                                <h4 class="mt-1 truncate text-lg font-black text-blue-700 dark:text-blue-400">৳ {{ Number(summary.total_purchase_value || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</h4>
                                <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Cost of stock received</p>
                            </div>

                            <!-- TOTAL STOCK OUT SALES VALUE -->
                            <div class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none print:hover:translate-y-0">
                                <p class="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Stock Out Value</p>
                                <h4 class="mt-1 truncate text-lg font-black text-amber-700 dark:text-amber-400">৳ {{ Number(summary.total_stock_out_sales_value || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</h4>
                                <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Sales value of stock removed</p>
                            </div>

                        </div>

                        <!-- ==================== FILTER PANEL (hidden on print) ==================== -->
                        <div class="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 print:hidden">
                            <div class="space-y-5">

                                <!-- Header -->
                                <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/60">
                                    <div class="flex items-center gap-2.5">
                                        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                            <i class="fa-solid fa-sliders text-xs"></i>
                                        </div>

                                        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                            Filter Report
                                        </h3>
                                    </div>

                                    <span
                                        v-if="isFilterActive"
                                        class="inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-400"
                                    >
                                        <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"></span>
                                        Filter Active
                                    </span>
                                </div>

                                <!-- Date Filters & Actions -->
                                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-12 md:items-end md:gap-4">

                                    <!-- Start Date -->
                                    <div class="md:col-span-4">
                                        <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            Start Date
                                        </label>

                                        <div class="relative">
                                            <input
                                                type="date"
                                                v-model="startDate"
                                                :max="endDate || today"
                                                class="input pl-10"
                                            />
                                        </div>
                                    </div>

                                    <!-- End Date -->
                                    <div class="md:col-span-4">
                                        <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            End Date
                                        </label>

                                        <div class="relative">
                                            <input
                                                type="date"
                                                v-model="endDate"
                                                :min="startDate || undefined"
                                                :max="today"
                                                class="input pl-10"
                                            />
                                        </div>
                                    </div>

                                    <!-- Action Buttons Group -->
                                    <div class="flex items-center gap-2 md:col-span-4">
                                        <!-- Apply (Primary Action) -->
                                        <button
                                            type="button"
                                            @click="applyFilters"
                                            :disabled="loading"
                                            class="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-600 bg-indigo-600 px-4 text-xs font-bold text-white shadow-sm transition-all hover:border-indigo-700 hover:bg-indigo-700 hover:shadow focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <i v-if="!loading" class="fa-solid fa-magnifying-glass text-xs"></i>
                                            <i v-else class="fa-solid fa-spinner animate-spin text-xs"></i>
                                            <span>{{ loading ? 'Filtering...' : 'Apply' }}</span>
                                        </button>

                                        <!-- Print -->
                                        <button
                                            type="button"
                                            @click="printReport"
                                            :disabled="loading"
                                            class="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                            title="Print Report"
                                        >
                                            <i class="fa-solid fa-print text-xs"></i>
                                            <span class="hidden sm:inline">Print</span>
                                        </button>

                                        <!-- Reset -->
                                        <button
                                            type="button"
                                            @click="resetFilters"
                                            :disabled="loading"
                                            class="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50/50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-rose-500/30 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                            title="Reset Filters"
                                        >
                                            <i class="fa-solid fa-rotate-left text-xs"></i>
                                            <span class="hidden sm:inline">Reset</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- Search & Pagination -->
                                <div class="flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800/60 sm:flex-row sm:items-end">

                                    <!-- Product Search -->
                                    <div class="w-full sm:flex-1">
                                        <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            Search Product
                                        </label>

                                        <div class="relative">
                                            <input
                                                type="text"
                                                v-model="searchQuery"
                                                @keyup.enter="applyFilters"
                                                placeholder="Search by product name..."
                                                class="input pl-10 pr-9"
                                            />

                                            <button
                                                v-if="searchQuery"
                                                type="button"
                                                @click="searchQuery = ''; applyFilters()"
                                                class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-rose-500 dark:hover:text-rose-400"
                                                title="Clear search"
                                            >
                                                <i class="fa-solid fa-xmark text-xs"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Per Page -->
                                    <div class="w-full sm:w-44">
                                        <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                            Per Page
                                        </label>

                                        <div class="relative">
                                            <select
                                                v-model.number="perPage"
                                                @change="applyFilters"
                                                class="input cursor-pointer pl-10"
                                            >
                                                <option :value="10">10 Rows</option>
                                                <option :value="20">20 Rows</option>
                                                <option :value="50">50 Rows</option>
                                                <option :value="100">100 Rows</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <!-- ==================== STOCK LEDGER TABLE ==================== -->
                        <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm">
                            <div class="max-h-[48rem] overflow-y-auto custom-scrollbar">
                                <table class="w-full text-left border-collapse">
                                    <thead class="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                        <tr>
                                            <th class="p-3.5 pl-5">Date</th>
                                            <th class="p-3.5">Product</th>
                                            <th class="p-3.5 text-right">Stock In</th>
                                            <th class="p-3.5 text-right">Stock Out</th>
                                            <th class="p-3.5 text-right">Balance</th>
                                            <th class="p-3.5 pr-5">Remark</th>
                                        </tr>
                                    </thead>

                                    <!-- Skeleton Loading -->
                                    <tbody v-if="loading" class="divide-y divide-slate-100 dark:divide-slate-800/50 animate-pulse">
                                        <tr v-for="i in 5" :key="i">
                                            <td class="p-3.5 pl-5"><div class="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-20"></div></td>
                                            <td class="p-3.5"><div class="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-44"></div></td>
                                            <td class="p-3.5"><div class="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-12 ml-auto"></div></td>
                                            <td class="p-3.5"><div class="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-12 ml-auto"></div></td>
                                            <td class="p-3.5"><div class="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-12 ml-auto"></div></td>
                                            <td class="p-3.5 pr-5"><div class="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-28"></div></td>
                                        </tr>
                                    </tbody>

                                    <!-- Data Rows -->
                                    <tbody v-else-if="stocks.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs text-slate-700 dark:text-slate-300">
                                        <tr v-for="row in stocks" :key="row.id" class="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-colors">
                                            <td class="p-3.5 pl-5 whitespace-nowrap">
                                                <div class="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                                                    <span class="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                                        #{{ row.reg ?? 'N/A' }}
                                                    </span>
                                                </div>
                                                <div class="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                                    <i class="fa-regular fa-clock text-[10px]"></i>
                                                    <span>{{ formatDateTime(row.date) }}</span>
                                                </div>
                                            </td>
                                            <td class="p-3.5">
                                                <div class="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[240px]" :title="row.product?.name">
                                                    {{ row.product?.name ?? 'N/A' }}
                                                </div>
                                            </td>
                                            <td class="p-3.5 text-right font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                                {{ row.stockIn > 0 ? `+${row.stockIn}` : '-' }}
                                            </td>
                                            <td class="p-3.5 text-right font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                                                {{ row.stockOut > 0 ? `-${row.stockOut}` : '-' }}
                                            </td>
                                            <td class="p-3.5 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                {{ row.stockIn - row.stockOut }}
                                            </td>
                                            <td class="p-3.5 pr-5 text-slate-500 truncate max-w-[200px]">{{ row.remark || '-' }}</td>
                                        </tr>
                                    </tbody>

                                    <!-- Empty State -->
                                    <tbody v-else>
                                        <tr>
                                            <td colspan="6" class="py-12 text-center">
                                                <div class="max-w-xs mx-auto flex flex-col items-center justify-center">
                                                    <div class="relative mb-3 flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 text-slate-400 dark:text-slate-500">
                                                        <i class="fa-solid fa-box-open text-xl"></i>
                                                    </div>
                                                    <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200">No Stock Records Found</h3>
                                                    <p class="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Try adjusting your filters or date range.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- ==================== PROFESSIONAL PAGINATION ==================== -->
                            <div v-if="pagination.total > 0" class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 dark:border-slate-800/60 px-4 py-3 text-xs bg-slate-50/50 dark:bg-slate-900/40">
                                
                                <!-- Record Summary Text -->
                                <div class="text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
                                    Showing <span class="font-semibold text-slate-700 dark:text-slate-200">{{ paginationRange.from }}</span> to 
                                    <span class="font-semibold text-slate-700 dark:text-slate-200">{{ paginationRange.to }}</span> of 
                                    <span class="font-semibold text-slate-700 dark:text-slate-200">{{ pagination.total }}</span> results
                                </div>

                                <!-- Page Navigation Controls -->
                                <div class="flex items-center justify-center gap-1">
                                    
                                    <!-- First Page -->
                                    <button 
                                        type="button" 
                                        :disabled="pagination.current_page <= 1 || loading" 
                                        @click="goToPage(1)"
                                        class="p-2 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                        title="First Page"
                                    >
                                        <i class="fa-solid fa-angles-left text-[10px]"></i>
                                    </button>

                                    <!-- Prev Page -->
                                    <button 
                                        type="button" 
                                        :disabled="pagination.current_page <= 1 || loading" 
                                        @click="goToPage(pagination.current_page - 1)"
                                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
                                    >
                                        <i class="fa-solid fa-chevron-left text-[10px]"></i>
                                        <span class="hidden sm:inline">Prev</span>
                                    </button>

                                    <!-- Page Number Buttons -->
                                    <template v-for="(page, index) in visiblePages" :key="index">
                                        <span v-if="page === '...'" class="px-2 py-1 text-slate-400 dark:text-slate-600 select-none">...</span>
                                        <button 
                                            v-else 
                                            type="button" 
                                            @click="goToPage(page)"
                                            :class="[
                                                'h-8 min-w-[32px] px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center',
                                                pagination.current_page === page
                                                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                                                    : 'border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                            ]"
                                        >
                                            {{ page }}
                                        </button>
                                    </template>

                                    <!-- Next Page -->
                                    <button 
                                        type="button" 
                                        :disabled="pagination.current_page >= pagination.last_page || loading" 
                                        @click="goToPage(pagination.current_page + 1)"
                                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
                                    >
                                        <span class="hidden sm:inline">Next</span>
                                        <i class="fa-solid fa-chevron-right text-[10px]"></i>
                                    </button>

                                    <!-- Last Page -->
                                    <button 
                                        type="button" 
                                        :disabled="pagination.current_page >= pagination.last_page || loading" 
                                        @click="goToPage(pagination.last_page)"
                                        class="p-2 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                        title="Last Page"
                                    >
                                        <i class="fa-solid fa-angles-right text-[10px]"></i>
                                    </button>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    </div>
    <FooterSection />
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import api from "../../../../services/api.js";

import AdminNavbar from '../admin-navbar.vue';
import AdminHeader from '../admin-header.vue';
import Message from '../../../Message/message.vue';
import FooterSection from "../../../footer.vue";

const mobileMenu = ref(false);
function toggleMenu() {
    mobileMenu.value = !mobileMenu.value;
}

const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

// Today's date (yyyy-mm-dd)
const today = new Date().toISOString().split('T')[0];

// Filter State
const startDate = ref(today);
const endDate = ref(today);
const searchQuery = ref('');
const perPage = ref(20);
const currentPage = ref(1);

const isFilterActive = computed(() =>
    !!(startDate.value || endDate.value || searchQuery.value)
);

// Data State
const stocks = ref([]);
const summary = ref({
    total_stock_in: 0,
    total_stock_out: 0,
    net_stock: 0,
    total_purchase_value: 0,
    total_stock_out_cost: 0,
    total_stock_out_sales_value: 0,
});
const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
});

// Calculate Showing X to Y of Z
const paginationRange = computed(() => {
    if (!pagination.value.total) return { from: 0, to: 0 };
    const from = (pagination.value.current_page - 1) * perPage.value + 1;
    const to = Math.min(pagination.value.current_page * perPage.value, pagination.value.total);
    return { from, to };
});

// Dynamic Smart Page Numbers with Ellipsis (...)
const visiblePages = computed(() => {
    const current = pagination.value.current_page;
    const last = pagination.value.last_page;
    const delta = 1;
    const pages = [];

    if (last <= 1) return [];

    let left = current - delta;
    let right = current + delta + 1;

    for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= left && i < right)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }

    return pages;
});

// Fetch Data API Call
async function fetchData() {
    loading.value = true;
    errorMsg.value = '';
    try {
        const params = {
            per_page: perPage.value,
            page: currentPage.value,
        };
        if (startDate.value) params.start_date = startDate.value;
        if (endDate.value) params.end_date = endDate.value;
        if (searchQuery.value) params.search = searchQuery.value;

        const res = await api.get('/stock/report', { params });

        if (res.data?.success) {
            const paginator = res.data.data;
            stocks.value = paginator?.data ?? [];
            pagination.value = {
                current_page: paginator?.current_page ?? 1,
                last_page: paginator?.last_page ?? 1,
                total: paginator?.total ?? 0,
            };
            summary.value = res.data.summary ?? summary.value;
        } else {
            errorMsg.value = res.data?.message || "Failed to fetch stock report";
        }
    } catch (err) {
        console.error(err);
        errorMsg.value = err.response?.data?.message || err.message || "Something went wrong";
    } finally {
        loading.value = false;
    }
}

function applyFilters() {
    currentPage.value = 1;
    fetchData();
}

async function printReport() {
    loading.value = true;
    try {
        const startVal = typeof startDate !== 'undefined' ? startDate.value : (typeof filter !== 'undefined' ? filter.startDate : null);
        const endVal = typeof endDate !== 'undefined' ? endDate.value : (typeof filter !== 'undefined' ? filter.endDate : null);
        const searchVal = typeof searchQuery !== 'undefined' ? searchQuery.value : (typeof filter !== 'undefined' ? filter.searchQuery : null);

        let currentPageNum = 1;
        let lastPageNum = 1;
        let allStocks = [];
        let printSummary = {};

        do {
            const params = {
                per_page: 100, 
                page: currentPageNum,
            };

            if (startVal) params.start_date = startVal;
            if (endVal) params.end_date = endVal;
            if (searchVal) params.search = searchVal;

            const res = await api.get('/stock/report', { params });

            if (res.data?.success) {
                const paginator = res.data.data;
                const pageItems = paginator?.data ?? [];
                
                allStocks = [...allStocks, ...pageItems];
                lastPageNum = paginator?.last_page ?? 1;
                printSummary = res.data.summary ?? printSummary;

                currentPageNum++;
            } else {
                throw new Error(res.data?.message || "Failed to fetch stock report");
            }

        } while (currentPageNum <= lastPageNum);

        const printData = {
            startDate: startVal,
            endDate: endVal,
            searchQuery: searchVal,
            summary: printSummary,
            items: allStocks
        };

        localStorage.setItem('print_report_data', JSON.stringify(printData));

        const printWindow = window.open('/admin/stock-report-print', '_blank');
        if (!printWindow || printWindow.closed || typeof printWindow.closed === 'undefined') {
            alert('Please allow popups for this website to print the report.');
        }

    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || err.message || "Failed to fetch all data for print");
    } finally {
        loading.value = false;
    }
}

function resetFilters() {
    startDate.value = today;
    endDate.value = today;
    searchQuery.value = '';
    perPage.value = 20;
    currentPage.value = 1;
    fetchData();
}

function goToPage(page) {
    if (page === '...' || page < 1 || page > pagination.value.last_page || page === pagination.value.current_page) return;
    currentPage.value = page;
    fetchData();
}


// Date Time Format Helper Function
function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
}













// Dark / Light Mode Logic
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
    fetchData();

    const saved = localStorage.getItem("theme");
    if (saved === "dark") applyTheme(true);
    else if (saved === "light") applyTheme(false);
    else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
});
</script>

<style scoped>
.input {
    @apply w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-sm font-medium text-slate-800 outline-none transition-all
        hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10
        dark:border-slate-700/80 dark:bg-slate-800/40 dark:text-slate-100 dark:hover:bg-slate-800/60
        dark:focus:border-indigo-500 dark:focus:bg-slate-800 h-10;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-slate-300 dark:bg-slate-700 rounded-full;
}
</style>