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
                <main class="flex-1 min-h-screen min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 lg:px-8 py-6 transition-colors duration-300">

                    <!-- Loading skeleton -->
                    <div v-if="loading && !order" class="space-y-6 animate-pulse">
                        <div class="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800/60">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                                <div class="space-y-2">
                                    <div class="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                    <div class="h-3 w-56 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <div class="h-9 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                                <div class="h-9 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div class="lg:col-span-2 space-y-6">
                                <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div v-for="n in 4" :key="n" class="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                                </div>
                                <div class="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                                <div class="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                            </div>
                            <div class="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                        </div>
                    </div>

                    <!-- Not found -->
                    <div v-else-if="!order" class="flex flex-col items-center text-center py-24">
                        <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mb-4">
                            <i class="fa-solid fa-circle-exclamation text-2xl text-slate-400 dark:text-slate-500"></i>
                        </div>
                        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">Order not found</p>
                        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
                            {{ errorMsg || 'This order may not exist or may have been removed.' }}
                        </p>
                        <button
                            @click="$router.back()"
                            class="mt-5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
                        >
                            Go back
                        </button>
                    </div>

                    <div v-else>

                        <!-- Page header -->
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200 dark:border-slate-800/60">

                            <div class="flex items-center gap-4">
                                <button
                                    @click="$router.back()"
                                    aria-label="Go back"
                                    class="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm shrink-0"
                                >
                                    <i class="fa-solid fa-arrow-left-long text-slate-600 dark:text-slate-400"></i>
                                </button>

                                <div class="space-y-1">
                                    <div class="flex flex-wrap items-center gap-2.5">
                                        <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            Order <span class="text-indigo-600 dark:text-indigo-400">#{{ order.order_number }}</span>
                                        </h1>

                                        <span
                                            v-if="Number(order.discount) > 0"
                                            class="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-500/20"
                                        >
                                            <i class="fa-solid fa-tag text-[10px]"></i>
                                            Discount applied
                                        </span>
                                    </div>

                                    <p class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <i class="fa-regular fa-calendar text-slate-400 dark:text-slate-500"></i>
                                        Placed on {{ formatDate(order.order_date) }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center gap-3">
                                <button v-if="order.status == 'partially_paid'"
                                    type="button"
                                    @click.stop="openDueCollection(order)"
                                    class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition shadow-sm"
                                >
                                    <i class="fa-solid fa-money-check mr-1.5"></i>
                                    Collect due
                                </button>

                                <button
                                    type="button"
                                    @click="printOrder(order)"
                                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm shadow-indigo-500/20 transition"
                                >
                                    <i class="fa-solid fa-print mr-1.5"></i>
                                    Print details
                                </button>
                            </div>
                        </div>


                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            <!-- LEFT -->
                            <div class="lg:col-span-2 space-y-6">

                                <!-- Metric cards -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                                    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div class="flex items-center gap-2 mb-3 text-slate-400">
                                            <i class="fa-regular fa-calendar text-sm"></i>
                                            <p class="text-xs font-medium uppercase tracking-wider">Payment date</p>
                                        </div>
                                        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {{ order.paid_at ? formatDate(order.paid_at) : 'Not paid yet' }}
                                        </p>
                                    </div>

                                    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div class="flex items-center gap-2 mb-3 text-slate-400">
                                            <i class="fa-solid fa-wallet text-sm"></i>
                                            <p class="text-xs font-medium uppercase tracking-wider">Total amount</p>
                                        </div>
                                        <p class="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                                            {{ money(order.payable_amount) }}
                                        </p>
                                    </div>

                                    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div class="flex items-center gap-2 mb-3 text-slate-400">
                                            <i class="fa-solid fa-truck-fast text-sm"></i>
                                            <p class="text-xs font-medium uppercase tracking-wider">Order status</p>
                                        </div>
                                        <span
                                            class="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase inline-flex items-center gap-1.5 border"
                                            :class="statusClass(order.status)"
                                        >
                                            <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                                            {{ order.status }}
                                        </span>
                                    </div>

                                    <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div class="flex items-center gap-2 mb-3 text-slate-400">
                                            <i class="fa-regular fa-star text-sm"></i>
                                            <p class="text-xs font-medium uppercase tracking-wider">Total points</p>
                                        </div>
                                        <p class="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                                            {{ Number(order.point || 0).toLocaleString() }}
                                        </p>
                                    </div>
                                </div>


                                <!-- Payment details -->
                                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                                    <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Payment details</span>
                                                <span
                                                    class="px-2 py-0.5 text-[10px] font-bold rounded-full"
                                                    :class="isFullyPaid
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                                                        : 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400'"
                                                >
                                                    {{ isFullyPaid ? 'Paid' : 'Due' }}
                                                </span>
                                            </div>
                                            <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{{ order?.order_number }}</h3>
                                        </div>

                                        <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                                            <i class="fa-solid fa-money-bill-wave text-emerald-500"></i>
                                            {{ order?.payment_method || 'N/A' }}
                                        </span>
                                    </div>

                                    <div class="px-6 py-5 space-y-5">

                                        <!-- Order info -->
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm pb-4 border-b border-slate-100 dark:border-slate-800">
                                            <div class="flex justify-between gap-3">
                                                <span class="text-slate-500 dark:text-slate-400">Order ref</span>
                                                <span class="font-semibold text-slate-900 dark:text-white font-mono">{{ order?.order_number }}</span>
                                            </div>
                                            <div class="flex justify-between gap-3">
                                                <span class="text-slate-500 dark:text-slate-400">Customer ID</span>
                                                <span class="font-semibold text-slate-800 dark:text-slate-200">#{{ order?.customer_id || 'N/A' }}</span>
                                            </div>
                                            <div class="flex justify-between gap-3">
                                                <span class="text-slate-500 dark:text-slate-400">Reg no</span>
                                                <span class="font-semibold text-slate-800 dark:text-slate-200 font-mono">{{ order?.reg }}</span>
                                            </div>
                                            <div class="flex justify-between gap-3">
                                                <span class="text-slate-500 dark:text-slate-400">Date</span>
                                                <span class="font-medium text-slate-700 dark:text-slate-300 text-xs">{{ formatDateTime(order?.created_at) }}</span>
                                            </div>
                                            <div class="flex justify-between gap-3 sm:col-span-2">
                                                <span class="text-slate-500 dark:text-slate-400">Customer</span>
                                                <span class="font-semibold text-slate-800 dark:text-slate-200">{{ order?.customer_name || 'N/A' }}</span>
                                            </div>
                                        </div>

                                        <!-- Amount summary -->
                                        <div>
                                            <h4 class="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">Amount summary</h4>

                                            <div class="space-y-2 text-sm">
                                                <div class="flex justify-between text-slate-500 dark:text-slate-400">
                                                    <span>Subtotal</span>
                                                    <span class="font-medium text-slate-700 dark:text-slate-300">{{ money(order?.subtotal) }}</span>
                                                </div>

                                                <div v-if="Number(order?.discount || 0) > 0" class="flex justify-between text-slate-500 dark:text-slate-400">
                                                    <span>Discount</span>
                                                    <span class="font-medium text-emerald-600 dark:text-emerald-400">− {{ money(order?.discount) }}</span>
                                                </div>

                                                <div v-if="Number(order?.vat || 0) > 0" class="flex justify-between text-slate-500 dark:text-slate-400">
                                                    <span>VAT <span v-if="Number(order?.vat_percentage || 0) > 0">({{ order.vat_percentage }}%)</span></span>
                                                    <span class="font-medium text-slate-700 dark:text-slate-300">+ {{ money(order?.vat) }}</span>
                                                </div>

                                                <div v-if="Number(order?.shipping_charge || 0) > 0" class="flex justify-between text-slate-500 dark:text-slate-400">
                                                    <span>Shipping</span>
                                                    <span class="font-medium text-slate-700 dark:text-slate-300">+ {{ money(order?.shipping_charge) }}</span>
                                                </div>
                                            </div>

                                            <div class="flex justify-between items-baseline border-t border-slate-100 dark:border-slate-800 mt-4 pt-4">
                                                <span class="text-sm font-bold text-slate-900 dark:text-white">Total payable</span>
                                                <span class="text-2xl font-mono font-black text-indigo-600 dark:text-indigo-400">{{ money(order?.payable_amount) }}</span>
                                            </div>

                                            <div class="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-2">
                                                <div class="flex justify-between items-center text-sm">
                                                    <span class="text-slate-500 dark:text-slate-400">
                                                        <i class="fa-solid fa-circle-check text-emerald-500 mr-1.5"></i>
                                                        Total paid
                                                    </span>
                                                    <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">{{ money(totalPaid) }}</span>
                                                </div>

                                                <div class="text-right">
                                                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                        Current Due
                                                    </p>

                                                    <p class="mt-0.5 text-base font-black text-red-600 dark:text-red-400">
                                                        ৳ {{ money(currentDue) }}
                                                    </p>
                                                </div>

                                                <div class="pt-1">
                                                    <span
                                                        v-if="currentDue > 0"
                                                        class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full"
                                                    >
                                                        <i class="fa-solid fa-triangle-exclamation"></i>
                                                        Partially paid
                                                    </span>
                                                    <span
                                                        v-else
                                                        class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full"
                                                    >
                                                        <i class="fa-solid fa-circle-check"></i>
                                                        Fully paid
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Payment history -->
                                        <div v-if="orderPayments.length" class="pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <div class="flex items-center justify-between mb-3">
                                                <h4 class="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                                    Payment History
                                                </h4>

                                                <span class="text-[11px] font-semibold text-slate-400">
                                                    {{ orderPayments.length }} transaction<span v-if="orderPayments.length !== 1">s</span>
                                                </span>
                                            </div>

                                            <div class="space-y-2">
                                                <div
                                                    v-for="(payment, index) in orderPayments"
                                                    :key="payment.id || index"
                                                    class="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 overflow-hidden"
                                                >
                                                    <!-- Payment Summary -->
                                                    <button
                                                        type="button"
                                                        @click="togglePaymentDetails(payment.id || index)"
                                                        class="w-full flex items-center justify-between gap-3 px-3 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                                    >
                                                        <div class="min-w-0 flex-1">
                                                            <div class="flex items-center gap-2 flex-wrap">
                                                                <!-- Payment Number -->
                                                                <span class="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                                                                    {{ payment.payment_number || payment.receipt_no || `Payment #${index + 1}` }}
                                                                </span>

                                                                <!-- Payment Type -->
                                                                <span
                                                                    v-if="payment.payment_type"
                                                                    class="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold uppercase"
                                                                >
                                                                    {{ payment.payment_type }}
                                                                </span>

                                                                <!-- Payment Method -->
                                                                <span
                                                                    class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold uppercase"
                                                                >
                                                                    {{ payment.payment_method || 'N/A' }}
                                                                </span>
                                                            </div>

                                                            <p class="text-[11px] text-slate-400 mt-1">
                                                                {{ payment.user?.name || 'N/A' }}

                                                                <span v-if="payment.paid_at">
                                                                    · {{ formatDateTime(payment.paid_at) }}
                                                                </span>
                                                            </p>
                                                        </div>

                                                        <!-- Amount + Arrow -->
                                                        <div class="shrink-0 flex items-center gap-2">
                                                            <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                                + {{ money(payment.amount) }}
                                                            </span>

                                                            <svg
                                                                class="w-4 h-4 text-slate-400 transition-transform duration-200"
                                                                :class="{
                                                                    'rotate-180': expandedPaymentId === (payment.id || index)
                                                                }"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                    stroke-width="2"
                                                                    d="M19 9l-7 7-7-7"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </button>

                                                    <!-- Payment Details -->
                                                    <div
                                                        v-if="expandedPaymentId === (payment.id || index)"
                                                        class="px-3 pb-3"
                                                    >
                                                        <div class="pt-3 border-t border-slate-200 dark:border-slate-700">
                                                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">

                                                                <!-- Payment ID -->
                                                                <div
                                                                    v-if="payment.id"
                                                                    class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                                >
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Payment ID
                                                                    </p>
                                                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                                                                        #{{ payment.id }}
                                                                    </p>
                                                                </div>

                                                                <!-- Payment Number -->
                                                                <div
                                                                    v-if="payment.payment_number"
                                                                    class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                                >
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Payment Number
                                                                    </p>
                                                                    <p class="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                                                                        {{ payment.payment_number }}
                                                                    </p>
                                                                </div>

                                                                <!-- Receipt No -->
                                                                <div
                                                                    v-if="payment.receipt_no"
                                                                    class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                                >
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Receipt No
                                                                    </p>
                                                                    <p class="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                                                                        {{ payment.receipt_no }}
                                                                    </p>
                                                                </div>

                                                                <!-- Payment Type -->
                                                                <div
                                                                    v-if="payment.payment_type"
                                                                    class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                                >
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Payment Type
                                                                    </p>
                                                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 capitalize">
                                                                        {{ payment.payment_type }}
                                                                    </p>
                                                                </div>

                                                                <!-- Payment Method -->
                                                                <div
                                                                    v-if="payment.payment_method"
                                                                    class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                                >
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Payment Method
                                                                    </p>
                                                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                                                                        {{ payment.payment_method }}
                                                                    </p>
                                                                </div>

                                                                <!-- Discount -->
                                                                <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Discount
                                                                    </p>
                                                                    <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                                        {{ money(payment.discount) }}
                                                                    </p>
                                                                </div>

                                                                <!-- Amount -->
                                                                <div class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Amount
                                                                    </p>
                                                                    <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                                        {{ money(payment.amount) }}
                                                                    </p>
                                                                </div>

                                                                <!-- Currency -->
                                                                <div
                                                                    v-if="payment.currency"
                                                                    class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                                >
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Currency
                                                                    </p>
                                                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 uppercase">
                                                                        {{ payment.currency }}
                                                                    </p>
                                                                </div>

                                                                <!-- Paid At -->
                                                                <div
                                                                    v-if="payment.paid_at"
                                                                    class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                                >
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Paid At
                                                                    </p>
                                                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                                                                        {{ formatDateTime(payment.paid_at) }}
                                                                    </p>
                                                                </div>

                                                                <!-- Verified At -->
                                                                <div
                                                                    v-if="payment.verified_at"
                                                                    class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                                >
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Verified At
                                                                    </p>
                                                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                                                                        {{ formatDateTime(payment.verified_at) }}
                                                                    </p>
                                                                </div>

                                                                <!-- Customer -->
                                                                <div
                                                                    v-if="payment.customer"
                                                                    class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                                >
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Customer
                                                                    </p>
                                                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                                                                        {{ payment.customer?.name || 'N/A' }}
                                                                    </p>
                                                                </div>

                                                                <!-- Received By -->
                                                                <div
                                                                    v-if="payment.received_by"
                                                                    class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                                >
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Received By
                                                                    </p>
                                                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                                                                        {{ payment.receiver?.name || payment.received_by }}
                                                                    </p>
                                                                </div>

                                                                <!-- Verified By -->
                                                                <div
                                                                    v-if="payment.verified_by"
                                                                    class="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                                >
                                                                    <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                        Verified By
                                                                    </p>
                                                                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                                                                        {{ payment.verified_by?.name || payment.verified_by }}
                                                                    </p>
                                                                </div>

                                                            </div>

                                                            <!-- Remarks -->
                                                            <div
                                                                v-if="payment.remarks"
                                                                class="mt-2 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700"
                                                            >
                                                                <p class="text-[10px] uppercase font-semibold text-slate-400">
                                                                    Remarks
                                                                </p>

                                                                <p class="text-xs text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap">
                                                                    {{ payment.remarks }}
                                                                </p>
                                                            </div>

                                                            <!-- Technical Information -->
                                                            <div
                                                                v-if="payment.ip_address || payment.user_agent"
                                                                class="mt-2"
                                                            >
                                                                <div class="px-2.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700">
                                                                    <p class="text-[10px] uppercase font-bold tracking-wide text-slate-400 mb-2">
                                                                        Technical Information
                                                                    </p>

                                                                    <div class="space-y-2">

                                                                        <!-- IP Address -->
                                                                        <div v-if="payment.ip_address">
                                                                            <p class="text-[10px] font-semibold text-slate-400">
                                                                                IP Address
                                                                            </p>

                                                                            <p class="text-xs font-mono text-slate-700 dark:text-slate-300 break-all">
                                                                                {{ payment.ip_address }}
                                                                            </p>
                                                                        </div>

                                                                        <!-- User Agent -->
                                                                        <div v-if="payment.user_agent">
                                                                            <p class="text-[10px] font-semibold text-slate-400">
                                                                                User Agent
                                                                            </p>

                                                                            <p class="text-[11px] font-mono text-slate-600 dark:text-slate-400 break-all leading-relaxed">
                                                                                {{ payment.user_agent }}
                                                                            </p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Remarks -->
                                        <div
                                            v-if="order?.remarks"
                                            class="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 text-xs"
                                        >
                                            <span class="text-amber-700 dark:text-amber-400 font-bold block mb-1">
                                                <i class="fa-regular fa-comment-dots mr-1"></i>
                                                Note
                                            </span>
                                            <p class="text-slate-700 dark:text-slate-300 italic">{{ order.remarks }}</p>
                                        </div>

                                        <!-- Technical details -->
                                        <details class="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 text-xs group">
                                            <summary class="text-slate-400 dark:text-slate-500 cursor-pointer select-none list-none flex items-center justify-between">
                                                <span><i class="fa-solid fa-circle-info mr-1"></i> Technical details</span>
                                                <i class="fa-solid fa-chevron-down text-[10px] transition-transform group-open:rotate-180"></i>
                                            </summary>

                                            <div class="mt-3 grid grid-cols-2 gap-y-2 text-slate-500 dark:text-slate-400">
                                                <span>Browser</span>
                                                <span class="text-right font-medium text-slate-700 dark:text-slate-300 truncate">{{ browserName }}</span>

                                                <span>OS</span>
                                                <span class="text-right font-medium text-slate-700 dark:text-slate-300 truncate">{{ operatingSystem }}</span>

                                                <span>IP address</span>
                                                <span class="text-right font-medium text-slate-700 dark:text-slate-300">{{ order?.ip_address || 'N/A' }}</span>

                                                <span>User agent</span>
                                                <span class="text-right font-medium text-slate-700 dark:text-slate-300 truncate" :title="order?.user_agent">
                                                    {{ order?.user_agent || 'N/A' }}
                                                </span>
                                            </div>
                                        </details>

                                    </div>
                                </div>


                                <!-- Order items -->
                                <div class="space-y-4">

                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                <i class="fa-solid fa-bag-shopping"></i>
                                            </div>
                                            <div>
                                                <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-tight">Order items</h3>
                                                <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Products included in this order</p>
                                            </div>
                                        </div>

                                        <span class="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                                            {{ cartItems?.length || 0 }}
                                        </span>
                                    </div>

                                    <div
                                        v-for="item in cartItems || []"
                                        :key="item.id"
                                        class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors"
                                    >
                                        <div class="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5">

                                            <!-- Product image -->
                                            <div class="relative w-full h-44 sm:w-24 sm:h-24 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                                <img
                                                    :src="getProductImage(item)"
                                                    :alt="item.product?.name || 'Product'"
                                                    class="h-full w-full object-cover"
                                                    @error="$event.target.src = defaultProductImage"
                                                />
                                                <div class="absolute top-2 right-2 min-w-7 h-7 px-2 flex items-center justify-center rounded-md bg-slate-950/80 backdrop-blur-sm text-white text-[11px] font-bold">
                                                    ×{{ item.quantity }}
                                                </div>
                                            </div>

                                            <!-- Content -->
                                            <div class="flex-1 min-w-0 flex flex-col">

                                                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                    <div class="min-w-0">
                                                        <h4
                                                            class="text-base font-bold text-slate-900 dark:text-white leading-snug truncate"
                                                            :title="item.product?.name || item.product_name || 'Product'"
                                                        >
                                                            {{ item.product?.name || item.product_name || 'Product' }}
                                                        </h4>
                                                        <p v-if="item.product?.sku || item.sku" class="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                            SKU <span class="font-medium text-slate-500 dark:text-slate-400">{{ item.product?.sku || item.sku }}</span>
                                                        </p>
                                                    </div>

                                                    <div class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                                                        <i class="fa-solid fa-star text-[10px] text-indigo-500 dark:text-indigo-400"></i>
                                                        <span class="text-sm font-black text-indigo-600 dark:text-indigo-400">{{ Number(item.point ?? item.points ?? 0) }}</span>
                                                        <span class="text-[9px] font-bold text-indigo-400 dark:text-indigo-500">PTS</span>
                                                    </div>
                                                </div>

                                                <div class="mt-auto pt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                                                    <div class="flex items-center gap-4 text-sm">
                                                        <div>
                                                            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Unit price</p>
                                                            <p class="mt-0.5 font-semibold text-slate-700 dark:text-slate-300">{{ money(item.unit_price ?? item.price ?? 0) }}</p>
                                                        </div>
                                                        <div class="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                                                        <div>
                                                            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Quantity</p>
                                                            <p class="mt-0.5 font-semibold text-slate-700 dark:text-slate-300">{{ item.quantity }}</p>
                                                        </div>
                                                    </div>

                                                    <div class="sm:text-right">
                                                        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Item subtotal</p>
                                                        <p class="mt-0.5 text-lg font-black text-slate-900 dark:text-white">
                                                            {{ money(item.subtotal ?? (Number(item.unit_price ?? item.price ?? 0) * Number(item.quantity ?? 0))) }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Empty state -->
                                    <div
                                        v-if="!cartItems || cartItems.length === 0"
                                        class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-12 text-center"
                                    >
                                        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                                            <i class="fa-solid fa-box-open text-xl"></i>
                                        </div>
                                        <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300">No order items found</h4>
                                        <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">There are no products associated with this order.</p>
                                    </div>
                                </div>

                            </div>


                            <!-- RIGHT -->
                            <div class="space-y-6">
                                <div class="sticky top-16 space-y-6">

                                    <!-- Customer -->
                                    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                                        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                                            <h3 class="font-bold text-slate-900 dark:text-white">Customer details</h3>
                                        </div>

                                        <div class="p-6">

                                            <div class="text-center mb-6">
                                                <div class="relative inline-flex mb-4">
                                                    <div class="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-sm shadow-indigo-500/30">
                                                        {{ customerInitials }}
                                                    </div>
                                                    <div class="absolute -bottom-1.5 -right-1.5 bg-emerald-500 border-[3px] border-white dark:border-slate-900 h-5 w-5 rounded-full" title="Active"></div>
                                                </div>

                                                <h4 class="text-lg font-bold text-slate-900 dark:text-white">{{ order.customer_name || 'Walk-in customer' }}</h4>
                                                <p class="text-sm text-slate-500 mt-1">{{ order.customer_phone || 'No phone number' }}</p>
                                            </div>

                                            <div class="rounded-xl border border-slate-200/70 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">

                                                <div class="flex items-center gap-3 p-4">
                                                    <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700 text-slate-500 dark:text-slate-400 shrink-0">
                                                        <i class="fa-regular fa-user text-[13px]"></i>
                                                    </span>
                                                    <div class="min-w-0">
                                                        <p class="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Full name</p>
                                                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{{ order.customer_name || 'Walk-in customer' }}</p>
                                                    </div>
                                                </div>

                                                <div class="flex items-center gap-3 p-4">
                                                    <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700 text-slate-500 dark:text-slate-400 shrink-0">
                                                        <i class="fa-solid fa-phone text-[13px]"></i>
                                                    </span>
                                                    <div class="min-w-0">
                                                        <p class="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Phone number</p>
                                                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{{ order.customer_phone || 'N/A' }}</p>
                                                    </div>
                                                </div>

                                                <div class="flex items-center gap-3 p-4">
                                                    <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700 text-slate-500 dark:text-slate-400 shrink-0">
                                                        <i class="fa-solid fa-user-tag text-[13px]"></i>
                                                    </span>
                                                    <div class="min-w-0">
                                                        <p class="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Customer type</p>
                                                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                            {{ order.customer_id ? 'Registered customer' : 'Walk-in customer' }}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>

                                            <!-- Processed by -->
                                            <div v-if="order.user" class="mt-5 flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                                <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-900 ring-1 ring-slate-200/80 dark:ring-slate-700 text-indigo-500 shrink-0">
                                                    <i class="fa-solid fa-user-check text-[13px]"></i>
                                                </span>
                                                <div class="min-w-0">
                                                    <p class="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Processed by</p>
                                                    <p class="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{{ order.user.name }}</p>
                                                    <p class="text-xs text-slate-500 truncate">{{ order.user.user_id }}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>

                </main>
            </div>
        </div>
























        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
            >
                <div
                    v-if="isDueCollectionModalOpen"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
                    @click.self="closeDueCollectionModal"
                >
                    <div
                        @click.stop
                        class="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
                    >

                        <!-- ================================================= -->
                        <!-- Header -->
                        <!-- ================================================= -->

                        <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            
                            <div class="flex items-center gap-3">

                                <div
                                    class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"
                                >
                                    <i class="fa-solid fa-money-check-dollar"></i>
                                </div>

                                <div>
                                    <h3
                                        class="text-base font-bold text-slate-900 dark:text-white"
                                    >
                                        Due Collection
                                    </h3>

                                    <p
                                        class="text-xs text-slate-500 dark:text-slate-400"
                                    >
                                        Collect payment for this order
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                @click="closeDueCollectionModal"
                                :disabled="isSavingDueCollection"
                                class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
                            >
                                <i class="fa-solid fa-xmark text-sm"></i>
                            </button>

                        </div>


                        <!-- ================================================= -->
                        <!-- Body -->
                        <!-- ================================================= -->

                        <div class="p-5 space-y-4">

                            <!-- Order Information -->

                            <div
                                class="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 p-3.5"
                            >

                                <div class="flex items-center justify-between gap-3">

                                    <div>
                                        <p
                                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                                        >
                                            Order Number
                                        </p>

                                        <p
                                            class="mt-0.5 text-sm font-black text-slate-900 dark:text-white"
                                        >
                                            #{{ selectedDueOrder?.order_number }}
                                        </p>
                                    </div>

                                    <div class="text-right">

                                        <p
                                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                                        >
                                            Total Payable
                                        </p>

                                        <p
                                            class="mt-0.5 text-base font-black text-emerald-600 dark:text-orange-400"
                                        >
                                            ৳ {{ formatMoney(dueCollectionTotal) }}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div>
                                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                                    Payment Method
                                    <span class="text-rose-500 font-bold">*</span>
                                </label>

                                <div class="relative">
                                    <!-- Input Icon -->
                                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                                        <i class="fa-solid fa-wallet"></i>
                                    </span>

                                    <select
                                        v-model="paymentMethod"
                                        class="w-full pl-8 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 dark:border-slate-700/80 outline-none transition-all appearance-none cursor-pointer focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:focus:border-emerald-500 dark:focus:bg-slate-800"
                                        :class="{
                                            '!border-rose-500 focus:!ring-rose-500/10': paymentMethodError
                                        }"
                                    >
                                        <option value="1" disabled selected>-- Select Method --</option>
                                        <option value="cash">Cash</option>
                                        <option value="bkash">bKash</option>
                                        <option value="nagad">Nagad</option>
                                        <option value="card">Card</option>
                                        <option value="bank">Bank</option>
                                    </select>

                                    <!-- Custom Dropdown Chevron Icon -->
                                    <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </span>
                                </div>

                                <!-- Error Message -->
                                <p v-if="paymentMethodError" class="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                                    <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                    {{ paymentMethodError }}
                                </p>
                            </div>


                            <!-- ================================================= -->
                            <!-- Discount -->
                            <!-- ================================================= -->

                            <div>

                                <label
                                    class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                                >
                                    Discount

                                    <span class="text-slate-400 font-normal normal-case">
                                        (Optional)
                                    </span>
                                </label>

                                <div class="relative">

                                    <span
                                        class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400"
                                    >
                                        ৳
                                    </span>

                                    <input
                                        v-model="dueDiscountAmount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        class="w-full pl-8 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:focus:border-emerald-500 dark:focus:bg-slate-800"
                                        :class="{
                                            '!border-rose-500 focus:!ring-rose-500/10':
                                                dueDiscountAmountError
                                        }"
                                        @keyup.enter="saveDueCollection"
                                    />

                                </div>

                                <p
                                    v-if="dueDiscountAmountError"
                                    class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                                >
                                    <i
                                        class="fa-solid fa-circle-exclamation text-[10px]"
                                    ></i>

                                    {{ dueDiscountAmountError }}
                                </p>

                            </div>


                            <!-- ================================================= -->
                            <!-- Net Payable -->
                            <!-- ================================================= -->

                            <div
                                class="flex items-center justify-between text-sm"
                            >

                                <span
                                    class="font-medium text-slate-500 dark:text-slate-400"
                                >
                                    Net Payable
                                </span>

                                <span
                                    class="font-black text-slate-900 dark:text-white"
                                >
                                    ৳ {{ formatMoney(dueCollectionNetPayable) }}
                                </span>

                            </div>


                            <!-- ================================================= -->
                            <!-- Received Amount -->
                            <!-- ================================================= -->

                            <div>

                                <label
                                    class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                                >
                                    Received Amount
                                    <span class="text-rose-500">*</span>
                                </label>

                                <div class="relative">

                                    <span
                                        class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400"
                                    >
                                        ৳
                                    </span>

                                    <input
                                        v-model="dueReceivedAmount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Enter received amount"
                                        autofocus
                                        class="w-full pl-8 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:focus:border-emerald-500 dark:focus:bg-slate-800"
                                        :class="{
                                            '!border-rose-500 focus:!ring-rose-500/10':
                                                dueReceivedAmountError
                                        }"
                                        @keyup.enter="saveDueCollection"
                                    />

                                </div>

                                <p
                                    v-if="dueReceivedAmountError"
                                    class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                                >
                                    <i
                                        class="fa-solid fa-circle-exclamation text-[10px]"
                                    ></i>

                                    {{ dueReceivedAmountError }}
                                </p>

                            </div>

                            <div>
                                <label
                                    class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                                >
                                    Remark
                                </label>

                                <textarea
                                    v-model="paymentRemarks"
                                    rows="3"
                                    maxlength="1000"
                                    placeholder="Enter payment remark..."
                                    class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none resize-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                                    :class="{
                                        '!border-rose-500 focus:!ring-rose-500/10':
                                            paymentRemarksError
                                    }"
                                ></textarea>

                                <div class="flex justify-between items-center mt-1.5">
                                    <p
                                        v-if="paymentRemarksError"
                                        class="text-xs text-rose-500 flex items-center gap-1"
                                    >
                                        <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                        {{ paymentRemarksError }}
                                    </p>

                                    <span
                                        class="text-[10px] text-slate-400 ml-auto"
                                    >
                                        {{ paymentRemarks.length }}/1000
                                    </span>
                                </div>
                            </div>


                            <!-- ================================================= -->
                            <!-- Payment Result -->
                            <!-- ================================================= -->

                            <div
                                class="rounded-xl border overflow-hidden"
                            >

                                <!-- Due -->

                                <div
                                    v-if="dueCollectionDue > 0"
                                    class="flex items-center justify-between px-3.5 py-3 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20"
                                >

                                    <div
                                        class="flex items-center gap-2 text-red-700 dark:text-red-400"
                                    >
                                        <i class="fa-solid fa-clock text-xs"></i>

                                        <span class="text-sm font-bold">
                                            Due
                                        </span>
                                    </div>

                                    <span
                                        class="text-base font-black text-red-700 dark:text-red-400"
                                    >
                                        ৳ {{ formatMoney(dueCollectionDue) }}
                                    </span>

                                </div>


                                <!-- Return -->

                                <div
                                    v-else-if="dueCollectionReturn > 0"
                                    class="flex items-center justify-between px-3.5 py-3 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20"
                                >

                                    <div
                                        class="flex items-center gap-2 text-emerald-700 dark:text-emerald-400"
                                    >
                                        <i
                                            class="fa-solid fa-arrow-rotate-left text-xs"
                                        ></i>

                                        <span class="text-sm font-bold">
                                            Return
                                        </span>
                                    </div>

                                    <span
                                        class="text-base font-black text-emerald-700 dark:text-emerald-400"
                                    >
                                        ৳ {{ formatMoney(dueCollectionReturn) }}
                                    </span>

                                </div>


                                <!-- Fully Paid -->

                                <div
                                    v-else-if="dueCollectionIsFullyPaid"
                                    class="flex items-center justify-center gap-2 px-3.5 py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                >

                                    <i class="fa-solid fa-circle-check"></i>

                                    <span class="text-sm font-bold">
                                        Fully Paid
                                    </span>

                                </div>


                                <!-- No Payment -->

                                <div
                                    v-else
                                    class="flex items-center justify-between px-3.5 py-3 bg-slate-50 dark:bg-slate-800/60"
                                >

                                    <span
                                        class="text-sm font-semibold text-slate-500 dark:text-slate-400"
                                    >
                                        Payment Status
                                    </span>

                                    <span
                                        class="text-xs font-bold text-slate-400"
                                    >
                                        Enter received amount
                                    </span>

                                </div>

                            </div>

                        </div>


                        <!-- ================================================= -->
                        <!-- Footer -->
                        <!-- ================================================= -->

                        <div
                            class="px-5 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3"
                        >

                            <button
                                type="button"
                                @click="closeDueCollectionModal"
                                :disabled="isSavingDueCollection"
                                class="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:border-slate-700/80 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                @click="saveDueCollection"
                                :disabled="isSavingDueCollection"
                                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            >

                                <i
                                    v-if="isSavingDueCollection"
                                    class="fa-solid fa-spinner fa-spin text-xs"
                                ></i>

                                <i
                                    v-else
                                    class="fa-solid fa-check text-xs"
                                ></i>

                                <span>
                                    {{
                                        isSavingDueCollection
                                            ? "Saving..."
                                            : "Collect Payment"
                                    }}
                                </span>

                            </button>

                        </div>

                    </div>
                </div>
            </Transition>
        </Teleport>

    </div>
    <FooterSection />

