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
                <main class="flex-1 min-h-screen min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 lg:px-8 py-6">

                    

                    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div class="flex items-center gap-3">
                                <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Order Management</h1>
                                <span class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                                    {{ pagination.total }} Payments
                                </span>
                            </div>
                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor and manage your customer transactions and shipping status.</p>
                        </div>
                    </div>

                    <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
                        <div class="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
                            
                            <!-- Search Input Field -->
                            <div class="relative flex-1 w-full">
                                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                    <i class="fa-solid fa-magnifying-glass text-xs sm:text-sm"></i>
                                </div>
                                <input 
                                    type="text" 
                                    v-model="searchQuery" 
                                    placeholder="Search by ID, Customer name or Transaction..." 
                                    class="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                                />
                            </div>

                            <!-- Filters & Action Area -->
                            <div class="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-between lg:justify-end">
                                <div class="flex items-center gap-2 flex-1 sm:flex-initial min-w-0">
                                    <div class="hidden sm:flex items-center gap-1.5 shrink-0">
                                        <i class="fa-solid fa-filter text-xs text-slate-400 dark:text-slate-500"></i>
                                        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Type:</span>
                                    </div>

                                    <select 
                                        v-model="statusFilter" 
                                        class="w-full sm:w-auto sm:min-w-[150px] rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-300 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                                    >
                                        <option value="" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Statuses</option>
                                        <option value="payment" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Payment</option>
                                        <option value="refund" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Refund</option>
                                        <option value="adjustment" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Adjustment</option>
                                    </select>
                                </div>

                                <!-- Reset Button -->
                                <button 
                                    @click="resetFilters" 
                                    class="inline-flex items-center justify-center shrink-0 h-10 w-10 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-all active:scale-95"
                                    title="Reset Filters"
                                >
                                    <i class="fa-solid fa-rotate text-sm"></i>
                                </button>
                            </div>

                        </div>
                    </div>


                    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div class="overflow-x-auto max-h-[850px] scrollbar-thin">
                            <table class="w-full text-left border-collapse whitespace-nowrap">

                                <!-- TABLE HEADER -->
                                <thead class="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 sticky top-0 backdrop-blur-md z-10">
                                    <tr>
                                        <th class="pl-5 pr-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            Payment & Receipt
                                        </th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            Order / Customer
                                        </th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            Processed By
                                        </th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            Method & Type
                                        </th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            Date
                                        </th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">
                                            Amount (BDT)
                                        </th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <!-- TABLE BODY -->
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">

                                    <!-- SKELETON LOADING -->
                                    <tr
                                        v-if="loading"
                                        v-for="n in 5"
                                        :key="'skeleton-' + n"
                                        class="animate-pulse"
                                    >
                                        <td class="pl-5 pr-4 py-3">
                                            <div class="h-3.5 w-24 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
                                            <div class="h-2.5 w-20 bg-slate-100 dark:bg-slate-800 rounded mt-1.5"></div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="h-3 w-28 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
                                            <div class="h-2.5 w-24 bg-slate-100 dark:bg-slate-800 rounded mt-1.5"></div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="h-3 w-20 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
                                            <div class="h-2.5 w-16 bg-slate-100 dark:bg-slate-800 rounded mt-1.5"></div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="h-3 w-20 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
                                            <div class="h-2.5 w-16 bg-slate-100 dark:bg-slate-800 rounded mt-1.5"></div>
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="h-3 w-20 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
                                        </td>
                                        <td class="px-4 py-3 text-right">
                                            <div class="h-3.5 w-20 bg-slate-200 dark:bg-slate-700/60 rounded ml-auto"></div>
                                        </td>
                                    </tr>

                                    <!-- DATA ROWS -->
                                    <template v-else-if="orderPayments && orderPayments.length > 0">
                                        <tr
                                            v-for="payment in orderPayments"
                                            :key="payment.id"
                                            class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                                        >
                                            <!-- Payment Number & Receipt -->
                                            <td class="pl-5 pr-4 py-2.5">
                                                <div class="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {{ payment.payment_number || 'N/A' }}
                                                </div>
                                                <div class="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5 font-medium">
                                                    {{ payment.receipt_no || 'No Receipt' }}
                                                </div>
                                            </td>

                                            <!-- Customer & Order details -->
                                            <td class="px-4 py-2.5">
                                                <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                    {{ payment.order?.customer_name || 'Guest Customer' }}
                                                </div>
                                                <div class="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                                    {{ payment.order?.order_number || 'No Order' }}
                                                </div>
                                                <div class="text-[10px] text-slate-400 dark:text-slate-500">
                                                    {{ payment.order?.customer_phone || 'No Phone' }}
                                                </div>
                                            </td>

                                            <!-- User Info -->
                                            <td class="px-4 py-2.5">
                                                <div class="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    {{ payment.user?.name || 'System' }}
                                                </div>
                                                <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                                    {{ payment.user?.user_id || '' }}
                                                </div>
                                            </td>

                                            <!-- Payment Method & Type Badges -->
                                            <td class="px-4 py-2.5">
                                                <div class="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                                                    {{ payment.payment_method || 'N/A' }}
                                                </div>
                                                <div class="mt-0.5">
                                                    <span
                                                        class="text-[10px] font-semibold"
                                                        :class="{
                                                            'text-emerald-600 dark:text-emerald-400': payment.payment_type === 'payment',
                                                            'text-orange-600 dark:text-orange-400': payment.payment_type === 'refund',
                                                            'text-blue-600 dark:text-blue-400': payment.payment_type === 'adjustment'
                                                        }"
                                                    >
                                                        {{
                                                            {
                                                                payment: 'Payment',
                                                                refund: 'Refund',
                                                                adjustment: 'Adjustment'
                                                            }[payment.payment_type] || payment.payment_type || 'Unknown'
                                                        }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Date -->
                                            <td class="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                                                {{ payment.paid_at ? formatDate(payment.paid_at) : 'N/A' }}
                                                <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                                    {{ payment.remarks || '' }}
                                                </div>
                                            </td>

                                            <!-- Amount (BDT) -->
                                            <td class="px-4 py-2.5 text-right">
                                                <div
                                                    class="text-xs font-bold tabular-nums"
                                                    :class="{
                                                        'text-emerald-600 dark:text-emerald-400': payment.payment_type === 'payment',
                                                        'text-orange-600 dark:text-orange-400': payment.payment_type === 'refund',
                                                        'text-blue-600 dark:text-blue-400': payment.payment_type === 'adjustment'
                                                    }"
                                                >
                                                    {{ payment.payment_type === 'refund' ? '-' : '+' }}
                                                    ৳{{ Number(payment.amount || 0).toLocaleString('en-BD', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }) }}
                                                </div>
                                            </td>

                                            <td class="px-4 py-2 text-center whitespace-nowrap">
                                                <div class="inline-flex items-center p-1 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
                                                    <!-- Print Button -->
                                                    <button
                                                        type="button" @click.stop="printOrder(payment)"
                                                        title="Print Order"
                                                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 active:scale-95 transition-all duration-150"
                                                    >
                                                        <i class="fa-solid fa-print text-xs"></i>
                                                    </button>

                                                    <!-- Return Line -->
                                                    <!-- <div class="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-0.5"></div> -->

                                                    <!-- Return Button -->
                                                    <!-- <button
                                                        type="button" @click.stop="returnOrder(payment)"
                                                        title="Return Order"
                                                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-gray-700 active:scale-95 transition-all duration-150"
                                                    >
                                                        <i class="fa-solid fa-arrow-rotate-left text-xs"></i>
                                                    </button> -->
                                                </div>
                                            </td>
                                        </tr>
                                    </template>

                                    <!-- EMPTY STATE -->
                                    <tr v-else>
                                        <td colspan="6" class="px-6 py-16 text-center">
                                            <div class="flex flex-col items-center justify-center max-w-xs mx-auto text-slate-400 dark:text-slate-500">
                                                <i class="fa-solid fa-money-bill-transfer text-2xl mb-2"></i>
                                                <p class="text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-400">
                                                    No payment records found
                                                </p>
                                                <p class="text-[10px] mt-1 text-slate-400 dark:text-slate-500">
                                                    Try changing your search or payment type filter.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>


                    <!-- Pagination -->
                    <div class="flex flex-col gap-2 border-slate-200 bg-white dark:bg-slate-900 shadow-sm px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <!-- Showing info -->
                        <p class="text-xs text-slate-500">
                            Showing
                            <span class="font-semibold text-slate-700">{{ pagination.from }}</span>
                            –
                            <span class="font-semibold text-slate-700">{{ pagination.to }}</span>
                            of
                            <span class="font-semibold text-slate-700">{{ pagination.total }}</span>
                        </p>

                        <div class="flex flex-wrap items-center justify-end gap-2">
                            <!-- First -->
                            <button
                                @click="changePage(1)" :disabled="pagination.page === 1 || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                                <i class="fa-solid fa-angles-left"></i>
                            </button>

                            <!-- Prev -->
                            <button
                                @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1 || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>

                            <!-- Pages -->
                            <button
                                v-for="page in OrderVisiblePages"
                                :key="String(page)"
                                @click="page !== '...' && changePage(page)"
                                class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                                :disabled="page === '...' || loading"
                                :class="[
                                    page === pagination.page
                                        ? 'border-slate-900 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                                        : 'border-slate-200 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 hover:bg-slate-50'
                                ]">
                                {{ page }}
                            </button>

                            <!-- Next -->
                            <button
                                @click="changePage(pagination.page + 1)"
                                :disabled="pagination.page === pagination.lastPage || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                                <i class="fa-solid fa-angle-right"></i>
                            </button>

                            <!-- Last -->
                            <button
                                @click="changePage(pagination.lastPage)"
                                :disabled="pagination.page === pagination.lastPage || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
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
import { useRouter } from 'vue-router'
import api from '../../../../services/api.js'

