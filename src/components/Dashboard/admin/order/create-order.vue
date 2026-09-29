<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <Header
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
            <div class="flex-1 min-w-0">
                <main class="flex-1 min-h-screen min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 lg:px-8 py-6">
                    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-l-4 border-emerald-500 dark:border-orange-500 pl-4 py-1">
                        <div>
                            <div class="flex items-center gap-3">
                                <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Create Custom Order
                                </h1>
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold
                                            bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    <i class="fa-solid fa-bolt text-[10px] text-emerald-500 dark:text-orange-400 mr-1"></i> Quick Action
                                </span>
                            </div>
                            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Create new custom transactions and send directly to customer.
                            </p>
                        </div>
                    </div>

                    <!-- Wrap everything in a real <form> so native validation + submit works -->
                    <form @submit.prevent="checkOut" class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 sm:p-6 shadow-sm mt-4 backdrop-blur-md">

                        <!-- MAIN WORKSPACE GRID -->
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                            <!-- ================= 1. LEFT SIDE: PRODUCT SELECTION & FILTER (5 Columns) ================= -->
                            <div class="lg:col-span-5 flex flex-col gap-3">

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
                                            v-model="searchQuery"
                                            type="text"
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
                                            {{ filteredProducts.length }}
                                        </span>
                                    </div>
                                </div>
                                <!-- Product Table Container -->
                                <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden shadow-sm">
                                    <div class="max-h-[28rem] overflow-y-auto custom-scrollbar">
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
                                                <tr v-if="filteredProducts.length === 0">
                                                    <td colspan="3" class="p-8 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">
                                                        <i class="fa-solid fa-box-open text-2xl mb-2 block text-slate-300 dark:text-slate-700"></i>
                                                        No matching products found.
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <!-- ================= 2. RIGHT SIDE: CART TABLE (7 Columns) ================= -->
                            <div class="lg:col-span-7 flex flex-col gap-3">

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
                                    <div class="max-h-[31.5rem] overflow-y-auto overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left border-collapse">

                                            <!-- Table Header -->
                                            <thead class="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                                <tr>
                                                    <th class="py-3 px-4">Product</th>
                                                    <th class="py-3 px-3 text-center">Qty</th>
                                                    <th class="py-3 px-3 text-center">Points</th>
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
                                                                    <span v-if="item.variant?.color" class="text-[9px] font-bold text-slate-500 uppercase">
                                                                        {{ item.variant.color }}
                                                                    </span>
                                                                    <span v-if="item.variant?.size" class="text-[9px] font-bold text-emerald-600 dark:text-orange-400 uppercase">
                                                                        / {{ item.variant.size }}
                                                                    </span>
                                                                    <span v-if="item.discount > 0" class="text-[9px] font-extrabold text-green-600 dark:text-orange-400 ml-1">
                                                                        (Saved ৳{{ (Number(item.discount) * item.quantity).toLocaleString() }})
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
                                                    <!-- Points -->
                                                    <td class="py-3 px-3 text-center whitespace-nowrap">
                                                        <span v-if="item.point" class="text-[10px] font-extrabold text-emerald-600 dark:text-orange-400">
                                                            {{ (Number(item.point) * item.quantity).toLocaleString() }} pts
                                                        </span>
                                                        <span v-else class="text-slate-300 dark:text-slate-700">-</span>
                                                    </td>
                                                    <!-- Unit Price -->
                                                    <td class="py-3 px-3 text-right whitespace-nowrap">
                                                        <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                            ৳{{ Number(item.price).toLocaleString() }}
                                                        </span>
                                                    </td>
                                                    <!-- Subtotal -->
                                                    <td class="py-3 px-3 text-right whitespace-nowrap font-black text-slate-900 dark:text-white">
                                                        ৳{{ ((Number(item.price) - Number(item.discount)) * item.quantity).toLocaleString() }}
                                                    </td>
                                                    <!-- Remove Button -->
                                                    <td class="py-3 px-3 text-center whitespace-nowrap">
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
                            </div>
                        </div>


                        <div class="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800">
                            <div class="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/60">
                                <h3 class="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                                    <i class="fa-solid fa-map-location-dot text-emerald-600 dark:text-orange-500"></i> Shipping Address
                                </h3>
                                <button type="button" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <i class="fa-solid fa-map-location-dot text-base"></i>
                                </button>
                            </div>
                            <div class="p-5 space-y-5 overflow-y-auto flex-1 custom-scrollbar">

                                <!-- Recipient & Phone Grid -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Recipient Name *</label>
                                        <input v-model="form.recipient_name" type="text" required class="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-orange-500/20 focus:border-emerald-500 dark:focus:border-orange-500 text-slate-800 dark:text-slate-100 transition-all" placeholder="e.g. John Doe">
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Phone Number *</label>
                                        <input v-model="form.phone" type="tel" required class="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-orange-500/20 focus:border-emerald-500 dark:focus:border-orange-500 text-slate-800 dark:text-slate-100 transition-all" placeholder="e.g. 017XXXXXXXX">
                                    </div>
                                </div>
                                <!-- Location Dropdowns Grid -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <!-- Division -->
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Division *</label>
                                        <select v-model="form.division_id" @change="handleDivisionChange" required class="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-orange-500/20 focus:border-emerald-500 dark:focus:border-orange-500 text-slate-800 dark:text-slate-100 transition-all cursor-pointer">
                                            <option :value="null" disabled>-- Select Division --</option>
                                            <option v-for="division in localDivisions" :key="division.id" :value="division.id">{{ division.name }}</option>
                                        </select>
                                    </div>
                                    <!-- District -->
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">District *</label>
                                        <select v-model="form.district_id" @change="handleDistrictChange" :disabled="!form.division_id" required class="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-orange-500/20 focus:border-emerald-500 dark:focus:border-orange-500 text-slate-800 dark:text-slate-100 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                                            <option :value="null" disabled>-- Select District --</option>
                                            <option v-for="district in districts" :key="district.id" :value="district.id">{{ district.name }}</option>
                                        </select>
                                    </div>
                                    <!-- Upazila -->
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Upazila *</label>
                                        <select v-model="form.upazila_id" @change="handleUpazilaChange" :disabled="!form.district_id" required class="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-orange-500/20 focus:border-emerald-500 dark:focus:border-orange-500 text-slate-800 dark:text-slate-100 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                                            <option :value="null" disabled>-- Select Upazila --</option>
                                            <option v-for="upazila in upazilas" :key="upazila.id" :value="upazila.id">{{ upazila.name }}</option>
                                        </select>
                                    </div>
                                    <!-- Police Station (Optional) -->
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Police Station (Optional)</label>
                                        <select v-model="form.police_station_id" :disabled="!form.upazila_id" class="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-orange-500/20 focus:border-emerald-500 dark:focus:border-orange-500 text-slate-800 dark:text-slate-100 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                                            <option :value="null">-- Select Police Station --</option>
                                            <option v-for="station in policeStations" :key="station.id" :value="station.id">{{ station.name }}</option>
                                        </select>
                                    </div>
                                </div>
                                <!-- Postal Code & Address Label -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Postal Code (Optional)</label>
                                        <input v-model="form.postal_code" type="text" class="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-orange-500/20 focus:border-emerald-500 dark:focus:border-orange-500 text-slate-800 dark:text-slate-100 transition-all" placeholder="e.g. 1200">
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Address Label</label>
                                        <div class="flex gap-2">
                                            <button v-for="label in ['Home', 'Office', 'Other']" :key="label" type="button" @click="form.label = label"
                                                :class="[
                                                'flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-200',
                                                form.label === label
                                                    ? 'bg-emerald-600 dark:bg-orange-500 text-white border-transparent shadow-sm'
                                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                                                ]">
                                                {{ label }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- Complete Street Address Textarea -->
                                <div class="space-y-1">
                                    <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Street Address *</label>
                                    <textarea v-model="form.address" rows="3" required class="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-orange-500/20 focus:border-emerald-500 dark:focus:border-orange-500 text-slate-800 dark:text-slate-100 resize-none transition-all" placeholder="House no, Road no, Village, Area details..."></textarea>
                                </div>
                            </div>
                        </div>


                        <div class="w-full p-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-200 backdrop-blur-md">

                            <!-- Header Label -->
                            <label for="coupon" class="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                <i class="fa-solid fa-ticket text-emerald-600 dark:text-orange-500 mr-1.5"></i>
                                Have a Promo / Coupon Code?
                            </label>

                            <!-- Input Group -->
                            <div class="flex items-center gap-2">
                                <div class="relative flex-grow">
                                    <!-- Icon -->
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fa-solid fa-tags text-xs text-slate-400 dark:text-slate-500"></i>
                                    </div>

                                    <!-- Input Field -->
                                    <input
                                        type="text"
                                        id="coupon"
                                        v-model="coupon"
                                        placeholder="Enter coupon code..."
                                        class="block w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 dark:focus:border-orange-500 transition-colors duration-200"
                                    />
                                </div>

                                <!-- Apply Button -->
                                <button
                                    type="button"
                                    @click="checkCoupon"
                                    :disabled="couponLoading"
                                    class="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 dark:bg-orange-500 dark:hover:bg-orange-600 dark:active:bg-orange-700 rounded-xl transition-all duration-200 focus:outline-none shadow-sm flex-shrink-0 active:scale-95 disabled:opacity-60"
                                >
                                    {{ couponLoading ? 'Checking...' : 'Apply' }}
                                </button>
                            </div>
                            <!-- Success Banner -->
                            <div
                                v-if="couponSuccess"
                                class="mt-3 flex items-center gap-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3 text-emerald-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400"
                            >
                                <div class="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 dark:bg-orange-500/20 flex-shrink-0">
                                    <i class="fa-solid fa-circle-check text-xs text-emerald-600 dark:text-orange-400"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between">
                                        <h4 class="text-xs font-bold truncate">Coupon Applied Successfully</h4>
                                    </div>
                                    <p class="text-[11px] text-emerald-600/90 dark:text-orange-300/90 leading-tight">
                                        {{ couponSuccess }}
                                    </p>

                                    <div v-if="couponData" class="mt-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
                                        <span class="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-orange-500/20 text-emerald-800 dark:text-orange-300">
                                            {{ couponData.code }}
                                        </span>
                                        <span>•</span>
                                        <span v-if="couponData.discount_type === 'percent'">
                                            {{ couponData.discount }}% Off
                                        </span>
                                        <span v-else>
                                            ৳{{ couponData.discount }} Off
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <!-- Error Banner -->
                            <div
                                v-if="couponError"
                                class="mt-3 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
                            >
                                <div class="flex h-6 w-6 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40 flex-shrink-0">
                                    <i class="fa-solid fa-circle-exclamation text-xs text-red-600 dark:text-red-400"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-xs font-bold">Unable to Apply</h4>
                                    <p class="text-[11px] text-red-600/90 dark:text-red-300/90 leading-tight">
                                        {{ couponError }}
                                    </p>
                                </div>
                            </div>

                        </div>


                        <div class="sm:col-span-2 mt-2 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-5">
                            
                            <!-- ==================== Payment method section start ==================== -->
                            <div class="sm:col-span-2">
                                <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 block mb-2">
                                    Payment Method <span class="text-red-500">*</span>
                                </label>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <!-- Cash on delivery -->
                                    <label class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                                        :class="form.payment_method === 'cod' ? 'border-[#16A34A] bg-[#16A34A]/5 ring-1 ring-[#16A34A]' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'">
                                        <input type="radio" v-model="form.payment_method" value="cod" class="accent-[#16A34A] h-4 w-4" />
                                        <div class="flex flex-col">
                                            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Cash on Delivery</span>
                                            <span class="text-[10px] text-slate-400 dark:text-slate-500">Pay the price after receiving the product.</span>
                                        </div>
                                    </label>
                                    
                                    <!-- advance payment -->
                                    <label class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                                        :class="form.payment_method === 'advance' ? 'border-[#16A34A] bg-[#16A34A]/5 ring-1 ring-[#16A34A]' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'">
                                        <input type="radio" v-model="form.payment_method" value="advance" class="accent-[#16A34A] h-4 w-4" />
                                        <div class="flex flex-col">
                                            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Advance Payment</span>
                                            <span class="text-[10px] text-slate-400 dark:text-slate-500">Pay delivery charges and product price in advance.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div v-if="form.payment_method === 'advance'" class="sm:col-span-2 mt-2 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-5">
                               
                                <!-- Payment Type Selection Switch -->
                                <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
                                    <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider mb-3">
                                        Choose payment method <span class="text-red-500">*</span>
                                    </label>
                                    <div class="grid grid-cols-2 gap-3">
                                        <!-- Mobile Banking Radio Box -->
                                        <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-200"
                                            :class="form.trans_payment_method === 'mobile' ? 'border-emerald-500 dark:border-orange-500 bg-emerald-50/[0.15] dark:bg-orange-500/[0.03] ring-1 ring-emerald-500 dark:ring-orange-500' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                                            <input type="radio" v-model="form.trans_payment_method" value="mobile" class="accent-emerald-600 dark:accent-orange-500 h-4 w-4" />
                                            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Mobile Banking</span>
                                        </label>
                                        
                                        <!-- Bank Radio Box -->
                                        <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-200"
                                            :class="form.trans_payment_method === 'bank' ? 'border-emerald-500 dark:border-orange-500 bg-emerald-50/[0.15] dark:bg-orange-500/[0.03] ring-1 ring-emerald-500 dark:ring-orange-500' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                                            <input type="radio" v-model="form.trans_payment_method" value="bank" class="accent-emerald-600 dark:accent-orange-500 h-4 w-4" />
                                            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Bank Transfer</span>
                                        </label>
                                    </div>
                                </div>

                                <hr class="border-slate-100 dark:border-slate-800/60 my-2" />

                                <!-- Template for Mobile Banking Input -->
                                <template v-if="form.trans_payment_method === 'mobile'">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                                        <div class="flex flex-col gap-1.5">
                                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Account No. <span class="text-red-500">*</span>
                                            </label>
                                            <div class="relative flex items-center">
                                                <span class="absolute left-3 text-slate-400 dark:text-slate-500">
                                                    <i class="fa-solid fa-phone text-xs"></i>
                                                </span>
                                                <input 
                                                    type="text" 
                                                    v-model="form.account_number"
                                                    placeholder="01XXXXXXXXX"
                                                    class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div class="flex flex-col gap-1.5">
                                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Transaction ID <span class="text-red-500">*</span>
                                            </label>
                                            <div class="relative flex items-center">
                                                <span class="absolute left-3 text-slate-400 dark:text-slate-500">
                                                    <i class="fa-solid fa-key text-xs"></i>
                                                </span>
                                                <input 
                                                    type="text" 
                                                    v-model="form.transaction_id"
                                                    placeholder="e.g: BK24X7890"
                                                    class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Select Bank Name <span class="text-red-500">*</span>
                                        </label>
                                        <div class="relative flex items-center">
                                            <span class="absolute left-3 text-slate-400 dark:text-slate-500">
                                                <i class="fa-solid fa-wallet text-xs"></i>
                                            </span>
                                            
                                            <select 
                                                v-model="form.bank_name"
                                                class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500 appearance-none"
                                                required
                                            >
                                                <option value="" disabled selected>Select Payment Method</option>
                                                <option value="Bkash">BKash</option>
                                                <option value="Nagad">Nagad</option>
                                                <option value="Rocket">Rocket</option>
                                            </select>
                                            
                                            <span class="absolute right-3 pointer-events-none text-slate-400">
                                                <i class="fa-solid fa-chevron-down text-xs"></i>
                                            </span>
                                        </div>
                                    </div>
                                </template>

                                <!-- Template for Bank Transfer Input -->
                                <template v-if="form.trans_payment_method === 'bank'">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                                        <div class="flex flex-col gap-1.5">
                                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Your Bank Name <span class="text-red-500">*</span>
                                            </label>
                                            <div class="relative flex items-center">
                                                <span class="absolute left-3 text-slate-400 dark:text-slate-500">
                                                    <i class="fa-solid fa-building-columns text-xs"></i>
                                                </span>
                                                <input 
                                                    type="text" 
                                                    v-model="form.bank_name"
                                                    placeholder="like: Islami Bank, BRAC Bank"
                                                    class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div class="flex flex-col gap-1.5">
                                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Account Title / Name <span class="text-red-500">*</span>
                                            </label>
                                            <div class="relative flex items-center">
                                                <span class="absolute left-3 text-slate-400 dark:text-slate-500">
                                                    <i class="fa-solid fa-user text-xs"></i>
                                                </span>
                                                <input 
                                                    type="text" 
                                                    v-model="form.account_holder_name" 
                                                    placeholder="Account Holder Name"
                                                    class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div class="flex flex-col gap-1.5">
                                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Account Number <span class="text-red-500">*</span>
                                            </label>
                                            <div class="relative flex items-center">
                                                <span class="absolute left-3 text-slate-400 dark:text-slate-500">
                                                    <i class="fa-solid fa-hashtag text-xs"></i>
                                                </span>
                                                <input 
                                                    type="text" 
                                                    v-model="form.account_number"
                                                    placeholder="Account Number"
                                                    class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div class="flex flex-col gap-1.5">
                                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Transaction ID / Slip No (Optional)
                                            </label>
                                            <div class="relative flex items-center">
                                                <span class="absolute left-3 text-slate-400 dark:text-slate-500">
                                                    <i class="fa-solid fa-receipt text-xs"></i>
                                                </span>
                                                <input 
                                                    type="text" 
                                                    v-model="form.transaction_id"
                                                    placeholder="Bank deposit or slip number (optional)"
                                                    class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </template>

                            </div>
                        </div>

                        <!-- ================= Delivery Charge Payment Toggle ================= -->
                        <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm mt-4">
                            <label class="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    v-model="form.is_delivery_charge_payment"
                                    class="w-4 h-4 rounded accent-emerald-600 dark:accent-orange-500"
                                />
                                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    <i class="fa-solid fa-truck-fast text-emerald-600 dark:text-orange-500 mr-1.5"></i>
                                    Is Delivery Charge Payment?
                                </span>
                            </label>

                            <!-- Delivery Charge Details (shows only when checked) -->
                            <template v-if="form.is_delivery_charge_payment">
                                <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-4 animate-fadeIn">

                                    <!-- Amount -->
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Delivery Charge Amount <span class="text-red-500">*</span>
                                        </label>
                                        <div class="relative flex items-center">
                                            <span class="absolute left-3 text-slate-400 dark:text-slate-500 text-xs">৳</span>
                                            <input
                                                type="number"
                                                min="0"
                                                v-model="form.delivery_charge_amount"
                                                placeholder="e.g. 60"
                                                class="w-full pl-8 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <!-- Mobile / Bank Switch -->
                                    <div class="grid grid-cols-2 gap-3">
                                        <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-200"
                                            :class="form.delivery_trans_payment_method === 'mobile' ? 'border-emerald-500 dark:border-orange-500 bg-emerald-50/[0.15] dark:bg-orange-500/[0.03] ring-1 ring-emerald-500 dark:ring-orange-500' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                                            <input type="radio" v-model="form.delivery_trans_payment_method" value="mobile" class="accent-emerald-600 dark:accent-orange-500 h-4 w-4" />
                                            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Mobile Banking</span>
                                        </label>
                                        <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-200"
                                            :class="form.delivery_trans_payment_method === 'bank' ? 'border-emerald-500 dark:border-orange-500 bg-emerald-50/[0.15] dark:bg-orange-500/[0.03] ring-1 ring-emerald-500 dark:ring-orange-500' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                                            <input type="radio" v-model="form.delivery_trans_payment_method" value="bank" class="accent-emerald-600 dark:accent-orange-500 h-4 w-4" />
                                            <span class="text-xs font-bold text-slate-700 dark:text-slate-200">Bank Transfer</span>
                                        </label>
                                    </div>

                                    <!-- Mobile Banking Fields -->
                                    <template v-if="form.delivery_trans_payment_method === 'mobile'">
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Account No. <span class="text-red-500">*</span></label>
                                                <input type="text" v-model="form.delivery_account_number" placeholder="01XXXXXXXXX"
                                                    class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500" required />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Transaction ID <span class="text-red-500">*</span></label>
                                                <input type="text" v-model="form.delivery_transaction_id" placeholder="e.g: BK24X7890"
                                                    class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500" required />
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-1.5">
                                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Select Bank Name <span class="text-red-500">*</span></label>
                                            <select v-model="form.delivery_bank_name"
                                                class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500" required>
                                                <option value="" disabled selected>Select Payment Method</option>
                                                <option value="Bkash">BKash</option>
                                                <option value="Nagad">Nagad</option>
                                                <option value="Rocket">Rocket</option>
                                            </select>
                                        </div>
                                    </template>

                                    <!-- Bank Transfer Fields -->
                                    <template v-if="form.delivery_trans_payment_method === 'bank'">
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Bank Name <span class="text-red-500">*</span></label>
                                                <input type="text" v-model="form.delivery_bank_name" placeholder="Bank Name"
                                                    class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500" required />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Account Holder Name <span class="text-red-500">*</span></label>
                                                <input type="text" v-model="form.delivery_account_holder_name" placeholder="Account Holder Name"
                                                    class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500" required />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Account Number <span class="text-red-500">*</span></label>
                                                <input type="text" v-model="form.delivery_account_number" placeholder="Account Number"
                                                    class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500" required />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Transaction ID / Slip No. (Optional)</label>
                                                <input type="text" v-model="form.delivery_transaction_id" placeholder="Transaction (Optional)"
                                                    class="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 dark:focus:border-orange-500 focus:ring-1 focus:ring-emerald-500 dark:focus:ring-orange-500" />
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </div>

                        <!-- Inline validation error box (shown when checkOut() validation fails) -->
                        <div
                            v-if="formError"
                            class="mt-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
                        >
                            <i class="fa-solid fa-triangle-exclamation text-xs"></i>
                            <p class="text-[11px] font-semibold">{{ formError }}</p>
                        </div>

                        <!-- ================= 3. BOTTOM: ORDER SUMMARY SECTION ================= -->
                        <div class="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800">
                            <div class="bg-slate-50 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">

                                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                            Order Summary
                                            <span class="w-2 h-2 rounded-full bg-emerald-500 dark:bg-orange-500 animate-pulse"></span>
                                        </h2>
                                        <p class="text-xs text-slate-400 mt-0.5">Review pricing breakdown before proceeding to checkout.</p>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">

                                        <!-- Total Points Badge -->
                                        <div class="flex flex-col items-end">
                                            <span class="text-[10px] font-bold uppercase text-slate-400">Total Points</span>
                                            <span class="text-xs font-black text-emerald-600 dark:text-orange-400 bg-emerald-50 dark:bg-orange-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-orange-500/20">
                                                <i class="fa-solid fa-star text-[9px] mr-1"></i>{{ totalPoint ? totalPoint.toLocaleString() : 0 }} Pts
                                            </span>
                                        </div>

                                        <!-- Coupon Discount Badge (only shown when a coupon is applied) -->
                                        <div v-if="couponData" class="flex flex-col items-end">
                                            <span class="text-[10px] font-bold uppercase text-slate-400">Coupon Discount</span>
                                            <span class="text-xs font-black text-red-500">
                                                -৳{{ (couponData.discount_amount || 0).toLocaleString() }}
                                            </span>
                                        </div>

                                        <!-- Payable Amount Box -->
                                        <div class="flex flex-col items-end pl-4 border-l border-slate-200 dark:border-slate-700">
                                            <span class="text-[10px] font-bold uppercase text-slate-400">Total Payable</span>
                                            <span class="text-2xl font-black text-emerald-600 dark:text-orange-500 tracking-tight">
                                                ৳{{ payableAmount ? payableAmount.toLocaleString() : 0 }}
                                            </span>
                                        </div>
                                        <!-- Checkout Button -->
                                        <button
                                            type="submit"
                                            :disabled="!cartItems || cartItems.length === 0 || isCheckingOut"
                                            class="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-orange-500 hover:dark:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 dark:shadow-none flex items-center justify-center gap-2 group active:scale-[0.98]"
                                        >
                                            <span v-if="isCheckingOut">Placing Order...</span>
                                            <template v-else>
                                                Checkout Order
                                                <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                            </template>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </div>
        <FooterSection />
    </div>
</template>
<script setup>
import { onMounted, ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import api from '../../../../services/api.js';
import Navbar from '../admin/admin-navbar.vue';
import Header from '../admin/admin-header.vue';
import Message from '../../Message/message.vue';
import FooterSection from "../../e-commerce/footer.vue";
import { useCartStore } from '../../e-commerce/stores/cart.js';

const sidebarOpen = ref(false);
const active = ref("dashboard");
const router = useRouter();
const loading = ref(false);
const successMsg = ref('');
const errorMsg = ref('');
const search = ref('');

















// ==============================
// Main Order Form State
// This object holds EVERY field that gets sent to the backend on checkout.
// ==============================
const form = reactive({
    product_id: null,

    // Shipping address fields
    recipient_name: '',
    phone: '',
    division_id: null,
    district_id: null,
    upazila_id: null,
    police_station_id: null,
    postal_code: '',
    label: '',
    address: '',

    // Payment fields (product / advance payment)
    payment_method: 'cod',
    trans_payment_method: 'mobile', // 'mobile' | 'bank'
    account_number: '',             
    transaction_id: '',             
    bank_name: '',                  
    account_holder_name: '',        

    // Delivery Charge Payment fields
    is_delivery_charge_payment: false,
    delivery_charge_amount: '',
    delivery_trans_payment_method: 'mobile', // 'mobile' | 'bank'
    delivery_account_number: '',
    delivery_transaction_id: '',
    delivery_bank_name: '',
    delivery_account_holder_name: '',

    // Coupon field (set after a successful coupon check)
    coupon: '',
});







// Form-level validation error message (shown above the checkout button)
const formError = ref('');

// Filter State Variables
const searchQuery = ref('');
const sortBy = ref('all');
const products = ref([]);










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
        list = list.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        String(p.id).includes(query)
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
// Location Cascade (Division -> District -> Upazila -> Police Station)
// ==============================
const divisions = ref([])
const localDivisions = ref([])
const districts = ref([])
const upazilas = ref([])
const policeStations = ref([])

// 1. Division
// FIX: `divisions` is a ref, so we must check `divisions.value.length`,
// not `divisions.length` (which is always undefined on a ref object).
const fetchDivisions = async () => {
    if (divisions.value && divisions.value.length > 0) {
        localDivisions.value = divisions.value
        return
    }
    try {
        const { data } = await api.get('/public/get-division')
        localDivisions.value = data.data ?? []
        divisions.value = localDivisions.value
    } catch (err) {
        console.error("Failed to load divisions from modal fallback API", err)
    }
}

// 2. District
const handleDivisionChange = async () => {
    form.district_id = null
    form.upazila_id = null
    form.police_station_id = null
    districts.value = []
    upazilas.value = []
    policeStations.value = []

    if (!form.division_id) return
    try {
        const { data } = await api.get('/public/get-district', { params: { division_id: form.division_id } })
        districts.value = data.data ?? []
    } catch (err) {
        console.error("Failed to load districts", err)
    }
}

// 3. Upazila
const handleDistrictChange = async () => {
    form.upazila_id = null
    form.police_station_id = null
    upazilas.value = []
    policeStations.value = []
    if (!form.district_id) return
    try {
        const { data } = await api.get('/public/get-upazila', { params: { district_id: form.district_id } })
        upazilas.value = data.data ?? []
    } catch (err) {
        console.error("Failed to load upazilas", err)
    }
}

// 4. Police Station
const handleUpazilaChange = async () => {
    form.police_station_id = null
    policeStations.value = []
    if (!form.upazila_id) return
    try {
        const { data } = await api.get('/public/get-police-station', { params: { upazila_id: form.upazila_id } })
        policeStations.value = data.data ?? []
    } catch (err) {
        console.error("Failed to load police stations", err)
    }
}



















// ================
// Check Coupon
// ================
const coupon = ref('');
const couponLoading = ref(false);
const couponData = ref(null);
const couponSuccess = ref('');
const couponError = ref('');

const checkCoupon = async () => {
    couponSuccess.value = '';
    couponError.value = '';
    couponData.value = null;
    couponLoading.value = true;
    if (!coupon.value.trim()) {
        couponError.value = 'Please enter a coupon code.';
        couponLoading.value = false;
        return;
    }
    try {
        const response = await api.post('/coupon/check', {
            coupon: coupon.value, subtotal: subtotal.value,
        })
        couponData.value = response.data.data;
        couponSuccess.value = response.data.message;
        form.coupon = coupon.value;
    } catch (error) {
        couponData.value = null
        couponError.value =
            error.response?.data?.message ??
            'Something went wrong. Please try again.';
        form.coupon = '';
    } finally {
        couponLoading.value = false
    }
}













// Final payable amount after applying coupon discount (used in Order Summary & payload)
const payableAmount = computed(() => {
    const discount = Number(couponData.value?.discount_amount || 0);
    return Math.max(subtotal.value - discount, 0);
});
















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
        const res = await api.post("/admin/cart/add-to-cart", cartData);
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











const cartItems = ref([]);
async function getCartItems() {
    loading.value = true
    try {
        const res = await api.get(`/admin/cart`);
        cartItems.value = res.data.data;
    } catch (err) {
        console.error(err);
        errorMsg.value = err || "Something is wrong";
    } finally {
        loading.value = false;
    }
}

const cartReg = computed(() => {
    return cartItems.value && cartItems.value.length > 0
        ? cartItems.value[0].reg
        : null;
});

// subtotal (before coupon discount)
const subtotal = computed(() =>
    (cartItems.value || []).reduce((sum, i) => {
        return sum + (Number(i.price) * Number(i.quantity) - (Number(i.discount) * Number(i.quantity)))
    }, 0)
)

// total point
const totalPoint = computed(() =>
    (cartItems.value || []).reduce((sum, i) => {
        return sum + (Number(i.point) * Number(i.quantity))
    }, 0)
)

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
        const res = await api.post(`/admin/cart/qty-update/${item.reg}/${item.product_id}/${item.variant_id}`, {
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
        const res = await api.post(`/admin/cart/remove-to-cart/${item.id}/${item.reg}/${item.product_id}/${item.variant_id}`, {
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













const defaultProductImage = "/images/product/default-product.webp";
const getProductImage = (item) => {
    const images = item.product?.images;
    if (images && images.length > 0) {
        return images[0].url;
    }
    return defaultProductImage;
};

















function ProductDetails(item) {
    const route = router.resolve({
        path: `/product-details/${item.product.slug}`
    });
    window.open(route.href, '_blank');
}




















// ==============================
// Validate the form before submitting the payload
// ==============================
function validateOrderForm() {
    if (!cartItems.value || cartItems.value.length === 0) {
        return 'Please add at least one product to the cart.';
    }
    if (!form.recipient_name.trim()) {
        return 'Recipient name is required.';
    }
    if (!form.phone.trim()) {
        return 'Phone number is required.';
    }
    if (!form.division_id) {
        return 'Please select a division.';
    }
    if (!form.district_id) {
        return 'Please select a district.';
    }
    if (!form.upazila_id) {
        return 'Please select an upazila.';
    }
    if (!form.address.trim()) {
        return 'Street address is required.';
    }
    if (!form.payment_method) {
        return 'Please select a payment method.';
    }

    if (form.payment_method === 'advance') {
        if (!form.trans_payment_method) {
            return 'Please choose an advance payment method.';
        }
        if (!form.account_number.trim()) {
            return 'Account number is required.';
        }
        if (form.trans_payment_method === 'mobile') {
            if (!form.transaction_id.trim()) return 'Transaction ID is required.';
            if (!form.bank_name.trim()) return 'Please select a mobile banking provider.';
        }
        if (form.trans_payment_method === 'bank') {
            if (!form.bank_name.trim()) return 'Bank name is required.';
            if (!form.account_holder_name.trim()) return 'Account holder name is required.';
        }
    }

    // Delivery charge payment validation (checkbox controlled)
    if (form.is_delivery_charge_payment) {
        if (!form.delivery_charge_amount || Number(form.delivery_charge_amount) <= 0) {
            return 'Please enter a valid delivery charge amount.';
        }
        if (!form.delivery_account_number.trim()) {
            return 'Delivery payment account number is required.';
        }
        if (form.delivery_trans_payment_method === 'mobile') {
            if (!form.delivery_transaction_id.trim()) return 'Delivery payment transaction ID is required.';
            if (!form.delivery_bank_name.trim()) return 'Please select a mobile banking provider for delivery charge.';
        }
        if (form.delivery_trans_payment_method === 'bank') {
            if (!form.delivery_bank_name.trim()) return 'Delivery payment bank name is required.';
            if (!form.delivery_account_holder_name.trim()) return 'Delivery payment account holder name is required.';
        }
    }

    return '';
}
















// ==============================
// Checkout: build the complete payload and send it to the backend
// ==============================
const isCheckingOut = ref(false);

async function checkOut() {
    formError.value = '';

    // Run validation first
    const validationMessage = validateOrderForm();
    if (validationMessage) {
        formError.value = validationMessage;
        return;
    }

    if (!cartReg.value) {
        formError.value = 'Cart session not found. Please refresh and try again.';
        return;
    }

    // Build the full order items array from the cart
    const orderItems = cartItems.value.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id ?? null,
        quantity: Number(item.quantity),
        price: Number(item.price),
        discount: Number(item.discount || 0),
        point: Number(item.point || 0),
        subtotal: (Number(item.price) - Number(item.discount || 0)) * Number(item.quantity),
    }));

    const payload = {
        // Cart / products
        items: orderItems,

        // Shipping address
        recipient_name: form.recipient_name,
        phone: form.phone,
        division_id: form.division_id,
        district_id: form.district_id,
        upazila_id: form.upazila_id,
        police_station_id: form.police_station_id,
        postal_code: form.postal_code,
        label: form.label,
        address: form.address,

        // Payment
        payment_method: form.payment_method,
        trans_payment_method: form.payment_method === 'advance' ? form.trans_payment_method : null,
        account_number: form.payment_method === 'advance' ? form.account_number : null,
        transaction_id: form.payment_method === 'advance' ? (form.transaction_id || null) : null,
        bank_name: form.payment_method === 'advance' ? form.bank_name : null,
        account_holder_name: form.payment_method === 'advance' ? form.account_holder_name : null,

        // Coupon
        coupon: form.coupon || null,
        coupon_discount: Number(couponData.value?.discount_amount || 0),

        // Delivery Charge Payment
        is_delivery_charge_payment: form.is_delivery_charge_payment,
        delivery_charge_amount: form.is_delivery_charge_payment ? Number(form.delivery_charge_amount) : null,
        delivery_trans_payment_method: form.is_delivery_charge_payment ? form.delivery_trans_payment_method : null,
        delivery_account_number: form.is_delivery_charge_payment ? form.delivery_account_number : null,
        delivery_transaction_id: form.is_delivery_charge_payment ? (form.delivery_transaction_id || null) : null,
        delivery_bank_name: form.is_delivery_charge_payment ? form.delivery_bank_name : null,
        delivery_account_holder_name: form.is_delivery_charge_payment ? form.delivery_account_holder_name : null,

        // Totals
        subtotal: subtotal.value,
        total_point: totalPoint.value,
        payable_amount: payableAmount.value,
    };

    isCheckingOut.value = true;
    errorMsg.value = '';
    try {
        const res = await api.post(`/admin/cart/confirm/order/${cartReg.value}`, payload);
        if (res.data?.success) {
            successMsg.value = res.data.message || 'Order created successfully!';
            errorMsg.value = null;

            // Reset cart + form after a successful order
            cartItems.value = [];
            coupon.value = '';
            couponData.value = null;
            couponSuccess.value = '';
            couponError.value = '';
            Object.assign(form, {
                product_id: null,
                recipient_name: '',
                phone: '',
                division_id: null,
                district_id: null,
                upazila_id: null,
                police_station_id: null,
                postal_code: '',
                label: 'Home',
                address: '',
                payment_method: 'cod',
                trans_payment_method: 'mobile',
                account_number: '',
                transaction_id: '',
                bank_name: '',
                account_holder_name: '',
                is_delivery_charge_payment: false,
                delivery_charge_amount: '',
                delivery_trans_payment_method: 'mobile',
                delivery_account_number: '',
                delivery_transaction_id: '',
                delivery_bank_name: '',
                delivery_account_holder_name: '',
                coupon: '',
            });

            // If the backend returns an order id, you can redirect to details page:
            // if (res.data.data?.id) router.push(`/admin/orders/${res.data.data.id}`);
        } else {
            errorMsg.value = res.data?.message || 'Failed to place order.';
            successMsg.value = null;
        }
    } catch (error) {
        errorMsg.value = error.response?.data?.message || error.message || 'Something went wrong while placing the order.';
        successMsg.value = null;
    } finally {
        isCheckingOut.value = false;
    }
}


















const isDark = ref(false);
function applyTheme(dark) {
    isDark.value = dark;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
}
function toggleTheme() {
    applyTheme(!isDark.value);
}
const onSearch = () => {
    console.log(search.value)
}
















/* ESC to close drawer */
onMounted(() => {
    fetchProducts();
    getCartItems();
    fetchDivisions();
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
/* Custom Scrollbar for better UX inside table containers */
.custom-scrollbar::-webkit-scrollbar {
width: 5px;
height: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
background: rgba(156, 163, 175, 0.3);
border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
background: rgba(156, 163, 175, 0.5);
}
</style>