</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRouter, useRoute } from 'vue-router'
import api from '../../../../services/api.js'

import Navbar from "../../admin/admin-navbar.vue";
import HeaderSection from "../../admin/admin-header.vue";
import Message from '../../../Message/message.vue'
import FooterSection from "../../../footer.vue";









const mobileMenu = ref(false);

function toggleMenu() {
    mobileMenu.value = !mobileMenu.value;
}









const router = useRouter();
const route = useRoute();
const loading = ref(false);
const successMsg = ref('');
const errorMsg = ref('');












// =============================
// Get orders
// =============================
const order = ref(null);
const cartItems = ref([]);
const payments = ref([]);
const totalPaid = ref(0);

async function fetchOrderDetails() {
    loading.value = true;

    try {
        const reg = route.params.reg;

        if (!reg) {
            errorMsg.value = "Invalid order reference.";
            return;
        }

        const res = await api.get(`/due/${reg}`);

        const data = res.data.data;

        order.value = data.order;
        cartItems.value = data.cartItems || [];
        payments.value = data.payments || [];
        totalPaid.value = Number(data.total_paid || 0);

    } catch (err) {
        errorMsg.value =
            err.response?.data?.message ||
            err.message ||
            "Something went wrong while fetching order.";
    } finally {
        loading.value = false;
    }
}

