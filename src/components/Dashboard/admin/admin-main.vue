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


            <ReportAnalysis />


            <!-- =========================== Balance Section (Orders) =========================== -->
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



            <!-- =========================== Extra Stat Groups (all remaining Order/Payment API fields) =========================== -->
            <div v-for="group in statGroups" :key="group.title" class="mt-8 space-y-4">
                <div>
                    <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {{ group.title }}
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        {{ group.subtitle }}
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        v-for="item in group.items"
                        :key="item.label"
                        class="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div class="flex items-center gap-3">
                            <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', item.iconWrap]">
                                <i :class="item.icon"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {{ item.label }}
                                </p>
                                <h4 class="mt-0.5 font-mono text-xl font-extrabold text-slate-800 dark:text-slate-200 truncate">
                                    {{ item.display }}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- =========================== Extra Stat Groups =========================== -->


            <!-- ======================================================================= -->
            <!-- ===================== PURCHASE ORDER SECTIONS (NEW) ================== -->
            <!-- ======================================================================= -->
            <div class="mt-12 pt-8 border-t-2 border-dashed border-slate-200 dark:border-slate-800">
                <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">Purchase Overview</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Supplier purchases, purchase orders and purchase payments</p>
            </div>

            <!-- =========================== Purchase Order Balance Section =========================== -->
            <div class="mb-8 space-y-6">
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <!-- Total Purchase Subtotal -->
                    <div class="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:border-amber-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex min-h-[125px] flex-col justify-between">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2.5">
                                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                        <i class="fa-solid fa-truck-ramp-box text-sm"></i>
                                    </div>
                                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Purchase</span>
                                </div>
                                <span class="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                    Gross
                                </span>
                            </div>

                            <div class="flex items-baseline">
                                <span class="mr-1.5 text-xl text-slate-400">৳</span>
                                <h2 class="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {{ Number(purchaseOrderSummary.total_subtotal || 0).toLocaleString() }}
                                </h2>
                            </div>

                            <div class="border-t border-slate-100 pt-2.5 text-[11px] text-slate-400 dark:border-slate-800">
                                Total purchase subtotal
                            </div>
                        </div>
                    </div>

                    <!-- Total Payable -->
                    <div class="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:border-purple-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex min-h-[125px] flex-col justify-between">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2.5">
                                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                                        <i class="fa-solid fa-hand-holding-dollar text-sm"></i>
                                    </div>
                                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Payable</span>
                                </div>
                                <span class="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                                    Payable
                                </span>
                            </div>

                            <div class="flex items-baseline">
                                <span class="mr-1.5 text-xl text-slate-400">৳</span>
                                <h2 class="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {{ Number(purchaseOrderSummary.total_payable_amount || 0).toLocaleString() }}
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
                                    Paid
                                </span>
                            </div>

                            <div class="flex items-baseline">
                                <span class="mr-1.5 text-xl text-slate-400">৳</span>
                                <h2 class="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {{ Number(purchaseOrderSummary.total_paid_amount || 0).toLocaleString() }}
                                </h2>
                            </div>

                            <div class="border-t border-slate-100 pt-2.5 text-[11px] text-slate-400 dark:border-slate-800">
                                Paid to suppliers
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
                                    Payable to supplier
                                </span>
                            </div>

                            <div class="flex items-baseline">
                                <span class="mr-1.5 text-xl text-slate-400">৳</span>
                                <h2 class="font-mono text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {{ Number(purchaseOrderSummary.total_due_amount || 0).toLocaleString() }}
                                </h2>
                            </div>

                            <div class="border-t border-slate-100 pt-2.5 text-[11px] text-slate-400 dark:border-slate-800">
                                Outstanding to suppliers
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
                                    ৳{{ Number(purchaseOrderSummary.total_discount || 0).toLocaleString() }}
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
                                    ৳{{ Number(purchaseOrderSummary.total_vat || 0).toLocaleString() }}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <!-- Suppliers -->
                    <div class="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                                <i class="fa-solid fa-truck-field"></i>
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Suppliers</p>
                                <h4 class="mt-0.5 font-mono text-xl font-extrabold text-slate-800 dark:text-slate-200">
                                    {{ Number(purchaseOrderSummary.total_suppliers || 0).toLocaleString() }}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <!-- Total Purchase Orders -->
                    <div class="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <i class="fa-solid fa-box"></i>
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Purchase Orders</p>
                                <h4 class="mt-0.5 font-mono text-xl font-extrabold text-slate-800 dark:text-slate-200">
                                    {{ Number(purchaseOrderSummary.total_purchase_orders || 0).toLocaleString() }}
                                </h4>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <!-- =========================== Purchase Order Balance Section =========================== -->


            <!-- Purchase Order Payment Summary -->
            <div class="mt-8 space-y-4">
                <div>
                    <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                        Purchase Payment Summary
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        Supplier payment transactions, methods and collection overview
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        v-for="card in purchasePaymentCards"
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


            <!-- =========================== Purchase Order Details (status cards) =========================== -->
            <div class="mt-8 space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Purchase Order Details</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400">Real-time breakdown of purchase order status and payment methods</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div
                        v-for="card in purchaseStatusCards"
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
            <!-- =========================== Purchase Order Details =========================== -->


            <!-- =========================== Extra Purchase Stat Groups (remaining API fields) =========================== -->
            <div v-for="group in purchaseStatGroups" :key="group.title" class="mt-8 space-y-4">
                <div>
                    <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {{ group.title }}
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        {{ group.subtitle }}
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        v-for="item in group.items"
                        :key="item.label"
                        class="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div class="flex items-center gap-3">
                            <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', item.iconWrap]">
                                <i :class="item.icon"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {{ item.label }}
                                </p>
                                <h4 class="mt-0.5 font-mono text-xl font-extrabold text-slate-800 dark:text-slate-200 truncate">
                                    {{ item.display }}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- =========================== Extra Purchase Stat Groups =========================== -->

        </div>
    </main>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../../../services/api";

