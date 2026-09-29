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
                <main class="flex-1 min-h-screen min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 lg:px-8 py-6 print:bg-white print:px-0 print:py-0">

                    <!-- ==================== REPORT LETTERHEAD ==================== -->
                    <div class="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between print:rounded-none print:border-0 print:border-b-2 print:border-slate-900 print:p-0 print:pb-4 print:shadow-none">
                        <div class="flex items-center gap-4">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 print:bg-white print:text-slate-900 print:border print:border-slate-900">
                                <i class="fa-solid fa-money-check-dollar text-lg"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Order Payment Report</p>
                                <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Payment Ledger</h1>
                                <p class="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Period: {{ formatDate(startDate) }} &rarr; {{ formatDate(endDate) }} &middot; Page {{ pagination.page }} of {{ pagination.lastPage }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-3">
                            <div class="hidden text-right sm:block">
                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Records Matched</p>
                                <p class="text-lg font-black text-slate-900 dark:text-white">
                                    {{ filteredPayments.length }} <span class="text-xs font-medium text-slate-400">/ {{ pagination.total }}</span>
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
                    <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 print:grid-cols-5 print:gap-2">

                        <div class="relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-800/50 dark:bg-emerald-950/20 print:rounded-lg print:border-slate-900 print:bg-white print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500">
                                {{ totalAmount !== null ? 'Total Amount' : 'Net Amount (this page)' }}
                            </p>
                            <h4 class="mt-1 truncate text-lg font-black text-emerald-700 dark:text-emerald-400">{{ money(displayTotalAmount) }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-emerald-600/70 dark:text-emerald-500/60">
                                {{ totalAmount !== null ? 'For selected date range' : 'Server total unavailable — showing page sum' }}
                            </p>
                        </div>

                        <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Transactions</p>
                            <h4 class="mt-1 truncate text-lg font-black text-slate-900 dark:text-white">{{ pagination.total }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Total records</p>
                        </div>

                        <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500">Payments (page)</p>
                            <h4 class="mt-1 truncate text-lg font-black text-emerald-600 dark:text-emerald-400">{{ money(pageSummary.paid) }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Current page total</p>
                        </div>

                        <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500">Refunds (page)</p>
                            <h4 class="mt-1 truncate text-lg font-black text-rose-600 dark:text-rose-400">−{{ money(pageSummary.refunded) }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Current page total</p>
                        </div>

                        <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">Verified (page)</p>
                            <h4 class="mt-1 truncate text-lg font-black text-blue-600 dark:text-blue-400">{{ pageSummary.verified }} <span class="text-xs font-medium text-slate-400">/ {{ payments.length }}</span></h4>
                            <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">{{ pageSummary.unverified }} pending</p>
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
                                    <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Filter Payments</h3>
                                </div>
                                <span v-if="searchQuery || typeFilter || methodFilter || startDate !== today || endDate !== today" class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
                                    <span class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                    Filter Active
                                </span>
                            </div>

                            <!-- =========================
                                DATE FILTER ROW
                            ========================== -->
                            <div class="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">

                                <div class="md:col-span-4">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Start Date</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
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
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">End Date</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
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

                                <div class="md:col-span-4">
                                    <button
                                        type="button"
                                        @click="applyDateFilter"
                                        :disabled="loading"
                                        class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-600 bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:border-indigo-700 focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <i v-if="!loading" class="fa-solid fa-magnifying-glass text-xs"></i>
                                        <i v-else class="fa-solid fa-spinner animate-spin text-xs"></i>
                                        <span>{{ loading ? 'Filtering...' : 'Apply Date Filter' }}</span>
                                    </button>
                                </div>

                            </div>

                            <div class="flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800/60 lg:flex-row lg:items-end">
                                <div class="w-full lg:flex-1">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Search Payment Record</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                            <i class="fa-solid fa-magnifying-glass text-sm"></i>
                                        </div>
                                        <input type="text" v-model="searchQuery"
                                            placeholder="Search by Receipt No, Payment No, Order, Customer, Remarks..."
                                            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800" />
                                    </div>
                                </div>

                                <div class="w-full lg:w-[200px]">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</label>
                                    <select v-model="typeFilter"
                                        class="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:bg-slate-800">
                                        <option value="">All Types</option>
                                        <option value="payment">Payment</option>
                                        <option value="refund">Refund</option>
                                        <option value="adjustment">Adjustment</option>
                                    </select>
                                </div>

                                <div class="w-full lg:w-[200px]">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Method</label>
                                    <select v-model="methodFilter"
                                        class="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:bg-slate-800">
                                        <option value="">All Methods</option>
                                        <option v-for="(label, key) in paymentMethodLabels" :key="key" :value="key">{{ label }}</option>
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

                    <!-- ==================== PAYMENT TABLE ==================== -->
                    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden print:rounded-none print:border print:border-slate-400 print:shadow-none">
                        <div class="overflow-x-auto max-h-[1080px] print:max-h-none print:overflow-visible">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-md print:static print:bg-slate-100 print:border-slate-400">
                                    <tr>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Date</th>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Receipt / Payment No</th>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Order</th>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Method</th>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center print:px-3 print:py-2">Type</th>
                                        <th class="px-6 py-4 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Amount</th>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Received / Verified By</th>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center print:px-3 print:py-2">Status</th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                    <template v-if="filteredPayments && filteredPayments.length > 0">
                                        <tr v-for="(payment, index) in filteredPayments"  :key="payment.id" 
                                            class="transition-colors group hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                                            :class="index % 2 === 1 ? 'bg-slate-50/40 dark:bg-slate-800/20 print:bg-slate-50' : ''" @click="viewOrderDetails(payment)">

                                            <!-- Date -->
                                            <td class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2">
                                                <div class="text-xs font-semibold text-slate-700 dark:text-slate-200">{{ formatDate(payment.paid_at) }}</div>
                                                <div class="text-[10px] text-slate-400 dark:text-slate-500">{{ formatDateTime(payment.paid_at).split(',').pop().trim() }}</div>
                                            </td>

                                            <!-- Receipt / Payment No -->
                                            <td class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2">
                                                <div class="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 print:text-slate-900">{{ payment.receipt_no }}</div>
                                                <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{{ payment.payment_number }}</div>
                                            </td>

                                            <!-- Order -->
                                            <td class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2">
                                                <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">{{ payment.order?.reg || payment.order?.order_number || ('#' + payment.order_id) }}</div>
                                                <div class="text-[10px] text-slate-400 dark:text-slate-500">{{ payment.user?.name || 'N/A' }}</div>
                                            </td>

                                            <!-- Method -->
                                            <td class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2">
                                                <span class="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/50 print:bg-transparent print:border-0 print:px-0 print:py-0">
                                                    <i :class="paymentMethodIcons[payment.payment_method] || 'fa-wallet'" class="fas text-[10px] text-slate-400 print:hidden"></i>
                                                    {{ paymentMethodLabels[payment.payment_method] || payment.payment_method }}
                                                </span>
                                            </td>

                                            <!-- Type -->
                                            <td class="px-6 py-4 whitespace-nowrap text-center print:px-3 print:py-2">
                                                <span :class="getTypeBadge(payment.payment_type).container"
                                                    class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border print:border-slate-400">
                                                    <span class="relative inline-flex rounded-full h-1.5 w-1.5 print:hidden" :class="getTypeBadge(payment.payment_type).dot"></span>
                                                    {{ getTypeBadge(payment.payment_type).label }}
                                                </span>
                                            </td>

                                            <!-- Amount -->
                                            <td class="px-6 py-4 whitespace-nowrap text-right print:px-3 print:py-2">
                                                <div class="text-xs font-bold font-mono"
                                                    :class="payment.payment_type === 'refund' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'">
                                                    {{ getTypeBadge(payment.payment_type).sign }}{{ money(payment.amount) }}
                                                </div>
                                                <div class="text-[10px] text-slate-400 dark:text-slate-500 uppercase">{{ payment.currency }}</div>
                                            </td>

                                            <!-- Received / Verified By -->
                                            <td class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2">
                                                <div class="text-xs text-slate-700 dark:text-slate-300 font-medium">{{ payment.receiver?.name || '—' }}</div>
                                                <div class="text-[10px] text-slate-400 dark:text-slate-500">
                                                    <span v-if="payment.verifier">Verified by {{ payment.verifier.name }}</span>
                                                    <span v-else>Not verified</span>
                                                </div>
                                            </td>

                                            <!-- Status -->
                                            <td class="px-6 py-4 whitespace-nowrap text-center print:px-3 print:py-2">
                                                <span v-if="payment.verified_at"
                                                    class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 print:border-slate-400">
                                                    <i class="fa-solid fa-check text-[9px]"></i>
                                                    Verified
                                                </span>
                                                <span v-else
                                                    class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 print:border-slate-400">
                                                    <i class="fa-solid fa-clock text-[9px]"></i>
                                                    Pending
                                                </span>
                                            </td>
                                        </tr>
                                    </template>

                                    <tr v-else>
                                        <td colspan="8" class="px-6 py-12 text-center">
                                            <div v-if="loading" class="w-full flex flex-col items-center justify-center py-10">
                                                <div class="animate-spin h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full"></div>
                                                <p class="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">Loading payment records...</p>
                                            </div>
                                            <div v-else class="flex flex-col items-center justify-center max-w-xs mx-auto py-6">
                                                <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-3 ring-8 ring-slate-50 dark:ring-slate-900/50 flex items-center justify-center w-12 h-12">
                                                    <i class="fas fa-money-check-dollar text-lg"></i>
                                                </div>
                                                <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">No payment record found</h3>
                                                <p class="text-[11px] text-slate-400 dark:text-slate-500">{{ errorMsg || 'Try adjusting your search or filters.' }}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>

                                <!-- Report Totals Footer -->
                                <tfoot v-if="filteredPayments && filteredPayments.length > 0" class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 print:bg-slate-100 print:border-slate-400">
                                    <tr>
                                        <td colspan="5" class="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">
                                            Net Total (this page, {{ filteredPayments.length }} records)
                                        </td>
                                        <td class="px-6 py-4 text-right text-sm font-black text-slate-900 dark:text-white font-mono print:px-3 print:py-2">
                                            {{ money(pageSummary.paid + pageSummary.adjusted - pageSummary.refunded) }}
                                        </td>
                                        <td colspan="2" class="print:px-3 print:py-2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div class="flex flex-col gap-2 border-slate-200 bg-white dark:bg-slate-900 shadow-sm px-4 py-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
                        <p class="text-xs text-slate-500">
                            Showing
                            <span class="font-semibold text-slate-700">{{ pagination.from }}</span>
                            –
                            <span class="font-semibold text-slate-700">{{ pagination.to }}</span>
                            of
                            <span class="font-semibold text-slate-700">{{ pagination.total }}</span>
                        </p>

                        <div class="flex flex-wrap items-center justify-end gap-2">
                            <button @click="changePage(1)" :disabled="pagination.page === 1 || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                                <i class="fa-solid fa-angles-left"></i>
                            </button>
                            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1 || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>
                            <button v-for="page in OrderVisiblePages" :key="String(page)" @click="page !== '...' && changePage(page)"
                                class="rounded-lg border px-3 py-1.5 text-xs font-semibold" :disabled="page === '...' || loading"
                                :class="[page === pagination.page ? 'border-slate-900 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : 'border-slate-200 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 hover:bg-slate-50']">
                                {{ page }}
                            </button>
                            <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.lastPage || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                                <i class="fa-solid fa-angle-right"></i>
                            </button>
                            <button @click="changePage(pagination.lastPage)" :disabled="pagination.page === pagination.lastPage || loading"
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
import { onMounted, ref, computed } from "vue";
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
const router = useRouter();
const successMsg = ref('');
const errorMsg = ref('');
const loading = ref(false);

/* =============================================================
   State
============================================================= */
const payments = ref([]);
const totalAmount = ref(null); // null = server didn't return a range total; fall back to page sum

const pagination = ref({
    page: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
    from: 0,
    to: 0,
});

const today = new Date().toISOString().split('T')[0];
const startDate = ref(today);
const endDate = ref(today);

/* =============================================================
   Fetch payments
   Endpoint: GET /orders/reports/payment/filter
   (reportPaymentFilter — defaults to today's date range server-side
   when start_date/end_date are omitted, so we always send them
   explicitly to keep the UI and the actual query in sync)
============================================================= */
async function fetchPayments(page = 1) {
    try {
        loading.value = true;
        errorMsg.value = '';

        const res = await api.get('/orders/reports/payment/filter', {
            params: {
                page,
                start_date: startDate.value,
                end_date: endDate.value,
            },
        });

        const response = res.data;

        payments.value = response?.data?.data ?? [];
        // reportPaymentFilter() doesn't return total_amount yet — fall back to null
        // and the UI will show a page-level sum instead (see displayTotalAmount).
        totalAmount.value = response?.total_amount !== undefined ? Number(response.total_amount) : null;

        pagination.value = {
            page: response?.data?.current_page ?? 1,
            lastPage: response?.data?.last_page ?? 1,
            total: response?.data?.total ?? 0,
            perPage: response?.data?.per_page ?? 20,
            from: response?.data?.from ?? 0,
            to: response?.data?.to ?? 0,
        };
    } catch (err) {
        console.log(err);
        errorMsg.value = err?.response?.data?.message || 'Failed to fetch payments';
        payments.value = [];
        pagination.value = { page: 1, lastPage: 1, total: 0, perPage: 20, from: 0, to: 0 };
    } finally {
        loading.value = false;
    }
}

function changePage(page) {
    if (page === '...' || page < 1 || page > pagination.value.lastPage || page === pagination.value.page) return;
    fetchPayments(page);
}

function applyDateFilter() {
    fetchPayments(1);
}

/* =============================================================
   Filters (client-side, scoped to the current page of results)
============================================================= */
const searchQuery = ref('');
const typeFilter = ref('');
const methodFilter = ref('');

const filteredPayments = computed(() => {
    return payments.value.filter((p) => {
        const matchesType = !typeFilter.value || p.payment_type === typeFilter.value;
        const matchesMethod = !methodFilter.value || p.payment_method === methodFilter.value;

        const search = searchQuery.value.toLowerCase().trim();
        const matchesSearch =
            !search ||
            p.payment_number?.toLowerCase().includes(search) ||
            p.receipt_no?.toLowerCase().includes(search) ||
            p.order?.reg?.toLowerCase().includes(search) ||
            p.order?.order_number?.toLowerCase().includes(search) ||
            p.user?.name?.toLowerCase().includes(search) ||
            p.remarks?.toLowerCase().includes(search);

        return matchesType && matchesMethod && matchesSearch;
    });
});

function resetFilters() {
    searchQuery.value = '';
    typeFilter.value = '';
    methodFilter.value = '';
    startDate.value = today;
    endDate.value = today;
    fetchPayments(1);
}

/* =============================================================
   Page-scoped summary (based on the currently loaded rows)
============================================================= */
const pageSummary = computed(() => {
    let paid = 0, refunded = 0, adjusted = 0, verified = 0;

    for (const p of payments.value) {
        const amt = parseFloat(p.amount) || 0;
        if (p.payment_type === 'refund') refunded += amt;
        else if (p.payment_type === 'adjustment') adjusted += amt;
        else paid += amt;

        if (p.verified_at) verified++;
    }

    return { paid, refunded, adjusted, verified, unverified: payments.value.length - verified };
});

/* Falls back to the current page's net total when the server doesn't
   provide a range-wide total_amount (reportPaymentFilter doesn't yet). */
const displayTotalAmount = computed(() =>
    totalAmount.value !== null ? totalAmount.value : (pageSummary.value.paid + pageSummary.value.adjusted - pageSummary.value.refunded)
);

/* =============================================================
   Pagination visible pages
============================================================= */
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
    for (let i = start; i <= end; i++) pages.push(i);

    if (cur < last - 2) pages.push("...");
    pages.push(last);

    return pages;
});

/* =============================================================
   Display helpers
============================================================= */
const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const formatDateTime = (date) =>
    date
        ? new Date(date).toLocaleString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '—';

const money = (amount) =>
    `৳ ${Number(amount || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const paymentMethodLabels = {
    cash: 'Cash',
    card: 'Card',
    bank_transfer: 'Bank Transfer',
    bkash: 'bKash',
    nagad: 'Nagad',
    rocket: 'Rocket',
    wallet: 'Wallet',
};

const paymentMethodIcons = {
    cash: 'fa-money-bill-wave',
    card: 'fa-credit-card',
    bank_transfer: 'fa-building-columns',
    bkash: 'fa-mobile-screen',
    nagad: 'fa-mobile-screen',
    rocket: 'fa-mobile-screen',
    wallet: 'fa-wallet',
};

const typeBadge = {
    payment: {
        container: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
        dot: 'bg-emerald-500',
        label: 'Payment',
        sign: '',
    },
    refund: {
        container: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
        dot: 'bg-rose-500',
        label: 'Refund',
        sign: '−',
    },
    adjustment: {
        container: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
        dot: 'bg-amber-500',
        label: 'Adjustment',
        sign: '±',
    },
};

function getTypeBadge(type) {
    return typeBadge[type] || {
        container: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        dot: 'bg-slate-500',
        label: type || 'Unknown',
        sign: '',
    };
}









function viewOrderDetails(payment){
    router.push(`/admin/payment/due/details/${payment.order.reg}/${payment.order.slug}`);
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

/* ESC to close drawer */
onMounted(() => {
    fetchPayments();

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