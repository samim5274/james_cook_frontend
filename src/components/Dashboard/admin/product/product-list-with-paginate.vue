<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <HeaderSection
            @open-sidebar="sidebarOpen = true"
            @search="onSearch"
            :isDark="isDark" @toggle-theme="toggleTheme"
        />

        <div class="flex min-h-[calc(100vh-56px)]">
            <Navbar
                v-model="active"
                :open="sidebarOpen"
                @close="sidebarOpen = false"
            />

            <Message
                :successMsg="successMsg"
                :errorMsg="errorMsg"
                @update:successMsg="successMsg = $event"
                @update:errorMsg="errorMsg = $event"
            />

            <!-- Content -->
            <div class="flex-1 min-w-0 flex flex-col">
                <div class="min-h-screen bg-gray-50 dark:bg-[#0f172e]">

                    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white"><i class="fa-solid fa-dolly"></i> Products Details</h2>
                    <input type="search" v-model="searchQuery" @input="onSearch" placeholder="Search products..." class="mb-4 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/30">
                    
                    <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        
                            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                                <tr v-for="product in filterProducts" :key="product.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150">
                                    
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-start gap-4">
                                            <div class="group relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                                                <img v-if="product.image" 
                                                    :src="product.image" 
                                                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                                <div v-else class="flex h-full w-full items-center justify-center text-slate-400">
                                                    <i class="fa-solid fa-box-open text-lg opacity-40"></i>
                                                </div>
                                            </div>

                                            <div class="flex flex-col gap-0.5 max-w-[220px]">
                                                <div class="flex items-center gap-2">
                                                    <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                        {{ product.name }}
                                                    </h4>
                                                    <span class="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                        #{{ product.id }}
                                                    </span>
                                                </div>

                                                <div class="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                                    <span class="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700">
                                                        {{ product.sku }}
                                                    </span>
                                                    <span class="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                    <span class="font-medium text-blue-600 dark:text-blue-400">
                                                        {{ product.brand?.name || 'No Brand' }}
                                                    </span>
                                                </div>

                                                <div class="mt-1 flex items-center gap-3">
                                                    <div v-if="product.is_active" class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                                                        <span class="relative flex h-1.5 w-1.5">
                                                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                                        </span>
                                                        Active
                                                    </div>
                                                    <div v-else class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                                        <span class="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                                        Inactive
                                                    </div>

                                                    <span class="text-[10px] text-slate-400 dark:text-slate-600 font-mono italic truncate">
                                                        /{{ product.slug }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex flex-col gap-1.5">
                                            <div class="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                <i class="fa-solid fa-store text-[10px] text-blue-500"></i>
                                                <span>{{ product.vendor?.shop_name || 'Mercuvaix' }}</span>
                                            </div>

                                            <div class="flex items-center gap-1 text-[11px] font-medium tracking-tight">
                                                <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                    {{ product.category?.name || 'Uncategorized' }}
                                                </span>
                                                
                                                <i v-if="product.subcategory" class="fa-solid fa-chevron-right text-[8px] text-slate-400 mx-0.5"></i>
                                                
                                                <span v-if="product.subcategory" class="text-slate-500 dark:text-slate-500 italic">
                                                    {{ product.subcategory.name }}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex flex-col gap-3">
                                            <div class="flex flex-col group">
                                                <div class="flex items-center gap-2">
                                                    <span class="text-base font-extrabold text-slate-900 dark:text-white leading-none">
                                                        ৳{{ Number(product.discount > 0 ? product.discount : product.price).toLocaleString() }}
                                                    </span>
                                                    
                                                    <span v-if="product.discount > 0 && product.price > 0" 
                                                        class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-rose-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
                                                        <i class="fa-solid fa-arrow-down mr-0.5 scale-75"></i>
                                                        {{ Math.round(((product.price - product.discount) / product.price) * 100) }}% OFF
                                                    </span>
                                                </div>

                                                <div v-if="product.discount > 0" class="flex items-center gap-1.5 mt-0.5">
                                                    <span class="text-[11px] font-medium text-slate-400 line-through decoration-slate-300">
                                                        ৳{{ Number(product.price).toLocaleString() }}
                                                    </span>
                                                    <span class="text-[10px] text-slate-300 font-medium">Original</span>
                                                </div>
                                            </div>

                                            <div class="flex flex-col gap-1.5">
                                                <div class="flex items-center justify-between w-[120px]">
                                                    <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock Status</span>
                                                    <span :class="[
                                                        'text-[10px] font-bold px-1.5 py-0.5 rounded-full', 
                                                        product.stock_quantity <= product.min_stock 
                                                        ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-500/20' 
                                                        : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500/20'
                                                    ]">
                                                        {{ product.stock_quantity }} Qty
                                                    </span>
                                                </div>
                                                
                                                <div class="w-[120px] h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div :class="[
                                                            'h-full transition-all duration-700 ease-in-out shadow-[0_0_8px_rgba(16,185,129,0.4)]', 
                                                            product.stock_quantity <= product.min_stock ? 'bg-amber-500' : 'bg-emerald-500'
                                                        ]" 
                                                        :style="{ width: Math.min((product.stock_quantity / (product.stock_quantity + 20)) * 100, 100) + '%' }">
                                                    </div>
                                                </div>

                                                <p v-if="product.stock_quantity <= product.min_stock" class="flex items-center gap-1 text-[9px] font-bold text-rose-500 uppercase tracking-tighter">
                                                    <span class="h-1 w-1 bg-rose-500 rounded-full animate-ping"></span>
                                                    Reorder Soon
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="flex justify-end gap-2">
                                            <button @click="editProduct(product.id)" class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-blue-600 transition-colors hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-blue-900/30">
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button @click="deleteProduct(product.id)" class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-red-600 transition-colors hover:bg-red-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-red-900/30">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <tr v-if="products.length === 0">
                                    <td colspan="7" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div class="flex flex-col items-center gap-2">
                                            <i class="fa-solid fa-box-open text-4xl opacity-20"></i>
                                            <p class="text-sm font-medium">No products found in the database.</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Pagination section -->
                    <div class="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p class="text-xs text-slate-500">
                            Showing
                            <span class="font-semibold text-slate-700">{{ fromItem }}</span>
                            –
                            <span class="font-semibold text-slate-700">{{ toItem }}</span>
                            of
                            <span class="font-semibold text-slate-700">{{ total }}</span>
                        </p>

                        <div class="flex flex-wrap items-center justify-end gap-2">
                            <!-- First -->
                            <button
                                @click="fetchProducts(1)"
                                :disabled="currentPage === 1 || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                                <i class="fa-solid fa-angles-left"></i>
                            </button>

                            <!-- Prev -->
                            <button
                                @click="fetchProducts(Math.max(1, currentPage - 1))"
                                :disabled="currentPage === 1 || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                                <i class="fa-solid fa-chevron-left"></i>
                            </button>

                            <!-- Pages -->
                            <button
                                v-for="page in visiblePages"
                                :key="String(page)"
                                :disabled="page === '...' || loading"
                                @click="page !== '...' && fetchProducts(page)"
                                class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                                :class="[
                                    page === '...'
                                    ? 'border-slate-200 bg-white dark:bg-slate-900 text-slate-400 cursor-default'
                                    : currentPage === page
                                        ? 'border-slate-900 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                                        : 'border-slate-200 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 hover:bg-slate-50'
                                ]">
                                {{ page }}
                            </button>

                            <!-- Next -->
                            <button
                                @click="fetchProducts(Math.min(lastPage, currentPage + 1))"
                                :disabled="currentPage === lastPage || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                                <i class="fa-solid fa-angle-right"></i>
                            </button>

                            <!-- Last -->
                            <button
                                @click="fetchProducts(lastPage)"
                                :disabled="currentPage === lastPage || loading"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                                <i class="fa-solid fa-angles-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api, {makeImg} from '../../../../services/api.js'

