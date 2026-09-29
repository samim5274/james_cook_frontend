<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <AdminHeader
            :is-dark="isDark"
            @toggle-dark="toggleDarkMode"
            @toggle-menu="toggleMenu" />

        <div class="flex">
            <AdminNavbar
                :mobile-menu="mobileMenu"
                @close="mobileMenu = false" />

            
            <Message
                :successMsg="successMsg"
                :errorMsg="errorMsg"
                @update:successMsg="successMsg = $event"
                @update:errorMsg="errorMsg = $event"
            />
            
            <div class="flex-1 min-w-0 flex flex-col">
                <div class="min-h-screen bg-gray-50 dark:bg-[#0f172e]">
                    <div class="mx-auto px-4 sm:px-6 lg:px-8 pt-5">

                        <!-- ================= 1. LEFT SIDE: PRODUCT SELECTION & FILTER (5 Columns) ================= -->
                        <div class="lg:col-span-4 flex flex-col gap-3">

                            <!-- Header & Badge -->
                            <div class="flex items-center justify-between">
                                <label class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                    <i class="fa-solid fa-boxes-stacked text-emerald-600 dark:text-orange-500"></i>
                                    Select Products
                                </label>
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                    0.x Total Available
                                </span>
                            </div>

                            <!-- 🔍 SEARCH & FILTER BAR -->
                            <div class="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-2 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">

                                <!-- Text Search Input -->
                                <div class="relative w-full">
                                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                                    <input
                                        v-model="searchQuery"
                                        type="text"
                                        @keydown.enter="handleSearch"
                                        placeholder="Search ID or name..."
                                        class="w-full h-8 pl-8 pr-7 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 dark:focus:border-orange-500 transition-colors"
                                    />
                                    <button
                                        v-if="searchQuery"
                                        type="button"
                                        @click="searchQuery = ''"
                                        class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                                    >
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Product Table Container -->
                            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden shadow-sm">
                                <div class="max-h-[48rem] overflow-y-auto custom-scrollbar">
                                <table class="w-full text-left border-collapse">
                                    <!-- Table Header -->
                                    <thead class="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                    <tr>
                                        <th class="p-3">Product Name</th>
                                        <th class="p-3">SKU / Brand</th>
                                        <th class="p-3">Price</th>
                                        <th class="p-3 text-right font-medium">Stock</th>
                                        <th class="p-3 text-center w-16">Action</th>
                                    </tr>
                                    </thead>

                                    <!-- Skeleton Loading State -->
                                    <tbody v-if="loading" class="divide-y divide-slate-100 dark:divide-slate-800/50 animate-pulse">
                                    <tr v-for="i in 4" :key="i">
                                        <td class="p-3"><div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-36"></div></td>
                                        <td class="p-3"><div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div></td>
                                        <td class="p-3"><div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div></td>
                                        <td class="p-3 text-right"><div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-10 ml-auto"></div></td>
                                        <td class="p-3 text-center"><div class="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto"></div></td>
                                    </tr>
                                    </tbody>

                                    <!-- Product List View -->
                                    <tbody v-else-if="products && products.length > 0" class="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs text-slate-700 dark:text-slate-300">
                                        <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <!-- Name & Category -->
                                            <td class="p-3">
                                            <div class="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]" :title="product.name">
                                                {{ product.name }}
                                            </div>
                                            <div class="text-[10px] text-slate-400">
                                                {{ product.category?.name }} <span v-if="product.subcategory?.name">• {{ product.subcategory.name }}</span>
                                            </div>
                                            </td>

                                            <!-- SKU & Brand -->
                                            <td class="p-3">
                                            <div class="font-mono text-[11px] text-slate-500">{{ product.sku }}</div>
                                            <div class="text-[10px] text-indigo-500 font-medium">{{ product.brand?.name }}</div>
                                            </td>

                                            <!-- Price -->
                                            <td class="p-3 font-semibold text-slate-900 dark:text-white">
                                            ৳{{ product.purchase_price }}
                                            </td>

                                            <!-- Stock Quantity -->
                                            <td class="p-3 text-right whitespace-nowrap">
                                                <span
                                                    :class="product.stock_quantity <= product.min_stock
                                                        ? 'bg-red-50 text-red-600 dark:bg-red-950/40'
                                                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'"
                                                    class="inline-flex items-center whitespace-nowrap shrink-0 px-2 py-0.5 rounded-full font-medium text-[11px]"
                                                >
                                                    {{ Number(product.stock_quantity) }} pcs
                                                </span>
                                            </td>

                                            <!-- Action Button (+) -->
                                            <td class="p-3 text-center">
                                            <button 
                                                type="button" 
                                                @click.stop="openProductStock(product)"
                                                class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 dark:text-indigo-400 font-medium transition-all active:scale-95 shadow-sm"
                                                title="Add Product"
                                            >
                                                <i class="fa-solid fa-plus text-xs"></i>
                                            </button>
                                            </td>
                                        </tr>
                                    </tbody>

                                    <!-- Empty State -->
                                    <tbody v-else>
                                    <tr>
                                        <td colspan="5" class="py-12 text-center">
                                        <div class="max-w-xs mx-auto flex flex-col items-center justify-center">
                                            <div class="relative mb-3 flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50">
                                            <i class="fa-solid fa-box-open text-xl text-slate-400 dark:text-slate-500"></i>
                                            </div>
                                            <h3 class="text-xs font-semibold text-slate-800 dark:text-slate-200">No Products Available</h3>
                                            <p class="text-[11px] text-slate-500 dark:text-slate-400">There are no items found in the response.</p>
                                        </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    </div>
    <FooterSection />


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
                v-if="isProductStockModalOpen"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
                @click.self="closeProductStockModal"
            >
                <div
                    @click.stop
                    class="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
                >
                    <!-- Header -->
                    <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <i class="fa-solid fa-boxes-stacked"></i>
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-slate-900 dark:text-white">
                                    Add Stock
                                </h3>
                                <p class="text-xs text-slate-500 dark:text-slate-400">
                                    Add stock for this product
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            @click="closeProductStockModal"
                            class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                            <i class="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="p-5 space-y-5">
                        <!-- Product -->
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                                Product
                            </label>
                            <div class="px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                                <p class="text-sm font-semibold text-slate-900 dark:text-white">
                                    {{ selectedStockProduct?.name }}
                                </p>
                                <p
                                    v-if="selectedStockProduct?.stock_quantity !== undefined"
                                    class="text-xs text-slate-500 dark:text-slate-400 mt-1"
                                >
                                    Current stock:
                                    <span class="font-semibold">
                                        {{ selectedStockProduct.stock_quantity }}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <!-- Purchase Price -->
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                                Purchase Price <span class="text-rose-500">*</span>
                            </label>
                            <input
                                v-model="purchasePrice"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter purchase price"
                                class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                                :class="{ '!border-rose-500 focus:!ring-rose-500/10': purchasePriceError }"
                                @keyup.enter="saveProductStock"
                            />
                            <p
                                v-if="purchasePriceError"
                                class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                            >
                                <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                {{ purchasePriceError }}
                            </p>
                        </div>

                        <!-- Sale Price -->
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                                Sale Price <span class="text-rose-500">*</span>
                            </label>
                            <input
                                v-model="salePrice"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter sale price"
                                class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                                :class="{ '!border-rose-500 focus:!ring-rose-500/10': salePriceError }"
                                @keyup.enter="saveProductStock"
                            />
                            <p
                                v-if="salePriceError"
                                class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                            >
                                <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                {{ salePriceError }}
                            </p>
                        </div>

                        <!-- Stock Quantity -->
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                                Stock Quantity <span class="text-rose-500">*</span>
                            </label>
                            <input
                                v-model="productStock"
                                type="number"
                                min="1"
                                step="1"
                                placeholder="Enter stock quantity"
                                class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                                :class="{ '!border-rose-500 focus:!ring-rose-500/10': stockError }"
                                @keyup.enter="saveProductStock"
                            />
                            <p
                                v-if="stockError"
                                class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                            >
                                <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                {{ stockError }}
                            </p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="px-5 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3">
                        
                        <button
                            type="button"
                            @click="saveProductStock"
                            :disabled="isSavingStock"
                            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <i
                                v-if="isSavingStock"
                                class="fa-solid fa-spinner fa-spin text-xs"
                            ></i>
                            <i
                                v-else
                                class="fa-solid fa-plus text-xs"
                            ></i>
                            <span>
                                {{ isSavingStock ? 'Adding...' : 'Add Stock' }}
                            </span>
                        </button>

                        <button
                            type="button"
                            @click="closeProductStockModal"
                            :disabled="isSavingStock"
                            class="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:border-slate-700/80 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import api, { makeImg } from "../../../../services/api.js";


