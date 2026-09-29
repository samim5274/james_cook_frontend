<template>
    <main class="min-h-screen bg-gray-50 dark:bg-[#0C1326]">
        <div class="mx-auto px-4 sm:px-6 lg:px-8 py-5">

            <!-- Top bar (Title + optional actions/search) -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard Overview</h1>
                    <p class="text-sm text-gray-700 dark:text-slate-300">Ogrova Online Business summary & performance</p>
                </div>

                <!-- Optional: right side button -->
                <div class="flex items-center gap-3">
                    <button class="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-white/10 
                    dark:text-white border border-white/10 hover:bg-white/15 transition">Export</button>
                </div>
            </div>

            <!-- Loading & Error Alert -->
            <div v-if="loading" class="mt-4 text-center py-4 text-slate-500">
                <!-- Dashboard Skeleton Loader -->
                <div class="space-y-8 mb-8 animate-pulse">

                    <!-- ================= SECTION 1: PRIMARY FINANCIAL OVERVIEW SKELETON ================= -->
                    <div class="space-y-6">
                        <!-- 4 Big Cards Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div v-for="i in 4" :key="'fin-main-' + i" class="rounded-2xl border border-slate-200/60 bg-white dark:bg-slate-900 dark:border-slate-800/80 p-6 shadow-sm">
                                <div class="flex flex-col justify-between min-h-[140px]">
                                    <!-- Header -->
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2.5">
                                            <div class="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                                            <div class="h-3.5 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        </div>
                                        <div class="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                                    </div>
                                    <!-- Value -->
                                    <div class="my-4 flex items-center gap-2">
                                        <div class="h-6 w-5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        <div class="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                    </div>
                                    <!-- Footer -->
                                    <div class="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                        <div class="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        <div class="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 4 Mini Analytic Cards Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div v-for="i in 4" :key="'fin-sub-' + i" class="rounded-xl border border-slate-200/60 bg-white dark:bg-slate-900/40 dark:border-slate-800/60 p-5">
                                <div class="flex items-center gap-3">
                                    <div class="h-10 w-10 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
                                    <div class="space-y-2 flex-1">
                                        <div class="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        <div class="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ================= SECTION 2: PAYMENT & GATEWAY METRICS SKELETON ================= -->
                    <div class="space-y-4 pt-4">
                        <!-- Section Title Skeleton -->
                        <div class="space-y-2">
                            <div class="h-5 w-52 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            <div class="h-3 w-72 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        </div>

                        <!-- Dynamic Payment Cards Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div v-for="i in 8" :key="'pay-card-' + i" class="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5">
                                <div class="flex flex-col justify-between min-h-[120px]">
                                    <!-- Header -->
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-2.5">
                                            <div class="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                                            <div class="h-3.5 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        </div>
                                        <div class="h-4 w-10 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                                    </div>
                                    <!-- Value -->
                                    <div class="my-3">
                                        <div class="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                    </div>
                                    <!-- Footer -->
                                    <div class="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-2.5">
                                        <div class="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        <div class="h-3 w-3 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ================= SECTION 3: ORDER DETAILS SKELETON ================= -->
                    <div class="mt-8 space-y-4">
                        <div>
                            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Order Details
                            </h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400">
                                Order status and payment overview
                            </p>
                        </div>

                        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <div
                                v-for="card in statusCards"
                                :key="card.key"
                                class="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div class="flex min-h-[125px] flex-col justify-between">

                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div :class="[
                                                'flex h-10 w-10 items-center justify-center rounded-xl',
                                                card.iconWrap
                                            ]">
                                                <i :class="card.icon" class="text-sm"></i>
                                            </div>

                                            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                {{ card.title }}
                                            </span>
                                        </div>

                                        <span class="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                            {{ card.pill }}
                                        </span>
                                    </div>

                                    <div class="my-3">
                                        <h2 class="font-mono text-2xl font-black text-slate-900 dark:text-white">
                                            {{ formatCount(card.value) }}
                                        </h2>
                                    </div>

                                    <div class="border-t border-slate-100 pt-2.5 dark:border-slate-800">
                                        <span :class="['text-[11px] font-semibold', card.subtextClass]">
                                            {{ card.subtext }}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div v-if="errorMsg" class="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
                {{ errorMsg }}
            </div>


            <!-- =========================== Balance Section =========================== -->
            <div class="mb-8 space-y-6">
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <!-- Total Sales -->
                    <div class="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:border-amber-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex min-h-[125px] flex-col justify-between">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2.5">
                                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                        <i class="fa-solid fa-cart-shopping text-sm"></i>
                                    </div>
                                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Sales</span>
                                </div>
                                <span class="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                    Gross
                                </span>
                            </div>

                            <div class="flex items-baseline">
                                <span class="mr-1.5 text-xl text-slate-400">৳</span>
                                <h2 class="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {{ Number(summary.total_subtotal || 0).toLocaleString() }}
                                </h2>
                            </div>

                            <div class="border-t border-slate-100 pt-2.5 text-[11px] text-slate-400 dark:border-slate-800">
                                Total subtotal
                            </div>
                        </div>
                    </div>

                    <!-- Total Revenue -->
                    <div class="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:border-purple-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex min-h-[125px] flex-col justify-between">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2.5">
                                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                                        <i class="fa-solid fa-hand-holding-dollar text-sm"></i>
                                    </div>
                                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</span>
                                </div>
                                <span class="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                                    Payable
                                </span>
                            </div>

                            <div class="flex items-baseline">
                                <span class="mr-1.5 text-xl text-slate-400">৳</span>
                                <h2 class="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {{ Number(summary.total_payable_amount || 0).toLocaleString() }}
                                </h2>
                            </div>

                            <div class="border-t border-slate-100 pt-2.5 text-[11px] text-slate-400 dark:border-slate-800">
                                Total payable amount
                            </div>
                        </div>
                    </div>

                    <!-- Paid Amount -->
                    <div class="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex min-h-[125px] flex-col justify-between">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2.5">
                                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                        <i class="fa-solid fa-wallet text-sm"></i>
                                    </div>
                                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Paid Amount</span>
                                </div>
                                <span class="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                                    Received
                                </span>
                            </div>

                            <div class="flex items-baseline">
                                <span class="mr-1.5 text-xl text-slate-400">৳</span>
                                <h2 class="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {{ Number(summary.total_paid_amount || 0).toLocaleString() }}
                                </h2>
                            </div>

                            <div class="border-t border-slate-100 pt-2.5 text-[11px] text-slate-400 dark:border-slate-800">
                                Collected amount
                            </div>
                        </div>
                    </div>

                    <!-- Due Amount -->
                    <div class="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:border-rose-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex min-h-[125px] flex-col justify-between">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2.5">
                                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                                        <i class="fa-solid fa-file-invoice-dollar text-sm"></i>
                                    </div>
                                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Due</span>
                                </div>
                                <span class="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                                    Receivable
                                </span>
                            </div>

                            <div class="flex items-baseline">
                                <span class="mr-1.5 text-xl text-slate-400">৳</span>
                                <h2 class="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {{ Number(summary.total_due_amount || 0).toLocaleString() }}
                                </h2>
                            </div>

                            <div class="border-t border-slate-100 pt-2.5 text-[11px] text-slate-400 dark:border-slate-800">
                                Outstanding balance
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Additional Summary -->
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <!-- Discount -->
                    <div class="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                <i class="fa-solid fa-tag"></i>
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Discount</p>
                                <h4 class="mt-0.5 font-mono text-xl font-extrabold text-slate-800 dark:text-slate-200">
                                    ৳{{ Number(summary.total_discount || 0).toLocaleString() }}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <!-- VAT -->
                    <div class="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                                <i class="fa-solid fa-receipt"></i>
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total VAT</p>
                                <h4 class="mt-0.5 font-mono text-xl font-extrabold text-slate-800 dark:text-slate-200">
                                    ৳{{ Number(summary.total_vat || 0).toLocaleString() }}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <!-- Points -->
                    <div class="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                                <i class="fa-solid fa-star"></i>
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Earned Points</p>
                                <h4 class="mt-0.5 font-mono text-xl font-extrabold text-slate-800 dark:text-slate-200">
                                    {{ Number(summary.total_points || 0).toLocaleString() }}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <!-- Total Orders -->
                    <div class="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <i class="fa-solid fa-box"></i>
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Orders</p>
                                <h4 class="mt-0.5 font-mono text-xl font-extrabold text-slate-800 dark:text-slate-200">
                                    {{ Number(summary.total_orders || 0).toLocaleString() }}
                                </h4>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <!-- =========================== Balance Section =========================== -->





            <!-- Payment Summary -->
            <div class="mt-8 space-y-4">
                <div>
                    <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                        Payment Summary
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        Payment transactions, methods and collection overview
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        v-for="card in paymentCards"
                        :key="card.title"
                        class="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div class="flex min-h-[120px] flex-col justify-between">

                            <div class="flex items-center gap-3">
                                <div :class="[
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                                    card.iconWrap
                                ]">
                                    <i :class="[card.icon, 'text-sm']"></i>
                                </div>

                                <div>
                                    <p class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        {{ card.title }}
                                    </p>

                                    <span class="text-[10px] font-semibold text-slate-400">
                                        {{ card.pill }}
                                    </span>
                                </div>
                            </div>

                            <div class="my-3">
                                <h2 class="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {{ formatCount(card.value) }}
                                </h2>
                            </div>

                            <div class="border-t border-slate-100 pt-2.5 text-[11px] text-slate-400 dark:border-slate-800">
                                {{ card.subtext }}
                            </div>

                        </div>
                    </div>
                </div>
            </div>





            <!-- =========================== Card Section (Dynamic Order Statuses) =========================== -->
            <div class="mt-8 space-y-4">
                <!-- Header Title -->
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Order Details</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400">Real-time breakdown of order status and payment methods</p>
                    </div>
                </div>
            
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div 
                        v-for="card in statusCards" 
                        :key="card.key" 
                        class="group relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:shadow-none">
                        <div class="flex h-full flex-col justify-between min-h-[140px]">
                        
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div :class="['flex h-10 w-10 items-center justify-center rounded-xl border border-transparent', card.iconWrap]">
                                        <i :class="card.icon" class="text-base"></i>
                                    </div>
                                    <span class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        {{ card.title }}
                                    </span>
                                </div>
                                <span class="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:border-transparent">
                                    {{ card.pill }}
                                </span>
                            </div>

                            <div class="my-4 flex items-baseline text-slate-900 dark:text-white">
                                <h2 class="font-mono text-3xl font-black tracking-tight">
                                    {{ formatCount(card.value) }}
                                </h2>
                            </div>

                            <div class="flex items-center gap-1.5 border-t border-slate-50 pt-3 dark:border-slate-800/40 text-slate-800 dark:text-slate-100">
                                <i :class="[card.subIcon, card.subtextClass]" class="text-[11px]"></i>
                                <span :class="['text-[11px] font-semibold tracking-wide', card.subtextClass]">
                                    {{ card.subtext }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- =========================== Card Section =========================== -->





            
        </div>
    </main>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../../../services/api";

const router = useRouter();

const loading = ref(false);
const errorMsg = ref("");

/* Dashboard State Variables
   NOTE: these keys are matched 1:1 to DashboardController@dashboard's
   $orderSummary / $paymentSummary response — do not rename without
   updating the backend as well. */
const user = ref({});
const summary = ref({
    // Order Summary
    total_orders: 0,
    pending_orders: 0,
    unpaid_orders: 0,
    partially_paid_orders: 0,
    completed_orders: 0,
    returned_orders: 0,

    // Payment
    paid_orders: 0,
    due_orders: 0,

    // Financial
    total_subtotal: 0,
    total_discount: 0,
    total_vat: 0,
    total_payable_amount: 0,
    total_due_amount: 0,
    total_paid_amount: 0,
    total_points: 0,

    // Payment Method
    cash_orders: 0,
    card_orders: 0,
    bank_transfer_orders: 0,
    bkash_orders: 0,
    nagad_orders: 0,
    rocket_orders: 0,
    wallet_orders: 0,
});

const paymentSummary = ref({
    total_transactions: 0,

    payment: 0,
    refund: 0,
    adjustment: 0,

    cash: 0,
    card: 0,
    bank_transfer: 0,
    bkash: 0,
    nagad: 0,
    rocket: 0,
    wallet: 0,

    total_amount: 0,
    total_discount: 0,
    net_amount: 0,

    verified_transactions: 0,
    unverified_transactions: 0,

    today_transactions: 0,
    this_month_transactions: 0,
});

/* Fetch API Data */
const fetchDashBoardData = async () => {
    try {
        loading.value = true;
        errorMsg.value = null;

        const response = await api.get('/dashboard'); 

        if (response.data?.success) {
            const data = response.data.data;
            user.value = data.user ?? {};
            summary.value = data.summary ?? {};
            paymentSummary.value = data.payment_summary ?? {};
        } else {
            errorMsg.value = response.data?.message || "Failed to fetch dashboard data.";
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        errorMsg.value = err.response?.data?.message || "Something went wrong while connecting to the server.";
    } finally {
        loading.value = false;
    }
};

function WithdrawCreate() {
    router.push('/withdraw/create');
}

/* Computed Dynamic Order Status / Payment Method Cards
   Fixed to use the actual keys returned by the backend
   (previously used non-existent keys like confirmed_orders,
   processing_orders, cod_orders, advance_orders, etc. which
   always rendered as 0). */
const statusCards = computed(() => [
    // ---- Order Status ----
    {
        key: "total_orders",
        title: "Total Orders",
        value: summary.value.total_orders,
        icon: "fa-solid fa-boxes-packing",
        iconWrap: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        pill: "All",
        subIcon: "fa-solid fa-layer-group",
        subtext: "All orders",
        subtextClass: "text-indigo-500",
    },
    {
        key: "pending_orders",
        title: "Pending",
        value: summary.value.pending_orders,
        icon: "fa-solid fa-clock",
        iconWrap: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
        pill: "Order",
        subIcon: "fa-solid fa-hourglass-half",
        subtext: "Awaiting confirmation",
        subtextClass: "text-amber-500",
    },
    {
        key: "unpaid_orders",
        title: "Unpaid",
        value: summary.value.unpaid_orders,
        icon: "fa-solid fa-file-invoice-dollar",
        iconWrap: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
        pill: "Order",
        subIcon: "fa-solid fa-triangle-exclamation",
        subtext: "No payment received",
        subtextClass: "text-rose-500",
    },
    {
        key: "partially_paid_orders",
        title: "Partially Paid",
        value: summary.value.partially_paid_orders,
        icon: "fa-solid fa-coins",
        iconWrap: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
        pill: "Order",
        subIcon: "fa-solid fa-coins",
        subtext: "Partial payment made",
        subtextClass: "text-orange-500",
    },
    {
        key: "completed_orders",
        title: "Completed",
        value: summary.value.completed_orders,
        icon: "fa-solid fa-circle-check",
        iconWrap: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        pill: "Order",
        subIcon: "fa-solid fa-check-double",
        subtext: "Completed orders",
        subtextClass: "text-emerald-500",
    },
    {
        key: "returned_orders",
        title: "Returned",
        value: summary.value.returned_orders,
        icon: "fa-solid fa-rotate-left",
        iconWrap: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
        pill: "Order",
        subIcon: "fa-solid fa-arrow-rotate-left",
        subtext: "Returned items",
        subtextClass: "text-slate-500",
    },

    // ---- Payment Status ----
    {
        key: "paid_orders",
        title: "Fully Paid",
        value: summary.value.paid_orders,
        icon: "fa-solid fa-money-check-dollar",
        iconWrap: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
        pill: "Payment",
        subIcon: "fa-solid fa-check",
        subtext: "Payment completed",
        subtextClass: "text-green-500",
    },
    {
        key: "due_orders",
        title: "Due Orders",
        value: summary.value.due_orders,
        icon: "fa-solid fa-wallet",
        iconWrap: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        pill: "Payment",
        subIcon: "fa-solid fa-hourglass-half",
        subtext: "Balance still due",
        subtextClass: "text-yellow-500",
    },

    // ---- Payment Method ----
    {
        key: "cash_orders",
        title: "Cash",
        value: summary.value.cash_orders,
        icon: "fa-solid fa-money-bill-wave",
        iconWrap: "bg-lime-50 dark:bg-lime-500/10 text-lime-600 dark:text-lime-400",
        pill: "Method",
        subIcon: "fa-solid fa-sack-dollar",
        subtext: "Cash orders",
        subtextClass: "text-lime-500",
    },
    {
        key: "card_orders",
        title: "Card",
        value: summary.value.card_orders,
        icon: "fa-solid fa-credit-card",
        iconWrap: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400",
        pill: "Method",
        subIcon: "fa-solid fa-credit-card",
        subtext: "Card orders",
        subtextClass: "text-sky-500",
    },
    {
        key: "bank_transfer_orders",
        title: "Bank Transfer",
        value: summary.value.bank_transfer_orders,
        icon: "fa-solid fa-building-columns",
        iconWrap: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        pill: "Method",
        subIcon: "fa-solid fa-building-columns",
        subtext: "Bank transfer orders",
        subtextClass: "text-indigo-500",
    },
    {
        key: "bkash_orders",
        title: "bKash",
        value: summary.value.bkash_orders,
        icon: "fa-solid fa-mobile-screen",
        iconWrap: "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400",
        pill: "Method",
        subIcon: "fa-solid fa-mobile-screen",
        subtext: "bKash orders",
        subtextClass: "text-pink-500",
    },
    {
        key: "nagad_orders",
        title: "Nagad",
        value: summary.value.nagad_orders,
        icon: "fa-solid fa-wallet",
        iconWrap: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
        pill: "Method",
        subIcon: "fa-solid fa-wallet",
        subtext: "Nagad orders",
        subtextClass: "text-orange-500",
    },
    {
        key: "rocket_orders",
        title: "Rocket",
        value: summary.value.rocket_orders,
        icon: "fa-solid fa-rocket",
        iconWrap: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
        pill: "Method",
        subIcon: "fa-solid fa-rocket",
        subtext: "Rocket orders",
        subtextClass: "text-purple-500",
    },
    {
        key: "wallet_orders",
        title: "Wallet",
        value: summary.value.wallet_orders,
        icon: "fa-solid fa-wallet",
        iconWrap: "bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400",
        pill: "Method",
        subIcon: "fa-solid fa-wallet",
        subtext: "Wallet orders",
        subtextClass: "text-teal-500",
    },
]);

/* Count Formatter helper */
function formatCount(value) {
    const num = Number(value) || 0;

    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }

    return num.toString();
}

const paymentCards = computed(() => [
    {
        title: "Transactions",
        value: paymentSummary.value?.total_transactions ?? 0,
        icon: "fa-solid fa-money-check-dollar",
        iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        pill: "Total",
        subtext: "Total transactions",
    },
    {
        title: "Payments",
        value: paymentSummary.value?.payment ?? 0,
        icon: "fa-solid fa-circle-check",
        iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        pill: "Type",
        subtext: "Payment transactions",
    },
    {
        title: "Refunds",
        value: paymentSummary.value?.refund ?? 0,
        icon: "fa-solid fa-rotate-left",
        iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
        pill: "Type",
        subtext: "Refund transactions",
    },
    {
        title: "Adjustments",
        value: paymentSummary.value?.adjustment ?? 0,
        icon: "fa-solid fa-sliders",
        iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        pill: "Type",
        subtext: "Adjustment transactions",
    },
    {
        title: "Cash",
        value: paymentSummary.value?.cash ?? 0,
        icon: "fa-solid fa-money-bill-wave",
        iconWrap: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
        pill: "Method",
        subtext: "Cash transactions",
    },
    {
        title: "Card",
        value: paymentSummary.value?.card ?? 0,
        icon: "fa-solid fa-credit-card",
        iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
        pill: "Method",
        subtext: "Card transactions",
    },
    {
        title: "Bank Transfer",
        value: paymentSummary.value?.bank_transfer ?? 0,
        icon: "fa-solid fa-building-columns",
        iconWrap: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
        pill: "Method",
        subtext: "Bank transactions",
    },
    {
        title: "bKash",
        value: paymentSummary.value?.bkash ?? 0,
        icon: "fa-solid fa-mobile-screen",
        iconWrap: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
        pill: "Method",
        subtext: "bKash transactions",
    },
    {
        title: "Nagad",
        value: paymentSummary.value?.nagad ?? 0,
        icon: "fa-solid fa-wallet",
        iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
        pill: "Method",
        subtext: "Nagad transactions",
    },
    {
        title: "Rocket",
        value: paymentSummary.value?.rocket ?? 0,
        icon: "fa-solid fa-rocket",
        iconWrap: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
        pill: "Method",
        subtext: "Rocket transactions",
    },
    {
        title: "Wallet",
        value: paymentSummary.value?.wallet ?? 0,
        icon: "fa-solid fa-wallet",
        iconWrap: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
        pill: "Method",
        subtext: "Wallet transactions",
    },
    {
        title: "Total Amount",
        value: paymentSummary.value?.total_amount ?? 0,
        icon: "fa-solid fa-sack-dollar",
        iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        pill: "Amount",
        subtext: "Total payment amount",
    },
    {
        title: "Discount",
        value: paymentSummary.value?.total_discount ?? 0,
        icon: "fa-solid fa-tag",
        iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        pill: "Amount",
        subtext: "Total payment discount",
    },
    {
        title: "Net Amount",
        value: paymentSummary.value?.net_amount ?? 0,
        icon: "fa-solid fa-coins",
        iconWrap: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
        pill: "Amount",
        subtext: "Amount after discount",
    },
    {
        title: "Verified",
        value: paymentSummary.value?.verified_transactions ?? 0,
        icon: "fa-solid fa-circle-check",
        iconWrap: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
        pill: "Verification",
        subtext: "Verified transactions",
    },
    {
        title: "Unverified",
        value: paymentSummary.value?.unverified_transactions ?? 0,
        icon: "fa-solid fa-circle-question",
        iconWrap: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
        pill: "Verification",
        subtext: "Unverified transactions",
    },
    {
        title: "Today",
        value: paymentSummary.value?.today_transactions ?? 0,
        icon: "fa-solid fa-calendar-day",
        iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        pill: "Today",
        subtext: "Today's transactions",
    },
    {
        title: "This Month",
        value: paymentSummary.value?.this_month_transactions ?? 0,
        icon: "fa-solid fa-calendar",
        iconWrap: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
        pill: "Month",
        subtext: "This month's transactions",
    },
]);

onMounted(() => {
    fetchDashBoardData();
});
</script>

<style scoped>
</style>