import Navbar from "../../admin/admin-navbar.vue";
import HeaderSection from "../../admin/admin-header.vue";
import Message from '../../../Message/message.vue'
import FooterSection from "../../../footer.vue";

const router = useRouter()

const loading = ref(false)
const errors = reactive({})
const successMsg = ref('');
const errorMsg = ref('');

const active = ref('dashboard');



// get products
const products = ref([]);
const searchQuery = ref('');
async function fetchProducts(page = 1){
    loading.value = true;

    try{
        const params = new URLSearchParams();
        params.set('page', String(page));

        // search add
        if (searchQuery.value) {
            params.set('search', searchQuery.value);
        }

        const res = await api.get(`/products?${params.toString()}`);
        const payload = res.data;

        const dataSource = payload.data?.data ? payload.data : payload;

        const list = Array.isArray(dataSource.data) ? dataSource.data : [];

        products.value = list.map(p => ({
            ...p,
            image: makeImg(p.image)
        }));

        currentPage.value = dataSource.current_page ?? 1;
        lastPage.value = dataSource.last_page ?? 1;
        total.value = dataSource.total ?? 0;
        perPage.value = dataSource.per_page ?? 15;
        fromItem.value = dataSource.from ?? 0;
        toItem.value = dataSource.to ?? 0;

    }catch(err){
        console.error('Failed to fetch products:', err);
        errorMsg.value = err.response?.data?.message || 'Failed to load products.';
    }finally{
        loading.value = false;
    }
}


/**
 * ------------------------------------------------
 * Pagination
 * ------------------------------------------------
 */
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
const perPage = ref(15);
const fromItem = ref(0);
const toItem = ref(0);

const visiblePages = computed(() => {
    const pages = [];
    const current = currentPage.value;
    const last = lastPage.value;

    if (last <= 5) {
        for (let i = 1; i <= last; i++) pages.push(i);
        return pages;
    }

    pages.push(1);

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < last - 2) pages.push("...");

    pages.push(last);

    return pages;
});




// filter products by search query
const filterProducts = computed(() => {
    if (!searchQuery.value) return products.value;

    const q = searchQuery.value.toLowerCase();
    return products.value.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand?.name?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q) ||
        p.subcategory?.name?.toLowerCase().includes(q)
    );
});



// dark and light mode
const isDark = ref(false);
const sidebarOpen = ref(false);

function applyTheme(dark) {
    isDark.value = dark;   // VERY IMPORTANT
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
}

function toggleTheme() {
    applyTheme(!isDark.value);
}

function onSearch(q) {
    console.log("search:", q);
}


/* ESC to close drawer */
onMounted(() => {
    fetchProducts();



    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") sidebarOpen.value = false;
    });
    const saved = localStorage.getItem("theme");
    if (saved === "dark") applyTheme(true);
    else if (saved === "light") applyTheme(false);
    else {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(systemDark);
    }
});
</script>

<style scoped>

</style>