import Navbar from "../../admin/admin-navbar.vue";
import HeaderSection from "../../admin/admin-header.vue";
import Message from '../../../Message/message.vue'
import FooterSection from "../../../footer.vue";



const mobileMenu = ref(false);

function toggleMenu() {
    mobileMenu.value = !mobileMenu.value;
}




const sidebarOpen = ref(false);
const active = ref("dashboard");
const router = useRouter();
const successMsg = ref('');
const errorMsg = ref('');
const search = ref('');

const loading = ref(false);





// =============================
// Get orders
// =============================
const OrderVisiblePages = computed(() => {
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

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (cur < last - 2) pages.push("...");

    pages.push(last);

    return pages;
});



const pagination = ref({
    page: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
    from: 0,
    to: 0,
});


const orderPayments = ref([]);
const searchQuery = ref('');
const statusFilter = ref('');

async function fetchOrderPayments(page = 1){
    loading.value = true;
    try{
        const res = await api.get('/orders/status', {
            params: { 
                page,
                search: searchQuery.value.trim(),
                status: statusFilter.value,
            }
        });
        const response = res.data;

        orderPayments.value = response?.data?.data ?? [];

        // PAGINATION META
        pagination.value = {
            page: response?.data?.current_page ?? 1,
            lastPage: response?.data?.last_page ?? 1,
            total: response?.data?.total ?? 0,
            perPage: response?.data?.per_page ?? 20,
            from: response?.data?.from ?? 0,
            to: response?.data?.to ?? 0,
        };
        // console.log(orderPayments.value);
    } catch(err){
        errorMsg.value = err || "Something is wrong to fetched orders.";

        orderPayments.value = [];

        pagination.value = {
            page: 1,
            lastPage: 1,
            total: 0,
            perPage: 20,
            from: 0,
            to: 0,
        };

        console.log(err);
    } finally {
        loading.value = false;
    }
}

