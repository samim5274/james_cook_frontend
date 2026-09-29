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
                                <i class="fa-solid fa-store text-lg"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Sales &amp; Order Report</p>
                                <h1 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Transaction Summary</h1>
                                <p class="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <span v-if="startDate || endDate">
                                        Period: <span class="text-slate-700 dark:text-slate-200">{{ startDate ? formatDate(startDate) : 'Beginning' }}</span>
                                        &rarr;
                                        <span class="text-slate-700 dark:text-slate-200">{{ endDate ? formatDate(endDate) : 'Today' }}</span>
                                    </span>
                                    <span v-else>All-time record &middot; Generated {{ formatDate(today) }}</span>
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-3">
                            <div class="hidden text-right sm:block">
                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Records Matched</p>
                                <p class="text-lg font-black text-slate-900 dark:text-white">{{ filteredOrders.length }} <span class="text-xs font-medium text-slate-400">/ {{ orders.length }}</span></p>
                            </div>
                            <button
                                type="button"
                                class="print:hidden flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                <i class="fa-solid fa-print text-xs"></i>
                                Print / Export
                            </button>
                        </div>
                    </div>

                    <!-- ==================== TOTAL AMOUNT CARDS ==================== -->
                    <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 print:grid-cols-5 print:gap-2">

                        <!-- SUBTOTAL -->
                        <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subtotal</p>
                            <h4 class="mt-1 truncate text-lg font-black text-slate-900 dark:text-white">৳ {{ Number(saleSummary?.subtotal || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Before discount &amp; VAT</p>
                        </div>

                        <!-- DISCOUNT -->
                        <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Discount</p>
                            <h4 class="mt-1 truncate text-lg font-black text-amber-600 dark:text-amber-400">−৳ {{ Number(saleSummary?.discount || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Total discount given</p>
                        </div>

                        <!-- VAT -->
                        <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">VAT</p>
                            <h4 class="mt-1 truncate text-lg font-black text-blue-600 dark:text-blue-400">৳ {{ Number(saleSummary?.vat || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Total VAT collected</p>
                        </div>

                        <!-- DUE AMOUNT -->
                        <div class="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-500">Due Amount</p>
                            <h4 class="mt-1 truncate text-lg font-black text-rose-600 dark:text-rose-400">৳ {{ Number(saleSummary?.dueAmount || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">Outstanding receivables</p>
                        </div>

                        <!-- PAYABLE AMOUNT -->
                        <div class="relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4 shadow-sm transition-all hover:shadow-md dark:border-emerald-800/50 dark:bg-emerald-950/20 print:rounded-lg print:border-slate-900 print:bg-white print:p-3 print:shadow-none">
                            <p class="text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500">Payable Amount</p>
                            <h4 class="mt-1 truncate text-lg font-black text-emerald-700 dark:text-emerald-400">৳ {{ Number(saleSummary?.payableAmount || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</h4>
                            <p class="mt-0.5 text-[10px] font-medium text-emerald-600/70 dark:text-emerald-500/60">Net total revenue</p>
                        </div>

                    </div>

                    <!-- ==================== FILTER PANEL (hidden on print) ==================== -->
                    <div class="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900 print:hidden">
                        <div class="space-y-5">

                            <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/60">
                                <div class="flex items-center gap-2">
                                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                        <i class="fa-solid fa-sliders text-xs"></i>
                                    </div>
                                    <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Filter Report</h3>
                                </div>
                                <span v-if="startDate || endDate || searchQuery || statusFilter" class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
                                    <span class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                    Filter Active
                                </span>
                            </div>

                            <div class="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
                                <div class="md:col-span-4">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Start Date</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                            <i class="fa-solid fa-calendar-days text-sm"></i>
                                        </div>
                                        <input type="date" v-model="startDate" :max="endDate || today"
                                            class="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:hover:bg-slate-800/60 dark:focus:border-indigo-500 dark:focus:bg-slate-800" />
                                    </div>
                                </div>

                                <div class="md:col-span-4">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">End Date</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                            <i class="fa-solid fa-calendar-check text-sm"></i>
                                        </div>
                                        <input type="date" v-model="endDate" :min="startDate || undefined" :max="today"
                                            class="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition-all hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:hover:bg-slate-800/60 dark:focus:border-indigo-500 dark:focus:bg-slate-800" />
                                    </div>
                                </div>

                                <div class="md:col-span-2">
                                    <button type="button" @click="fetchData" :disabled="loading"
                                        class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-600 bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:border-indigo-700 focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                                        <i v-if="!loading" class="fa-solid fa-magnifying-glass text-xs"></i>
                                        <i v-else class="fa-solid fa-spinner animate-spin text-xs"></i>
                                        <span>{{ loading ? 'Filtering...' : 'Apply' }}</span>
                                    </button>
                                </div>

                                <div class="md:col-span-2">
                                    <button type="button" @click="resetFilters" :disabled="loading"
                                        class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
                                        <i class="fa-solid fa-rotate-left text-xs"></i>
                                        <span>Reset</span>
                                    </button>
                                </div>
                            </div>

                            <div class="flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800/60 lg:flex-row lg:items-end lg:justify-between">
                                <div class="w-full lg:flex-1">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Search Sales Record</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                            <i class="fa-solid fa-magnifying-glass text-sm"></i>
                                        </div>
                                        <input type="text" v-model="searchQuery" @keyup.enter="fetchData"
                                            placeholder="Search by Order ID, Reg, Customer Name, or Phone..."
                                            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800" />
                                    </div>
                                </div>

                                <div class="w-full lg:w-[220px]">
                                    <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sale Status</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                                            <i class="fa-solid fa-filter text-xs"></i>
                                        </div>
                                        <select v-model="statusFilter"
                                            class="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-9 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:bg-slate-800">
                                            <option value="">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="unpaid">Unpaid</option>
                                            <option value="paid">Paid</option>
                                            <option value="partially_paid">Partially Paid</option>
                                            <option value="completed">Completed</option>
                                            <option value="returned">Returned</option>
                                        </select>
                                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 dark:text-slate-500">
                                            <i class="fa-solid fa-chevron-down text-[10px]"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- ==================== REPORT TABLE ==================== -->
                    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden print:rounded-none print:border print:border-slate-400 print:shadow-none">
                        <div class="overflow-x-auto max-h-[1080px] print:max-h-none print:overflow-visible">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-md print:static print:bg-slate-100 print:border-slate-400">
                                    <tr>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Date</th>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Reg / Invoice</th>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Customer</th>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Payment Method</th>
                                        <th class="px-6 py-4 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Amount</th>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider print:px-3 print:py-2">Served By</th>
                                        <th class="px-6 py-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center print:px-3 print:py-2">Status</th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                    <template v-if="filteredOrders && filteredOrders.length > 0">
                                        <tr v-for="(order, index) in filteredOrders" :key="order.id" @click="viewOrderDetails(order)"
                                            class="cursor-pointer transition-colors group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 print:cursor-default"
                                            :class="index % 2 === 1 ? 'bg-slate-50/40 dark:bg-slate-800/20 print:bg-slate-50' : ''">

                                            <td class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2">
                                                <div class="text-xs font-semibold text-slate-700 dark:text-slate-200">{{ formatDate(order.order_date) }}</div>
                                                <div v-if="order.paid_at" class="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 print:text-slate-500">
                                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 print:hidden"></span>
                                                    Paid: {{ formatDate(order.paid_at) }}
                                                </div>
                                            </td>

                                            <td class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2">
                                                <div class="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 print:text-slate-900">{{ order.reg }}</div>
                                                <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{{ order.order_number }}</div>
                                            </td>

                                            <td class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2">
                                                <div class="flex items-center gap-3">
                                                    <div class="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs uppercase shadow-sm print:hidden">
                                                        {{ (order.customer_name || 'WC').substring(0, 2) }}
                                                    </div>
                                                    <div>
                                                        <div class="text-xs font-semibold text-slate-900 dark:text-slate-100">{{ order.customer_name || 'Walk-in Customer' }}</div>
                                                        <div class="text-[10px] text-slate-400 dark:text-slate-500">{{ order.customer_phone || 'N/A' }}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2">
                                                <span class="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md capitalize inline-flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/50 print:bg-transparent print:border-0 print:px-0 print:py-0">
                                                    <i class="fas fa-wallet text-[10px] text-slate-400 print:hidden"></i>
                                                    {{ order.payment_method }}
                                                </span>
                                            </td>

                                            <td class="px-6 py-4 whitespace-nowrap text-right print:px-3 print:py-2">
                                                <div class="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">৳ {{ parseFloat(order.payable_amount).toLocaleString('en-BD', { minimumFractionDigits: 2 }) }}</div>
                                                <div v-if="parseFloat(order.discount) > 0" class="text-[10px] text-amber-600 dark:text-amber-400 font-mono">−৳ {{ parseFloat(order.discount).toLocaleString('en-BD', { minimumFractionDigits: 2 }) }}</div>
                                            </td>

                                            <td class="px-6 py-4 whitespace-nowrap print:px-3 print:py-2">
                                                <div class="text-xs text-slate-700 dark:text-slate-300 font-medium">{{ order.user?.name || 'N/A' }}</div>
                                                <div class="text-[10px] text-slate-400 dark:text-slate-500">ID: #{{ order.user_id }}</div>
                                            </td>

                                            <td class="px-6 py-4 whitespace-nowrap text-center print:px-3 print:py-2">
                                                <span :class="getStatus(order.status).container"
                                                    class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border border-transparent dark:border-current/10 shadow-xs print:border print:border-slate-400 print:shadow-none">
                                                    <span class="relative flex h-2 w-2 print:hidden">
                                                        <span v-if="order.status.toLowerCase() === 'pending'" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="getStatus(order.status).dot"></span>
                                                        <span class="relative inline-flex rounded-full h-2 w-2" :class="getStatus(order.status).dot"></span>
                                                    </span>
                                                    {{ order.status }}
                                                </span>
                                            </td>
                                        </tr>
                                    </template>

                                    <tr v-else>
                                        <td colspan="7" class="px-6 py-12 text-center">
                                            <div v-if="loading" class="w-full flex flex-col items-center justify-center py-10">
                                                <div class="animate-spin h-8 w-8 border-3 border-[#A3D921] border-t-transparent rounded-full"></div>
                                                <p class="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">Updating report data...</p>
                                            </div>
                                            <div v-else class="flex flex-col items-center justify-center max-w-xs mx-auto py-6">
                                                <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 mb-3 ring-8 ring-slate-50 dark:ring-slate-900/50 flex items-center justify-center w-12 h-12">
                                                    <i class="fas fa-receipt text-lg"></i>
                                                </div>
                                                <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">No sales record found</h3>
                                                <p class="text-[11px] text-slate-400 dark:text-slate-500">Try adjusting your search query or date filter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>

                                <!-- Report Totals Footer -->
                                <tfoot v-if="filteredOrders && filteredOrders.length > 0" class="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 print:bg-slate-100 print:border-slate-400">
                                    <tr>
                                        <td colspan="4" class="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2">
                                            Total Payable ({{ filteredOrders.length }} orders)
                                        </td>
                                        <td class="px-6 py-4 text-right text-sm font-black text-slate-900 dark:text-white font-mono print:px-3 print:py-2">
                                            ৳ {{ Number(saleSummary?.payableAmount || 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
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






// Pagination
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




// =============================
// Get Purchase Orders
// =============================
const orders = ref([]);

const pagination = ref({
    page: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
    from: 0,
    to: 0,
});


// =============================
// Fetch Purchase Orders
// =============================
async function fetchPurchaseOrders(page = 1) {
    try {
        loading.value = true;
        errorMsg.value = '';

        const res = await api.get('/purchase/reports', {
            params: {
                page: page,
                per_page: pagination.value.perPage,
            },
        });

        const response = res.data;

        // Orders array
        orders.value = Array.isArray(response?.data) ? response.data : [];

        // Pagination
        pagination.value = {
            page: response?.pagination?.current_page ?? 1,
            lastPage: response?.pagination?.last_page ?? 1,
            total: response?.pagination?.total ?? 0,
            perPage: response?.pagination?.per_page ?? 20,
            from: response?.pagination?.from ?? 0,
            to: response?.pagination?.to ?? 0,
        };

    } catch (err) {
        console.error('Purchase orders fetch error:',err?.response?.data || err);
        errorMsg.value = err?.response?.data?.message || 'Failed to fetch purchase orders.';
        orders.value = [];
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


// =============================
// Format Date
// =============================
const formatDate = (date) => {
    if (!date) {
        return '-';
    }
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
        return '-';
    }
    return parsedDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};


// =============================
// Status
// =============================
const getStatus = (status) => {

    const normalizedStatus = String(status || '').toLowerCase().trim();

    const statuses = {
        pending: {
            container:
                'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
            dot: 'bg-amber-500',
        },
        unpaid: {
            container:
                'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
            dot: 'bg-rose-500',
        },
        partially_paid: {
            container:
                'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
            dot: 'bg-blue-500',
        },
        completed: {
            container:
                'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
            dot: 'bg-emerald-500',
        },
        returned: {
            container:
                'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
            dot: 'bg-orange-500',
        },
        cancelled: {
            container:
                'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
            dot: 'bg-slate-500',
        },
    };

    return statuses[normalizedStatus] || {
        container:
            'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        dot: 'bg-slate-500',
    };
};


// =============================
// Filter
// =============================
const searchQuery = ref('');
const statusFilter = ref('');


// =============================
// Filter Orders
// =============================
const filteredOrders = computed(() => {

    const search = String(searchQuery.value || '').toLowerCase().trim();
    const selectedStatus = String(statusFilter.value || '').toLowerCase().trim();

    return orders.value.filter((order) => {

        // -----------------------------
        // Status filter
        // -----------------------------
        const orderStatus = String(order?.status || '').toLowerCase().trim();

        const matchesStatus = !selectedStatus || orderStatus === selectedStatus;


        // -----------------------------
        // Search
        // -----------------------------
        if (!search) {
            return matchesStatus;
        }

        const searchableValues = [

            // Purchase order
            order?.reg,
            order?.order_number,
            order?.slug,

            // Supplier
            order?.supplier_name,
            order?.supplier_phone,
            order?.supplier?.name,

            // User
            order?.user?.name,
            order?.user?.user_id,

            // Payment
            order?.payment_method,
            order?.currency,

            // Status
            order?.status,

            // Remarks
            order?.remarks,

        ];

        const matchesSearch = searchableValues.some((value) => {

            if (value === null || value === undefined) {
                return false;
            }

            return String(value)
                .toLowerCase()
                .includes(search);
        });

        return matchesStatus && matchesSearch;
    });
});




























const today = new Date().toISOString().split('T')[0];
const startDate = ref(today);
const endDate = ref(today);
const isDateFilterActive = ref(false);

async function fetchData(page = 1) {
    try {
        loading.value = true;
        errorMsg.value = '';
        isDateFilterActive.value = true;

        const res = await api.get('/purchase/reports/filter', {
            params: {
                page,
                start_date: startDate.value,
                end_date: endDate.value,
                per_page: pagination.value.perPage,
            }
        });

        const response = res.data;

        orders.value = Array.isArray(response?.data)
            ? response.data
            : [];

        pagination.value = {
            page: response?.pagination?.current_page ?? 1,
            lastPage: response?.pagination?.last_page ?? 1,
            total: response?.pagination?.total ?? 0,
            perPage: response?.pagination?.per_page ?? 20,
            from: response?.pagination?.from ?? 0,
            to: response?.pagination?.to ?? 0,
        };

    } catch (error) {
        console.error('Error fetching data:', error);

        errorMsg.value =
            error?.response?.data?.message ||
            'Failed to fetch orders';

        orders.value = [];

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

async function changePage(page) {
    if (isDateFilterActive.value) {
        await fetchData(page);
    } else {
        await fetchPurchaseOrders(page);
    }
}


const resetFilters = async () => {

    searchQuery.value = '';
    statusFilter.value = '';

    startDate.value = today;
    endDate.value = today;

    isDateFilterActive.value = false;

    await fetchPurchaseOrders(1);
};







// =========================================================================
// Cart calculate
// =========================================================================
const saleSummary = computed(() => {
    const orders = filteredOrders.value || [];

    return {
        subtotal: orders.reduce(
            (sum, order) => sum + Number(order.subtotal || 0),
            0
        ),

        discount: orders.reduce(
            (sum, order) => sum + Number(order.discount || 0),
            0
        ),

        vat: orders.reduce(
            (sum, order) => sum + Number(order.vat || 0),
            0
        ),

        dueAmount: orders.reduce(
            (sum, order) => sum + Number(order.due_amount || 0),
            0
        ),

        payableAmount: orders.reduce(
            (sum, order) => sum + Number(order.payable_amount || 0),
            0
        ),

        point: orders.reduce(
            (sum, order) => sum + Number(order.point || 0),
            0
        ),
    };
});









function viewOrderDetails(order) {
    if (!order?.id) {
        console.warn('Invalid purchase order:', order);
        return;
    }

    router.push(`/admin/purchase/details/${order.reg}/${order.order_number}/${order.slug}`);
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
    fetchPurchaseOrders();


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