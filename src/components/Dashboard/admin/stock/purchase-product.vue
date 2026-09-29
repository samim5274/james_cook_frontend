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

                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            
                            <!-- ================= 2. RIGHT SIDE: CART TABLE (7 Columns) ================= -->
                            <div class="lg:col-span-8 flex flex-col gap-3 pb-4">

                                <!-- Cart Title Header -->
                                <div class="flex items-center justify-between">
                                    <label class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <i class="fa-solid fa-cart-shopping text-emerald-600 dark:text-orange-500"></i>
                                        Selected Order Items
                                    </label>
                                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-orange-500/10 dark:text-orange-400 border border-emerald-200 dark:border-orange-500/20">
                                        {{ cartItems ? cartItems.length : 0 }} Items Selected
                                    </span>
                                </div>
                                <!-- Cart Table Container -->
                                <div class="w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
                                    <div class="max-h-[45rem] overflow-y-auto overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left border-collapse">

                                            <!-- Table Header -->
                                            <thead class="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                                <tr>
                                                    <th class="py-3 px-4">Product</th>
                                                    <th class="py-3 px-3 text-center">Qty</th>
                                                    <th class="py-3 px-3 text-right">Unit Price</th>
                                                    <th class="py-3 px-3 text-right">Subtotal</th>
                                                    <th class="py-3 px-3 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <!-- Table Body -->
                                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                                                <tr v-for="item in cartItems" :key="item.id"
                                                    class="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-200">

                                                    <!-- Product Details -->
                                                    <td class="py-3 px-4 min-w-[180px]">
                                                        <div class="flex items-center gap-3">
                                                            <div @click="ProductDetails(item)"
                                                                class="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer flex-shrink-0 border border-slate-200 dark:border-slate-700">
                                                                <img :src="getProductImage(item)" :alt="item.product?.name || 'Product Image'"
                                                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                    @error="(e) => e.target.src = defaultProductImage" />
                                                            </div>
                                                            <div class="flex flex-col">
                                                                <h3 @click="ProductDetails(item)"
                                                                    class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-orange-400 transition-colors cursor-pointer line-clamp-1">
                                                                    {{ item.product?.name }}
                                                                </h3>
                                                                <div class="flex items-center gap-1 mt-0.5">
                                                                    <span v-if="item.discount > 0" class="text-[9px] font-extrabold text-green-600 dark:text-orange-400 ml-1">
                                                                        (Saved ৳{{ (Number(item.discount) * item.quantity).toLocaleString() }}) - {{ (Number(item.point) * item.quantity).toLocaleString() }} pts
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <!-- Quantity Controls -->
                                                    <td class="py-3 px-3 text-center whitespace-nowrap">
                                                        <div class="inline-flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                                            <button type="button" @click="decreaseQty(item)"
                                                                :disabled="item.quantity <= 1"
                                                                class="w-5 h-5 flex items-center justify-center rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-orange-400 transition-colors disabled:opacity-40">
                                                                <i class="fa-solid fa-minus text-[8px]"></i>
                                                            </button>
                                                            <span class="w-6 text-center font-bold text-slate-800 dark:text-slate-200 text-xs">{{ item.quantity }}</span>
                                                            <button type="button" @click="increaseQty(item)"
                                                                class="w-5 h-5 flex items-center justify-center rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-orange-400 transition-colors">
                                                                <i class="fa-solid fa-plus text-[8px]"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <!-- Unit Price -->
                                                    <td class="py-3 px-3 text-right whitespace-nowrap">
                                                        <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                            ৳{{ Number(item.price).toLocaleString() }}
                                                        </span>
                                                    </td>
                                                    <!-- Subtotal -->
                                                    <td class="py-3 px-3 text-right whitespace-nowrap font-black text-slate-900 dark:text-white">
                                                        ৳{{ (Number(item.price) * item.quantity).toLocaleString() }}
                                                    </td>
                                                    <!-- Remove Button -->
                                                    <td class="py-3 px-3 text-center whitespace-nowrap">
                                                        <button type="button" @click="openEdit(item)"
                                                            class="w-6 h-6 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all">
                                                            <i class="fa-solid fa-pen-to-square text-[11px]"></i>
                                                        </button>
                                                        <button type="button" @click="remove(item)"
                                                            class="w-6 h-6 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all">
                                                            <i class="fa-solid fa-trash-can text-[11px]"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                                <!-- Empty State -->
                                                <tr v-if="!cartItems || cartItems.length === 0">
                                                    <td colspan="6" class="py-16 text-center">
                                                        <div class="max-w-xs mx-auto flex flex-col items-center justify-center">
                                                            <!-- Icon Container with Subtle Glow & Background -->
                                                            <div class="relative mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 shadow-inner">
                                                                <i class="fa-solid fa-cart-plus text-3xl text-slate-400 dark:text-slate-500"></i>
                                                                <span class="absolute -top-1 -right-1 flex h-3 w-3">
                                                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                                    <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                                                </span>
                                                            </div>

                                                            <!-- Main Heading -->
                                                            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                                                                Your cart is empty
                                                            </h3>

                                                            <!-- Subtitle -->
                                                            <p class="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                                                                Looks like you haven't added any products to this order yet.
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div class="sticky top-6 mt-4 bg-white dark:bg-[#0f172e] rounded-xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700/60 transition-all">
                                    <!-- Header -->
                                    <h2 class="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                                        <span>Order Summary</span>
                                        <span class="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#F97316] animate-pulse"></span>
                                    </h2>

                                    <div class="space-y-2 text-xs">

                                        <!-- Subtotal -->
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-500 dark:text-slate-400 font-medium">Subtotal</span>
                                            <span class="text-slate-900 dark:text-white font-bold">৳ {{ formatMoney(subtotal) }}</span>
                                        </div>

                                        <!-- Total Points -->
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-500 dark:text-slate-400 font-medium">Total Points</span>
                                            <span class="text-[#16a34a] dark:text-[#fb923c] font-bold bg-[#16a34a]/10 dark:bg-[#f97316]/20 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                                                <i class="fa-solid fa-star text-[9px]"></i>
                                                {{ formatPoints(totalPoint) }} pts
                                            </span>
                                        </div>

                                        <!-- Discount -->
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-500 dark:text-slate-400 font-medium">Discount</span>
                                            <span class="text-red-500 dark:text-red-400 font-bold">- ৳ {{ formatMoney(manualDiscount) }}</span>
                                        </div>

                                        <!-- VAT -->
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-500 dark:text-slate-400 font-medium">VAT ({{ formatRate(form.vat) }}%)</span>
                                            <span class="text-slate-900 dark:text-white font-bold">+ ৳ {{ formatMoney(vatAmount) }}</span>
                                        </div>

                                        <!-- Divider -->
                                        <div class="h-px bg-slate-100 dark:bg-slate-700/80 my-2"></div>

                                        <!-- Total Payable -->
                                        <div class="flex justify-between items-center py-0.5">
                                            <div>
                                                <span class="text-sm font-bold text-slate-900 dark:text-white block leading-tight">Total Payable</span>
                                                <span class="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Incl. VAT</span>
                                            </div>
                                            <p class="text-xl font-black text-[#16a34a] dark:text-[#F97316] tracking-tight">
                                                ৳ {{ formatMoney(totalPayable) }}
                                            </p>
                                        </div>

                                        <!-- Received Amount -->
                                        <div class="flex justify-between items-center pt-1 border-t border-dashed border-slate-200 dark:border-slate-700/60">
                                            <span class="text-slate-500 dark:text-slate-400 font-medium">Received</span>
                                            <span class="font-bold text-slate-900 dark:text-white">৳ {{ formatMoney(receivedAmount) }}</span>
                                        </div>

                                        <!-- Return / Change Amount -->
                                        <div v-if="changeAmount > 0" class="mt-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                                            <div class="flex justify-between items-center">
                                                <span class="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                                                    <i class="fa-solid fa-arrow-rotate-left text-[10px]"></i>
                                                    Return
                                                </span>
                                                <span class="text-emerald-700 dark:text-emerald-400 font-bold">৳ {{ formatMoney(changeAmount) }}</span>
                                            </div>
                                        </div>

                                        <!-- Due Amount -->
                                        <div v-if="dueAmount > 0" class="mt-1 px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                                            <div class="flex justify-between items-center">
                                                <span class="text-red-700 dark:text-red-400 font-semibold flex items-center gap-1.5">
                                                    <i class="fa-solid fa-clock text-[10px]"></i>
                                                    Due
                                                </span>
                                                <span class="text-red-700 dark:text-red-400 font-bold">৳ {{ formatMoney(dueAmount) }}</span>
                                            </div>
                                        </div>

                                        <!-- Fully Paid Status -->
                                        <div v-if="totalPayable > 0 && receivedAmount >= totalPayable && changeAmount === 0"
                                            class="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                            <i class="fa-solid fa-circle-check"></i>
                                            Fully Paid
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <!-- ================= 1. LEFT SIDE: PRODUCT SELECTION & FILTER (5 Columns) ================= -->
                            <div class="lg:col-span-4 flex flex-col gap-3">

                                <!-- Header & Badge -->
                                <div class="flex items-center justify-between">
                                    <label class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <i class="fa-solid fa-boxes-stacked text-emerald-600 dark:text-orange-500"></i>
                                        Select Products
                                    </label>
                                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                        {{ products.length }} Total Available
                                    </span>
                                </div>
                                <!-- 🔍 SEARCH & FILTER BAR -->
                                <div class="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-2 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">

                                    <!-- Text Search Input -->
                                    <div class="relative w-full sm:w-1/2">
                                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"></i>
                                        <input
                                            ref="searchInput"
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
                                    <!-- Filter Dropdown & Badge -->
                                    <div class="flex items-center gap-2 w-full sm:w-1/2 justify-end">
                                        
                                        <input type="number" min="1" v-model.number="quantity" value="1" @keydown.enter="handleSearch"
                                        class="w-full h-8 px-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 dark:focus:border-orange-500 transition-colors">
                                        
                                        <select
                                            v-model="sortBy"
                                            class="w-full h-8 px-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 dark:focus:border-orange-500 transition-colors"
                                        >
                                            <option value="all">All Products</option>
                                            <option value="discount">Has Discount</option>
                                            <option value="points">Has Points</option>
                                            <option value="price_low">Price: Low to High</option>
                                            <option value="price_high">Price: High to Low</option>
                                        </select>

                                        <span class="text-[10px] font-extrabold px-2 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-emerald-600 dark:text-orange-400 whitespace-nowrap">
                                            {{ products.length }}
                                        </span>
                                    </div>
                                </div>
                                <!-- Product Table Container -->
                                <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden shadow-sm">
                                    <div class="max-h-[27rem] overflow-y-auto custom-scrollbar">
                                        <table class="w-full text-left border-collapse">

                                            <thead class="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                                <tr>
                                                    <th class="p-3">Product Name</th>
                                                    <th class="p-3">Price</th>
                                                    <th class="p-3 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
                                                <tr
                                                    v-for="product in filteredProducts"
                                                    :key="product.id"
                                                    @click="selectProduct(product)"
                                                    class="group cursor-pointer transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                                    :class="{
                                                        'bg-emerald-50/80 dark:bg-orange-500/10': form.product_id === product.id
                                                    }"
                                                >
                                                    <!-- Name & Points -->
                                                    <td class="p-3">
                                                        <div class="flex items-center gap-2">
                                                            <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                                                #{{ product.id }}
                                                            </span>

                                                            <span class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1">
                                                                {{ product.name }}
                                                            </span>
                                                            <span
                                                                v-if="product.point"
                                                                class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black shrink-0
                                                                    bg-emerald-50 text-emerald-600 border border-emerald-200/80
                                                                    dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
                                                            >
                                                                <i class="fa-solid fa-award text-[8px] mr-1"></i>{{ product.point }}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <!-- Price & Discount -->
                                                    <td class="p-3 whitespace-nowrap">
                                                        <div class="flex items-center gap-1.5">
                                                            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500" :class="{'line-through text-[10px]': product.discount > 0}">
                                                                ৳{{ product.price }}
                                                            </span>
                                                            <span v-if="product.discount > 0" class="text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 dark:text-red-400 px-1 py-0.5 rounded">
                                                                -৳{{ product.discount }}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <!-- Final Price -->
                                                    <td class="p-3 text-right font-black text-xs text-slate-900 dark:text-white whitespace-nowrap">
                                                        ৳{{ product.price - (product.discount || 0) }}
                                                    </td>
                                                </tr>
                                                <!-- Empty State -->
                                                <tr v-if="products.length === 0">
                                                    <td colspan="6" class="py-16 text-center">
                                                        <div class="max-w-xs mx-auto flex flex-col items-center justify-center">
                                                            <!-- Icon Container with Subtle Glow & Background -->
                                                            <div class="relative mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 shadow-inner">
                                                                <i class="fa-solid fa-cart-plus text-3xl text-slate-400 dark:text-slate-500"></i>
                                                                <span class="absolute -top-1 -right-1 flex h-3 w-3">
                                                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                                    <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                                                </span>
                                                            </div>

                                                            <!-- Main Heading -->
                                                            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                                                                Your cart is empty
                                                            </h3>

                                                            <!-- Subtitle -->
                                                            <p class="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                                                                Looks like you haven't added any products to this order yet.
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <!-- Order Summary Card -->
                                <div class="lg:col-span-4 pb-4">

                                    
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-[#0F172E] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <!-- Phone Number Input -->
                                        <div class="space-y-1.5">
                                            <label for="supplier_phone" class="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                Customer Phone Number
                                            </label>
                                            <input type="tel" id="supplier_phone" name="supplier_phone" v-model="form.supplier_phone" placeholder="017XXXXXXXX"
                                                class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] dark:focus:ring-[#f97316] focus:border-transparent transition-all" />
                                        </div>
                                        <div class="space-y-1.5">
                                            <label for="supplier_name" class="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                Customer Name
                                            </label>
                                            <input type="text" id="supplier_name" name="supplier_name" v-model="form.supplier_name" placeholder="Mr. Hossain"
                                                class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] dark:focus:ring-[#f97316] focus:border-transparent transition-all" />
                                        </div>

                                        <div class="space-y-1.5 md:col-span-2">
                                            <label for="supplier" class="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                Select Supplier
                                            </label>
                                            <select
                                                v-model="form.supplier_id"
                                                class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a] dark:focus:ring-[#f97316] focus:border-transparent transition-all"
                                            >
                                                <option :value="null">-- Select Supplier --</option>

                                                <option
                                                    v-for="supplier in supplyers"
                                                    :key="supplier.id"
                                                    :value="supplier.id"
                                                >
                                                    {{ supplier.name }} - {{ supplier.company_name }}
                                                </option>
                                            </select>

                                        </div>
                                    
                                        <!-- Payment Method Selection -->
                                        <div class="space-y-1 md:col-span-2 border-t border-slate-100 dark:border-slate-800 pt-2">
                                            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                                Select Payment Method
                                            </label>
                                            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                                <label class="cursor-pointer">
                                                    <input type="radio" v-model="form.payment_method" value="cash" class="peer hidden" />
                                                    <div class="text-center p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 peer-checked:border-[#16a34a] dark:peer-checked:border-[#f97316] peer-checked:bg-[#16a34a]/10 dark:peer-checked:bg-[#f97316]/20 peer-checked:text-[#16a34a] dark:peer-checked:text-[#fb923c] transition-all">
                                                        Cash
                                                    </div>
                                                </label>
                                                <label class="cursor-pointer">
                                                    <input type="radio" v-model="form.payment_method" value="bkash" class="peer hidden" />
                                                    <div class="text-center p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 peer-checked:border-[#16a34a] dark:peer-checked:border-[#f97316] peer-checked:bg-[#16a34a]/10 dark:peer-checked:bg-[#f97316]/20 peer-checked:text-[#16a34a] dark:peer-checked:text-[#fb923c] transition-all">
                                                        bKash
                                                    </div>
                                                </label>
                                                <label class="cursor-pointer">
                                                    <input type="radio" v-model="form.payment_method" value="nagad" class="peer hidden" />
                                                    <div class="text-center p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 peer-checked:border-[#16a34a] dark:peer-checked:border-[#f97316] peer-checked:bg-[#16a34a]/10 dark:peer-checked:bg-[#f97316]/20 peer-checked:text-[#16a34a] dark:peer-checked:text-[#fb923c] transition-all">
                                                        Nagad
                                                    </div>
                                                </label>
                                                <label class="cursor-pointer">
                                                    <input type="radio" v-model="form.payment_method" value="rocket" class="peer hidden" />
                                                    <div class="text-center p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 peer-checked:border-[#16a34a] dark:peer-checked:border-[#f97316] peer-checked:bg-[#16a34a]/10 dark:peer-checked:bg-[#f97316]/20 peer-checked:text-[#16a34a] dark:peer-checked:text-[#fb923c] transition-all">
                                                        Rocket
                                                    </div>
                                                </label>
                                                <label class="cursor-pointer">
                                                    <input type="radio" v-model="form.payment_method" value="card" class="peer hidden" />
                                                    <div class="text-center p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 peer-checked:border-[#16a34a] dark:peer-checked:border-[#f97316] peer-checked:bg-[#16a34a]/10 dark:peer-checked:bg-[#f97316]/20 peer-checked:text-[#16a34a] dark:peer-checked:text-[#fb923c] transition-all">
                                                        Card
                                                    </div>
                                                </label>
                                                <label class="cursor-pointer">
                                                    <input type="radio" v-model="form.payment_method" value="bank" class="peer hidden" />
                                                    <div class="text-center p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 peer-checked:border-[#16a34a] dark:peer-checked:border-[#f97316] peer-checked:bg-[#16a34a]/10 dark:peer-checked:bg-[#f97316]/20 peer-checked:text-[#16a34a] dark:peer-checked:text-[#fb923c] transition-all">
                                                        Bank
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <!-- VAT Input -->
                                        <div class="space-y-1.5 ">
                                            <label for="vat" class="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                VAT (%)
                                            </label>
                                            <div class="relative flex">
                                                <input
                                                    v-model.number="form.vat"
                                                    type="number"
                                                    id="vat"
                                                    name="vat"
                                                    placeholder="0"
                                                    min="0"
                                                    max="100"
                                                    step="any"
                                                    class="w-full pl-3.5 pr-12 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] dark:focus:ring-[#f97316] focus:border-transparent transition-all"
                                                />
                                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">%</span>
                                            </div>
                                        </div>

                                        <!-- Discount Input -->
                                        <div class="space-y-1.5">
                                            <label for="discount" class="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                Discount
                                            </label>
                                            <div class="relative flex">
                                                <input
                                                    v-model.number="form.discount"
                                                    type="number"
                                                    id="discount"
                                                    name="discount"
                                                    placeholder="0.00"
                                                    min="0"
                                                    :max="subtotal"
                                                    step="any"
                                                    class="w-full pl-3.5 pr-12 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] dark:focus:ring-[#f97316] focus:border-transparent transition-all"
                                                />
                                                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">৳</span>
                                            </div>
                                        </div>

                                        <!-- Received Amount Input -->
                                        <div class="space-y-1.5 md:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <label for="received_amount" class="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                Received Amount (৳)
                                            </label>
                                            <div class="relative">
                                                <input
                                                    v-model.number="form.received_amount" @keydown.enter="handleCheckout"
                                                    type="number"
                                                    id="received_amount"
                                                    name="received_amount"
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="any"
                                                    class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-base font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] dark:focus:ring-[#f97316] focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    
                                    <div class="mx-auto">
                                        <button @click="handleCheckout" :disabled="checkoutLoading || !cartItems?.length" class="w-full mt-8 bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#F97316] hover:dark:bg-[#d85a00] text-white py-4 rounded-xl font-black text-base tracking-wide transition-all shadow-lg shadow-[#16a34a]/20 dark:shadow-none flex items-center justify-center gap-3 group active:scale-[0.99]">
                                            <span v-if="checkoutLoading">
                                                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                                                Processing...
                                            </span>

                                            <span v-else>
                                                Confirm Purchase
                                                <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                            </span>
                                        </button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>








            <!-- cart item purchase price update modal -->
            <div v-if="editModal"
                class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                @click.self="closeEdit">
                <div
                    class="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700"
                >

                    <!-- Header -->
                    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                        <div>
                            <h3 class="text-sm font-bold text-slate-800 dark:text-white">
                                Edit Purchase Item
                            </h3>

                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {{ editForm.product_name }}
                            </p>
                        </div>

                        <button
                            type="button"
                            @click="closeEdit"
                            class="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="p-5 space-y-4">

                        <!-- Purchase Price -->
                        <div>
                            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                Purchase Price
                            </label>

                            <input
                                v-model.number="editForm.price"
                                type="number"
                                min="0.01"
                                step="0.01"
                                class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <!-- Quantity -->
                        <div>
                            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                Quantity
                            </label>

                            <input
                                v-model.number="editForm.quantity"
                                type="number"
                                min="1"
                                step="1"
                                class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <!-- Sale Price -->
                        <div>
                            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                Sale Price
                            </label>

                            <input
                                v-model.number="editForm.sale_price"
                                type="number"
                                min="1"
                                step="1"
                                class="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <!-- Total -->
                        <div class="flex justify-between items-center px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <span class="text-xs font-semibold text-slate-500">
                                Total
                            </span>

                            <span class="text-sm font-black text-emerald-600 dark:text-orange-400">
                                ৳{{
                                    (
                                        Number(editForm.price || 0) *
                                        Number(editForm.quantity || 0)
                                    ).toLocaleString()
                                }}
                            </span>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div class="flex justify-end gap-2 px-5 py-4 border-t border-slate-200 dark:border-slate-700">

                        <button
                            type="button"
                            @click="closeEdit"
                            class="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            @click="updateCartItem"
                            :disabled="checkoutLoading"
                            class="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                        >
                            <i
                                v-if="checkoutLoading"
                                class="fa-solid fa-spinner fa-spin mr-1"
                            ></i>

                            Update
                        </button>

                    </div>

                </div>
            </div>








        </div>
    </div>
    <FooterSection />
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import api from "../../../../services/api.js";
import { useRouter } from 'vue-router';
import { useCartStore } from './cart.js';

import AdminNavbar from '../admin-navbar.vue';
import AdminHeader from '../admin-header.vue';
import Message from '../../../Message/message.vue';
import FooterSection from "../../../footer.vue";

const mobileMenu = ref(false);

function toggleMenu() {
    mobileMenu.value = !mobileMenu.value;
}


const loading = ref(false);
const checkoutLoading = ref(false);
const saving = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const router = useRouter();

// Filter State Variables
const searchInput = ref(null);
const searchQuery = ref('');
const quantity = ref(1);
const sortBy = ref('all');
const supplyer = ref('1');
const products = ref([]);








// ==============================
// Main Order Form State
// ==============================
const form = reactive({
    supplier_id: null,
    supplier_name: "",
    supplier_phone: "",

    payment_method: "cash",

    vat: 0,
    discount: 0,

    received_amount: 0,

    remarks: "",
});









// fetch all products
async function fetchProducts() {
    loading.value = true;
    errorMsg.value = '';
    try {
        const res = await api.get('/products');
        if (res.data?.success) {
            products.value = res.data.data;
        } else {
            errorMsg.value = res.data?.message || "Failed to fetch products";
        }
    } catch (err) {
        console.error(err);
        errorMsg.value = err.response?.data?.message || err.message || "Something went wrong";
    } finally {
        loading.value = false;
    }
}

// Fixed Computed Filter Logic
const filteredProducts = computed(() => {
    let list = [...products.value]
    // 1. Text Search (ID & Name)
    if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase().trim()
            list = list.filter(p => p.name?.toLowerCase().includes(query) || String(p.id).includes(query)
        )
    }
    // 2. Filter / Sort Select Option
    if (sortBy.value === 'discount') {
        list = list.filter(p => p.discount > 0)
    } else if (sortBy.value === 'points') {
        list = list.filter(p => p.point > 0)
    } else if (sortBy.value === 'price_low') {
        list.sort((a, b) => (a.price - (a.discount || 0)) - (b.price - (b.discount || 0)))
    } else if (sortBy.value === 'price_high') {
        list.sort((a, b) => (b.price - (b.discount || 0)) - (a.price - (a.discount || 0)))
    }
    return list
})









