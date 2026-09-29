<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <HeaderSection
            :is-dark="isDark"
            @toggle-dark="toggleDarkMode"
            @toggle-menu="toggleMenu"
        />

        <div class="flex min-h-[calc(100vh-56px)]">
            <Navbar
                :mobile-menu="mobileMenu"
                @close="mobileMenu = false" />

            <Message
                :successMsg="successMsg"
                :errorMsg="errorMsg"
                @update:successMsg="successMsg = $event"
                @update:errorMsg="errorMsg = $event"
            />

            <div class="flex-1 min-w-0">
                <main class="flex-1 min-h-screen min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 lg:px-8 py-6 print:bg-white print:px-0 print:py-0">

                    <!-- ==================== REPORT LETTERHEAD ==================== -->
                    <div class="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between print:rounded-none print:border-0 print:border-b-2 print:border-slate-900 print:p-0 print:pb-4 print:shadow-none">
                        <div class="flex items-center gap-4">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 print:bg-white print:text-slate-900 print:border print:border-slate-900">
                                <i class="fa-solid fa-hand-holding-dollar text-lg"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Customer Accounts</p>
                                <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Customer Due Report</h1>
                                <p class="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Outstanding customer balances &middot; Page {{ pagination.page }} of {{ pagination.lastPage }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-3">
                            <div class="hidden text-right sm:block">
                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Customers With Due</p>
                                <p class="text-lg font-black text-slate-900 dark:text-white">
                                    {{ filteredCustomers.length }} <span class="text-xs font-medium text-slate-400">/ {{ pagination.total }}</span>
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

                    <!-- ==================== KPI CARDS ==================== -->
                    <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 print:gap-2">

                        <div class="relative overflow-hidden rounded-2xl border-2 border-rose-200 bg-rose-50/50 p-4 shadow-sm dark:border-rose-800/50 dark:bg-rose-950/20 print:rounded-lg print:border-slate-900 print:bg-white print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-500">Total Outstanding Due</p>
                            <h4 class="mt-1 truncate text-lg font-black text-rose-700 dark:text-rose-400">{{ money(totalDue) }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-rose-600/70 dark:text-rose-500/60">Total amount currently receivable</p>
                        </div>

                        <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Customers With Due</p>
                            <h4 class="mt-1 truncate text-lg font-black text-slate-900 dark:text-white">{{ totalCustomers }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Total customers</p>
                        </div>

                        <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Average Due</p>
                            <h4 class="mt-1 truncate text-lg font-black text-indigo-600 dark:text-indigo-400">{{ money(averageDue) }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Average outstanding balance</p>
                        </div>

                        <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">High Due (this page)</p>
                            <h4 class="mt-1 truncate text-lg font-black text-amber-600 dark:text-amber-400">{{ highDueCount }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Due ≥ &#2547; 10,000</p>
                        </div>

                    </div>

                    <!-- ==================== FILTER PANEL ==================== -->
                    <div class="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden">
                        <div class="space-y-5">

                            <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/60">
                                <div class="flex items-center gap-2">
                                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                        <i class="fa-solid fa-sliders text-xs"></i>
                                    </div>
                                    <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Filter Customers</h3>
                                </div>
                                <span v-if="searchQuery || statusFilter" class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
                                    <span class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                    Filter Active
                                </span>
                            </div>

                            <div class="flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800/60 lg:flex-row lg:items-end">

                                <div class="w-full lg:flex-1">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Search Customer</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                            <i class="fa-solid fa-magnifying-glass text-sm"></i>
                                        </div>
                                        <input type="text" v-model="searchQuery"
                                            placeholder="Search by customer name or phone..."
                                            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800" />
                                    </div>
                                </div>

                                <div class="w-full lg:w-[200px]">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Due Status</label>
                                    <select v-model="statusFilter"
                                        class="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:bg-slate-800">
                                        <option value="">All Statuses</option>
                                        <option value="due">Due</option>
                                        <option value="high">High Due (&#2547; 10,000+)</option>
                                    </select>
                                </div>

                                <div class="w-full lg:w-[200px]">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort By</label>
                                    <select v-model="sortBy"
                                        class="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:bg-slate-800">
                                        <option value="due_desc">Due: High to Low</option>
                                        <option value="due_asc">Due: Low to High</option>
                                        <option value="name_asc">Name: A to Z</option>
                                        <option value="name_desc">Name: Z to A</option>
                                    </select>
                                </div>

                                <div class="w-full lg:w-auto">
                                    <button type="button" @click="resetFilters" :disabled="loading"
                                        class="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
                                        <i class="fa-solid fa-rotate-left text-xs"></i>
                                        <span>Reset</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ==================== CUSTOMER DUE TABLE ==================== -->
                    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-none print:border print:border-slate-400 print:shadow-none">
                        <div class="max-h-[1080px] overflow-x-auto print:max-h-none print:overflow-visible">
                            <table class="w-full border-collapse text-left">
                                <thead class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-800/80 print:static print:border-slate-400 print:bg-slate-100">
                                    <tr>
                                        <th class="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">#</th>
                                        <th class="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">Customer</th>
                                        <th class="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">Phone</th>
                                        <th class="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">Payable</th>
                                        <th class="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">Total Due</th>
                                        <th class="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">Status</th>
                                        <th class="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">Action</th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                    <template v-if="filteredCustomers && filteredCustomers.length > 0">
                                        <tr v-for="(customer, index) in filteredCustomers" :key="customer.id"
                                            class="group cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                                            :class="index % 2 === 1 ? 'bg-slate-50/40 dark:bg-slate-800/20 print:bg-slate-50' : ''"
                                            @click="viewCustomerDetails(customer)">

                                            <td class="whitespace-nowrap px-6 py-4 print:px-3 print:py-2">
                                                <span class="text-xs font-bold text-slate-400">{{ pagination.from + index }}</span>
                                            </td>

                                            <td class="whitespace-nowrap px-6 py-4 print:px-3 print:py-2">
                                                <div class="flex items-center gap-3">
                                                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-black text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                                        {{ getCustomerInitial(customer.name) }}
                                                    </div>
                                                    <div>
                                                        <div class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ customer.name || "Walk-in Customer" }}</div>
                                                        <div class="text-[10px] text-slate-400 dark:text-slate-500">Customer ID: {{ customer.id }}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td class="whitespace-nowrap px-6 py-4 print:px-3 print:py-2">
                                                <span class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ customer.phone || "—" }}</span>
                                            </td>

                                            <td class="whitespace-nowrap px-6 py-4 text-right print:px-3 print:py-2">
                                                <div class="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">{{ money(customer.total_payable) }}</div>
                                            </td>

                                            <td class="whitespace-nowrap px-6 py-4 text-right print:px-3 print:py-2">
                                                <div class="font-mono text-sm font-black text-rose-600 dark:text-rose-400">{{ money(customer.total_due) }}</div>
                                                <div class="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-400">Outstanding</div>
                                            </td>

                                            <td class="whitespace-nowrap px-6 py-4 text-center print:px-3 print:py-2">
                                                <span :class="getDueStatus(customer.total_due).class"
                                                    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider print:border-slate-400">
                                                    <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                                                    {{ getDueStatus(customer.total_due).label }}
                                                </span>
                                            </td>

                                            <td class="whitespace-nowrap px-6 py-4 text-center print:px-3 print:py-2">
                                                <button type="button" @click.stop="viewCustomerDetails(customer)"
                                                    class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 print:hidden">
                                                    <i class="fa-solid fa-eye"></i>
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    </template>

                                    <tr v-else>
                                        <td colspan="7" class="px-6 py-12 text-center">
                                            <div v-if="loading" class="flex w-full flex-col items-center justify-center py-10">
                                                <div class="h-8 w-8 animate-spin rounded-full border-3 border-indigo-500 border-t-transparent"></div>
                                                <p class="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Loading customer due...</p>
                                            </div>
                                            <div v-else class="mx-auto flex max-w-xs flex-col items-center justify-center py-6">
                                                <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 p-3 text-slate-400 ring-8 ring-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-900/50">
                                                    <i class="fa-solid fa-hand-holding-dollar text-lg"></i>
                                                </div>
                                                <h3 class="mb-1 text-xs font-bold text-slate-800 dark:text-slate-200">No customer due found</h3>
                                                <p class="text-[11px] text-slate-400 dark:text-slate-500">{{ errorMsg || "No outstanding customer balance found." }}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>

                                <tfoot v-if="filteredCustomers && filteredCustomers.length > 0" class="border-t-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 print:border-slate-400 print:bg-slate-100">
                                    <tr>
                                        <td colspan="4" class="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">
                                            Current Page Total ({{ filteredCustomers.length }} customers)
                                        </td>
                                        <td class="px-6 py-4 text-right font-mono text-sm font-black text-rose-600 dark:text-rose-400 print:px-3 print:py-2">{{ money(pageDueTotal) }}</td>
                                        <td colspan="2" class="print:px-3 print:py-2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <!-- ==================== PAGINATION ==================== -->
                    <div class="flex flex-col gap-2 bg-white px-4 py-3 shadow-sm dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between print:hidden">
                        <p class="text-xs text-slate-500">
                            Showing
                            <span class="font-semibold text-slate-700 dark:text-slate-300">{{ pagination.from }}</span>
                            –
                            <span class="font-semibold text-slate-700 dark:text-slate-300">{{ pagination.to }}</span>
                            of
                            <span class="font-semibold text-slate-700 dark:text-slate-300">{{ pagination.total }}</span>
                        </p>

                        <div class="flex flex-wrap items-center justify-end gap-2">
                            <button @click="changePage(1)" :disabled="pagination.page === 1 || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                <i class="fa-solid fa-angles-left"></i>
                            </button>
                            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1 || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>
                            <button v-for="page in visiblePages" :key="String(page)" @click="page !== '...' && changePage(page)"
                                :disabled="page === '...' || loading"
                                class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                                :class="page === pagination.page
                                    ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'">
                                {{ page }}
                            </button>
                            <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.lastPage || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                <i class="fa-solid fa-angle-right"></i>
                            </button>
                            <button @click="changePage(pagination.lastPage)" :disabled="pagination.page === pagination.lastPage || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
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
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../../../../services/api.js";

import Navbar from "../../admin/admin-navbar.vue";
import HeaderSection from "../../admin/admin-header.vue";
import Message from "../../../Message/message.vue";
import FooterSection from "../../../footer.vue";


/* =============================================================
   Layout State
============================================================= */

const mobileMenu = ref(false);
const router = useRouter();

const successMsg = ref("");
const errorMsg = ref("");
const loading = ref(false);

function toggleMenu() {
    mobileMenu.value = !mobileMenu.value;
}


/* =============================================================
   Customer Due State
============================================================= */

const customers = ref([]);
const totalDue = ref(0);
const totalCustomers = ref(0);

const PER_PAGE = 20;

const pagination = ref({
    page: 1,
    lastPage: 1,
    total: 0,
    perPage: PER_PAGE,
    from: 0,
    to: 0,
});


/* =============================================================
   Filters
============================================================= */

const searchQuery = ref("");
const statusFilter = ref("");       // "", "due", "high"
const sortBy = ref("due_desc");     // due_desc | due_asc | name_asc | name_desc

let searchDebounce = null;


/* =============================================================
   Fetch Customer Due
============================================================= */

async function fetchCustomerDue(page = 1) {
    try {

        loading.value = true;
        errorMsg.value = "";

        const res = await api.get("/reports/customer/due", {
            params: {
                page,
                per_page: PER_PAGE,
                search: searchQuery.value?.trim() || undefined,
            },
        });

        const response = res?.data;

        if (!response?.success) {
            throw new Error(response?.message || "Request failed.");
        }

        customers.value = Array.isArray(response?.data?.data)
            ? response.data.data
            : [];

        totalDue.value = Number(response?.total_due ?? 0);

        totalCustomers.value = Number(
            response?.total_customers ?? response?.data?.total ?? 0
        );

        pagination.value = {
            page: Number(response?.data?.current_page ?? page),
            lastPage: Number(response?.data?.last_page ?? 1),
            total: Number(response?.data?.total ?? 0),
            perPage: Number(response?.data?.per_page ?? PER_PAGE),
            from: Number(response?.data?.from ?? 0),
            to: Number(response?.data?.to ?? 0),
        };

    } catch (err) {

        console.error("Failed to fetch customer due:", err?.response?.data || err);

        errorMsg.value =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch customer due.";

        customers.value = [];
        totalDue.value = 0;
        totalCustomers.value = 0;

        pagination.value = { ...pagination.value, total: 0, from: 0, to: 0 };

    } finally {

        loading.value = false;

    }
}


/* =============================================================
   Server-side Search (debounced)
============================================================= */

watch(searchQuery, () => {
    if (searchDebounce) clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => fetchCustomerDue(1), 400);
});