import ReportAnalysis from './reports/analysis-body.vue';

const router = useRouter();

const loading = ref(false);
const errorMsg = ref("");

/* Dashboard State Variables
   NOTE: these keys are matched 1:1 to DashboardController@dashboard's
   $orderSummary / $paymentSummary / $purchaseOrderSummary / $purchasePaymentSummary
   response — do not rename without updating the backend as well. */
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

    // Percentages
    pending_percentage: 0,
    unpaid_percentage: 0,
    partially_paid_percentage: 0,
    completed_percentage: 0,
    returned_percentage: 0,

    // Amounts by method
    cash_amount: 0,
    card_amount: 0,
    bank_transfer_amount: 0,
    bkash_amount: 0,
    nagad_amount: 0,
    rocket_amount: 0,
    wallet_amount: 0,

    // Customer breakdown
    total_customers: 0,
    guest_orders: 0,
    registered_customer_orders: 0,
    customer_sales: 0,
    guest_sales: 0,
    customer_due: 0,
    guest_due: 0,

    // Discount / VAT / Points breakdown
    orders_with_discount: 0,
    orders_without_discount: 0,
    average_discount: 0,
    orders_with_vat: 0,
    orders_without_vat: 0,
    average_vat: 0,
    orders_with_points: 0,
    orders_without_points: 0,
    average_points_per_order: 0,

    // Averages
    average_order_value: 0,
    average_subtotal: 0,
    average_due_per_order: 0,

    // Today / This month
    today_orders: 0,
    today_sales: 0,
    today_due: 0,
    this_month_orders: 0,
    this_month_sales: 0,
    this_month_discount: 0,
    this_month_vat: 0,
    this_month_due: 0,

    // Status-wise sales/due
    completed_sales: 0,
    completed_due: 0,
    pending_sales: 0,
    pending_due: 0,
    unpaid_sales: 0,
    unpaid_due: 0,
    partial_paid_sales: 0,
    partial_paid_due: 0,
    returned_orders_amount: 0,
    returned_orders_due: 0,

    // Other
    total_collection: 0,
    total_outstanding: 0,
    fully_paid_orders: 0,
    zero_value_orders: 0,
    bdt_orders: 0,
    total_sales_users: 0,
    net_sales: 0,
    last_order_date: null,
    completed_with_date: 0,
    returned_with_date: 0,
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

    // Amounts by type
    payment_amount: 0,
    refund_amount: 0,
    adjustment_amount: 0,

    // Amounts by method
    cash_amount: 0,
    card_amount: 0,
    bank_transfer_amount: 0,
    bkash_amount: 0,
    nagad_amount: 0,
    rocket_amount: 0,
    wallet_amount: 0,

    // Customer breakdown
    total_customers: 0,
    customer_transactions: 0,
    guest_transactions: 0,
    received_transactions: 0,

    // Time & averages
    today_amount: 0,
    this_month_amount: 0,
    average_payment: 0,
    total_orders_paid: 0,
    total_payment_users: 0,
});

/* ===================== NEW: Purchase Order state ===================== */
const purchaseOrderSummary = ref({
    total_purchase_orders: 0,
    pending_purchase_orders: 0,
    unpaid_purchase_orders: 0,
    paid_purchase_orders: 0,
    partially_paid_purchase_orders: 0,
    completed_purchase_orders: 0,
    returned_purchase_orders: 0,

    pending_percentage: 0,
    unpaid_percentage: 0,
    paid_percentage: 0,
    partially_paid_percentage: 0,
    completed_percentage: 0,
    returned_percentage: 0,

    total_subtotal: 0,
    total_discount: 0,
    total_vat: 0,
    total_payable_amount: 0,
    total_due_amount: 0,
    total_paid_amount: 0,
    total_outstanding: 0,

    fully_paid_purchase_orders: 0,
    due_purchase_orders: 0,
    zero_value_purchase_orders: 0,

    cash_purchase_orders: 0,
    card_purchase_orders: 0,
    bank_transfer_purchase_orders: 0,
    bkash_purchase_orders: 0,
    nagad_purchase_orders: 0,
    rocket_purchase_orders: 0,
    wallet_purchase_orders: 0,

    cash_amount: 0,
    card_amount: 0,
    bank_transfer_amount: 0,
    bkash_amount: 0,
    nagad_amount: 0,
    rocket_amount: 0,
    wallet_amount: 0,

    total_suppliers: 0,
    supplier_purchases: 0,
    supplier_due: 0,

    orders_with_discount: 0,
    orders_without_discount: 0,
    average_discount: 0,
    orders_with_vat: 0,
    orders_without_vat: 0,
    average_vat: 0,

    average_purchase_order_value: 0,
    average_subtotal: 0,
    average_due_per_order: 0,

    today_purchase_orders: 0,
    today_purchase_amount: 0,
    today_purchase_due: 0,

    this_month_purchase_orders: 0,
    this_month_purchase_amount: 0,
    this_month_purchase_discount: 0,
    this_month_purchase_vat: 0,
    this_month_purchase_due: 0,

    first_purchase_order_date: null,
    last_purchase_order_date: null,

    completed_with_date: 0,
    returned_with_date: 0,

    bdt_purchase_orders: 0,
    total_purchase_users: 0,

    returned_purchase_amount: 0,
    returned_purchase_due: 0,
    completed_purchase_amount: 0,
    completed_purchase_due: 0,
    pending_purchase_amount: 0,
    pending_purchase_due: 0,
    unpaid_purchase_amount: 0,
    unpaid_purchase_due: 0,
    paid_purchase_amount: 0,
    partial_paid_purchase_amount: 0,
    partial_paid_purchase_due: 0,
    net_purchase: 0,
});