import AdminNavbar from '../admin-navbar.vue';
import AdminHeader from '../admin-header.vue';

import Message from '../../../Message/message.vue';
import FooterSection from "../../../footer.vue";

const mobileMenu = ref(false);

function toggleMenu() {
    mobileMenu.value = !mobileMenu.value;
}


const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

// Filter State Variables
const searchQuery = ref('');
const products = ref([]);











// fetch all products
async function fetchProducts() {
    loading.value = true;
    errorMsg.value = "";

    try {
        const res = await api.get("/products");

        if (!res.data?.success) {
            errorMsg.value = res.data?.message || "Failed to fetch products.";
            return;
        }

        products.value = (res.data.data || []).map(product => ({
            ...product,
            stock_quantity: Number(product.stock_quantity ?? 0),
            min_stock: Number(product.min_stock ?? 0),
            purchase_price: Number(product.purchase_price ?? 0),
            price: Number(product.price ?? 0),
        }));
    } catch (err) {
        console.error("Failed to fetch products:", err);

        errorMsg.value =
            err.response?.data?.message ||
            "Failed to fetch products.";
    } finally {
        loading.value = false;
    }
}

// Fixed Computed Filter Logic
const filteredProducts = computed(() => {
    // Array safety check
    if (!Array.isArray(products.value)) return []

    const query = searchQuery.value.toLowerCase().trim()
    
    if (!query) return products.value

    return products.value.filter(p => {
        const nameMatch = p.name?.toLowerCase().includes(query)
        const idMatch = String(p.id ?? '').toLowerCase().includes(query)
        const skuMatch = p.sku?.toLowerCase().includes(query)
        const brandMatch = p.brand?.name?.toLowerCase().includes(query)
        const categoryMatch = p.category?.name?.toLowerCase().includes(query)

        return nameMatch || idMatch || skuMatch || brandMatch || categoryMatch
    })
})










