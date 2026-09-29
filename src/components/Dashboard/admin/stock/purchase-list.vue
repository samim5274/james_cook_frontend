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
                <main
                    class="flex-1 min-h-screen min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 lg:px-8 py-6"
                >

                    <!-- ============================= -->
                    <!-- Header -->
                    <!-- ============================= -->
                    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

                        <div>
                            <div class="flex items-center gap-3">

                                <h1
                                    class="text-2xl font-black tracking-tight text-slate-900 dark:text-white"
                                >
                                    Purchase Orders
                                </h1>

                                <span
                                    class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20"
                                >
                                    {{ pagination.total }} Orders
                                </span>

                            </div>

                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Monitor and manage your purchase orders and supplier transactions.
                            </p>
                        </div>

                    </div>


                    <!-- ============================= -->
                    <!-- Search & Filters -->
                    <!-- ============================= -->
                    <div
                        class="mb-6 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors"
                    >

                        <div class="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">

                            <!-- Search -->
                            <div class="relative flex-1 w-full">

                                <div
                                    class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500"
                                >
                                    <i class="fa-solid fa-magnifying-glass text-xs sm:text-sm"></i>
                                </div>

                                <input
                                    type="text"
                                    v-model="searchQuery"
                                    placeholder="Search by PO number, invoice or supplier..."
                                    class="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                                />

                            </div>


                            <!-- Filter -->
                            <div
                                class="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-between lg:justify-end"
                            >

                                <div
                                    class="flex items-center gap-2 flex-1 sm:flex-initial min-w-0"
                                >

                                    <div class="hidden sm:flex items-center gap-1.5 shrink-0">
                                        <i
                                            class="fa-solid fa-filter text-xs text-slate-400 dark:text-slate-500"
                                        ></i>

                                        <span
                                            class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                                        >
                                            Status:
                                        </span>
                                    </div>


                                    <select
                                        v-model="statusFilter"
                                        class="w-full sm:w-auto sm:min-w-[160px] rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-300 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                                    >

                                        <option value="">
                                            All Statuses
                                        </option>

                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="unpaid">
                                            Unpaid
                                        </option>

                                        <option value="partially_paid">
                                            Partially Paid
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>

                                        <option value="returned">
                                            Returned
                                        </option>

                                    </select>

                                </div>


                                <!-- Reset -->
                                <button
                                    type="button"
                                    @click="resetFilters"
                                    class="inline-flex items-center justify-center shrink-0 h-10 w-10 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-all active:scale-95"
                                    title="Reset Filters"
                                >
                                    <i class="fa-solid fa-rotate text-sm"></i>
                                </button>

                            </div>

                        </div>

                    </div>


                    <!-- ============================= -->
                    <!-- Table -->
                    <!-- ============================= -->
                    <div
                        class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                    >

                        <div class="overflow-x-auto max-h-[850px] scrollbar-thin">

                            <table class="w-full text-left border-collapse whitespace-nowrap">

                                <!-- ============================= -->
                                <!-- Header -->
                                <!-- ============================= -->
                                <thead
                                    class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 sticky top-0 backdrop-blur-md z-10"
                                >

                                    <tr>

                                        <th
                                            class="pl-5 pr-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[18%]"
                                        >
                                            Purchase Order
                                        </th>

                                        <th
                                            class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[25%]"
                                        >
                                            Supplier
                                        </th>

                                        <th
                                            class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[15%]"
                                        >
                                            Date
                                        </th>

                                        <th
                                            class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[15%]"
                                        >
                                            Status
                                        </th>

                                        <th
                                            class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[15%]"
                                        >
                                            Created By
                                        </th>

                                        <th
                                            class="pl-4 pr-5 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[12%] text-center"
                                        >
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <!-- ============================= -->
                                <!-- Body -->
                                <!-- ============================= -->
                                <tbody
                                    class="divide-y divide-slate-100 dark:divide-slate-800/50"
                                >

                                    <!-- ============================= -->
                                    <!-- Loading -->
                                    <!-- ============================= -->
                                    <template v-if="loading">

                                        <tr
                                            v-for="n in 7"
                                            :key="'skeleton-' + n"
                                            class="animate-pulse"
                                        >

                                            <!-- Purchase Order -->
                                            <td class="pl-5 pr-4 py-3">

                                                <div
                                                    class="h-3.5 w-28 bg-slate-200 dark:bg-slate-700/60 rounded"
                                                ></div>

                                                <div
                                                    class="h-2.5 w-20 bg-slate-100 dark:bg-slate-800 rounded mt-1.5"
                                                ></div>

                                            </td>


                                            <!-- Supplier -->
                                            <td class="px-4 py-3">

                                                <div class="flex items-center gap-2.5">

                                                    <div
                                                        class="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700/60 shrink-0"
                                                    ></div>

                                                    <div class="space-y-1.5">

                                                        <div
                                                            class="h-3 w-28 bg-slate-200 dark:bg-slate-700/60 rounded"
                                                        ></div>

                                                        <div
                                                            class="h-2.5 w-20 bg-slate-100 dark:bg-slate-800 rounded"
                                                        ></div>

                                                    </div>

                                                </div>

                                            </td>


                                            <!-- Date -->
                                            <td class="px-4 py-3">

                                                <div
                                                    class="h-3 w-20 bg-slate-200 dark:bg-slate-700/60 rounded"
                                                ></div>

                                                <div
                                                    class="h-2.5 w-14 bg-slate-100 dark:bg-slate-800 rounded mt-1.5"
                                                ></div>

                                            </td>


                                            <!-- Status -->
                                            <td class="px-4 py-3">

                                                <div
                                                    class="h-6 w-20 bg-slate-200 dark:bg-slate-700/60 rounded-full"
                                                ></div>

                                            </td>


                                            <!-- Created By -->
                                            <td class="px-4 py-3">

                                                <div
                                                    class="h-3 w-24 bg-slate-200 dark:bg-slate-700/60 rounded"
                                                ></div>

                                                <div
                                                    class="h-2.5 w-16 bg-slate-100 dark:bg-slate-800 rounded mt-1.5"
                                                ></div>

                                            </td>


                                            <!-- Actions -->
                                            <td class="pl-4 pr-5 py-3 text-center">

                                                <div
                                                    class="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 gap-1.5"
                                                >

                                                    <div
                                                        class="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-700/60"
                                                    ></div>

                                                    <div
                                                        class="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-700/60"
                                                    ></div>

                                                    <div
                                                        class="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-700/60"
                                                    ></div>

                                                </div>

                                            </td>

                                        </tr>

                                    </template>


                                    <!-- ============================= -->
                                    <!-- Data -->
                                    <!-- ============================= -->
                                    <template v-else-if="orders.length > 0">

                                        <tr
                                            v-for="order in orders"
                                            :key="order.id"
                                            @click="viewOrderDetails(order)"
                                            class="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all duration-150 cursor-pointer group border-l-4 border-l-transparent"
                                            :class="{
                                                'hover:border-l-amber-500': order.status === 'pending',
                                                'hover:border-l-rose-500': order.status === 'unpaid',
                                                'hover:border-l-blue-500': order.status === 'partially_paid',
                                                'hover:border-l-emerald-500': order.status === 'completed',
                                                'hover:border-l-emerald-500': order.status === 'paid',
                                                'hover:border-l-orange-500': order.status === 'returned'
                                            }"
                                        >

                                            <!-- ============================= -->
                                            <!-- Purchase Order -->
                                            <!-- ============================= -->
                                            <td class="pl-5 pr-4 py-3">

                                                <div
                                                    class="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                                                >
                                                    {{ order.reg || 'N/A' }}
                                                </div>

                                                <div
                                                    v-if="order.invoice_no"
                                                    class="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono mt-1 flex items-center gap-1"
                                                >

                                                    <i class="fa-solid fa-file-invoice text-[9px]"></i>

                                                    {{ order.invoice_no }}

                                                </div>

                                                <div
                                                    v-else
                                                    class="text-[10px] text-slate-400 dark:text-slate-500 mt-1"
                                                >
                                                    No Invoice
                                                </div>

                                            </td>


                                            <!-- ============================= -->
                                            <!-- Supplier -->
                                            <!-- ============================= -->
                                            <td class="px-4 py-3">

                                                <div class="flex items-center gap-2.5">

                                                    <div
                                                        class="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px] uppercase border border-indigo-100 dark:border-indigo-500/20 shrink-0"
                                                    >
                                                        {{
                                                            order.supplier?.name
                                                                ? order.supplier.name.substring(0, 2)
                                                                : 'SU'
                                                        }}
                                                    </div>


                                                    <div class="truncate max-w-[220px]">

                                                        <div
                                                            class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate"
                                                        >
                                                            {{ order.supplier?.name || 'Unknown Supplier' }}
                                                        </div>

                                                        <div
                                                            class="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5"
                                                        >
                                                            Supplier ID:
                                                            {{ order.supplier?.id || '-' }}
                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                            <!-- ============================= -->
                                            <!-- Date -->
                                            <!-- ============================= -->
                                            <td class="px-4 py-3">

                                                <div
                                                    class="text-xs text-slate-600 dark:text-slate-400 font-medium"
                                                >
                                                    {{
                                                        formatDate(
                                                            order.order_date ||
                                                            order.purchase_date ||
                                                            order.created_at
                                                        )
                                                    }}
                                                </div>

                                                <div
                                                    v-if="order.created_at"
                                                    class="text-[10px] text-slate-400 dark:text-slate-500 mt-1"
                                                >
                                                    Created:
                                                    {{
                                                        new Date(order.created_at).toLocaleTimeString(
                                                            'en-US',
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }
                                                        )
                                                    }}
                                                </div>

                                            </td>


                                            <!-- ============================= -->
                                            <!-- Status -->
                                            <!-- ============================= -->
                                            <td class="px-4 py-3">
                                                <span
                                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                                                    :class="{
                                                        pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
                                                        unpaid: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
                                                        partially_paid: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
                                                        completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
                                                        paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
                                                        returned: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
                                                    }[order.status] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'"
                                                >
                                                    <!-- Dynamic Colored Dot -->
                                                    <span
                                                        class="h-1.5 w-1.5 rounded-full"
                                                        :class="{
                                                            pending: 'bg-amber-500',
                                                            unpaid: 'bg-rose-500',
                                                            partially_paid: 'bg-blue-500',
                                                            completed: 'bg-emerald-500',
                                                            paid: 'bg-emerald-500',
                                                            returned: 'bg-orange-500'
                                                        }[order.status] || 'bg-slate-400'"
                                                    ></span>

                                                    <!-- Dynamic Status Text -->
                                                    <span>
                                                        {{
                                                            {
                                                                pending: 'Pending',
                                                                unpaid: 'Unpaid',
                                                                partially_paid: 'Partially Paid',
                                                                completed: 'Completed',
                                                                paid: 'Paid',
                                                                returned: 'Returned'
                                                            }[order.status] || order.status || 'Unknown'
                                                        }}
                                                    </span>
                                                </span>
                                            </td>


                                            <!-- ============================= -->
                                            <!-- Created By -->
                                            <!-- ============================= -->
                                            <td class="px-4 py-3">

                                                <div
                                                    class="text-xs font-semibold text-slate-700 dark:text-slate-300"
                                                >
                                                    {{ order.user?.name || 'System' }}
                                                </div>

                                                <div
                                                    class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5"
                                                >
                                                    ID:
                                                    {{ order.user?.id || '-' }}
                                                </div>

                                            </td>


                                            <!-- ============================= -->
                                            <!-- Actions -->
                                            <!-- ============================= -->
                                            <td class="pl-4 pr-5 py-3 text-center">

                                                <div
                                                    class="inline-flex items-center p-1 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 shadow-sm"
                                                >

                                                    <!-- Print -->
                                                    <button
                                                        type="button"
                                                        @click.stop="printPurchaseOrder(order)"
                                                        title="Print Purchase Order"
                                                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-gray-700 active:scale-95 transition-all duration-150"
                                                    >
                                                        <i class="fa-solid fa-print text-xs"></i>
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    </template>


                                    <!-- ============================= -->
                                    <!-- Empty -->
                                    <!-- ============================= -->
                                    <tr v-else>

                                        <td
                                            colspan="6"
                                            class="px-6 py-16 text-center"
                                        >

                                            <div
                                                class="flex flex-col items-center justify-center max-w-xs mx-auto"
                                            >

                                                <div
                                                    class="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4"
                                                >
                                                    <i
                                                        class="fa-solid fa-file-invoice text-lg text-slate-400 dark:text-slate-500"
                                                    ></i>
                                                </div>

                                                <p
                                                    class="text-sm font-bold text-slate-700 dark:text-slate-300"
                                                >
                                                    No Purchase Orders Found
                                                </p>

                                                <p
                                                    class="text-xs text-slate-400 dark:text-slate-500 mt-1"
                                                >
                                                    Try changing your search or filter.
                                                </p>

                                                <button
                                                    type="button"
                                                    @click="resetFilters"
                                                    class="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-white px-3.5 py-2 text-xs font-semibold text-white dark:text-slate-900 hover:opacity-90 transition"
                                                >
                                                    <i class="fa-solid fa-rotate text-[10px]"></i>
                                                    Reset Filters
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>


                    <!-- ============================= -->
                    <!-- Pagination -->
                    <!-- ============================= -->
                    <div
                        class="mt-3 flex flex-col gap-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-sm px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >

                        <!-- Showing -->
                        <p class="text-xs text-slate-500 dark:text-slate-400">

                            Showing

                            <span class="font-semibold text-slate-700 dark:text-slate-200">
                                {{ pagination.from }}
                            </span>

                            –

                            <span class="font-semibold text-slate-700 dark:text-slate-200">
                                {{ pagination.to }}
                            </span>

                            of

                            <span class="font-semibold text-slate-700 dark:text-slate-200">
                                {{ pagination.total }}
                            </span>

                        </p>


                        <!-- Pagination Buttons -->
                        <div class="flex flex-wrap items-center justify-end gap-1.5">

                            <!-- First -->
                            <button
                                type="button"
                                @click="changePage(1)"
                                :disabled="pagination.page === 1 || loading || pagination.total === 0"
                                class="inline-flex items-center justify-center h-8 min-w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                title="First Page"
                            >
                                <i class="fa-solid fa-angles-left"></i>
                            </button>


                            <!-- Previous -->
                            <button
                                type="button"
                                @click="changePage(pagination.page - 1)"
                                :disabled="pagination.page === 1 || loading"
                                class="inline-flex items-center justify-center h-8 min-w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                title="Previous Page"
                            >
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>


                            <!-- Pages -->
                            <template
                                v-for="(page, index) in OrderVisiblePages"
                                :key="`page-${index}-${page}`"
                            >

                                <!-- Ellipsis -->
                                <span
                                    v-if="page === '...'"
                                    class="inline-flex items-center justify-center h-8 min-w-8 px-1 text-xs font-bold text-slate-400 dark:text-slate-500"
                                >
                                    ...
                                </span>


                                <!-- Page -->
                                <button
                                    v-else
                                    type="button"
                                    @click="changePage(page)"
                                    :disabled="loading"
                                    class="inline-flex items-center justify-center h-8 min-w-8 rounded-lg border px-2.5 text-xs font-semibold transition disabled:cursor-not-allowed"
                                    :class="
                                        page === pagination.page
                                            ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    "
                                >
                                    {{ page }}
                                </button>

                            </template>


                            <!-- Next -->
                            <button
                                type="button"
                                @click="changePage(pagination.page + 1)"
                                :disabled="
                                    pagination.page === pagination.lastPage ||
                                    loading ||
                                    pagination.total === 0
                                "
                                class="inline-flex items-center justify-center h-8 min-w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                title="Next Page"
                            >
                                <i class="fa-solid fa-chevron-right"></i>
                            </button>


                            <!-- Last -->
                            <button
                                type="button"
                                @click="changePage(pagination.lastPage)"
                                :disabled="
                                    pagination.page === pagination.lastPage ||
                                    loading ||
                                    pagination.total === 0
                                "
                                class="inline-flex items-center justify-center h-8 min-w-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                title="Last Page"
                            >
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
// Pagination
// =============================
const pagination = ref({
    page: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
    from: 0,
    to: 0,
});

