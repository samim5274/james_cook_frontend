<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <HeaderSection
            :is-dark="isDark"
            @toggle-dark="toggleDarkMode"
            @toggle-menu="toggleMenu"
        />

        <div class="flex  min-h-[calc(100vh-56px)]">
            <Navbar
                :mobile-menu="mobileMenu"
                @close="mobileMenu = false" />

            <Message
                :successMsg="successMsg"
                :errorMsg="errorMsg"
                @update:successMsg="successMsg = $event"
                @update:errorMsg="errorMsg = $event"
            />

            <!-- Content -->
            <div class="flex-1 min-w-0">
                <main class="flex-1 min-h-screen min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 py-5 print:bg-white print:px-0 print:py-0">

                    <!-- ============================== REPORT HEADER ============================== -->
                    <div class="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between print:rounded-none print:border-0 print:border-b-2 print:border-slate-900 print:p-0 print:pb-3 print:shadow-none">

                        <!-- LEFT -->
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 print:border print:border-slate-900 print:bg-white print:text-slate-900">
                                <i class="fa-solid fa-boxes-stacked text-base"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Product Sales Report</p>
                                <h1 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">Product Performance</h1>
                                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Aggregated product sales summary</p>
                            </div>
                        </div>

                        <!-- RIGHT -->
                        <div class="flex items-center gap-3">
                            <div class="hidden text-right sm:block">
                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Products Matched</p>
                                <p class="text-lg font-black text-slate-900 dark:text-white">
                                    {{ filteredProducts.length }}
                                    <span class="text-xs font-medium text-slate-400">/ {{ products.length }}</span>
                                </p>
                            </div>

                            <button type="button" @click="window.print()"
                                class="print:hidden flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                                <i class="fa-solid fa-print text-xs"></i>
                                Print / Export
                            </button>
                        </div>
                    </div>

                    <!-- ============================== SUMMARY CARDS ============================== -->
                    <div class="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 print:gap-2">

                        <div class="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Products</p>
                            <h4 class="mt-0.5 truncate text-lg font-black text-slate-900 dark:text-white">{{ formatNumber(productSummary.products) }}</h4>
                            <p class="text-[10px] font-medium text-slate-400 dark:text-slate-500">Products in report</p>
                        </div>

                        <div class="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Total Sales</p>
                            <h4 class="mt-0.5 truncate text-lg font-black text-indigo-600 dark:text-indigo-400">{{ formatNumber(productSummary.sales) }}</h4>
                            <p class="text-[10px] font-medium text-slate-400 dark:text-slate-500">Total sale transactions</p>
                        </div>

                        <div class="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Quantity Sold</p>
                            <h4 class="mt-0.5 truncate text-lg font-black text-blue-600 dark:text-blue-400">{{ formatNumber(productSummary.quantity) }}</h4>
                            <p class="text-[10px] font-medium text-slate-400 dark:text-slate-500">Total units sold</p>
                        </div>

                        <div class="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-3.5 shadow-sm transition-all hover:shadow-md dark:border-emerald-800/50 dark:bg-emerald-950/20 print:rounded-lg print:border-slate-900 print:bg-white print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500">Sales Amount</p>
                            <h4 class="mt-0.5 truncate text-lg font-black text-emerald-700 dark:text-emerald-400">৳ {{ formatCurrency(productSummary.amount) }}</h4>
                            <p class="text-[10px] font-medium text-emerald-600/70 dark:text-emerald-500/60">Total sales revenue</p>
                        </div>
                    </div>

                    <!-- ============================== FILTER PANEL ============================== -->
                    <div class="mb-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden">
                        <div class="space-y-3.5">

                            <div class="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800/60">
                                <div class="flex items-center gap-2">
                                    <div class="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                        <i class="fa-solid fa-sliders text-xs"></i>
                                    </div>
                                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Filter Products</h3>
                                </div>

                                <span v-if="searchQuery || statusFilter"
                                    class="inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-400">
                                    <span class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                    Filter Active
                                </span>
                            </div>

                            <div class="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">

                                <div class="md:col-span-10">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Search Product</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                            <i class="fa-solid fa-magnifying-glass text-sm"></i>
                                        </div>
                                        <input type="text" v-model="searchQuery" placeholder="Search by product name, SKU, code..."
                                            class="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800" />
                                    </div>
                                </div>

                                <div class="md:col-span-2">
                                    <button type="button" @click="resetFilters" :disabled="loading"
                                        class="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400">
                                        <i class="fa-solid fa-rotate-left text-xs"></i>
                                        <span>Reset</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ============================== PRODUCT REPORT TABLE ============================== -->
                    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-none print:border print:border-slate-400 print:shadow-none">
                        <div class="max-h-[1080px] overflow-x-auto print:max-h-none print:overflow-visible">
                            <table class="w-full border-collapse text-left">

                                <thead class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-800/80 print:static print:border-slate-400 print:bg-slate-100">
                                    <tr>
                                        <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">#</th>
                                        <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">Product</th>
                                        <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">SKU / Code</th>
                                        <th class="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">Sale Count</th>
                                        <th class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">Quantity Sold</th>
                                        <th class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">Discount</th>
                                        <th class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">Sales Amount</th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">

                                    <template v-if="filteredProducts && filteredProducts.length > 0">
                                        <tr v-for="(item, index) in filteredProducts" :key="item?.product_id ?? item?.product?.id ?? index"
                                            class="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 print:cursor-default"
                                            :class="index % 2 === 1 ? 'bg-slate-50/40 dark:bg-slate-800/20 print:bg-slate-50' : ''">

                                            <td class="whitespace-nowrap px-4 py-3 print:px-3 print:py-2">
                                                <div class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ (pagination.from || 1) + index }}</div>
                                            </td>

                                            <td class="px-4 py-3 print:px-3 print:py-2">
                                                <div class="flex items-center gap-2.5">
                                                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-800/50 dark:bg-indigo-950/50 dark:text-indigo-400 print:hidden">
                                                        <i class="fa-solid fa-box text-xs"></i>
                                                    </div>
                                                    <div class="min-w-0">
                                                        <div class="max-w-[250px] truncate text-xs font-bold text-slate-900 dark:text-slate-100">{{ getProductName(item) }}</div>
                                                        <div class="text-[10px] text-slate-400 dark:text-slate-500">Product ID: {{ item?.product_id ?? item?.product?.id ?? "-" }}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td class="whitespace-nowrap px-4 py-3 print:px-3 print:py-2">
                                                <span class="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 print:text-slate-900">{{ getProductSku(item) }}</span>
                                            </td>

                                            <td class="px-4 py-3 text-center print:px-3 print:py-2">
                                                <span class="inline-flex min-w-[42px] items-center justify-center rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-black text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400">
                                                    {{ formatNumber(getSaleCount(item)) }}
                                                </span>
                                            </td>

                                            <td class="whitespace-nowrap px-4 py-3 text-right font-mono text-xs font-bold text-slate-700 dark:text-slate-200 print:px-3 print:py-2">
                                                {{ formatNumber(getTotalQty(item)) }}
                                            </td>

                                            <td class="whitespace-nowrap px-4 py-3 text-right font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 print:px-3 print:py-2">
                                                ৳ {{ formatCurrency(getTotalDiscount(item)) }}
                                            </td>

                                            <td class="whitespace-nowrap px-4 py-3 text-right font-mono text-xs font-black text-emerald-700 dark:text-emerald-400 print:px-3 print:py-2">
                                                ৳ {{ formatCurrency(getTotalAmount(item)) }}
                                            </td>
                                        </tr>
                                    </template>

                                    <tr v-else>
                                        <td colspan="8" class="px-6 py-10 text-center">

                                            <div v-if="loading" class="flex w-full flex-col items-center justify-center py-8">
                                                <div class="h-8 w-8 animate-spin rounded-full border-3 border-indigo-500 border-t-transparent"></div>
                                                <p class="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Updating product report...</p>
                                            </div>

                                            <div v-else-if="errorMsg" class="mx-auto flex max-w-sm flex-col items-center justify-center py-5">
                                                <div class="mb-3 rounded-full bg-rose-50 p-3 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400">
                                                    <i class="fas fa-circle-exclamation text-lg"></i>
                                                </div>
                                                <h3 class="mb-1 text-xs font-bold text-slate-800 dark:text-slate-200">Failed to load report</h3>
                                                <p class="text-[11px] text-slate-400 dark:text-slate-500">{{ errorMsg }}</p>
                                                <button type="button" @click="fetchProductReports(1)"
                                                    class="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                                                    Try Again
                                                </button>
                                            </div>

                                            <div v-else class="mx-auto flex max-w-xs flex-col items-center justify-center py-5">
                                                <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 ring-8 ring-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-900/50">
                                                    <i class="fas fa-box-open text-lg"></i>
                                                </div>
                                                <h3 class="mb-1 text-xs font-bold text-slate-800 dark:text-slate-200">No product record found</h3>
                                                <p class="text-[11px] text-slate-400 dark:text-slate-500">Try adjusting your search query or filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>

                                <!-- TOTAL FOOTER -->
                                <tfoot v-if="filteredProducts && filteredProducts.length > 0"
                                    class="border-t-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 print:border-slate-400 print:bg-slate-100">
                                    <tr>
                                        <td colspan="3" class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">
                                            Total ({{ filteredProducts.length }} products)
                                        </td>
                                        <td class="px-4 py-3 text-center font-mono text-sm font-black text-indigo-700 dark:text-indigo-400 print:px-3 print:py-2">
                                            {{ formatNumber(productSummary.sales) }}
                                        </td>
                                        <td class="px-4 py-3 text-right font-mono text-sm font-black text-slate-900 dark:text-white print:px-3 print:py-2">
                                            {{ formatNumber(productSummary.quantity) }}
                                        </td>
                                        <td class="px-4 py-3 text-right font-mono text-sm font-black text-amber-600 dark:text-amber-400 print:px-3 print:py-2">
                                            ৳ {{ formatCurrency(productSummary.discount) }}
                                        </td>
                                        <td class="px-4 py-3 text-right font-mono text-sm font-black text-emerald-700 dark:text-emerald-400 print:px-3 print:py-2">
                                            ৳ {{ formatCurrency(productSummary.amount) }}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <!-- ============================== PAGINATION ============================== -->
                    <div class="flex flex-col gap-2 bg-white px-4 py-2.5 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between print:hidden">

                        <p class="text-xs text-slate-500">
                            Showing
                            <span class="font-semibold text-slate-700 dark:text-slate-200">{{ pagination.from }}</span>
                            –
                            <span class="font-semibold text-slate-700 dark:text-slate-200">{{ pagination.to }}</span>
                            of
                            <span class="font-semibold text-slate-700 dark:text-slate-200">{{ pagination.total }}</span>
                        </p>

                        <div class="flex flex-wrap items-center justify-end gap-1.5">

                            <button type="button" @click="changePage(1)" :disabled="pagination.page === 1 || loading || pagination.lastPage <= 1"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                                <i class="fa-solid fa-angles-left"></i>
                            </button>

                            <button type="button" @click="previousPage" :disabled="pagination.page === 1 || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>

                            <button v-for="page in visiblePages" :key="String(page)" type="button" @click="page !== '...' && changePage(page)" :disabled="page === '...' || loading"
                                class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                                :class="page === pagination.page ? 'border-slate-900 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'">
                                {{ page }}
                            </button>

                            <button type="button" @click="nextPage" :disabled="pagination.page === pagination.lastPage || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                                <i class="fa-solid fa-angle-right"></i>
                            </button>

                            <button type="button" @click="changePage(pagination.lastPage)" :disabled="pagination.page === pagination.lastPage || loading || pagination.lastPage <= 1"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
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
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../../../../services/api.js";