/* =============================================================
   Client-side Status Filter + Sort
   (applied on the already-loaded page, instant — no extra request)
============================================================= */

const filteredCustomers = computed(() => {

    let list = [...customers.value];

    if (statusFilter.value === "due") {
        list = list.filter((c) => Number(c.total_due ?? 0) > 0 && Number(c.total_due ?? 0) < 10000);
    } else if (statusFilter.value === "high") {
        list = list.filter((c) => Number(c.total_due ?? 0) >= 10000);
    }

    list.sort((a, b) => {
        switch (sortBy.value) {
            case "due_asc":
                return Number(a.total_due ?? 0) - Number(b.total_due ?? 0);
            case "name_asc":
                return String(a.name ?? "").localeCompare(String(b.name ?? ""));
            case "name_desc":
                return String(b.name ?? "").localeCompare(String(a.name ?? ""));
            case "due_desc":
            default:
                return Number(b.total_due ?? 0) - Number(a.total_due ?? 0);
        }
    });

    return list;
});


/* =============================================================
   Pagination
============================================================= */

function changePage(page) {

    if (page === "...") return;

    const target = Number(page);
    const current = Number(pagination.value.page);
    const last = Number(pagination.value.lastPage);

    if (!Number.isInteger(target) || target < 1 || target > last || target === current) {
        return;
    }

    fetchCustomerDue(target);
}