let searchTimeout = null;

watch(searchQuery, () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        fetchOrderPayments(1);
    }, 500);
});

watch(statusFilter, () => {
    fetchOrderPayments(1);
});

const resetFilters = () => {
    clearTimeout(searchTimeout);

    searchQuery.value = '';
    statusFilter.value = '';

    fetchOrderPayments(1);
};

async function changePage(page) {
    if (
        page === '...' ||
        page === pagination.value.page ||
        page < 1 ||
        page > pagination.value.lastPage
    ) {
        return;
    }

    await fetchOrderPayments(page);
}

const formatDate = (date) => {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return 'N/A';
    }

    return parsedDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const filteredOrders = computed(() => {
    const search = searchQuery.value.toLowerCase().trim();
    const status = statusFilter.value.toLowerCase();

    return orderPayments.value.filter(payment => {

        const matchesStatus =
            !status ||
            payment.payment_type?.toLowerCase() === status;

        if (!search) {
            return matchesStatus;
        }

        const matchesSearch =
            payment.payment_number?.toLowerCase().includes(search) ||
            payment.receipt_no?.toLowerCase().includes(search) ||
            payment.payment_type?.toLowerCase().includes(search) ||
            payment.payment_method?.toLowerCase().includes(search) ||
            payment.order?.reg?.toLowerCase().includes(search) ||
            payment.order?.order_number?.toLowerCase().includes(search) ||
            payment.order?.customer_name?.toLowerCase().includes(search) ||
            payment.order?.customer_phone?.toLowerCase().includes(search) ||
            payment.user?.name?.toLowerCase().includes(search) ||
            String(payment.user?.user_id ?? '')
                .toLowerCase()
                .includes(search);

        return matchesStatus && matchesSearch;
    });
});

