const OrderVisiblePages = computed(() => {
    const pages = [];

    const last = pagination.value.lastPage;
    const current = pagination.value.page;

    if (last <= 5) {
        for (let i = 1; i <= last; i++) {
            pages.push(i);
        }

        return pages;
    }

    pages.push(1);

    if (current > 3) {
        pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < last - 2) {
        pages.push('...');
    }

    pages.push(last);

    return pages;
});


// =============================
// Orders
// =============================
const orders = ref([]);

const searchQuery = ref('');
const statusFilter = ref('');


// =============================
// Fetch Orders
// =============================
async function fetchOrders(page = 1) {
    if (loading.value) return;

    loading.value = true;
    errorMsg.value = '';

    try {
        const params = {
            page,
            per_page: pagination.value.perPage,
        };

        // Search only when available
        const search = searchQuery.value.trim();

        if (search) {
            params.search = search;
        }

        // Status only when selected
        if (statusFilter.value) {
            params.status = statusFilter.value;
        }

        const res = await api.get('/purchase/orders', {
            params,
        });

        const response = res.data;

        if (!response?.success) {
            throw new Error(
                response?.message || 'Failed to fetch purchase orders.'
            );
        }

        // =============================
        // Orders
        // =============================
        orders.value = response?.data ?? [];

        // =============================
        // Pagination
        // =============================
        const meta = response?.pagination;

        pagination.value = {
            page: meta?.current_page ?? 1,
            lastPage: meta?.last_page ?? 1,
            total: meta?.total ?? 0,
            perPage: meta?.per_page ?? 20,
            from: meta?.from ?? 0,
            to: meta?.to ?? 0,
        };

    } catch (err) {
        console.error('Purchase order fetch error:', err);

        errorMsg.value =
            err?.response?.data?.message ||
            err?.message ||
            'Something went wrong while fetching purchase orders.';

        orders.value = [];

        pagination.value = {
            page: 1,
            lastPage: 1,
            total: 0,
            perPage: pagination.value.perPage || 20,
            from: 0,
            to: 0,
        };

    } finally {
        loading.value = false;
    }
}