// ==============================
// Cart / Product Selection
// ==============================
const isAddingToCart = ref(false);
const CartItem = ref([]);
const cartStore = useCartStore();

async function addToCart(product) {
    const cartData = {
        product_id: product.id,
    };
    
    try {
        isAddingToCart.value = true;
        const res = await api.post("/purchase/add-to-cart", cartData);
        if (res.data?.success) {
            errorMsg.value = null;
            CartItem.value = res.data.data;
            cartStore.addToCartLocal({
                product_id: product.id,
            })
            await getCartItems();
        } else {
            errorMsg.value = res.data?.message || "Something went wrong";
            successMsg.value = null;
        }
    } catch (error) {
        if (error.response) {
            errorMsg.value = error.response.data?.message || "Server error";
        } else {
            errorMsg.value = "Network error";
            console.error(error);
        }
    } finally {
        isAddingToCart.value = false;
    }
}

const selectProduct = (product) => {
    form.product_id = product.id;
    addToCart(product);
};







// Search enter add to cart
async function handleSearch() {
    
    const cartData = {
        product: searchQuery.value,
        quantity: Number(quantity.value) || 1,
    };

    // console.log('Searching:', cartData)
    
    try {
        isAddingToCart.value = true;
        const res = await api.post("/purchase/add-to-cart-search", cartData);
        if (res.data?.success) {
            errorMsg.value = null;
            const product = res.data.data;
            CartItem.value = product;
            cartStore.addToCartLocal({
                product_id: product.id,
            });
            searchQuery.value = "";
            quantity.value = "1";
            await getCartItems();

            searchInput.value?.focus();
        } else {
            errorMsg.value = res.data?.message || "Something went wrong";
            successMsg.value = null;
        }
    } catch (error) {
        if (error.response) {
            errorMsg.value = error.response.data?.message || "Server error";
        } else {
            errorMsg.value = "Network error";
            console.error(error);
        }
    } finally {
        isAddingToCart.value = false;
    }
}