const visiblePages = computed(() => {

    const pages = [];
    const last = Number(pagination.value.lastPage);
    const current = Number(pagination.value.page);

    if (last <= 0) return [];

    if (last <= 5) {
        for (let i = 1; i <= last; i++) pages.push(i);
        return pages;
    }

    pages.push(1);
    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < last - 2) pages.push("...");
    pages.push(last);

    return pages;
});


/* =============================================================
   Reset Filters
============================================================= */

function resetFilters() {
    searchQuery.value = "";
    statusFilter.value = "";
    sortBy.value = "due_desc";
    fetchCustomerDue(1);
}


/* =============================================================
   Display Helpers
============================================================= */

function money(amount) {
    const value = Number(amount ?? 0);
    const safe = Number.isFinite(value) ? value : 0;
    return `৳ ${safe.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function getCustomerInitial(name) {
    if (!name) return "?";
    return String(name).trim().charAt(0).toUpperCase();
}

function getDueStatus(amount) {

    const due = Number(amount ?? 0);

    if (due <= 0) {
        return {
            label: "Clear",
            class: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
        };
    }

    if (due >= 10000) {
        return {
            label: "High Due",
            class: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
        };
    }

    return {
        label: "Due",
        class: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    };
}


/* =============================================================
   KPI Computed
============================================================= */

const averageDue = computed(() => {
    if (!totalCustomers.value) return 0;
    return totalDue.value / totalCustomers.value;
});

const highDueCount = computed(() =>
    filteredCustomers.value.filter((c) => Number(c.total_due ?? 0) >= 10000).length
);

const pageDueTotal = computed(() =>
    filteredCustomers.value.reduce((sum, c) => sum + Number(c.total_due ?? 0), 0)
);


/* =============================================================
   Navigation
============================================================= */

function viewCustomerDetails(customer) {
    if (!customer?.id) return;
    alert('Customer details page working in under maintenance');
    // router.push(`/admin/customer/due/details/${customer.id}`);
}


/* =============================================================
   Dark / Light Mode
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


/* =============================================================
   Mounted
============================================================= */

onMounted(() => {

    fetchCustomerDue(1);

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") mobileMenu.value = false;
    });

    const saved = localStorage.getItem("theme");

    if (saved === "dark") applyTheme(true);
    else if (saved === "light") applyTheme(false);
    else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);

});
</script>

<style>
</style>