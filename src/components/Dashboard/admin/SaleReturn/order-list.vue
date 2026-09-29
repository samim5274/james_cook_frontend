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
                                    {{ orders.length }} Orders
                                </span>
                            </div>
                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor and manage your customer transactions and shipping status.</p>
                        </div>
                    </div>

                    <div class="mb-6 rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors">
                        <div class="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
                            
                            <!-- Search Input -->
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

                            <!-- Filter Dropdown & Reset Action -->
                            <div class="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-between lg:justify-end">
                                <div class="flex items-center gap-2 flex-1 sm:flex-initial min-w-0">
                                    <div class="hidden sm:flex items-center gap-1.5 shrink-0">
                                        <i class="fa-solid fa-filter text-xs text-slate-400 dark:text-slate-500"></i>
                                        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status:</span>
                                    </div>

                                    <select 
                                        v-model="statusFilter" 
                                        class="w-full sm:w-auto sm:min-w-[160px] rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-slate-700/80 dark:bg-slate-800/60 dark:text-slate-300 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                                    >
                                        <option value="" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">All Statuses</option>
                                        <option value="pending" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Pending</option>
                                        <option value="unpaid" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Unpaid</option>
                                        <option value="partially_paid" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Partially Paid</option>
                                        <option value="completed" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Completed</option>
                                        <option value="returned" class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Returned</option>
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
                                <!-- Table Header -->
                                <thead class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 sticky top-0 backdrop-blur-md z-10">
                                    <tr>
                                        <th class="pl-5 pr-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[14%]">Order / Reg</th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[26%]">Customer & Contact</th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[16%]">Timeline</th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[16%]">Payment & Gateway</th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[14%] text-right">Financials (BDT)</th>
                                        <th class="pl-4 pr-5 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-[14%] text-center">Action</th>
                                    </tr>
                                </thead>

                                <!-- Table Body -->
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    
                                    <!-- Skeleton Loading State -->
                                    <tr v-if="loading" v-for="n in 5" :key="'skeleton-' + n" class="animate-pulse">
                                        <!-- Order / Reg Skeleton -->
                                        <td class="pl-5 pr-4 py-3">
                                            <div class="h-3.5 w-20 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
                                            <div class="h-2.5 w-14 bg-slate-100 dark:bg-slate-800 rounded mt-1.5"></div>
                                        </td>

                                        <!-- Customer & Contact Skeleton -->
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-2.5">
                                                <div class="h-7 w-7 rounded bg-slate-200 dark:bg-slate-700/60 shrink-0"></div>
                                                <div class="space-y-1.5 flex-1">
                                                    <div class="h-3 w-28 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
                                                    <div class="h-2.5 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Timeline & Points Skeleton -->
                                        <td class="px-4 py-3">
                                            <div class="h-3 w-20 bg-slate-200 dark:bg-slate-700/60 rounded mb-1.5"></div>
                                            <div class="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                        </td>

                                        <!-- Payment Gateway Skeleton -->
                                        <td class="px-4 py-3">
                                            <div class="h-3 w-16 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
                                            <div class="h-2.5 w-14 bg-slate-100 dark:bg-slate-800 rounded mt-1.5"></div>
                                        </td>

                                        <!-- Financials Skeleton -->
                                        <td class="px-4 py-3 text-right">
                                            <div class="h-3.5 w-16 bg-slate-200 dark:bg-slate-700/60 rounded ml-auto"></div>
                                            <div class="h-2.5 w-12 bg-slate-100 dark:bg-slate-800 rounded ml-auto mt-1.5"></div>
                                        </td>

                                        <!-- Actions Skeleton -->
                                        <td class="pl-4 pr-5 py-3 text-center">
                                            <div class="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 gap-1.5">
                                                <div class="h-6 w-6 rounded-lg bg-slate-200 dark:bg-slate-700/60"></div>
                                                <div class="h-6 w-6 rounded-lg bg-slate-200 dark:bg-slate-700/60"></div>
                                                <div class="h-6 w-6 rounded-lg bg-slate-200 dark:bg-slate-700/60"></div>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    <!-- Data Rows @click="viewOrderDetails(order)" -->
                                    <template v-else-if="filteredOrders && filteredOrders.length > 0">
                                        <tr v-for="order in filteredOrders"  @click="viewOrderDetails(order)"
                                            :key="order.id" 
                                            
                                            :class="[
                                                'hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all duration-150 cursor-pointer group border-l-4 border-l-transparent',
                                                order.status.toLowerCase() === 'pending' ? 'hover:border-l-amber-500' :
                                                order.status.toLowerCase() === 'delivered' ? 'hover:border-l-emerald-500' :
                                                order.status.toLowerCase() === 'cancelled' ? 'hover:border-l-rose-500' : 'hover:border-l-indigo-500'
                                            ]"
                                        >
                                            <!-- Order Identification & Coupon -->
                                            <td class="pl-5 pr-4 py-2.5">
                                                <div class="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {{ order.reg }}
                                                </div>
                                                <div v-if="order.order_number" class="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 flex items-center gap-1">
                                                    <i class="fa-solid fa-tag text-[9px]"></i>
                                                    {{ order.order_number }}
                                                </div>
                                                <div v-else class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                                    No Order Number
                                                </div>
                                            </td>

                                            <!-- Customer & Contact Details -->
                                            <td class="px-4 py-2.5">
                                                <div class="flex items-center gap-2.5">
                                                    <!-- Initials Avatar -->
                                                    <div class="h-7 w-7 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-[10px] uppercase border border-slate-200/50 dark:border-slate-700/40">
                                                        {{ (order.customer_name ? order.customer_name.substring(0, 2) : 'CU') }}
                                                    </div>
                                                    <div class="truncate max-w-[190px]">
                                                        <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                            {{ order.customer_name || 'Guest Customer' }}
                                                        </div>
                                                        <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                                                            <span>{{ order.customer_phone || 'No Phone' }}</span>
                                                            <span v-if="order.user?.user_id" class="text-slate-300 dark:text-slate-700">|</span>
                                                            <span v-if="order.user?.user_id">{{ order.user.user_id }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <!-- Date & Timeline Progress -->
                                            <td class="px-4 py-2.5">
                                                <!-- Order Creation Date -->
                                                <div class="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">
                                                    {{ formatDate(order.order_date) }}
                                                </div>

                                                <div  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                    <i class="fa-solid fa-star text-[9px]"></i> 
                                                    {{ order.point }}
                                                </div>
                                            </td>

                                            <!-- Payment Method & Payment Status -->
                                            <td class="px-4 py-2.5">
                                                <div class="flex items-center gap-1.5">
                                                    <span class="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                                                        {{ order.payment_method }}
                                                    </span>
                                                </div>

                                                <!-- Payment Status Badges based on model constants -->
                                                <div class="text-[10px] font-semibold mt-0.5 flex items-center gap-1">
                                                    <!-- Status Color Dot Indicator -->
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

                                                    <!-- Status Text -->
                                                    <span
                                                        :class="{
                                                            pending: 'text-amber-600 dark:text-amber-400',
                                                            unpaid: 'text-rose-600 dark:text-rose-400',
                                                            partially_paid: 'text-blue-600 dark:text-blue-400',
                                                            completed: 'text-emerald-600 dark:text-emerald-400',
                                                            paid: 'text-emerald-600 dark:text-emerald-400',
                                                            returned: 'text-orange-600 dark:text-orange-400'
                                                        }[order.status] || 'text-slate-500 dark:text-slate-400'"
                                                    >
                                                        {{
                                                            {
                                                                pending: 'Pending',
                                                                unpaid: 'Unpaid',
                                                                partially_paid: 'Partially Paid',
                                                                completed: 'Completed',
                                                                paid: 'Paid',
                                                                returned: 'Returned'
                                                            }[order.status] || order.status
                                                        }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- (Payable Amount, Base Amount & Discounts) -->
                                            <td class="px-4 py-2.5 text-right">
                                                <div class="text-xs font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                                                    ৳{{ parseFloat(order.payable_amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}
                                                </div>
                                                <!-- Show discount summary if exists -->
                                                <div v-if="parseFloat(order.discount) > 0" class="text-[9px] text-orange-500 font-medium mt-0.5">
                                                    Saved ৳{{ (parseFloat(order.discount)).toFixed(0) }}
                                                </div>
                                                <div v-else class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                                    Base: ৳{{ parseFloat(order.payable_amount).toFixed(0) }}
                                                </div>
                                            </td>

                                            <!-- Order Status Badge -->
                                            <td class="px-4 py-2 text-center whitespace-nowrap">
                                                <div class="inline-flex items-center p-1 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
                                                    <!-- Print Button -->
                                                    <button
                                                        type="button" @click.stop="printOrder(order)"
                                                        title="Print Order"
                                                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-700 active:scale-95 transition-all duration-150"
                                                    >
                                                        <i class="fa-solid fa-print text-xs"></i>
                                                    </button>

                                                    <div class="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-0.5"></div>

                                                    <button @click="viewOrderDetails(order)"
                                                        type="button"
                                                        title="Edit Order"
                                                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-gray-700 active:scale-95 transition-all duration-150"
                                                    >
                                                        <i class="fa-solid fa-pencil text-xs"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>

                                    <!-- Empty State -->
                                    <tr v-else>
                                        <td colspan="6" class="px-6 py-16 text-center">
                                            <div class="flex flex-col items-center justify-center max-w-xs mx-auto text-slate-400">
                                                <i class="fa-solid fa-inbox text-xl mb-2"></i>
                                                <p class="text-xs font-semibold tracking-wide uppercase">No orders found for today</p>
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
import api, {makeImg} from '../../../../services/api.js'

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


const orders = ref([]);
const searchQuery = ref('');
const statusFilter = ref('');

async function fetchOrders(page = 1){
    loading.value = true;
    try{
        const res = await api.get('/orders', {
            params: { 
                page,
                search: searchQuery.value.trim(),
                status: statusFilter.value,
            }
        });
        const response = res.data;

        orders.value = response?.data?.data ?? [];

        // PAGINATION META
        pagination.value = {
            page: response?.data?.current_page ?? 1,
            lastPage: response?.data?.last_page ?? 1,
            total: response?.data?.total ?? 0,
            perPage: response?.data?.per_page ?? 20,
            from: response?.data?.from ?? 0,
            to: response?.data?.to ?? 0,
        };
        // console.log(orders.value);
    } catch(err){
        errorMsg.value = err || "Something is wrong to fetched orders.";

        orders.value = [];

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
        fetchOrders(1);
    }, 500);
});