// =============================
// Print / Download invoice
// =============================
function printOrder(payment) {
    // console.log(payment)
    const win = window.open("about:blank", "_blank");
    if(!win){
        alert("Popup blocked! Allow popups.");
        return;
    }
    
    win.location.href = `/admin/order/payment/invoice-print/${payment.payment_number}/${payment.order_id}`;
}










// =============================
// Return invoice
// =============================
async function returnOrder(payment) {
    const order = payment?.order;

    if (!order?.id || !order?.reg || !order?.slug) {
        errorMsg.value = 'Order information is not available.';
        return;
    }

    const confirmed = window.confirm(
        'Are you sure you want to return this order?'
    );

    if (!confirmed) {
        return;
    }

    loading.value = true;

    try {
        const res = await api.post(
            `/orders/return/${order.reg}/${order.slug}/${order.id}`
        );

        if (res.data?.success) {
            successMsg.value =
                res.data?.message ||
                'Order returned successfully.';

            errorMsg.value = '';

            await fetchOrderPayments(pagination.value.page);
        } else {
            errorMsg.value =
                res.data?.message ||
                'Failed to return order.';

            successMsg.value = '';
        }

    } catch (err) {

        console.error('Return Order Error:', err);

        errorMsg.value =
            err?.response?.data?.message ||
            err?.message ||
            'Something went wrong while returning the order.';

    } finally {
        loading.value = false;
    }
}









// dark and light mode
const isDark = ref(false);
function applyTheme(dark) {
    isDark.value = dark;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
}

function toggleTheme() {
    applyTheme(!isDark.value);
}

function toggleDarkMode() {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("dark",isDark.value);
    localStorage.setItem("theme",isDark.value ? "dark" : "light");
}

/* ESC to close drawer */
onMounted(() => {
    fetchOrderPayments();


    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") sidebarOpen.value = false;
    });

    const saved = localStorage.getItem("theme");
    if (saved === "dark") applyTheme(true);
    else if (saved === "light") applyTheme(false);
    else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
});
</script>

<style>

</style>