import Navbar from "../../admin/admin-navbar.vue";
import HeaderSection from "../../admin/admin-header.vue";
import Message from "../../../Message/message.vue";
import FooterSection from "../../../footer.vue";

// =====================================================
// Router / UI
// =====================================================
const router = useRouter();

const mobileMenu = ref(false);
const sidebarOpen = ref(false);

const successMsg = ref("");
const errorMsg = ref("");
const loading = ref(false);


// =====================================================
// Mobile Menu
// =====================================================
function toggleMenu() {
    mobileMenu.value = !mobileMenu.value;
}


// =====================================================
// Product Reports
// =====================================================
const products = ref([]);

const pagination = ref({
    page: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
    from: 0,
    to: 0,
});


// =====================================================
// Search & Filter
// =====================================================
const searchQuery = ref("");
const statusFilter = ref("");


// =====================================================
// Pagination Visible Pages
// =====================================================
const visiblePages = computed(() => {
    const pages = [];

    const last = Number(pagination.value.lastPage || 1);
    const current = Number(pagination.value.page || 1);

    if (last <= 5) {
        for (let i = 1; i <= last; i++) {
            pages.push(i);
        }

        return pages;
    }

    pages.push(1);

    if (current > 3) {
        pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < last - 2) {
        pages.push("...");
    }

    pages.push(last);

    return pages;
});