const isProductStockModalOpen = ref(false);
const selectedStockProduct = ref(null);

const productStock = ref("");
const purchasePrice = ref("");
const salePrice = ref("");

const stockError = ref("");
const purchasePriceError = ref("");
const salePriceError = ref("");

const isSavingStock = ref(false);

function openProductStock(product) {
    selectedStockProduct.value = product;
    productStock.value = "";
    purchasePrice.value = product.purchase_price ?? "";
    salePrice.value = product.price ?? "";

    stockError.value = "";
    purchasePriceError.value = "";
    salePriceError.value = "";

    isProductStockModalOpen.value = true;
}

function closeProductStockModal() {
    if (isSavingStock.value) return;

    isProductStockModalOpen.value = false;
    selectedStockProduct.value = null;
    productStock.value = "";
    purchasePrice.value = "";
    salePrice.value = "";
    stockError.value = "";
    purchasePriceError.value = "";
    salePriceError.value = "";
}

function validateProductStock() {
    let valid = true;

    stockError.value = "";
    purchasePriceError.value = "";
    salePriceError.value = "";

    const stock = Number(productStock.value);
    const purchase = Number(purchasePrice.value);
    const sale = Number(salePrice.value);

    if (
        productStock.value === "" ||
        !Number.isInteger(stock) ||
        stock <= 0
    ) {
        stockError.value = "Please enter a valid stock quantity.";
        valid = false;
    }

    if (
        purchasePrice.value === "" ||
        !Number.isFinite(purchase) ||
        purchase < 0
    ) {
        purchasePriceError.value = "Please enter a valid purchase price.";
        valid = false;
    }

    if (
        salePrice.value === "" ||
        !Number.isFinite(sale) ||
        sale < 0
    ) {
        salePriceError.value = "Please enter a valid sale price.";
        valid = false;
    }

    if (valid && sale < purchase) {
        salePriceError.value =
            "Sale price cannot be lower than purchase price.";
        valid = false;
    }

    return valid;
}

async function saveProductStock() {
    const product = selectedStockProduct.value;

    if (!product?.id) {
        stockError.value = "Product not found.";
        return;
    }

    if (isSavingStock.value || !validateProductStock()) return;

    try {
        isSavingStock.value = true;

        const productId = product.id;

        const payload = {
            stock: Number(productStock.value),
            purchasePrice: Number(purchasePrice.value),
            salePrice: Number(salePrice.value),
        };

        const response = await api.post(
            `/stock/${productId}`,
            payload
        );

        if (response.data?.success) {
            const updatedProduct = response.data?.data?.product;
            const index = products.value.findIndex(
                item => item.id === productId
            );

            if (index !== -1 && updatedProduct) {
                products.value[index] = {
                    ...products.value[index],
                    ...updatedProduct,
                };
            }

            successMsg.value =
                response.data.message ||
                "Product stock added successfully.";

            // Success holei modal close
            isProductStockModalOpen.value = false;
            selectedStockProduct.value = null;
            productStock.value = "";
            purchasePrice.value = "";
            salePrice.value = "";
            stockError.value = "";
            purchasePriceError.value = "";
            salePriceError.value = "";
        }
    } catch (error) {
        console.error("Failed to add product stock:", error);

        if (error.response?.status === 422) {
            const errors = error.response.data?.errors || {};

            stockError.value = errors.stock?.[0] || "";
            purchasePriceError.value =
                errors.purchasePrice?.[0] ||
                errors.purchase_price?.[0] ||
                "";
            salePriceError.value =
                errors.salePrice?.[0] ||
                errors.sale_price?.[0] ||
                "";

            if (
                !stockError.value &&
                !purchasePriceError.value &&
                !salePriceError.value
            ) {
                stockError.value =
                    error.response.data?.message ||
                    "Please check the entered values.";
            }
        } else {
            stockError.value =
                error.response?.data?.message ||
                "Failed to add product stock.";
        }
    } finally {
        isSavingStock.value = false;
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



onMounted(() => {
    fetchProducts();

    const saved = localStorage.getItem("theme");
    if (saved === "dark") applyTheme(true);
    else if (saved === "light") applyTheme(false);
    else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
});


</script>

<style scoped>
.input{
    @apply w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100;
}
.inputDisabled{
    @apply w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600
        dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300;
}
</style>