const defaultProductImage = "/images/product/default-product.webp";

const getProductImage = (item) => {
    const images = item.product?.images;
    if (images && images.length > 0) {
        return images[0].url;
    }
    return defaultProductImage;
};

// Payments list used by the template
const orderPayments = computed(() => payments.value || []);

// Current due for the order being viewed (not the due-collection modal)
const currentDue = computed(() => {
    if (!order.value) return 0;

    // Prefer a due_amount from the API if present, otherwise derive it
    if (order.value.due_amount !== undefined && order.value.due_amount !== null) {
        return Math.max(0, Number(order.value.due_amount));
    }

    const payable = Number(order.value.payable_amount || 0);
    return Math.max(0, payable - Number(totalPaid.value || 0));
});

const isFullyPaid = computed(() => currentDue.value <= 0);

const expandedPaymentId = ref(null);

function togglePaymentDetails(id) {
    expandedPaymentId.value =
        expandedPaymentId.value === id ? null : id;
}




// Money formatter
const money = (value) => {
    const amount = Number(value || 0);

    return `৳ ${amount.toLocaleString('en-BD', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};


// Date
const formatDate = (date) => {
    if (!date) {
        return 'N/A';
    }

    return new Date(date).toLocaleDateString('en-BD', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });
};


// Date + Time
const formatDateTime = (date) => {
    if (!date) {
        return 'N/A';
    }

    return new Date(date).toLocaleString('en-BD', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};


// Paid amount
const paidAmount = computed(() => {
    if (!order.value) {
        return 0;
    }

    const payable = Number(order.value.payable_amount || 0);
    const due = Number(order.value.due_amount || 0);

    return Math.max(0, payable - due);
});


// Customer initials
const customerInitials = computed(() => {

    const name = order.value?.customer_name || 'Walk-in Customer';

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();
});


// Browser
const browserName = computed(() => {

    const ua = order.value?.user_agent || '';

    if (!ua) {
        return 'Unknown';
    }

    if (ua.includes('Firefox')) {
        return 'Firefox';
    }

    if (ua.includes('Chrome') && !ua.includes('Edg')) {
        return 'Google Chrome';
    }

    if (ua.includes('Edg')) {
        return 'Microsoft Edge';
    }

    if (ua.includes('Safari') && !ua.includes('Chrome')) {
        return 'Safari';
    }

    return 'Unknown Browser';
});

const operatingSystem = computed(() => {
    const ua = order.value?.user_agent || '';

    if (!ua) {
        return 'Unknown';
    }

    // Windows
    if (/Windows NT 10.0/i.test(ua)) {
        return 'Windows 10/11';
    }

    if (/Windows NT 6.3/i.test(ua)) {
        return 'Windows 8.1';
    }

    if (/Windows NT 6.2/i.test(ua)) {
        return 'Windows 8';
    }

    if (/Windows NT 6.1/i.test(ua)) {
        return 'Windows 7';
    }

    // macOS
    if (/Mac OS X/i.test(ua)) {
        return 'macOS';
    }

    // Android
    if (/Android/i.test(ua)) {
        const match = ua.match(/Android\s([0-9.]+)/i);

        return match
            ? `Android ${match[1]}`
            : 'Android';
    }

    // iPhone / iPad
    if (/iPhone|iPad|iPod/i.test(ua)) {
        return 'iOS';
    }

    // Linux
    if (/Linux/i.test(ua)) {
        return 'Linux';
    }

    // Chrome OS
    if (/CrOS/i.test(ua)) {
        return 'Chrome OS';
    }

    return 'Unknown';
});


// Status style
const statusClass = (status) => {

    switch (String(status || '').toLowerCase()) {

        case 'completed':
            return `
                bg-emerald-50
                dark:bg-emerald-500/10
                text-emerald-700
                dark:text-emerald-400
                border-emerald-200
                dark:border-emerald-500/20
            `;
        
        case 'paid':
            return `
                bg-emerald-50
                dark:bg-emerald-500/10
                text-emerald-700
                dark:text-emerald-400
                border-emerald-200
                dark:border-emerald-500/20
            `;

        case 'pending':
            return `
                bg-amber-50
                dark:bg-amber-500/10
                text-amber-700
                dark:text-amber-400
                border-amber-200
                dark:border-amber-500/20
            `;

        case 'cancelled':
        case 'canceled':
            return `
                bg-red-50
                dark:bg-red-500/10
                text-red-700
                dark:text-red-400
                border-red-200
                dark:border-red-500/20
            `;

        case 'processing':
            return `
                bg-blue-50
                dark:bg-blue-500/10
                text-blue-700
                dark:text-blue-400
                border-blue-200
                dark:border-blue-500/20
            `;

        default:
            return `
                bg-slate-100
                dark:bg-slate-800
                text-slate-600
                dark:text-slate-300
                border-slate-200
                dark:border-slate-700
            `;
    }
};



































// =============================
// Print / Download invoice
// =============================
function printOrder(order) {
    const win = window.open("about:blank", "_blank");
    if(!win){
        alert("Popup blocked! Allow popups.");
        return;
    }
    win.location.href = `/admin/order/invoice-print/${order.reg}`;
}


function formatMoney(value) {
    const amount = Number(value ?? 0);

    if (!Number.isFinite(amount)) {
        return "0.00";
    }

    return amount.toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
























const isDueCollectionModalOpen = ref(false);
const selectedDueOrder = ref(null);

const dueReceivedAmount = ref("");
const dueDiscountAmount = ref("");
const paymentMethod = ref("cash");
const paymentRemarks = ref("");

const dueReceivedAmountError = ref("");
const dueDiscountAmountError = ref("");
const paymentMethodError = ref("");
const paymentRemarksError = ref("");

const isSavingDueCollection = ref(false);

function openDueCollection(order) {
    selectedDueOrder.value = order;

    dueReceivedAmount.value = "";
    dueDiscountAmount.value = "";
    paymentMethod.value = "cash";
    paymentRemarks.value = "";

    dueReceivedAmountError.value = "";
    dueDiscountAmountError.value = "";
    paymentMethodError.value = "";
    paymentRemarksError.value = "";

    isDueCollectionModalOpen.value = true;
}

function closeDueCollectionModal() {
    if (isSavingDueCollection.value) return;

    isDueCollectionModalOpen.value = false;
    selectedDueOrder.value = null;

    dueReceivedAmount.value = "";
    dueDiscountAmount.value = "";
    paymentMethod.value = "cash";
    paymentRemarks.value = "";

    dueReceivedAmountError.value = "";
    dueDiscountAmountError.value = "";
    paymentMethodError.value = "";
    paymentRemarksError.value = "";
}


/*
|--------------------------------------------------------------------------
| Current Collection Values
|--------------------------------------------------------------------------
*/

// Total payable amount of the order being collected
const dueCollectionTotal = computed(() => {
    return Number(selectedDueOrder.value?.payable_amount || 0);
});

const dueCollectionCurrentDue = computed(() => {
    return Math.max(
        0,
        Number(selectedDueOrder.value?.due_amount || 0)
    );
});

const dueCollectionDiscount = computed(() => {
    const value = Number(dueDiscountAmount.value || 0);

    return Number.isFinite(value) && value > 0
        ? value
        : 0;
});

const dueCollectionReceived = computed(() => {
    const value = Number(dueReceivedAmount.value || 0);

    return Number.isFinite(value) && value > 0
        ? value
        : 0;
});

// Net payable after applying discount, before received amount
const dueCollectionNetPayable = computed(() => {
    return Math.max(
        0,
        dueCollectionCurrentDue.value - dueCollectionDiscount.value
    );
});

const dueCollectionRemaining = computed(() => {
    return Math.max(
        0,
        dueCollectionCurrentDue.value -
        dueCollectionDiscount.value -
        dueCollectionReceived.value
    );
});

// Used by the template's "Payment Result" block
const dueCollectionDue = dueCollectionRemaining;

const dueCollectionReturn = computed(() => {
    return Math.max(
        0,
        dueCollectionReceived.value -
        Math.max(
            0,
            dueCollectionCurrentDue.value -
            dueCollectionDiscount.value
        )
    );
});

const dueCollectionIsFullyPaid = computed(() => {
    return (
        dueCollectionCurrentDue.value > 0 &&
        dueCollectionRemaining.value === 0
    );
});

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/
function validateDueCollection() {
    let valid = true;

    dueReceivedAmountError.value = "";
    dueDiscountAmountError.value = "";
    paymentMethodError.value = "";
    paymentRemarksError.value = "";

    const received = Number(dueReceivedAmount.value);
    const discount = Number(dueDiscountAmount.value || 0);
    const due = Number(selectedDueOrder.value?.due_amount || 0);

    if (
        dueReceivedAmount.value === "" ||
        !Number.isFinite(received) ||
        received <= 0
    ) {
        dueReceivedAmountError.value =
            "Please enter a valid received amount.";
        valid = false;
    }

    if (
        !Number.isFinite(discount) ||
        discount < 0
    ) {
        dueDiscountAmountError.value =
            "Please enter a valid discount.";
        valid = false;
    }

    if (discount > due) {
        dueDiscountAmountError.value =
            "Discount cannot exceed current due.";
        valid = false;
    }

    if (received + discount > due) {
        dueReceivedAmountError.value =
            `Received + discount cannot exceed due amount ৳${formatMoney(due)}.`;
        valid = false;
    }

    if (!paymentMethod.value) {
        paymentMethodError.value =
            "Please select a payment method.";
        valid = false;
    }

    if (paymentRemarks.value.length > 1000) {
        paymentRemarksError.value =
            "Remark cannot exceed 1000 characters.";
        valid = false;
    }

    return valid;
}

/*
|--------------------------------------------------------------------------
| Save Due Collection
|--------------------------------------------------------------------------
*/

async function saveDueCollection() {
    if (isSavingDueCollection.value) return;

    if (!validateDueCollection()) return;

    const order = selectedDueOrder.value;

    if (!order?.reg) {
        errorMsg.value = "Invalid order.";
        return;
    }

    try {
        isSavingDueCollection.value = true;
        errorMsg.value = "";

        const payload = {
            reg: order.reg,
            amount: Number(dueReceivedAmount.value),
            discount: Number(dueDiscountAmount.value || 0),
            payment_method: paymentMethod.value,
            remarks: paymentRemarks.value.trim() || null,
        };

        const res = await api.post("/due/collection", payload);

        if (res.data?.success) {
            // Save success message
            successMsg.value =
                res.data.message || "Payment collected successfully.";

            // Close modal immediately
            isDueCollectionModalOpen.value = false;

            // Reset modal data
            selectedDueOrder.value = null;
            dueReceivedAmount.value = "";
            dueDiscountAmount.value = "";
            paymentMethod.value = "cash";
            paymentRemarks.value = "";

            dueReceivedAmountError.value = "";
            dueDiscountAmountError.value = "";
            paymentMethodError.value = "";
            paymentRemarksError.value = "";

            // Refresh order data
            await fetchOrderDetails();

            return;
        }

        errorMsg.value =
            res.data?.message || "Unable to collect due payment.";

    } catch (error) {
        console.error("Due collection failed:", error);

        errorMsg.value =
            error.response?.data?.message ||
            error.response?.data?.errors?.amount?.[0] ||
            error.response?.data?.errors?.discount?.[0] ||
            error.message ||
            "Unable to collect due payment.";

    } finally {
        isSavingDueCollection.value = false;
    }
}













// dark and light mode
const isDark = ref(false);
function applyTheme(dark) {
    isDark.value = dark;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
}

function toggleDarkMode() {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("dark",isDark.value);
    localStorage.setItem("theme",isDark.value ? "dark" : "light");
}

















/* ESC to close drawer */
onMounted(() => {

    fetchOrderDetails();

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