// =====================================================
// Fetch Product Reports
// =====================================================
async function fetchProductReports(page = 1) {
    if (loading.value) {
        return;
    }

    try {
        loading.value = true;
        errorMsg.value = "";
        successMsg.value = "";

        const response = await api.get("/reports/products", {
            params: {
                page: page,
                per_page: pagination.value.perPage,
            },
        });

        const data = response?.data;

        // -------------------------------------------------
        // Product Data
        // -------------------------------------------------
        products.value = Array.isArray(data?.data)
            ? data.data
            : [];

        // -------------------------------------------------
        // Pagination
        // -------------------------------------------------
        const meta =
            data?.pagination ||
            data?.meta ||
            {};

        pagination.value = {
            page: Number(
                meta.current_page ??
                meta.currentPage ??
                meta.page ??
                page
            ),

            lastPage: Number(
                meta.last_page ??
                meta.lastPage ??
                1
            ),

            total: Number(
                meta.total ??
                0
            ),

            perPage: Number(
                meta.per_page ??
                meta.perPage ??
                pagination.value.perPage ??
                20
            ),

            from: Number(
                meta.from ??
                0
            ),

            to: Number(
                meta.to ??
                0
            ),
        };

    } catch (error) {
        console.error(
            "Product report fetch error:",
            error?.response?.data || error
        );

        errorMsg.value =
            error?.response?.data?.message ||
            "Failed to fetch product reports.";

        products.value = [];

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

// =====================================================
// Get Product From Report Item
// =====================================================
function getProduct(item) {
    return item?.product || {};
}


// =====================================================
// Product Name
// =====================================================
function getProductName(item) {
    const product = getProduct(item);

    return (
        product?.name ||
        item?.product_name ||
        item?.name ||
        "Unknown Product"
    );
}


// =====================================================
// Product SKU
// =====================================================
function getProductSku(item) {
    const product = getProduct(item);

    return (
        product?.sku ||
        item?.sku ||
        product?.code ||
        item?.code ||
        "-"
    );
}


// =====================================================
// Total Sale Count
// =====================================================
function getSaleCount(item) {
    return Number(
        item?.sale_count ??
        item?.total_sales ??
        item?.sales_count ??
        item?.total_sale_count ??
        0
    );
}


// =====================================================
// Total Quantity Sold
// =====================================================
function getTotalQty(item) {
    return Number(
        item?.total_qty ??
        item?.quantity ??
        item?.total_quantity ??
        0
    );
}


// =====================================================
// Total Price
// =====================================================
function getTotalPrice(item) {
    return Number(
        item?.total_price ??
        item?.price ??
        0
    );
}


// =====================================================
// Total Discount
// =====================================================
function getTotalDiscount(item) {
    return Number(
        item?.total_discount ??
        item?.discount ??
        0
    );
}


// =====================================================
// Total Amount
// =====================================================
function getTotalAmount(item) {
    return Number(
        item?.total_amount ??
        item?.amount ??
        0
    );
}

// =====================================================
// Filter Products
// =====================================================
const filteredProducts = computed(() => {
    const search = String(searchQuery.value || "")
        .toLowerCase()
        .trim();


    return products.value.filter((item) => {

        // -------------------------------------------------
        // Searchable Values
        // -------------------------------------------------
        const searchableValues = [
            getProductName(item),
            getProductSku(item),

            item?.product_id,

            getTotalQty(item),
            getSaleCount(item),

            getTotalPrice(item),
            getTotalDiscount(item),
            getTotalAmount(item),

        ];


        const matchesSearch = searchableValues.some((value) => {

            if (
                value === null ||
                value === undefined
            ) {
                return false;
            }

            return String(value)
                .toLowerCase()
                .includes(search);
        });


        return (
            matchesSearch
        );
    });
});


// =====================================================
// Local Summary
// =====================================================
const productSummary = computed(() => {

    const list = filteredProducts.value || [];

    return {
        products: list.length,

        quantity: list.reduce(
            (sum, item) =>
                sum + getTotalQty(item),
            0
        ),

        sales: list.reduce(
            (sum, item) =>
                sum + getSaleCount(item),
            0
        ),

        amount: list.reduce(
            (sum, item) =>
                sum + getTotalAmount(item),
            0
        ),

        discount: list.reduce(
            (sum, item) =>
                sum + getTotalDiscount(item),
            0
        ),
    };
});


// =====================================================
// Change Page
// =====================================================
function changePage(page) {

    const targetPage = Number(page);

    if (
        page === "..." ||
        !Number.isInteger(targetPage) ||
        targetPage < 1 ||
        targetPage > Number(pagination.value.lastPage || 1) ||
        targetPage === Number(pagination.value.page || 1)
    ) {
        return;
    }

    fetchProductReports(targetPage);
}


// =====================================================
// Previous Page
// =====================================================
function previousPage() {

    const currentPage =
        Number(pagination.value.page || 1);

    if (currentPage > 1) {
        fetchProductReports(
            currentPage - 1
        );
    }
}


// =====================================================
// Next Page
// =====================================================
function nextPage() {

    const currentPage =
        Number(pagination.value.page || 1);

    const lastPage =
        Number(pagination.value.lastPage || 1);

    if (currentPage < lastPage) {
        fetchProductReports(
            currentPage + 1
        );
    }
}


// =====================================================
// Reset Filters
// =====================================================
function resetFilters() {
    searchQuery.value = "";
    statusFilter.value = "";
}


// =====================================================
// Format Date
// =====================================================
function formatDate(date) {

    if (!date) {
        return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "-";
    }

    return parsedDate.toLocaleDateString(
        "en-US",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
}


// =====================================================
// Format Number
// =====================================================
function formatNumber(value) {

    const number = Number(value ?? 0);

    return number.toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }
    );
}


// =====================================================
// Format Currency
// =====================================================
function formatCurrency(value) {

    const number = Number(value ?? 0);

    return number.toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );
}


// =====================================================
// Dark / Light Mode
// =====================================================
const isDark = ref(false);

function applyTheme(dark) {

    isDark.value = dark;

    document.documentElement.classList.toggle(
        "dark",
        dark
    );

    localStorage.setItem(
        "theme",
        dark ? "dark" : "light"
    );
}


function toggleDarkMode() {

    const dark =
        !isDark.value;

    applyTheme(dark);
}


// =====================================================
// Keyboard
// =====================================================
function handleKeydown(event) {

    if (event.key === "Escape") {
        sidebarOpen.value = false;
        mobileMenu.value = false;
    }
}


// =====================================================
// Mounted
// =====================================================
onMounted(() => {

    // Fetch product report
    fetchProductReports(1);


    // Keyboard event
    window.addEventListener(
        "keydown",
        handleKeydown
    );


    // Theme
    const saved =
        localStorage.getItem("theme");

    if (saved === "dark") {

        applyTheme(true);

    } else if (saved === "light") {

        applyTheme(false);

    } else {

        applyTheme(
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
        );
    }
});


// =====================================================
// Before Unmount
// =====================================================
onBeforeUnmount(() => {

    window.removeEventListener(
        "keydown",
        handleKeydown
    );
});
</script>

<style>

</style>