watch(statusFilter, () => {
    fetchOrders(1);
});

const resetFilters = () => {
    searchQuery.value = '';
    statusFilter.value = '';
    fetchOrders(1);
};

async function changePage(page) {
    await fetchOrders(page);
}

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const filteredOrders = computed(() => {
    return orders.value.filter(order => {
        const matchesStatus = !statusFilter.value || 
        order.status.toLowerCase() === statusFilter.value.toLowerCase();
        const search = searchQuery.value.toLowerCase().trim();
        if (!search) return matchesStatus;
        const matchesSearch = 
            (order.reg?.toLowerCase().includes(search)) ||
            (order.user?.name?.toLowerCase().includes(search)) ||
            (String(order.user?.user_id || '').includes(search)) ||
            (order.transaction_id?.toLowerCase().includes(search)) ||
            (order.status?.toLowerCase().includes(search));
        return matchesStatus && matchesSearch;
    });
});









function viewOrderDetails(order){
    router.push(`/admin/sale/order/return/${order.reg}/${order.slug}`);
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










// =============================
// Return invoice
// =============================
async function returnOrder(order) {

    const confirmed = window.confirm(
        `Are you sure you want to return this order?`
    );

    if (!confirmed) {
        return;
    }

    loading.value = true;
    successMsg.value = "";
    errorMsg.value = "";

    try {

        const res = await api.post(
            `/orders/return/${order.reg}/${order.slug}/${order.id}`
        );

        // console.log("RETURN ORDER RESPONSE:", res.data);

        if (res.data?.success) {

            successMsg.value =
                res.data?.message ||
                "Order returned successfully.";

            errorMsg.value = "";

            // Refresh order list
            await fetchOrders();

        } else {

            successMsg.value = "";

            errorMsg.value = String(
                res.data?.message ||
                "Failed to return order."
            );
        }

    } catch (err) {

        console.error("RETURN ORDER ERROR:", err);

        successMsg.value = "";

        /*
        |--------------------------------------------------------------------------
        | Laravel 422 validation message
        |--------------------------------------------------------------------------
        */

        const responseData = err?.response?.data;

        errorMsg.value = String(
            responseData?.message ||
            responseData?.errors?.order?.[0] ||
            responseData?.errors?.status?.[0] ||
            responseData?.errors?.payment?.[0] ||
            err?.message ||
            "Something went wrong while returning the order."
        );

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