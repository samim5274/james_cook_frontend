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
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div class="lg:col-span-2 space-y-6">
                                <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div v-for="n in 4" :key="n" class="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                                </div>
                                <div class="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                                <div class="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                                <div class="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                            </div>
                            <div class="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                        </div>
                    </div>

                    <!-- Not found -->
                    <div v-else-if="!order" class="flex flex-col items-center text-center py-24">
                        <div class="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center mb-4">
                            <i class="fa-solid fa-circle-exclamation text-2xl text-slate-400 dark:text-slate-500"></i>
                        </div>
                        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">Order not found</p>
                        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
                            {{ errorMsg || 'This order may not exist or may have been removed.' }}
                        </p>
                        <button @click="$router.back()" class="mt-5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition shadow-sm">
                            Go back
                        </button>
                    </div>

                    
                    <div v-else>

                        <!-- Page Header -->
                        <div
                            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200 dark:border-slate-800/60">

                            <div class="flex items-center gap-4">

                                <button
                                    @click="$router.back()"
                                    class="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm shrink-0"
                                >
                                    <i class="fa-solid fa-arrow-left-long text-slate-600 dark:text-slate-400"></i>
                                </button>

                                <div class="space-y-1.5">

                                    <div class="flex flex-wrap items-center gap-2.5">

                                        <h1
                                            class="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5"
                                        >
                                            Order
                                            <span class="text-green-600 dark:text-orange-400">
                                                #{{ order.order_number }}
                                            </span>
                                        </h1>

                                        <span
                                            v-if="Number(order.discount) > 0"
                                            class="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-mono text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-900/50 uppercase tracking-wider"
                                        >
                                            <i class="fa-solid fa-tags text-amber-500"></i>
                                            Discount Applied
                                        </span>

                                    </div>

                                    <p
                                        class="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5"
                                    >
                                        <i class="fa-regular fa-calendar text-slate-400 dark:text-slate-500"></i>

                                        Placed on {{ formatDate(order.order_date) }}
                                    </p>

                                </div>
                            </div>

                            <div class="flex items-center gap-3">

                                <!-- <button
                                    type="button" @click="downloadInvoice" :disabled="invoiceDownloading"
                                    class="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition shadow-sm"
                                >
                                    <i class="fa-solid fa-download mr-1.5"></i>
                                    Download Invoice
                                </button> -->

                                <button
                                    type="button"
                                    @click="printOrder(order)"
                                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-500/20 transition"
                                >
                                    <i class="fa-solid fa-print mr-1.5"></i>
                                    Print Details
                                </button>

                            </div>
                        </div>


                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            <!-- LEFT -->
                            <div class="lg:col-span-2 space-y-6">

                                <!-- Metric Cards -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                                    <!-- Payment Date -->
                                    <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div class="flex items-center gap-2 mb-3">
                                            <i class="fa-regular fa-calendar text-slate-400 text-sm"></i>

                                            <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Payment Date
                                            </p>
                                        </div>

                                        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {{ order.paid_at ? formatDate(order.paid_at) : 'Not Paid Yet' }}
                                        </p>
                                    </div>


                                    <!-- Total Amount -->
                                    <div
                                        class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                                    >
                                        <div class="flex items-center gap-2 mb-3">
                                            <i class="fa-solid fa-wallet text-slate-400 text-sm"></i>

                                            <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Total Amount
                                            </p>
                                        </div>

                                        <p class="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                                            {{ money(order.payable_amount) }}
                                        </p>
                                    </div>


                                    <!-- Order Status -->
                                    <div
                                        class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                                    >
                                        <div class="flex justify-between items-center mb-3">

                                            <div class="flex items-center gap-2">
                                                <i class="fa-solid fa-truck-fast text-slate-400 text-sm"></i>

                                                <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                    Order Status
                                                </p>
                                            </div>

                                        </div>

                                        <span
                                            class="px-3 py-1 rounded-lg text-[11px] font-bold uppercase inline-flex items-center gap-2 border w-fit"
                                            :class="statusClass(order.status)"
                                        >
                                            <span class="h-2 w-2 rounded-full bg-current"></span>

                                            {{ order.status }}
                                        </span>
                                    </div>


                                    <!-- Total Point -->
                                    <div
                                        class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                                    >
                                        <div class="flex items-center gap-2 mb-3">
                                            <i class="fa-regular fa-star text-slate-400 text-sm"></i>

                                            <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Total Point
                                            </p>
                                        </div>

                                        <p class="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                                            {{ Number(order.point || 0).toLocaleString() }}
                                        </p>
                                    </div>

                                </div>


                                <!-- Transaction Details -->
                                <div
                                    class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                                    <div
                                        class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between"
                                    >
                                        <div>
                                            <h3 class="font-bold text-base text-slate-900 dark:text-white">
                                                Transaction Details
                                            </h3>

                                            <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                                Order receipt
                                            </p>
                                        </div>

                                        <span
                                            class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase"
                                        >
                                            {{ order.payment_method }}
                                        </span>
                                    </div>


                                    <div class="px-6 py-4 space-y-3">

                                        <div class="flex justify-between items-center">
                                            <span class="text-sm text-slate-500 dark:text-slate-400">
                                                Registration Number
                                            </span>

                                            <span class="text-sm font-semibold text-slate-900 dark:text-white">
                                                {{ order.reg }}
                                            </span>
                                        </div>


                                        <div class="flex justify-between items-center">
                                            <span class="text-sm text-slate-500 dark:text-slate-400">
                                                Order Number
                                            </span>

                                            <span class="text-sm font-semibold text-slate-900 dark:text-white">
                                                {{ order.order_number }}
                                            </span>
                                        </div>


                                        <div class="flex justify-between items-center">
                                            <span class="text-sm text-slate-500 dark:text-slate-400">
                                                Currency
                                            </span>

                                            <span class="text-sm font-semibold text-slate-900 dark:text-white">
                                                {{ order.currency }} — Bangladeshi Taka
                                            </span>
                                        </div>


                                        <div class="flex justify-between items-center">
                                            <span class="text-sm text-slate-500 dark:text-slate-400">
                                                Payment Method
                                            </span>

                                            <span class="text-sm font-semibold text-slate-900 dark:text-white capitalize">
                                                {{ order.payment_method }}
                                            </span>
                                        </div>

                                    </div>


                                    <div class="relative px-6">
                                        <div class="border-t border-dashed border-slate-200 dark:border-slate-700"></div>
                                    </div>


                                    <!-- Amount Breakdown -->
                                    <div class="px-6 pt-5 pb-6">

                                        <h4
                                            class="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3"
                                        >
                                            Amount Breakdown
                                        </h4>

                                        <div class="space-y-2 text-sm">

                                            <!-- Subtotal -->
                                            <div class="flex justify-between text-slate-500 dark:text-slate-400">
                                                <span>Subtotal</span>

                                                <span class="font-medium text-slate-700 dark:text-slate-300">
                                                    {{ money(order.subtotal) }}
                                                </span>
                                            </div>


                                            <!-- Discount -->
                                            <div
                                                v-if="Number(order.discount) > 0"
                                                class="flex justify-between text-slate-500 dark:text-slate-400"
                                            >
                                                <span>Discount</span>

                                                <span class="font-medium text-emerald-600 dark:text-emerald-400">
                                                    − {{ money(order.discount) }}
                                                </span>
                                            </div>


                                            <!-- VAT -->
                                            <div
                                                v-if="Number(order.vat) > 0"
                                                class="flex justify-between text-slate-500 dark:text-slate-400"
                                            >
                                                <span>
                                                    VAT
                                                    <span v-if="Number(order.vat_percentage) > 0">
                                                        ({{ order.vat_percentage }}%)
                                                    </span>
                                                </span>

                                                <span class="font-medium text-slate-700 dark:text-slate-300">
                                                    + {{ money(order.vat) }}
                                                </span>
                                            </div>


                                            <!-- Shipping -->
                                            <div
                                                v-if="Number(order.shipping_charge || 0) > 0"
                                                class="flex justify-between text-slate-500 dark:text-slate-400"
                                            >
                                                <span>Shipping Charge</span>

                                                <span class="font-medium text-slate-700 dark:text-slate-300">
                                                    + {{ money(order.shipping_charge) }}
                                                </span>
                                            </div>

                                        </div>


                                        <!-- Total -->
                                        <div
                                            class="flex justify-between items-baseline border-t border-slate-100 dark:border-slate-800 mt-4 pt-4"
                                        >
                                            <span class="text-sm font-bold text-slate-900 dark:text-white">
                                                Total Payable
                                            </span>

                                            <span class="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                {{ money(order.payable_amount) }}
                                            </span>
                                        </div>


                                        <!-- Paid / Due -->
                                        <div
                                            class="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-2"
                                        >

                                            <div class="flex justify-between items-center text-sm">

                                                <span class="text-slate-500 dark:text-slate-400">
                                                    <i class="fa-solid fa-circle-check text-emerald-500 mr-1.5"></i>
                                                    Paid
                                                </span>

                                                <span class="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {{ money(paidAmount) }}
                                                </span>

                                            </div>


                                            <div class="flex justify-between items-center text-sm">

                                                <span class="text-slate-500 dark:text-slate-400">
                                                    <i class="fa-solid fa-hourglass-half mr-1.5 text-slate-400"></i>
                                                    Due
                                                </span>

                                                <span
                                                    class="font-mono font-semibold"
                                                    :class="Number(order.due_amount) > 0
                                                        ? 'text-amber-600 dark:text-amber-400'
                                                        : 'text-emerald-600 dark:text-emerald-400'"
                                                >
                                                    {{ money(order.due_amount) }}
                                                </span>

                                            </div>


                                            <!-- Payment status -->
                                            <span
                                                v-if="Number(order.due_amount) > 0"
                                                class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full mt-1"
                                            >
                                                <i class="fa-solid fa-triangle-exclamation"></i>
                                                Partially Paid
                                            </span>

                                            <span
                                                v-else
                                                class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full mt-1"
                                            >
                                                <i class="fa-solid fa-circle-check"></i>
                                                Fully Paid
                                            </span>

                                        </div>


                                        <!-- Remarks -->
                                        <div
                                            v-if="order.remarks"
                                            class="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700"
                                        >

                                            <div
                                                class="flex items-start gap-3 pl-4 border-l-2 border-amber-300 dark:border-amber-600"
                                            >
                                                <div>
                                                    <p
                                                        class="text-[10.5px] text-amber-600 dark:text-amber-500 uppercase font-bold tracking-wider mb-1"
                                                    >
                                                        <i class="fa-regular fa-comment-dots mr-1"></i>
                                                        Note
                                                    </p>

                                                    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                                        {{ order.remarks }}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>


                                        <!-- Device Details -->
                                        <details
                                            class="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 text-xs group"
                                        >

                                            <summary
                                                class="text-slate-400 dark:text-slate-500 cursor-pointer select-none list-none flex items-center justify-between"
                                            >
                                                <span>
                                                    <i class="fa-solid fa-circle-info mr-1"></i>
                                                    Device details
                                                </span>

                                                <i
                                                    class="fa-solid fa-chevron-down text-[10px] transition-transform group-open:rotate-180"
                                                ></i>
                                            </summary>

                                            <div class="mt-3 grid grid-cols-2 gap-y-2">

                                                <span class="text-slate-400 dark:text-slate-500">
                                                    Browser
                                                </span>

                                                <span class="text-right font-medium text-slate-700 dark:text-slate-300 truncate">
                                                    {{ browserName }}
                                                </span>

                                                <!-- Operating System -->
                                                <span class="text-slate-400 dark:text-slate-500">
                                                    Operating System
                                                </span>

                                                <span
                                                    class="text-right font-medium text-slate-700 dark:text-slate-300 truncate"
                                                >
                                                    {{ operatingSystem }}
                                                </span>


                                                <span class="text-slate-400 dark:text-slate-500">
                                                    IP Address
                                                </span>

                                                <span class="text-right font-medium text-slate-700 dark:text-slate-300">
                                                    {{ order.ip_address || 'N/A' }}
                                                </span>


                                                <span class="text-slate-400 dark:text-slate-500">
                                                    Created
                                                </span>

                                                <span class="text-right font-medium text-slate-700 dark:text-slate-300">
                                                    {{ formatDateTime(order.created_at) }}
                                                </span>

                                            </div>

                                        </details>

                                    </div>

                                </div>


                                <!-- Order Items -->
                                <div class="space-y-4">

                                    <!-- Section Header -->
                                    <div class="flex items-center justify-between mb-5">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="flex h-10 w-10 items-center justify-center rounded-xl
                                                    bg-indigo-50 dark:bg-indigo-500/10
                                                    text-indigo-600 dark:text-indigo-400"
                                            >
                                                <i class="fa-solid fa-bag-shopping"></i>
                                            </div>

                                            <div>
                                                <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                                    Order Items
                                                </h3>

                                                <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                                    Products included in this order
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            class="inline-flex items-center justify-center min-w-8 h-8 px-2
                                                rounded-lg bg-slate-100 dark:bg-slate-800
                                                text-xs font-bold text-slate-600 dark:text-slate-300"
                                        >
                                            {{ cartItems?.length || 0 }}
                                        </span>
                                    </div>


                                    <!-- Items -->
                                    <div
                                        v-for="item in cartItems || []"
                                        :key="item.id"
                                        class="group relative overflow-hidden
                                            bg-white dark:bg-slate-900
                                            rounded-2xl
                                            border border-slate-200 dark:border-slate-800
                                            shadow-sm
                                            hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30
                                            transition-all duration-300"
                                    >

                                        <div class="p-4 sm:p-5">

                                            <div class="flex flex-col sm:flex-row gap-4 sm:gap-5">

                                                <!-- Product Image -->
                                                <div
                                                    class="relative w-full h-52 sm:w-24 sm:h-24
                                                        shrink-0
                                                        bg-slate-100 dark:bg-slate-800
                                                        rounded-xl
                                                        overflow-hidden
                                                        border border-slate-200 dark:border-slate-700"
                                                >

                                                    <img
                                                        :src="getProductImage(item)"
                                                        :alt="item.product?.name || 'Product'"
                                                        class="h-full w-full object-cover
                                                            group-hover:scale-105
                                                            transition-transform duration-500"
                                                        @error="$event.target.src = defaultProductImage"
                                                    />

                                                    <!-- Quantity Badge -->
                                                    <div
                                                        class="absolute top-2 right-2
                                                            min-w-7 h-7 px-2
                                                            flex items-center justify-center
                                                            rounded-lg
                                                            bg-slate-950/80
                                                            backdrop-blur-sm
                                                            text-white
                                                            text-[11px]
                                                            font-bold
                                                            shadow-lg"
                                                    >
                                                        ×{{ item.quantity }}
                                                    </div>

                                                </div>


                                                <!-- Main Content -->
                                                <div class="flex-1 min-w-0">

                                                    <!-- Product Name -->
                                                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                                                        <div class="min-w-0">

                                                            <h4
                                                                class="text-base sm:text-[17px]
                                                                    font-bold
                                                                    text-slate-900 dark:text-white
                                                                    leading-snug
                                                                    truncate"
                                                                :title="item.product?.name || item.product_name || 'Product'"
                                                            >
                                                                {{ item.product?.name || item.product_name || 'Product' }}
                                                            </h4>

                                                            <p
                                                                v-if="item.product?.sku || item.sku"
                                                                class="mt-1.5 text-xs text-slate-400 dark:text-slate-500"
                                                            >
                                                                SKU:
                                                                <span class="font-medium text-slate-500 dark:text-slate-400">
                                                                    {{ item.product?.sku || item.sku }}
                                                                </span>
                                                            </p>

                                                        </div>


                                                        <!-- Points -->
                                                        <div
                                                            class="shrink-0 inline-flex sm:flex
                                                                items-center sm:flex-col
                                                                sm:items-end gap-2 sm:gap-0
                                                                px-3 py-2
                                                                rounded-xl
                                                                bg-indigo-50 dark:bg-indigo-500/10
                                                                border border-indigo-100 dark:border-indigo-500/20"
                                                        >

                                                            <div
                                                                class="flex items-center gap-1.5
                                                                    text-[9px] font-bold
                                                                    uppercase tracking-wider
                                                                    text-indigo-500 dark:text-indigo-400"
                                                            >
                                                                <i class="fa-solid fa-star text-[9px]"></i>
                                                                Points
                                                            </div>

                                                            <div class="flex items-baseline gap-1">
                                                                <span
                                                                    class="text-lg font-black
                                                                        text-indigo-600 dark:text-indigo-400"
                                                                >
                                                                    {{ Number(item.point ?? item.points ?? 0) }}
                                                                </span>

                                                                <span
                                                                    class="text-[9px] font-bold
                                                                        text-indigo-400 dark:text-indigo-500"
                                                                >
                                                                    PTS
                                                                </span>
                                                            </div>

                                                        </div>

                                                    </div>


                                                    <!-- Divider -->
                                                    <div class="my-4 border-t border-slate-100 dark:border-slate-800"></div>


                                                    <!-- Bottom Information -->
                                                    <div
                                                        class="flex flex-col sm:flex-row
                                                            sm:items-end sm:justify-between
                                                            gap-4"
                                                    >

                                                        <!-- Unit Price / Quantity -->
                                                        <div class="flex items-center gap-4">

                                                            <div>
                                                                <p
                                                                    class="text-[9px] font-bold uppercase
                                                                        tracking-wider
                                                                        text-slate-400 dark:text-slate-500"
                                                                >
                                                                    Unit Price
                                                                </p>

                                                                <p
                                                                    class="mt-1 text-sm font-semibold
                                                                        text-slate-700 dark:text-slate-300"
                                                                >
                                                                    {{ money(item.unit_price ?? item.price ?? 0) }}
                                                                </p>
                                                            </div>


                                                            <div class="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>


                                                            <div>
                                                                <p
                                                                    class="text-[9px] font-bold uppercase
                                                                        tracking-wider
                                                                        text-slate-400 dark:text-slate-500"
                                                                >
                                                                    Quantity
                                                                </p>

                                                                <p
                                                                    class="mt-1 text-sm font-semibold
                                                                        text-slate-700 dark:text-slate-300"
                                                                >
                                                                    {{ item.quantity }}
                                                                </p>
                                                            </div>

                                                        </div>


                                                        <!-- Subtotal -->
                                                        <div class="sm:text-right">

                                                            <p
                                                                class="text-[9px] font-bold uppercase
                                                                    tracking-wider
                                                                    text-slate-400 dark:text-slate-500"
                                                            >
                                                                Item Subtotal
                                                            </p>

                                                            <p
                                                                class="mt-1 text-xl font-black
                                                                    tracking-tight
                                                                    text-slate-900 dark:text-white"
                                                            >
                                                                {{
                                                                    money(
                                                                        item.subtotal ??
                                                                        (
                                                                            Number(item.unit_price ?? item.price ?? 0) *
                                                                            Number(item.quantity ?? 0)
                                                                        )
                                                                    )
                                                                }}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    <!-- Empty State -->
                                    <div
                                        v-if="!cartItems || cartItems.length === 0"
                                        class="rounded-2xl
                                            border border-dashed
                                            border-slate-300 dark:border-slate-700
                                            bg-white dark:bg-slate-900
                                            px-6 py-12
                                            text-center"
                                    >

                                        <div
                                            class="mx-auto mb-4
                                                flex h-14 w-14
                                                items-center justify-center
                                                rounded-2xl
                                                bg-slate-100 dark:bg-slate-800
                                                text-slate-400 dark:text-slate-500"
                                        >
                                            <i class="fa-solid fa-box-open text-xl"></i>
                                        </div>

                                        <h4
                                            class="text-sm font-bold
                                                text-slate-700 dark:text-slate-300"
                                        >
                                            No order items found
                                        </h4>

                                        <p
                                            class="mt-1 text-xs
                                                text-slate-400 dark:text-slate-500"
                                        >
                                            There are no products associated with this order.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <!-- RIGHT -->
                            <div class="space-y-6">

                                <div class="sticky top-16">

                                    <!-- Customer -->
                                    <div
                                        class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                                    >

                                        <div
                                            class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50"
                                        >
                                            <h3 class="font-bold text-slate-900 dark:text-white">
                                                Customer Details
                                            </h3>
                                        </div>


                                        <div class="p-6">

                                            <div class="text-center mb-6">

                                                <div class="relative inline-flex mb-4">

                                                    <div
                                                        class="h-20 w-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30"
                                                    >
                                                        {{ customerInitials }}
                                                    </div>

                                                    <div
                                                        class="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white dark:border-slate-900 h-6 w-6 rounded-full"
                                                        title="Active"
                                                    ></div>

                                                </div>


                                                <h4 class="text-lg font-bold text-slate-900 dark:text-white">
                                                    {{ order.customer_name || 'Walk-in Customer' }}
                                                </h4>

                                                <p class="text-sm text-slate-500 mt-1">
                                                    {{ order.customer_phone || 'No phone number' }}
                                                </p>

                                            </div>


                                            <div
                                                class="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm"
                                            >

                                                <!-- Name -->
                                                <div class="flex items-center gap-3 p-4">

                                                    <span
                                                        class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700 text-slate-500 dark:text-slate-400 shrink-0"
                                                    >
                                                        <i class="fa-regular fa-user text-[13px]"></i>
                                                    </span>

                                                    <div class="min-w-0">

                                                        <p class="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                                                            Full Name
                                                        </p>

                                                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                                            {{ order.customer_name || 'Walk-in Customer' }}
                                                        </p>

                                                    </div>

                                                </div>


                                                <!-- Phone -->
                                                <div class="flex items-center gap-3 p-4">

                                                    <span
                                                        class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700 text-slate-500 dark:text-slate-400 shrink-0"
                                                    >
                                                        <i class="fa-solid fa-phone text-[13px]"></i>
                                                    </span>

                                                    <div class="min-w-0">

                                                        <p class="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                                                            Phone Number
                                                        </p>

                                                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                                            {{ order.customer_phone || 'N/A' }}
                                                        </p>

                                                    </div>

                                                </div>


                                                <!-- Customer Type -->
                                                <div class="flex items-center gap-3 p-4">

                                                    <span
                                                        class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700 text-slate-500 dark:text-slate-400 shrink-0"
                                                    >
                                                        <i class="fa-solid fa-user-tag text-[13px]"></i>
                                                    </span>

                                                    <div class="min-w-0">

                                                        <p class="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                                                            Customer Type
                                                        </p>

                                                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                            {{ order.customer_id ? 'Registered Customer' : 'Walk-in Customer' }}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>


                                            <!-- Order Created By -->
                                            <div
                                                v-if="order.user"
                                                class="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                                            >

                                                <p class="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-1">
                                                    Processed By
                                                </p>

                                                <p class="text-sm font-bold text-slate-800 dark:text-slate-100">
                                                    {{ order.user.name }}
                                                </p>

                                                <p class="text-xs text-slate-500 mt-0.5">
                                                    {{ order.user.user_id }}
                                                </p>

                                            </div>


                                            <!-- Remarks -->
                                            <div
                                                v-if="order.remarks"
                                                class="mt-5"
                                            >

                                                <div
                                                    class="w-full flex items-start gap-3.5 pl-4 border-l-2 border-amber-300 dark:border-amber-600"
                                                >

                                                    <div class="min-w-0 flex-1">

                                                        <p
                                                            class="text-[10.5px] text-amber-600 dark:text-amber-500 uppercase font-bold tracking-wider mb-1"
                                                        >
                                                            <i class="fa-regular fa-comment-dots mr-1"></i>
                                                            Note
                                                        </p>

                                                        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                                            {{ order.remarks }}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    <!-- Quick Note -->
                                    <div
                                        class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 mt-4 shadow-sm"
                                    >

                                        <div class="flex items-start gap-3">

                                            <div
                                                class="flex-shrink-0 w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"
                                            >
                                                <i class="fa-solid fa-circle-info text-blue-600 dark:text-blue-400 text-sm"></i>
                                            </div>

                                            <div>

                                                <h4
                                                    class="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-1"
                                                >
                                                    Quick Note
                                                </h4>

                                                <p
                                                    class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed"
                                                >
                                                    This order was processed by
                                                    <strong>{{ order.user?.name || 'System' }}</strong>.
                                                </p>

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

    </div>