const cartItems = ref([]);
const supplyers = ref([]);
async function getCartItems() {
    loading.value = true
    try {
        const res = await api.get(`/purchase`);
        cartItems.value = res.data.data.items;
        supplyers.value = res.data.data.supplyers;
    } catch (err) {
        console.error(err);
        errorMsg.value = err?.response?.data?.message || err?.message || "Something went wrong";
    } finally {
        loading.value = false;
    }
}

const cartReg = computed(() => {
    return cartItems.value && cartItems.value.length > 0
        ? cartItems.value[0].reg
        : null;
});
















// ==============================
// Money Helpers
// =====================================================

/**
 * Round monetary value to 2 decimal places.
 */
const roundMoney = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.round((number + Number.EPSILON) * 100) / 100;
};


/**
 * Format money for UI.
 */
const formatMoney = (value) => {
    return roundMoney(value).toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatPoints = (value) => {
    const number = Number(value) || 0;

    return number.toLocaleString("en-BD", {
        maximumFractionDigits: 2,
    });
};

/**
 * Format percentage rate.
 */
const formatRate = (value) => {
    const number = Number(value) || 0;

    return number.toLocaleString("en-BD", {
        maximumFractionDigits: 2,
    });
};


// =====================================================
// Cart Calculations
// =====================================================

// ==============================
// Product Subtotal
// ==============================

const subtotal = computed(() => {

    const total = (cartItems.value || []).reduce(
        (sum, item) => {

            const price = Number(item.price) || 0;

            const discount = Number(item.discount) || 0;

            const quantity = Number(item.quantity) || 0;

            const unitPrice = Math.max(
                0,
                price - discount
            );

            return sum + (
                unitPrice * quantity
            );
        },
        0
    );

    return roundMoney(total);
});


// ==============================
// Total Product Points
// ==============================
const totalPoint = computed(() => {

    const total = (cartItems.value || []).reduce(
        (sum, item) => {

            const point = Number(item.point) || 0;

            const quantity = Number(item.quantity) || 0;

            return sum + (
                point * quantity
            );
        },
        0
    );

    return roundMoney(total);
});


// ==============================
// Manual Discount
// ==============================
const manualDiscount = computed(() => {

    const discount = Number(form.discount) || 0;

    const validDiscount = Math.min(
        Math.max(0, discount),
        subtotal.value
    );

    return roundMoney(validDiscount);
});


// ==============================
// VAT Amount
// ==============================
const vatAmount = computed(() => {
    const vatRate = Math.max(0, Number(form.vat) || 0);

    const taxableAmount = Math.max(0, subtotal.value);

    const amount = taxableAmount * vatRate / 100;

    return roundMoney(amount);
});





// ==============================
// Total Payable
// ==============================
const totalPayable = computed(() => {

    const total =
        subtotal.value
        - manualDiscount.value
        + vatAmount.value;

    return roundMoney(
        Math.max(0, total)
    );
});


// ==============================
// Received Amount
// ==============================
const receivedAmount = computed(() => {

    const received = Math.max(
        0,
        Number(form.received_amount) || 0
    );

    return roundMoney(received);
});


// ==============================
// Return / Change Amount
// ==============================
const changeAmount = computed(() => {

    const change =
        receivedAmount.value
        - totalPayable.value;

    return roundMoney(
        Math.max(0, change)
    );
});


// ==============================
// Due Amount
// ==============================
const dueAmount = computed(() => {

    const due =
        totalPayable.value
        - receivedAmount.value;

    return roundMoney(
        Math.max(0, due)
    );
});













// qty update
const qtyTimers = {};

// 1. Quantity increaseQty
async function increaseQty(item) {
    item.quantity = Number(item.quantity || 1) + 1;
    queueQtyUpdate(item);
}
// 2. Quantity decreaseQty
async function decreaseQty(item) {
    if (item.quantity > 1) {
        item.quantity = Number(item.quantity) - 1;
        queueQtyUpdate(item);
    }
}
// 3. Debounce
function queueQtyUpdate(item) {
    const key = `${item.reg}_${item.product_id}`;
    if (qtyTimers[key]) clearTimeout(qtyTimers[key]);
    qtyTimers[key] = setTimeout(() => {
        updateQty(item);
    }, 500);
}










async function updateQty(item) {
    try {
        const res = await api.post(`/purchase/qty-update/${item.reg}/${item.product_id}`, {
            quantity: Number(item.quantity),
        });
        if (res?.data?.status === 'success') {
            item.quantity = Number(res.data.quantity);
            if (res.data.available_stock !== undefined) {
                item.available_stock = res.data.available_stock;
            }
        }
        await getCartItems();
    } catch (err) {
        await getCartItems();
        const msg = err?.response?.data?.message || "Something went wrong or Out of stock.";
        errorMsg.value = msg;
        setTimeout(() => {
            errorMsg.value = "";
        }, 3000);
    }
}

async function remove(item) {
    try {
        const res = await api.post(`/purchase/remove-to-cart/${item.id}/${item.reg}/${item.product_id}`, {
            quantity: Number(item.quantity),
        });
        if (res?.data?.status === 'success') {
            item.quantity = Number(res.data.quantity);
            if (res.data.available_stock !== undefined) {
                item.available_stock = res.data.available_stock;
            }
        }
        await getCartItems();
    } catch (err) {
        await getCartItems();
        const msg = err?.response?.data?.message || "Something went wrong.";
        errorMsg.value = msg;
        setTimeout(() => {
            errorMsg.value = "";
        }, 3000);
    }
}


const editModal = ref(false);

const editForm = reactive({
    id: null,
    product_id: null,
    product_name: "",
    price: 0,
    sale_price: 0,
    quantity: 1,
});

const openEdit = (item) => {
    editForm.id = item.id;
    editForm.product_id = item.product_id;
    editForm.product_name = item.product?.name || "";
    editForm.price = Number(item.price || 0);
    editForm.sale_price = Number(item.sale_price || 0);
    editForm.quantity = Number(item.quantity || 1);

    editModal.value = true;
};

const closeEdit = () => {
    editModal.value = false;
};

const updateCartItem = async () => {
    if (!editForm.id) return;

    if (Number(editForm.price) <= 0) {
        errorMsg.value = "Purchase price must be greater than 0.";
        return;
    }

    if (Number(editForm.quantity) < 1) {
        errorMsg.value = "Quantity must be at least 1.";
        return;
    }

    try {
        checkoutLoading.value = true;

        const res = await api.put(
            `/purchase/cart/${editForm.id}`,
            {
                price: Number(editForm.price),
                quantity: Number(editForm.quantity),
                sale_price: Number(editForm.sale_price),
            }
        );

        if (res.data?.success) {
            editModal.value = false;
            await getCartItems();

            successMsg.value =
                res.data?.message || "Cart item updated successfully.";
        }
    } catch (error) {
        console.error("Update cart item error:", error);

        errorMsg.value =
            error.response?.data?.message ||
            "Unable to update cart item.";
    } finally {
        checkoutLoading.value = false;
    }
};












const defaultProductImage = "/images/product/default-product.webp";
const getProductImage = (item) => {
    const images = item.product?.images;
    if (images && images.length > 0) {
        return images[0].url;
    }
    return defaultProductImage;
};

























const handleCheckout = async () => {
    if (checkoutLoading.value) return;

    errorMsg.value = "";
    successMsg.value = "";

    if (!cartItems.value?.length) {
        errorMsg.value = "Cart is empty.";
        return;
    }

    if (totalPayable.value <= 0) {
        errorMsg.value = "Total payable amount must be greater than 0.";
        return;
    }

    if (dueAmount.value > 0) {
        if (!form.supplier_phone?.trim()) {
            errorMsg.value = "Customer phone number is required for partial payments.";
            return;
        }
        if (!form.supplier_name?.trim()) {
            errorMsg.value = "Customer name is required for partial payments.";
            return;
        }
    }

    const reg = cartReg.value;
    if (!reg) {
        errorMsg.value = "Cart registration not found.";
        return;
    }

    const confirmed = window.confirm(
        `Are you sure you want to place this order?\n\nPayable Amount: ${Number(totalPayable.value).toFixed(2)}`
    );

    if (!confirmed) {
        return;
    }

    const checkoutData = {
        supplier_id: form.supplier_id || null,
        supplier_name: form.supplier_name?.trim() || null,
        supplier_phone: form.supplier_phone?.trim() || null,
        payment_method: form.payment_method || "cash",
        vat: roundMoney(form.vat),
        discount: roundMoney(manualDiscount.value),
        received_amount: roundMoney(receivedAmount.value),
        remarks: form.remarks?.trim() || null,
    };

    try {
        checkoutLoading.value = true;

        const res = await api.post(`/purchase/checkout/${reg}`, checkoutData );

        if (res.data?.success) {
            successMsg.value = res.data?.message || "Order placed successfully.";
            await getCartItems();
            form.received_amount = 0;
            form.discount = 0;
            form.vat = 0;
            form.supplier_name = "";
            form.supplier_phone = "";
        } else {
            errorMsg.value = res.data?.message || "Checkout failed.";
        }

        // const win = window.open("about:blank", "_blank");
        // if(!win){
        //     alert("Popup Blocked! Allow popups");
        //     return;
        // }
        // win.location.href = `/admin/order/invoice-print/${res.data.data.order.reg}`;
    } catch (error) {
        console.error("Checkout Error:", error);
        if (error.response) {
            // Laravel validation errors
            if (error.response.status === 422) {
                const errors =
                    error.response.data?.errors;
                if (errors) {
                    const firstError =
                        Object.values(errors)[0];
                    errorMsg.value =
                        Array.isArray(firstError)
                            ? firstError[0]
                            : firstError;
                } else {
                    errorMsg.value =
                        error.response.data?.message ||
                        "Validation failed.";
                }
            } else {
                errorMsg.value =
                    error.response.data?.message ||
                    "Checkout failed.";
            }
        } else {
            errorMsg.value =
                "Network error. Please try again.";
        }
    } finally {
        checkoutLoading.value = false;
    }
};

























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
    getCartItems();

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