// =============================
// Search
// =============================
let searchTimeout = null;

watch(searchQuery, () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        fetchOrders(1);
    }, 500);
});


// =============================
// Status Filter
// =============================
watch(statusFilter, () => {
    fetchOrders(1);
});


// =============================
// Reset Filters
// =============================
function resetFilters() {
    clearTimeout(searchTimeout);

    searchQuery.value = '';
    statusFilter.value = '';

    fetchOrders(1);
}


// =============================
// Change Page
// =============================
async function changePage(page) {
    if (
        page === '...' ||
        page < 1 ||
        page > pagination.value.lastPage ||
        page === pagination.value.page
    ) {
        return;
    }

    await fetchOrders(page);
}


// =============================
// Previous Page
// =============================
async function previousPage() {
    if (pagination.value.page > 1) {
        await fetchOrders(pagination.value.page - 1);
    }
}


// =============================
// Next Page
// =============================
async function nextPage() {
    if (pagination.value.page < pagination.value.lastPage) {
        await fetchOrders(pagination.value.page + 1);
    }
}


// =============================
// Format Date
// =============================
const formatDate = (date) => {
    if (!date) return '-';

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



















// ==========================================
// Purchase Order Actions
// ==========================================

// View Purchase Order Details
function viewOrderDetails(order) {
    if (!order?.id) {
        console.warn('Invalid purchase order:', order);
        return;
    }

    router.push(`/admin/purchase/details/${order.reg}/${order.order_number}/${order.slug}`);
}


// Edit Purchase Order
function editPurchaseOrder(order) {
    if (!order?.id) {
        console.warn('Invalid purchase order:', order);
        return;
    }

    console.log('Edit Purchase Order:', order);

}


// Print Purchase Order
function printPurchaseOrder(purchaseOrder) {
        if (!purchaseOrder?.reg) {
        errorMsg.value =
            "Invalid purchase order reference.";

        return;
    }

    const win =
        window.open(
            "about:blank",
            "_blank"
        );

    if (!win) {

        alert(
            "Popup blocked! Please allow popups."
        );

        return;
    }

    win.location.href = `/admin/purchase/order/invoice-print/${purchaseOrder.reg}`;

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
    fetchOrders();


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