</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRouter, useRoute } from 'vue-router'
import api, {makeImg} from '../../../../services/api.js'

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
async function fetchOrderDetails(){
    loading.value = true;
    try{
        const reg = route.params.reg;
        if (!reg) {
            errorMsg.value = "Invalid order reference.";
            return;
        }

        const res = await api.get(`/orders/${route.params.reg}`);
        order.value = res.data.data.order;
        cartItems.value = res.data.data.cartItems;
        // console.log(order.value)
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

















function ProductDetails(item) {
    router.push(`/product-details/${item.product.slug}`)
}

function viewCustomerFullProfile(order){
    router.push(`/admin/customer-details/${order?.user.user_id}`);
}



















// =============================
// Print / Download invoice
// =============================
function printOrder(order) {
    const win = window.open("about:blank", "_blank");
    if(!win){
        alert("Popup blocked! Allow popups.");
        return;
    }
    // console.log(order)
    win.location.href = `/admin/order/invoice-print/${order.reg}`;
}

const invoiceDownloading = ref(false);
async function downloadInvoice() {
    // NOTE: adjust this endpoint to whatever your backend actually exposes
    // for generating the invoice PDF.
    invoiceDownloading.value = true;
    try {
        const res = await api.get(`/orders/${route.params.reg}/invoice`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${order.value.reg}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        errorMsg.value =
            err.response?.data?.message ||
            err.message ||
            "Could not download the invoice.";
    } finally {
        invoiceDownloading.value = false;
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