const purchasePaymentSummary = ref({
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

    payment_amount: 0,
    refund_amount: 0,
    adjustment_amount: 0,

    cash_amount: 0,
    card_amount: 0,
    bank_transfer_amount: 0,
    bkash_amount: 0,
    nagad_amount: 0,
    rocket_amount: 0,
    wallet_amount: 0,

    total_suppliers: 0,
    supplier_transactions: 0,

    verified_transactions: 0,
    unverified_transactions: 0,
    received_transactions: 0,

    today_transactions: 0,
    today_amount: 0,

    this_month_transactions: 0,
    this_month_amount: 0,

    average_payment: 0,

    first_payment_date: null,
    last_payment_date: null,

    total_orders_paid: 0,
    total_payment_users: 0,
});
/* ===================== END NEW: Purchase Order state ===================== */

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
            purchaseOrderSummary.value = data.purchase_order_summary ?? {};
            purchasePaymentSummary.value = data.purchase_order_payment_summary ?? {};
            // console.log(summary.value);
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

/* Computed Dynamic Order Status / Payment Method Cards */
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

/* Formatter helpers for the extra stat groups */
function formatCurrency(value) {
    return `৳${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}
function formatPercent(value) {
    return `${Number(value || 0)}%`;
}
function formatNumber(value, decimals = 0) {
    return Number(value || 0).toLocaleString(undefined, {
        maximumFractionDigits: decimals,
    });
}
function formatDate(value) {
    if (!value) return "—";
    return String(value).slice(0, 10);
}

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

/* Every remaining field from $orderSummary / $paymentSummary that isn't
   already covered by the balance cards, statusCards, or paymentCards above. */
const statGroups = computed(() => {
    const s = summary.value || {};
    const p = paymentSummary.value || {};

    return [
        {
            title: "Order Status Percentage",
            subtitle: "Share of each order status out of total orders",
            items: [
                { label: "Pending %", display: formatPercent(s.pending_percentage), icon: "fa-solid fa-clock", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Unpaid %", display: formatPercent(s.unpaid_percentage), icon: "fa-solid fa-file-invoice-dollar", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
                { label: "Partially Paid %", display: formatPercent(s.partially_paid_percentage), icon: "fa-solid fa-coins", iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
                { label: "Completed %", display: formatPercent(s.completed_percentage), icon: "fa-solid fa-circle-check", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Returned %", display: formatPercent(s.returned_percentage), icon: "fa-solid fa-rotate-left", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
            ],
        },
        {
            title: "Sales & Due by Order Status",
            subtitle: "Payable amount and outstanding due, broken down by status",
            items: [
                { label: "Completed Sales", display: formatCurrency(s.completed_sales), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Completed Due", display: formatCurrency(s.completed_due), icon: "fa-solid fa-wallet", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Pending Sales", display: formatCurrency(s.pending_sales), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Pending Due", display: formatCurrency(s.pending_due), icon: "fa-solid fa-wallet", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Unpaid Sales", display: formatCurrency(s.unpaid_sales), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
                { label: "Unpaid Due", display: formatCurrency(s.unpaid_due), icon: "fa-solid fa-wallet", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
                { label: "Partial Paid Sales", display: formatCurrency(s.partial_paid_sales), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
                { label: "Partial Paid Due", display: formatCurrency(s.partial_paid_due), icon: "fa-solid fa-wallet", iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
                { label: "Returned Amount", display: formatCurrency(s.returned_orders_amount), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                { label: "Returned Due", display: formatCurrency(s.returned_orders_due), icon: "fa-solid fa-wallet", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
            ],
        },
        {
            title: "Order Amounts by Payment Method",
            subtitle: "Total payable amount collected per payment method",
            items: [
                { label: "Cash Amount", display: formatCurrency(s.cash_amount), icon: "fa-solid fa-money-bill-wave", iconWrap: "bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400" },
                { label: "Card Amount", display: formatCurrency(s.card_amount), icon: "fa-solid fa-credit-card", iconWrap: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400" },
                { label: "Bank Transfer Amount", display: formatCurrency(s.bank_transfer_amount), icon: "fa-solid fa-building-columns", iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                { label: "bKash Amount", display: formatCurrency(s.bkash_amount), icon: "fa-solid fa-mobile-screen", iconWrap: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400" },
                { label: "Nagad Amount", display: formatCurrency(s.nagad_amount), icon: "fa-solid fa-wallet", iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
                { label: "Rocket Amount", display: formatCurrency(s.rocket_amount), icon: "fa-solid fa-rocket", iconWrap: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
                { label: "Wallet Amount", display: formatCurrency(s.wallet_amount), icon: "fa-solid fa-wallet", iconWrap: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400" },
            ],
        },
        {
            title: "Customer Breakdown",
            subtitle: "Registered customer vs guest order activity",
            items: [
                { label: "Total Customers", display: formatNumber(s.total_customers), icon: "fa-solid fa-users", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Guest Orders", display: formatNumber(s.guest_orders), icon: "fa-solid fa-user-secret", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                { label: "Registered Customer Orders", display: formatNumber(s.registered_customer_orders), icon: "fa-solid fa-user-check", iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                { label: "Customer Sales", display: formatCurrency(s.customer_sales), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Guest Sales", display: formatCurrency(s.guest_sales), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Customer Due", display: formatCurrency(s.customer_due), icon: "fa-solid fa-wallet", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
                { label: "Guest Due", display: formatCurrency(s.guest_due), icon: "fa-solid fa-wallet", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
            ],
        },
        {
            title: "Discount, VAT & Points Breakdown",
            subtitle: "How discount, VAT and loyalty points are distributed across orders",
            items: [
                { label: "Orders with Discount", display: formatNumber(s.orders_with_discount), icon: "fa-solid fa-tag", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Orders without Discount", display: formatNumber(s.orders_without_discount), icon: "fa-solid fa-tag", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                { label: "Average Discount", display: formatCurrency(s.average_discount), icon: "fa-solid fa-tags", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Orders with VAT", display: formatNumber(s.orders_with_vat), icon: "fa-solid fa-receipt", iconWrap: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400" },
                { label: "Orders without VAT", display: formatNumber(s.orders_without_vat), icon: "fa-solid fa-receipt", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                { label: "Average VAT", display: formatCurrency(s.average_vat), icon: "fa-solid fa-receipt", iconWrap: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400" },
                { label: "Orders with Points", display: formatNumber(s.orders_with_points), icon: "fa-solid fa-star", iconWrap: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400" },
                { label: "Orders without Points", display: formatNumber(s.orders_without_points), icon: "fa-solid fa-star", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                { label: "Avg Points / Order", display: formatNumber(s.average_points_per_order, 1), icon: "fa-solid fa-star-half-stroke", iconWrap: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400" },
            ],
        },
        {
            title: "Averages",
            subtitle: "Average financial figures per order",
            items: [
                { label: "Average Order Value", display: formatCurrency(s.average_order_value), icon: "fa-solid fa-chart-simple", iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                { label: "Average Subtotal", display: formatCurrency(s.average_subtotal), icon: "fa-solid fa-chart-simple", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Average Due / Order", display: formatCurrency(s.average_due_per_order), icon: "fa-solid fa-chart-simple", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
            ],
        },
        {
            title: "Today's Performance",
            subtitle: "Order activity for today",
            items: [
                { label: "Today's Orders", display: formatNumber(s.today_orders), icon: "fa-solid fa-calendar-day", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Today's Sales", display: formatCurrency(s.today_sales), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Today's Due", display: formatCurrency(s.today_due), icon: "fa-solid fa-wallet", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
            ],
        },
        {
            title: "This Month's Performance",
            subtitle: "Order activity for the current month",
            items: [
                { label: "This Month's Orders", display: formatNumber(s.this_month_orders), icon: "fa-solid fa-calendar", iconWrap: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" },
                { label: "This Month's Sales", display: formatCurrency(s.this_month_sales), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "This Month's Discount", display: formatCurrency(s.this_month_discount), icon: "fa-solid fa-tag", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "This Month's VAT", display: formatCurrency(s.this_month_vat), icon: "fa-solid fa-receipt", iconWrap: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400" },
                { label: "This Month's Due", display: formatCurrency(s.this_month_due), icon: "fa-solid fa-wallet", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
            ],
        },
        {
            title: "Other Order Stats",
            subtitle: "Miscellaneous order-level figures",
            items: [
                { label: "Total Collection", display: formatCurrency(s.total_collection), icon: "fa-solid fa-vault", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Total Outstanding", display: formatCurrency(s.total_outstanding), icon: "fa-solid fa-triangle-exclamation", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
                { label: "Fully Paid Orders", display: formatNumber(s.fully_paid_orders), icon: "fa-solid fa-circle-check", iconWrap: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
                { label: "Zero Value Orders", display: formatNumber(s.zero_value_orders), icon: "fa-solid fa-ban", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                { label: "BDT Orders", display: formatNumber(s.bdt_orders), icon: "fa-solid fa-money-bill-1", iconWrap: "bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400" },
                { label: "Total Sales Users", display: formatNumber(s.total_sales_users), icon: "fa-solid fa-user-tie", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Net Sales", display: formatCurrency(s.net_sales), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Last Order Date", display: formatDate(s.last_order_date), icon: "fa-solid fa-calendar-days", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                { label: "Completed With Date", display: formatNumber(s.completed_with_date), icon: "fa-solid fa-check-double", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Returned With Date", display: formatNumber(s.returned_with_date), icon: "fa-solid fa-rotate-left", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
            ],
        },

        // ---- Payment Summary ----
        {
            title: "Payment Type Amounts",
            subtitle: "Amount collected by transaction type",
            items: [
                { label: "Payment Amount", display: formatCurrency(p.payment_amount), icon: "fa-solid fa-circle-check", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Refund Amount", display: formatCurrency(p.refund_amount), icon: "fa-solid fa-rotate-left", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
                { label: "Adjustment Amount", display: formatCurrency(p.adjustment_amount), icon: "fa-solid fa-sliders", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
            ],
        },
        {
            title: "Payment Amounts by Method",
            subtitle: "Transaction amount collected per payment method",
            items: [
                { label: "Cash Amount", display: formatCurrency(p.cash_amount), icon: "fa-solid fa-money-bill-wave", iconWrap: "bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400" },
                { label: "Card Amount", display: formatCurrency(p.card_amount), icon: "fa-solid fa-credit-card", iconWrap: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400" },
                { label: "Bank Transfer Amount", display: formatCurrency(p.bank_transfer_amount), icon: "fa-solid fa-building-columns", iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                { label: "bKash Amount", display: formatCurrency(p.bkash_amount), icon: "fa-solid fa-mobile-screen", iconWrap: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400" },
                { label: "Nagad Amount", display: formatCurrency(p.nagad_amount), icon: "fa-solid fa-wallet", iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
                { label: "Rocket Amount", display: formatCurrency(p.rocket_amount), icon: "fa-solid fa-rocket", iconWrap: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
                { label: "Wallet Amount", display: formatCurrency(p.wallet_amount), icon: "fa-solid fa-wallet", iconWrap: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400" },
            ],
        },
        {
            title: "Payment Customer Breakdown",
            subtitle: "Registered customer vs guest transaction activity",
            items: [
                { label: "Total Customers", display: formatNumber(p.total_customers), icon: "fa-solid fa-users", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Customer Transactions", display: formatNumber(p.customer_transactions), icon: "fa-solid fa-user-check", iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                { label: "Guest Transactions", display: formatNumber(p.guest_transactions), icon: "fa-solid fa-user-secret", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                { label: "Received Transactions", display: formatNumber(p.received_transactions), icon: "fa-solid fa-hand-holding-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
            ],
        },
        {
            title: "Payment Time & Averages",
            subtitle: "Recent activity and average transaction figures",
            items: [
                { label: "Today's Amount", display: formatCurrency(p.today_amount), icon: "fa-solid fa-calendar-day", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "This Month's Amount", display: formatCurrency(p.this_month_amount), icon: "fa-solid fa-calendar", iconWrap: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" },
                { label: "Average Payment", display: formatCurrency(p.average_payment), icon: "fa-solid fa-chart-simple", iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                { label: "Total Orders Paid", display: formatNumber(p.total_orders_paid), icon: "fa-solid fa-box", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Total Payment Users", display: formatNumber(p.total_payment_users), icon: "fa-solid fa-user-tie", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
            ],
        },
    ];
});

/* ===================== NEW: Purchase Order Status Cards ===================== */
const purchaseStatusCards = computed(() => [
    {
        key: "total_purchase_orders",
        title: "Total Purchase",
        value: purchaseOrderSummary.value.total_purchase_orders,
        icon: "fa-solid fa-boxes-packing",
        iconWrap: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        pill: "All",
        subIcon: "fa-solid fa-layer-group",
        subtext: "All purchase orders",
        subtextClass: "text-indigo-500",
    },
    {
        key: "pending_purchase_orders",
        title: "Pending",
        value: purchaseOrderSummary.value.pending_purchase_orders,
        icon: "fa-solid fa-clock",
        iconWrap: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
        pill: "Purchase",
        subIcon: "fa-solid fa-hourglass-half",
        subtext: "Awaiting confirmation",
        subtextClass: "text-amber-500",
    },
    {
        key: "unpaid_purchase_orders",
        title: "Unpaid",
        value: purchaseOrderSummary.value.unpaid_purchase_orders,
        icon: "fa-solid fa-file-invoice-dollar",
        iconWrap: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
        pill: "Purchase",
        subIcon: "fa-solid fa-triangle-exclamation",
        subtext: "No payment made",
        subtextClass: "text-rose-500",
    },
    {
        key: "paid_purchase_orders",
        title: "Paid",
        value: purchaseOrderSummary.value.paid_purchase_orders,
        icon: "fa-solid fa-money-check-dollar",
        iconWrap: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
        pill: "Purchase",
        subIcon: "fa-solid fa-check",
        subtext: "Fully paid to supplier",
        subtextClass: "text-green-500",
    },
    {
        key: "partially_paid_purchase_orders",
        title: "Partially Paid",
        value: purchaseOrderSummary.value.partially_paid_purchase_orders,
        icon: "fa-solid fa-coins",
        iconWrap: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
        pill: "Purchase",
        subIcon: "fa-solid fa-coins",
        subtext: "Partial payment made",
        subtextClass: "text-orange-500",
    },
    {
        key: "completed_purchase_orders",
        title: "Completed",
        value: purchaseOrderSummary.value.completed_purchase_orders,
        icon: "fa-solid fa-circle-check",
        iconWrap: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        pill: "Purchase",
        subIcon: "fa-solid fa-check-double",
        subtext: "Completed purchase orders",
        subtextClass: "text-emerald-500",
    },
    {
        key: "returned_purchase_orders",
        title: "Returned",
        value: purchaseOrderSummary.value.returned_purchase_orders,
        icon: "fa-solid fa-rotate-left",
        iconWrap: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
        pill: "Purchase",
        subIcon: "fa-solid fa-arrow-rotate-left",
        subtext: "Returned to supplier",
        subtextClass: "text-slate-500",
    },
    {
        key: "due_purchase_orders",
        title: "Due Orders",
        value: purchaseOrderSummary.value.due_purchase_orders,
        icon: "fa-solid fa-wallet",
        iconWrap: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        pill: "Payment",
        subIcon: "fa-solid fa-hourglass-half",
        subtext: "Balance still due",
        subtextClass: "text-yellow-500",
    },
    {
        key: "cash_purchase_orders",
        title: "Cash",
        value: purchaseOrderSummary.value.cash_purchase_orders,
        icon: "fa-solid fa-money-bill-wave",
        iconWrap: "bg-lime-50 dark:bg-lime-500/10 text-lime-600 dark:text-lime-400",
        pill: "Method",
        subIcon: "fa-solid fa-sack-dollar",
        subtext: "Cash purchases",
        subtextClass: "text-lime-500",
    },
    {
        key: "card_purchase_orders",
        title: "Card",
        value: purchaseOrderSummary.value.card_purchase_orders,
        icon: "fa-solid fa-credit-card",
        iconWrap: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400",
        pill: "Method",
        subIcon: "fa-solid fa-credit-card",
        subtext: "Card purchases",
        subtextClass: "text-sky-500",
    },
    {
        key: "bank_transfer_purchase_orders",
        title: "Bank Transfer",
        value: purchaseOrderSummary.value.bank_transfer_purchase_orders,
        icon: "fa-solid fa-building-columns",
        iconWrap: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
        pill: "Method",
        subIcon: "fa-solid fa-building-columns",
        subtext: "Bank transfer purchases",
        subtextClass: "text-indigo-500",
    },
    {
        key: "bkash_purchase_orders",
        title: "bKash",
        value: purchaseOrderSummary.value.bkash_purchase_orders,
        icon: "fa-solid fa-mobile-screen",
        iconWrap: "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400",
        pill: "Method",
        subIcon: "fa-solid fa-mobile-screen",
        subtext: "bKash purchases",
        subtextClass: "text-pink-500",
    },
]);

/* ===================== NEW: Purchase Payment Cards ===================== */
const purchasePaymentCards = computed(() => [
    {
        title: "Transactions",
        value: purchasePaymentSummary.value?.total_transactions ?? 0,
        icon: "fa-solid fa-money-check-dollar",
        iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        pill: "Total",
        subtext: "Total supplier transactions",
    },
    {
        title: "Payments",
        value: purchasePaymentSummary.value?.payment ?? 0,
        icon: "fa-solid fa-circle-check",
        iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        pill: "Type",
        subtext: "Payment transactions",
    },
    {
        title: "Refunds",
        value: purchasePaymentSummary.value?.refund ?? 0,
        icon: "fa-solid fa-rotate-left",
        iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
        pill: "Type",
        subtext: "Refund transactions",
    },
    {
        title: "Adjustments",
        value: purchasePaymentSummary.value?.adjustment ?? 0,
        icon: "fa-solid fa-sliders",
        iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        pill: "Type",
        subtext: "Adjustment transactions",
    },
    {
        title: "Cash",
        value: purchasePaymentSummary.value?.cash ?? 0,
        icon: "fa-solid fa-money-bill-wave",
        iconWrap: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
        pill: "Method",
        subtext: "Cash transactions",
    },
    {
        title: "Card",
        value: purchasePaymentSummary.value?.card ?? 0,
        icon: "fa-solid fa-credit-card",
        iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
        pill: "Method",
        subtext: "Card transactions",
    },
    {
        title: "Bank Transfer",
        value: purchasePaymentSummary.value?.bank_transfer ?? 0,
        icon: "fa-solid fa-building-columns",
        iconWrap: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
        pill: "Method",
        subtext: "Bank transactions",
    },
    {
        title: "bKash",
        value: purchasePaymentSummary.value?.bkash ?? 0,
        icon: "fa-solid fa-mobile-screen",
        iconWrap: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
        pill: "Method",
        subtext: "bKash transactions",
    },
    {
        title: "Nagad",
        value: purchasePaymentSummary.value?.nagad ?? 0,
        icon: "fa-solid fa-wallet",
        iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
        pill: "Method",
        subtext: "Nagad transactions",
    },
    {
        title: "Rocket",
        value: purchasePaymentSummary.value?.rocket ?? 0,
        icon: "fa-solid fa-rocket",
        iconWrap: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
        pill: "Method",
        subtext: "Rocket transactions",
    },
    {
        title: "Wallet",
        value: purchasePaymentSummary.value?.wallet ?? 0,
        icon: "fa-solid fa-wallet",
        iconWrap: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
        pill: "Method",
        subtext: "Wallet transactions",
    },
    {
        title: "Total Amount",
        value: purchasePaymentSummary.value?.total_amount ?? 0,
        icon: "fa-solid fa-sack-dollar",
        iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
        pill: "Amount",
        subtext: "Total payment amount",
    },
    {
        title: "Discount",
        value: purchasePaymentSummary.value?.total_discount ?? 0,
        icon: "fa-solid fa-tag",
        iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        pill: "Amount",
        subtext: "Total payment discount",
    },
    {
        title: "Net Amount",
        value: purchasePaymentSummary.value?.net_amount ?? 0,
        icon: "fa-solid fa-coins",
        iconWrap: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
        pill: "Amount",
        subtext: "Amount after discount",
    },
    {
        title: "Verified",
        value: purchasePaymentSummary.value?.verified_transactions ?? 0,
        icon: "fa-solid fa-circle-check",
        iconWrap: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
        pill: "Verification",
        subtext: "Verified transactions",
    },
    {
        title: "Unverified",
        value: purchasePaymentSummary.value?.unverified_transactions ?? 0,
        icon: "fa-solid fa-circle-question",
        iconWrap: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
        pill: "Verification",
        subtext: "Unverified transactions",
    },
    {
        title: "Today",
        value: purchasePaymentSummary.value?.today_transactions ?? 0,
        icon: "fa-solid fa-calendar-day",
        iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        pill: "Today",
        subtext: "Today's transactions",
    },
    {
        title: "This Month",
        value: purchasePaymentSummary.value?.this_month_transactions ?? 0,
        icon: "fa-solid fa-calendar",
        iconWrap: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
        pill: "Month",
        subtext: "This month's transactions",
    },
]);

/* ===================== NEW: Purchase Order remaining fields grouped ===================== */
const purchaseStatGroups = computed(() => {
    const s = purchaseOrderSummary.value || {};
    const p = purchasePaymentSummary.value || {};

    return [
        {
            title: "Purchase Order Status Percentage",
            subtitle: "Share of each purchase order status out of total purchase orders",
            items: [
                { label: "Pending %", display: formatPercent(s.pending_percentage), icon: "fa-solid fa-clock", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Unpaid %", display: formatPercent(s.unpaid_percentage), icon: "fa-solid fa-file-invoice-dollar", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
                { label: "Paid %", display: formatPercent(s.paid_percentage), icon: "fa-solid fa-money-check-dollar", iconWrap: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
                { label: "Partially Paid %", display: formatPercent(s.partially_paid_percentage), icon: "fa-solid fa-coins", iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
                { label: "Completed %", display: formatPercent(s.completed_percentage), icon: "fa-solid fa-circle-check", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Returned %", display: formatPercent(s.returned_percentage), icon: "fa-solid fa-rotate-left", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
            ],
        },
        {
            title: "Purchase Amount by Payment Method",
            subtitle: "Total payable amount by payment method",
            items: [
                { label: "Cash Amount", display: formatCurrency(s.cash_amount), icon: "fa-solid fa-money-bill-wave", iconWrap: "bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400" },
                { label: "Card Amount", display: formatCurrency(s.card_amount), icon: "fa-solid fa-credit-card", iconWrap: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400" },
                { label: "Bank Transfer Amount", display: formatCurrency(s.bank_transfer_amount), icon: "fa-solid fa-building-columns", iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                { label: "bKash Amount", display: formatCurrency(s.bkash_amount), icon: "fa-solid fa-mobile-screen", iconWrap: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400" },
                { label: "Nagad Amount", display: formatCurrency(s.nagad_amount), icon: "fa-solid fa-wallet", iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
                { label: "Rocket Amount", display: formatCurrency(s.rocket_amount), icon: "fa-solid fa-rocket", iconWrap: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
                { label: "Wallet Amount", display: formatCurrency(s.wallet_amount), icon: "fa-solid fa-wallet", iconWrap: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400" },
            ],
        },
        {
            title: "Supplier Breakdown",
            subtitle: "Purchases and dues linked to suppliers",
            items: [
                { label: "Total Suppliers", display: formatNumber(s.total_suppliers), icon: "fa-solid fa-truck-field", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Supplier Purchases", display: formatCurrency(s.supplier_purchases), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Supplier Due", display: formatCurrency(s.supplier_due), icon: "fa-solid fa-wallet", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
                { label: "Fully Paid Purchase Orders", display: formatNumber(s.fully_paid_purchase_orders), icon: "fa-solid fa-circle-check", iconWrap: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
                { label: "Zero Value Purchase Orders", display: formatNumber(s.zero_value_purchase_orders), icon: "fa-solid fa-ban", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
            ],
        },
        {
            title: "Purchase Discount & VAT Breakdown",
            subtitle: "How discount and VAT are distributed across purchase orders",
            items: [
                { label: "Orders with Discount", display: formatNumber(s.orders_with_discount), icon: "fa-solid fa-tag", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Orders without Discount", display: formatNumber(s.orders_without_discount), icon: "fa-solid fa-tag", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                { label: "Average Discount", display: formatCurrency(s.average_discount), icon: "fa-solid fa-tags", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Orders with VAT", display: formatNumber(s.orders_with_vat), icon: "fa-solid fa-receipt", iconWrap: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400" },
                { label: "Orders without VAT", display: formatNumber(s.orders_without_vat), icon: "fa-solid fa-receipt", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                { label: "Average VAT", display: formatCurrency(s.average_vat), icon: "fa-solid fa-receipt", iconWrap: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400" },
            ],
        },
        {
            title: "Purchase Averages",
            subtitle: "Average financial figures per purchase order",
            items: [
                { label: "Average Purchase Order Value", display: formatCurrency(s.average_purchase_order_value), icon: "fa-solid fa-chart-simple", iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                { label: "Average Subtotal", display: formatCurrency(s.average_subtotal), icon: "fa-solid fa-chart-simple", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Average Due / Order", display: formatCurrency(s.average_due_per_order), icon: "fa-solid fa-chart-simple", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
            ],
        },
        {
            title: "Today's Purchase Performance",
            subtitle: "Purchase order activity for today",
            items: [
                { label: "Today's Purchase Orders", display: formatNumber(s.today_purchase_orders), icon: "fa-solid fa-calendar-day", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Today's Purchase Amount", display: formatCurrency(s.today_purchase_amount), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Today's Purchase Due", display: formatCurrency(s.today_purchase_due), icon: "fa-solid fa-wallet", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
            ],
        },
        {
            title: "This Month's Purchase Performance",
            subtitle: "Purchase order activity for the current month",
            items: [
                { label: "This Month's Purchase Orders", display: formatNumber(s.this_month_purchase_orders), icon: "fa-solid fa-calendar", iconWrap: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" },
                { label: "This Month's Purchase Amount", display: formatCurrency(s.this_month_purchase_amount), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "This Month's Discount", display: formatCurrency(s.this_month_purchase_discount), icon: "fa-solid fa-tag", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "This Month's VAT", display: formatCurrency(s.this_month_purchase_vat), icon: "fa-solid fa-receipt", iconWrap: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400" },
                { label: "This Month's Due", display: formatCurrency(s.this_month_purchase_due), icon: "fa-solid fa-wallet", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
            ],
        },
        {
            title: "Purchase Sales & Due by Status",
            subtitle: "Payable amount and outstanding due, broken down by status",
            items: [
                { label: "Completed Amount", display: formatCurrency(s.completed_purchase_amount), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Completed Due", display: formatCurrency(s.completed_purchase_due), icon: "fa-solid fa-wallet", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Pending Amount", display: formatCurrency(s.pending_purchase_amount), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Pending Due", display: formatCurrency(s.pending_purchase_due), icon: "fa-solid fa-wallet", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { label: "Unpaid Amount", display: formatCurrency(s.unpaid_purchase_amount), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
                { label: "Unpaid Due", display: formatCurrency(s.unpaid_purchase_due), icon: "fa-solid fa-wallet", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
                { label: "Paid Amount", display: formatCurrency(s.paid_purchase_amount), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
                { label: "Partial Paid Amount", display: formatCurrency(s.partial_paid_purchase_amount), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
                { label: "Partial Paid Due", display: formatCurrency(s.partial_paid_purchase_due), icon: "fa-solid fa-wallet", iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
                { label: "Returned Amount", display: formatCurrency(s.returned_purchase_amount), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                { label: "Returned Due", display: formatCurrency(s.returned_purchase_due), icon: "fa-solid fa-wallet", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
            ],
        },
        {
            title: "Other Purchase Stats",
            subtitle: "Miscellaneous purchase order-level figures",
            items: [
                { label: "BDT Purchase Orders", display: formatNumber(s.bdt_purchase_orders), icon: "fa-solid fa-money-bill-1", iconWrap: "bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400" },
                { label: "Total Purchase Users", display: formatNumber(s.total_purchase_users), icon: "fa-solid fa-user-tie", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Net Purchase", display: formatCurrency(s.net_purchase), icon: "fa-solid fa-sack-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Completed With Date", display: formatNumber(s.completed_with_date), icon: "fa-solid fa-check-double", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Returned With Date", display: formatNumber(s.returned_with_date), icon: "fa-solid fa-rotate-left", iconWrap: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
            ],
        },

        // ---- Purchase Payment Summary ----
        {
            title: "Purchase Payment Type Amounts",
            subtitle: "Amount paid by transaction type",
            items: [
                { label: "Payment Amount", display: formatCurrency(p.payment_amount), icon: "fa-solid fa-circle-check", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { label: "Refund Amount", display: formatCurrency(p.refund_amount), icon: "fa-solid fa-rotate-left", iconWrap: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" },
                { label: "Adjustment Amount", display: formatCurrency(p.adjustment_amount), icon: "fa-solid fa-sliders", iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
            ],
        },
        {
            title: "Purchase Payment Amounts by Method",
            subtitle: "Transaction amount paid per payment method",
            items: [
                { label: "Cash Amount", display: formatCurrency(p.cash_amount), icon: "fa-solid fa-money-bill-wave", iconWrap: "bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400" },
                { label: "Card Amount", display: formatCurrency(p.card_amount), icon: "fa-solid fa-credit-card", iconWrap: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400" },
                { label: "Bank Transfer Amount", display: formatCurrency(p.bank_transfer_amount), icon: "fa-solid fa-building-columns", iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                { label: "bKash Amount", display: formatCurrency(p.bkash_amount), icon: "fa-solid fa-mobile-screen", iconWrap: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400" },
                { label: "Nagad Amount", display: formatCurrency(p.nagad_amount), icon: "fa-solid fa-wallet", iconWrap: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" },
                { label: "Rocket Amount", display: formatCurrency(p.rocket_amount), icon: "fa-solid fa-rocket", iconWrap: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
                { label: "Wallet Amount", display: formatCurrency(p.wallet_amount), icon: "fa-solid fa-wallet", iconWrap: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400" },
            ],
        },
        {
            title: "Purchase Payment Supplier Breakdown",
            subtitle: "Supplier-linked transaction activity",
            items: [
                { label: "Total Suppliers", display: formatNumber(p.total_suppliers), icon: "fa-solid fa-truck-field", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Supplier Transactions", display: formatNumber(p.supplier_transactions), icon: "fa-solid fa-user-check", iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                { label: "Received Transactions", display: formatNumber(p.received_transactions), icon: "fa-solid fa-hand-holding-dollar", iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
            ],
        },
        {
            title: "Purchase Payment Time & Averages",
            subtitle: "Recent activity and average transaction figures",
            items: [
                { label: "Today's Amount", display: formatCurrency(p.today_amount), icon: "fa-solid fa-calendar-day", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "This Month's Amount", display: formatCurrency(p.this_month_amount), icon: "fa-solid fa-calendar", iconWrap: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" },
                { label: "Average Payment", display: formatCurrency(p.average_payment), icon: "fa-solid fa-chart-simple", iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
                { label: "Total Purchase Orders Paid", display: formatNumber(p.total_orders_paid), icon: "fa-solid fa-box", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { label: "Total Payment Users", display: formatNumber(p.total_payment_users), icon: "fa-solid fa-user-tie", iconWrap: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
            ],
        },
    ];
});

onMounted(() => {
    fetchDashBoardData();
});
</script>

<style scoped>
</style>