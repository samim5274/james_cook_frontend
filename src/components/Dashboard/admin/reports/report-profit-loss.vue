<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200"
  >
    <HeaderSection
      :is-dark="isDark"
      @toggle-dark="toggleDarkMode"
      @toggle-menu="toggleMenu"
    />

    <div class="flex min-h-[calc(100vh-56px)]">
      <Navbar :mobile-menu="mobileMenu" @close="mobileMenu = false" />

      <Message
        :successMsg="successMsg"
        :errorMsg="errorMsg"
        @update:successMsg="successMsg = $event"
        @update:errorMsg="errorMsg = $event"
      />

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <main
          class="flex-1 min-h-screen min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 py-5 print:bg-white print:px-0 print:py-0"
        >
          <!-- ============================== REPORT HEADER ============================== -->
          <div
            class="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between print:rounded-none print:border-0 print:border-b-2 print:border-slate-900 print:p-0 print:pb-3 print:shadow-none"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 print:border print:border-slate-900 print:bg-white print:text-slate-900"
              >
                <i class="fa-solid fa-boxes-stacked text-base"></i>
              </div>
              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400"
                >
                  Product Sales Report
                </p>
                <h1
                  class="text-xl font-black tracking-tight text-slate-900 dark:text-white"
                >
                  Profit &amp; Loss
                </h1>
                <p
                  class="text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                  Period: {{ formatDate(startDate) }} &rarr;
                  {{ formatDate(endDate) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="hidden text-right sm:block">
                <p
                  class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                >
                  Products Matched
                </p>
                <p class="text-lg font-black text-slate-900 dark:text-white">
                  {{ filteredProducts.length }}
                  <span class="text-xs font-medium text-slate-400"
                    >/ {{ productWise.length }}</span
                  >
                </p>
              </div>

              <button
                type="button"
                @click="window.print()"
                class="print:hidden flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <i class="fa-solid fa-print text-xs"></i>
                Print / Export
              </button>
            </div>
          </div>

          <!-- ============================== SUMMARY CARDS ============================== -->
          <div
            class="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 print:grid-cols-5 print:gap-2"
          >
            <div
              class="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none"
            >
              <p
                class="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Products
              </p>
              <h4
                class="mt-0.5 truncate text-lg font-black text-slate-900 dark:text-white"
              >
                {{ formatNumber(productWise.length) }}
              </h4>
              <p
                class="text-[10px] font-medium text-slate-400 dark:text-slate-500"
              >
                Products in report
              </p>
            </div>

            <div
              class="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none"
            >
              <p
                class="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400"
              >
                Quantity Sold
              </p>
              <h4
                class="mt-0.5 truncate text-lg font-black text-blue-600 dark:text-blue-400"
              >
                {{ formatNumber(summary.total_quantity) }}
              </h4>
              <p
                class="text-[10px] font-medium text-slate-400 dark:text-slate-500"
              >
                Total units sold
              </p>
            </div>

            <div
              class="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none"
            >
              <p
                class="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400"
              >
                Total Sales
              </p>
              <h4
                class="mt-0.5 truncate text-lg font-black text-indigo-600 dark:text-indigo-400"
              >
                ৳ {{ formatCurrency(summary.total_sales) }}
              </h4>
              <p
                class="text-[10px] font-medium text-slate-400 dark:text-slate-500"
              >
                Revenue from sales
              </p>
            </div>

            <div
              class="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-lg print:border-slate-300 print:p-3 print:shadow-none"
            >
              <p
                class="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400"
              >
                Total Cost
              </p>
              <h4
                class="mt-0.5 truncate text-lg font-black text-amber-600 dark:text-amber-400"
              >
                ৳ {{ formatCurrency(summary.total_cost) }}
              </h4>
              <p
                class="text-[10px] font-medium text-slate-400 dark:text-slate-500"
              >
                Purchase cost total
              </p>
            </div>

            <div
              class="rounded-xl border-2 p-3.5 shadow-sm print:rounded-lg print:border-slate-900 print:bg-white print:p-3 print:shadow-none"
              :class="
                summary.total_profit >= 0
                  ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-950/20'
                  : 'border-rose-200 bg-rose-50/50 dark:border-rose-800/50 dark:bg-rose-950/20'
              "
            >
              <p
                class="text-[9px] font-bold uppercase tracking-wider"
                :class="
                  summary.total_profit >= 0
                    ? 'text-emerald-700 dark:text-emerald-500'
                    : 'text-rose-700 dark:text-rose-500'
                "
              >
                Net {{ summary.total_profit >= 0 ? "Profit" : "Loss" }}
              </p>
              <h4
                class="mt-0.5 truncate text-lg font-black"
                :class="
                  summary.total_profit >= 0
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-rose-700 dark:text-rose-400'
                "
              >
                ৳ {{ formatCurrency(Math.abs(summary.total_profit)) }}
              </h4>
              <p
                class="text-[10px] font-medium"
                :class="
                  summary.total_profit >= 0
                    ? 'text-emerald-600/70 dark:text-emerald-500/60'
                    : 'text-rose-600/70 dark:text-rose-500/60'
                "
              >
                Margin: {{ summary.profit_margin }}%
              </p>
            </div>
          </div>

          <!-- ============================== FILTER PANEL ============================== -->
          <div
            class="mb-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden"
          >
            <div class="space-y-3.5">
              <div
                class="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800/60"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                  >
                    <i class="fa-solid fa-sliders text-xs"></i>
                  </div>
                  <h3
                    class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200"
                  >
                    Filter Products
                  </h3>
                </div>

                <span
                  v-if="isFilterActive"
                  class="inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-400"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"
                  ></span>
                  Filter Active
                </span>
              </div>

              <!-- Date row -->
              <div class="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
                <div class="md:col-span-4">
                  <label
                    class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    v-model="startDate"
                    :max="endDate || today"
                    class="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                  />
                </div>

                <div class="md:col-span-4">
                  <label
                    class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    v-model="endDate"
                    :min="startDate || undefined"
                    :max="today"
                    class="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-medium text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                  />
                </div>

                <div class="md:col-span-4">
                  <button
                    type="button"
                    @click="applyFilters"
                    :disabled="loading"
                    class="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-600 bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <i
                      v-if="!loading"
                      class="fa-solid fa-magnifying-glass text-xs"
                    ></i>
                    <i
                      v-else
                      class="fa-solid fa-spinner animate-spin text-xs"
                    ></i>
                    <span>{{
                      loading ? "Filtering..." : "Apply Filters"
                    }}</span>
                  </button>
                </div>
              </div>

              <!-- Search row -->
              <div
                class="flex flex-col gap-3 border-t border-slate-100 pt-3 dark:border-slate-800/60 md:flex-row md:items-end"
              >
                <div class="w-full md:flex-1">
                  <label
                    class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Search Product
                  </label>
                  <div class="relative">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500"
                    >
                      <i class="fa-solid fa-magnifying-glass text-sm"></i>
                    </div>
                    <input
                      type="text"
                      v-model="searchQuery"
                      @keyup.enter="applyFilters"
                      placeholder="Search by product name, SKU..."
                      class="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                    />
                  </div>
                </div>

                <div class="w-full md:w-auto">
                  <button
                    type="button"
                    @click="resetFilters"
                    :disabled="loading"
                    class="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                  >
                    <i class="fa-solid fa-rotate-left text-xs"></i>
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================== PRODUCT-WISE TABLE ============================== -->
          <div
            class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 print:rounded-none print:border print:border-slate-400 print:shadow-none"
          >
            <div
              class="max-h-[1080px] overflow-x-auto print:max-h-none print:overflow-visible"
            >
              <table class="w-full border-collapse text-left">
                <thead
                  class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-800/80 print:static print:border-slate-400 print:bg-slate-100"
                >
                  <tr>
                    <th
                      class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                    >
                      #
                    </th>
                    <th
                      class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                    >
                      Product
                    </th>
                    <th
                      class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                    >
                      SKU
                    </th>
                    <th
                      class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                    >
                      Qty Sold
                    </th>
                    <th
                      class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                    >
                      Avg Purchase
                    </th>
                    <th
                      class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                    >
                      Avg Sale
                    </th>
                    <th
                      class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                    >
                      Total Sales
                    </th>
                    <th
                      class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                    >
                      Total Cost
                    </th>
                    <th
                      class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                    >
                      Profit / Loss
                    </th>
                    <th
                      class="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                    >
                      Margin
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <template
                    v-if="filteredProducts && filteredProducts.length > 0"
                  >
                    <tr
                      v-for="(item, index) in filteredProducts"
                      :key="item.product_id"
                      class="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                      :class="
                        index % 2 === 1
                          ? 'bg-slate-50/40 dark:bg-slate-800/20 print:bg-slate-50'
                          : ''
                      "
                    >
                      <td
                        class="whitespace-nowrap px-4 py-3 print:px-3 print:py-2"
                      >
                        <div
                          class="text-xs font-bold text-slate-500 dark:text-slate-400"
                        >
                          {{ index + 1 }}
                        </div>
                      </td>

                      <td class="px-4 py-3 print:px-3 print:py-2">
                        <div class="flex items-center gap-2.5">
                          <div
                            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-800/50 dark:bg-indigo-950/50 dark:text-indigo-400 print:hidden"
                          >
                            <i class="fa-solid fa-box text-xs"></i>
                          </div>
                          <div class="min-w-0">
                            <div
                              class="max-w-[220px] truncate text-xs font-bold text-slate-900 dark:text-slate-100"
                            >
                              {{ item.product?.name || "Unknown Product" }}
                            </div>
                            <div
                              class="text-[10px] text-slate-400 dark:text-slate-500"
                            >
                              ID: {{ item.product_id }}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        class="whitespace-nowrap px-4 py-3 print:px-3 print:py-2"
                      >
                        <span
                          class="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 print:text-slate-900"
                        >
                          {{ item.product?.sku || "-" }}
                        </span>
                      </td>

                      <td
                        class="whitespace-nowrap px-4 py-3 text-right font-mono text-xs font-bold text-slate-700 dark:text-slate-200 print:px-3 print:py-2"
                      >
                        {{ formatNumber(item.sold_quantity) }}
                      </td>

                      <td
                        class="whitespace-nowrap px-4 py-3 text-right font-mono text-xs text-slate-600 dark:text-slate-300 print:px-3 print:py-2"
                      >
                        ৳ {{ formatCurrency(item.avg_purchase_price) }}
                      </td>

                      <td
                        class="whitespace-nowrap px-4 py-3 text-right font-mono text-xs text-slate-600 dark:text-slate-300 print:px-3 print:py-2"
                      >
                        ৳ {{ formatCurrency(item.avg_sale_price) }}
                      </td>

                      <td
                        class="whitespace-nowrap px-4 py-3 text-right font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 print:px-3 print:py-2"
                      >
                        ৳ {{ formatCurrency(item.total_sales) }}
                      </td>

                      <td
                        class="whitespace-nowrap px-4 py-3 text-right font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 print:px-3 print:py-2"
                      >
                        ৳ {{ formatCurrency(item.total_cost) }}
                      </td>

                      <td
                        class="whitespace-nowrap px-4 py-3 text-right font-mono text-xs font-black print:px-3 print:py-2"
                        :class="
                          item.status === 'profit'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        "
                      >
                        {{ item.status === "profit" ? "" : "−" }}৳
                        {{ formatCurrency(Math.abs(item.total_profit)) }}
                      </td>

                      <td
                        class="whitespace-nowrap px-4 py-3 text-center print:px-3 print:py-2"
                      >
                        <span
                          class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border"
                          :class="
                            item.status === 'profit'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                              : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                          "
                        >
                          {{ item.profit_margin }}%
                        </span>
                      </td>
                    </tr>
                  </template>

                  <tr v-else>
                    <td colspan="10" class="px-6 py-10 text-center">
                      <div
                        v-if="loading"
                        class="flex w-full flex-col items-center justify-center py-8"
                      >
                        <div
                          class="h-8 w-8 animate-spin rounded-full border-3 border-indigo-500 border-t-transparent"
                        ></div>
                        <p
                          class="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400"
                        >
                          Updating product report...
                        </p>
                      </div>

                      <div
                        v-else-if="errorMsg"
                        class="mx-auto flex max-w-sm flex-col items-center justify-center py-5"
                      >
                        <div
                          class="mb-3 rounded-full bg-rose-50 p-3 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400"
                        >
                          <i class="fas fa-circle-exclamation text-lg"></i>
                        </div>
                        <h3
                          class="mb-1 text-xs font-bold text-slate-800 dark:text-slate-200"
                        >
                          Failed to load report
                        </h3>
                        <p
                          class="text-[11px] text-slate-400 dark:text-slate-500"
                        >
                          {{ errorMsg }}
                        </p>
                        <button
                          type="button"
                          @click="fetchProductReports()"
                          class="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                        >
                          Try Again
                        </button>
                      </div>

                      <div
                        v-else
                        class="mx-auto flex max-w-xs flex-col items-center justify-center py-5"
                      >
                        <div
                          class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 ring-8 ring-slate-50 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-900/50"
                        >
                          <i class="fas fa-box-open text-lg"></i>
                        </div>
                        <h3
                          class="mb-1 text-xs font-bold text-slate-800 dark:text-slate-200"
                        >
                          No product record found
                        </h3>
                        <p
                          class="text-[11px] text-slate-400 dark:text-slate-500"
                        >
                          Try adjusting your search query or date filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>

                <!-- TOTAL FOOTER -->
                <tfoot
                  v-if="filteredProducts && filteredProducts.length > 0"
                  class="border-t-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 print:border-slate-400 print:bg-slate-100"
                >
                  <tr>
                    <td
                      colspan="3"
                      class="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:px-3 print:py-2"
                    >
                      Total ({{ filteredProducts.length }} products)
                    </td>
                    <td
                      class="px-4 py-3 text-right font-mono text-sm font-black text-slate-900 dark:text-white print:px-3 print:py-2"
                    >
                      {{ formatNumber(footerTotals.quantity) }}
                    </td>
                    <td class="print:px-3 print:py-2" colspan="2"></td>
                    <td
                      class="px-4 py-3 text-right font-mono text-sm font-black text-indigo-700 dark:text-indigo-400 print:px-3 print:py-2"
                    >
                      ৳ {{ formatCurrency(footerTotals.sales) }}
                    </td>
                    <td
                      class="px-4 py-3 text-right font-mono text-sm font-black text-amber-600 dark:text-amber-400 print:px-3 print:py-2"
                    >
                      ৳ {{ formatCurrency(footerTotals.cost) }}
                    </td>
                    <td
                      class="px-4 py-3 text-right font-mono text-sm font-black print:px-3 print:py-2"
                      :class="
                        footerTotals.profit >= 0
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      "
                    >
                      ৳ {{ formatCurrency(footerTotals.profit) }}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import api from "../../../../services/api.js";

import Navbar from "../../admin/admin-navbar.vue";
import HeaderSection from "../../admin/admin-header.vue";
import Message from "../../../Message/message.vue";
import FooterSection from "../../../footer.vue";

const mobileMenu = ref(false);
const sidebarOpen = ref(false);
const successMsg = ref("");
const errorMsg = ref("");
const loading = ref(false);

function toggleMenu() {
  mobileMenu.value = !mobileMenu.value;
}

/* =============================================================
   State — matches ReportController::profitAndLoss() response
============================================================= */
const summary = ref({
  total_records: 0,
  total_quantity: 0,
  total_sales: 0,
  total_cost: 0,
  total_profit: 0,
  profit_margin: 0,
});

const productWise = ref([]); // data.product_wise

/* =============================================================
   Filters
============================================================= */
const today = new Date().toISOString().split("T")[0];
const startDate = ref(today);
const endDate = ref(today);
const searchQuery = ref("");

const isFilterActive = computed(
  () =>
    searchQuery.value || startDate.value !== today || endDate.value !== today,
);

/* =============================================================
   Fetch Profit & Loss Report
============================================================= */
async function fetchProductReports() {
  if (loading.value) return;

  try {
    loading.value = true;
    errorMsg.value = "";
    successMsg.value = "";

    const response = await api.get("/reports/profit-loss", {
      params: {
        start_date: startDate.value || undefined,
        end_date: endDate.value || undefined,
        search: searchQuery.value?.trim() || undefined,
        per_page: 100, // product_wise itself isn't paginated; keep stocks page generous
      },
    });

    const data = response?.data?.data;

    summary.value = {
      total_records: Number(data?.summary?.total_records ?? 0),
      total_quantity: Number(data?.summary?.total_quantity ?? 0),
      total_sales: Number(data?.summary?.total_sales ?? 0),
      total_cost: Number(data?.summary?.total_cost ?? 0),
      total_profit: Number(data?.summary?.total_profit ?? 0),
      profit_margin: Number(data?.summary?.profit_margin ?? 0),
    };

    productWise.value = Array.isArray(data?.product_wise)
      ? data.product_wise
      : [];
  } catch (error) {
    console.error("Profit & loss fetch error:", error?.response?.data || error);

    errorMsg.value =
      error?.response?.data?.message || "Failed to fetch profit & loss report.";

    productWise.value = [];
    summary.value = {
      total_records: 0,
      total_quantity: 0,
      total_sales: 0,
      total_cost: 0,
      total_profit: 0,
      profit_margin: 0,
    };
  } finally {
    loading.value = false;
  }
}

function applyFilters() {
  fetchProductReports();
}

function resetFilters() {
  searchQuery.value = "";
  startDate.value = today;
  endDate.value = today;
  fetchProductReports();
}

/* =============================================================
   Client-side search (product_wise is a small, non-paginated list)
============================================================= */
const filteredProducts = computed(() => {
  const search = String(searchQuery.value || "")
    .toLowerCase()
    .trim();

  if (!search) return productWise.value;

  return productWise.value.filter((item) => {
    const name = item.product?.name?.toLowerCase() || "";
    const sku = item.product?.sku?.toLowerCase() || "";
    return name.includes(search) || sku.includes(search);
  });
});

/* =============================================================
   Footer totals (sum of currently visible/filtered products)
============================================================= */
const footerTotals = computed(() => {
  let quantity = 0,
    sales = 0,
    cost = 0,
    profit = 0;

  for (const item of filteredProducts.value) {
    quantity += Number(item.sold_quantity || 0);
    sales += Number(item.total_sales || 0);
    cost += Number(item.total_cost || 0);
    profit += Number(item.total_profit || 0);
  }

  return { quantity, sales, cost, profit };
});

/* =============================================================
   Display helpers
============================================================= */
function formatDate(date) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(value) {
  return Number(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatCurrency(value) {
  return Number(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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

function handleKeydown(event) {
  if (event.key === "Escape") {
    sidebarOpen.value = false;
    mobileMenu.value = false;
  }
}

onMounted(() => {
  fetchProductReports();
  window.addEventListener("keydown", handleKeydown);

  const saved = localStorage.getItem("theme");
  if (saved === "dark") applyTheme(true);
  else if (saved === "light") applyTheme(false);
  else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style></style>
