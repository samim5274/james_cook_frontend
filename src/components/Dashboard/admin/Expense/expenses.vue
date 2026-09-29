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

                    

                    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <!-- Title & Subtitle Section -->
                        <div class="flex items-start gap-3.5">
                            <!-- Icon Badge -->
                            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                                <i class="fa-solid fa-wallet text-lg"></i>
                            </div>

                            <div>
                                <div class="flex items-center gap-2.5">
                                    <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        Expense Management
                                    </h1>
                                    
                                    <!-- Dynamic Count Badge -->
                                    <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/80">
                                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                        {{ expenses.length || 0 }} Total
                                    </span>
                                </div>
                                
                                <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    Track, organize, and monitor all your business expenses in real-time.
                                </p>
                            </div>
                        </div>

                        <!-- Quick Stats / Action Pill (Optional Right-Side Content) -->
                        <div class="flex items-center gap-2 self-start sm:self-auto">
                            <div class="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-3.5 py-2 shadow-xs">
                                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Spent:</span>
                                <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    ৳{{ Number(totalExpensesAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}
                                </span>
                            </div>
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

                            <!-- Create Expenses Button -->
                            <button 
                                type="button" @click="openExpenseModal"
                                class="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 shrink-0"
                            >
                                <i class="fa-solid fa-plus text-xs sm:text-sm"></i>
                                <span>Create Expenses</span>
                            </button>

                        </div>
                    </div>


                    
                    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                        <div class="overflow-x-auto max-h-[850px] scrollbar-thin">
                            <table class="w-full text-left border-collapse whitespace-nowrap">
                                <!-- Table Header -->
                                <thead class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 sticky top-0 backdrop-blur-md z-10">
                                    <tr>
                                        <th class="pl-5 pr-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            #ID & Date
                                        </th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            Expense & Details
                                        </th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            Category / Subcategory
                                        </th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                            Created By
                                        </th>
                                        <th class="px-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                                            Amount (BDT)
                                        </th>
                                        <th class="pl-4 pr-5 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse border-b border-slate-100 dark:border-slate-800">
                                    <td class="pl-5 pr-4 py-4">
                                        <div class="h-3.5 bg-slate-200 dark:bg-slate-700 rounded-md w-24 mb-1.5"></div>
                                        <div class="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-md w-16"></div>
                                    </td>
                                    <td class="px-4 py-4">
                                        <div class="h-3.5 bg-slate-200 dark:bg-slate-700 rounded-md w-40 mb-1.5"></div>
                                        <div class="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-md w-28"></div>
                                    </td>
                                    <td class="px-4 py-4">
                                        <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-20"></div>
                                    </td>
                                    <td class="px-4 py-4">
                                        <div class="flex items-center gap-2">
                                            <div class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                            <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-20"></div>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4 text-right">
                                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-16 ml-auto"></div>
                                    </td>
                                    <td class="pl-4 pr-5 py-4 text-center">
                                        <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-12 mx-auto"></div>
                                    </td>
                                </tr>

                                <!-- Table Body -->
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
                                    <!-- Loop Expenses -->
                                    <tr 
                                        v-for="expense in filteredExpenses" 
                                        :key="expense.id" @click="expensesDetails(expense)"
                                        class="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                                    >
                                        <!-- ID & Date -->
                                        <td class="pl-5 pr-4 py-3.5">
                                            <div class="font-bold text-slate-900 dark:text-slate-100">
                                                #EXP-{{ expense.id }}
                                            </div>
                                            <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                                <i class="fa-regular fa-calendar text-[10px]"></i>
                                                <span>{{ expense.date }}</span>
                                            </div>
                                        </td>

                                        <!-- Title & Remark -->
                                        <td class="px-4 py-3.5 max-w-xs">
                                            <div class="font-semibold text-slate-800 dark:text-slate-200 truncate" :title="expense.title">
                                                {{ expense.title }}
                                            </div>
                                            <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5" :title="expense.remark">
                                                <span class="font-medium">Remark:</span> {{ expense.remark || 'N/A' }}
                                            </div>
                                        </td>

                                        <!-- Category & Subcategory -->
                                        <td class="px-4 py-3.5">
                                            <div class="flex flex-col gap-0.5">
                                                <!-- Main Category -->
                                                <div class="font-bold text-xs text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
                                                    {{ expense.category?.name || 'N/A' }}
                                                </div>
                                                <!-- Subcategory -->
                                                <div v-if="expense.subcategory?.name" class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                    <span class="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500"></span>
                                                    <span>{{ expense.subcategory.name }}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Created By (User) -->
                                        <td class="px-4 py-3.5">
                                            <div class="flex items-center gap-2">
                                                <div class="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                                                    {{ expense.user?.name ? expense.user.name.charAt(0) : 'U' }}
                                                </div>
                                                <span class="text-slate-700 dark:text-slate-300 font-medium">
                                                    {{ expense.user?.name || 'N/A' }}
                                                </span>
                                            </div>
                                        </td>

                                        <!-- Amount -->
                                        <td class="px-4 py-3.5 text-right font-bold text-slate-900 dark:text-slate-100">
                                            ৳{{ Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}
                                        </td>

                                        <!-- Action Buttons -->
                                        <td class="pl-4 pr-5 py-3.5 text-center">
                                            <div class="flex items-center justify-center gap-1.5">
                                                <button 
                                                    @click.stop="openEditExpense(expense)"
                                                    type="button"
                                                    class="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Edit Expense"
                                                >
                                                    <i class="fa-solid fa-pen-to-square text-xs sm:text-sm"></i>
                                                </button>
                                                <button 
                                                    @click.stop="printExpense(expense)"
                                                    type="button"
                                                    class="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Edit Expense"
                                                >
                                                    <i class="fa-solid fa-print text-xs sm:text-sm"></i>
                                                </button>
                                                <button 
                                                    @click.stop="deleteExpense(expense.id)"
                                                    type="button"
                                                    class="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Delete Expense"
                                                >
                                                    <i class="fa-solid fa-trash-can text-xs sm:text-sm"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- Empty State -->
                                    <tr v-if="expenses.length === 0">
                                        <td colspan="6" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                            <div class="flex flex-col items-center justify-center gap-2">
                                                <i class="fa-solid fa-receipt text-3xl text-slate-300 dark:text-slate-600"></i>
                                                <p class="text-sm font-medium">No expenses found.</p>
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
                                v-for="page in ExpensesVisiblePages"
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
                    v-if="isExpenseModalOpen"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
                    @click.self="closeExpenseModal"
                >
                    <div
                        @click.stop
                        class="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
                    >
                        <!-- Modal Header -->
                        <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                    <i class="fa-solid fa-receipt text-lg"></i>
                                </div>
                                <div>
                                    <h3 class="text-base font-bold text-slate-900 dark:text-white">
                                        Create New Expense
                                    </h3>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Enter details to record a new business expense.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="closeExpenseModal"
                                class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                            >
                                <i class="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>

                        <!-- Form -->
                        <form @submit.prevent="createExpense">
                            <div class="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">

                                <!-- Category + Subcategory -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <!-- Category -->
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                                            Category <span class="text-rose-500">*</span>
                                        </label>
                                        <select
                                            v-model="expenseForm.category_id"
                                            @change="onCategoryChange"
                                            class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                                            :class="{ '!border-rose-500 focus:!ring-rose-500/10': expenseErrors.category_id }"
                                        >
                                            <option value="" disabled class="text-slate-400">Select Category</option>
                                            <option
                                                v-for="category in categories"
                                                :key="category.id"
                                                :value="category.id"
                                            >
                                                {{ category.name }}
                                            </option>
                                        </select>
                                        <p v-if="expenseErrors.category_id" class="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                                            <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                            {{ expenseErrors.category_id[0] }}
                                        </p>
                                    </div>

                                    <!-- Subcategory -->
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                                            Subcategory
                                        </label>
                                        <select
                                            v-model="expenseForm.sub_category_id"
                                            :disabled="!expenseForm.category_id || filteredSubcategories.length === 0"
                                            class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">
                                                {{
                                                    !expenseForm.category_id
                                                        ? 'Select category first'
                                                        : filteredSubcategories.length
                                                            ? 'Select Subcategory'
                                                            : 'No subcategory available'
                                                }}
                                            </option>
                                            <option
                                                v-for="subcategory in filteredSubcategories"
                                                :key="subcategory.id"
                                                :value="subcategory.id"
                                            >
                                                {{ subcategory.name }}
                                            </option>
                                        </select>
                                        <p v-if="expenseErrors.sub_category_id" class="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                                            <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                            {{ expenseErrors.sub_category_id[0] }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Title -->
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                                        Expense Title <span class="text-rose-500">*</span>
                                    </label>
                                    <input
                                        v-model="expenseForm.title"
                                        type="text"
                                        placeholder="e.g. Office electricity bill"
                                        class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                                        :class="{ '!border-rose-500 focus:!ring-rose-500/10': expenseErrors.title }"
                                    />
                                    <p v-if="expenseErrors.title" class="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                                        <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                        {{ expenseErrors.title[0] }}
                                    </p>
                                </div>

                                <!-- Amount -->
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                                        Amount <span class="text-rose-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-semibold text-sm pointer-events-none">
                                            ৳
                                        </span>
                                        <input
                                            v-model="expenseForm.amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            class="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                                            :class="{ '!border-rose-500 focus:!ring-rose-500/10': expenseErrors.amount }"
                                        />
                                    </div>
                                    <p v-if="expenseErrors.amount" class="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                                        <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                        {{ expenseErrors.amount[0] }}
                                    </p>
                                </div>

                                <!-- Remark -->
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                                        Remark
                                    </label>
                                    <textarea
                                        v-model="expenseForm.remark"
                                        rows="3"
                                        placeholder="Write any additional notes..."
                                        class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20 resize-none"
                                    ></textarea>
                                    <p v-if="expenseErrors.remark" class="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                                        <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                        {{ expenseErrors.remark[0] }}
                                    </p>
                                </div>

                            </div>

                            <!-- Footer -->
                            <div class="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3 backdrop-blur-sm">
                                <!-- Cancel Button -->
                                <button
                                    type="button"
                                    @click="closeExpenseModal"
                                    :disabled="savingExpense"
                                    class="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:border-slate-700/80 rounded-xl transition-all shadow-xs disabled:opacity-50 active:scale-95 shrink-0"
                                >
                                    Cancel
                                </button>

                                <!-- Submit Button -->
                                <button
                                    type="submit"
                                    :disabled="savingExpense"
                                    class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow-indigo-500/25 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                                >
                                    <i v-if="savingExpense" class="fa-solid fa-spinner fa-spin text-xs"></i>
                                    <i v-else class="fa-solid fa-plus text-xs"></i>
                                    <span>{{ savingExpense ? 'Saving...' : 'Create Expense' }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
        </Teleport>

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
                    v-if="isExpenseEditModalOpen"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
                    @click.self="closeExpenseEditModal"
                >
                    <div
                        @click.stop
                        class="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
                    >
                        <!-- Header -->
                        <div
                            class="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0"
                                >
                                    <i class="fa-solid fa-pen-to-square text-lg"></i>
                                </div>

                                <div>
                                    <h3 class="text-base font-bold text-slate-900 dark:text-white">
                                        Edit Expense
                                    </h3>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Update the expense information below.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="closeExpenseEditModal"
                                class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                            >
                                <i class="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>

                        <!-- Form -->
                        <form @submit.prevent="updateExpense">
                            <div
                                class="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto"
                            >

                                <!-- Category + Subcategory -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    <!-- Category -->
                                    <div>
                                        <label
                                            class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                                        >
                                            Category
                                            <span class="text-rose-500">*</span>
                                        </label>

                                        <select
                                            v-model="expenseForm.category_id"
                                            @change="onCategoryChange"
                                            class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                                            :class="{
                                                '!border-rose-500 focus:!ring-rose-500/10':
                                                    expenseErrors.category_id
                                            }"
                                        >
                                            <option value="" disabled>
                                                Select Category
                                            </option>

                                            <option
                                                v-for="category in categories"
                                                :key="category.id"
                                                :value="category.id"
                                            >
                                                {{ category.name }}
                                            </option>
                                        </select>

                                        <p
                                            v-if="expenseErrors.category_id"
                                            class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                                        >
                                            <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                            {{ expenseErrors.category_id[0] }}
                                        </p>
                                    </div>

                                    <!-- Subcategory -->
                                    <div>
                                        <label
                                            class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                                        >
                                            Subcategory
                                        </label>

                                        <select
                                            v-model="expenseForm.sub_category_id"
                                            :disabled="
                                                !expenseForm.category_id ||
                                                filteredSubcategories.length === 0
                                            "
                                            class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            :class="{
                                                '!border-rose-500 focus:!ring-rose-500/10':
                                                    expenseErrors.sub_category_id
                                            }"
                                        >
                                            <option value="">
                                                {{
                                                    !expenseForm.category_id
                                                        ? 'Select category first'
                                                        : filteredSubcategories.length
                                                            ? 'Select Subcategory'
                                                            : 'No subcategory available'
                                                }}
                                            </option>

                                            <option
                                                v-for="subcategory in filteredSubcategories"
                                                :key="subcategory.id"
                                                :value="subcategory.id"
                                            >
                                                {{ subcategory.name }}
                                            </option>
                                        </select>

                                        <p
                                            v-if="expenseErrors.sub_category_id"
                                            class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                                        >
                                            <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                            {{ expenseErrors.sub_category_id[0] }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Title -->
                                <div>
                                    <label
                                        class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                                    >
                                        Expense Title
                                        <span class="text-rose-500">*</span>
                                    </label>

                                    <input
                                        v-model="expenseForm.title"
                                        type="text"
                                        placeholder="e.g. Office electricity bill"
                                        class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                                        :class="{
                                            '!border-rose-500 focus:!ring-rose-500/10':
                                                expenseErrors.title
                                        }"
                                    />

                                    <p
                                        v-if="expenseErrors.title"
                                        class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                                    >
                                        <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                        {{ expenseErrors.title[0] }}
                                    </p>
                                </div>

                                <!-- Amount -->
                                <div>
                                    <label
                                        class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                                    >
                                        Amount
                                        <span class="text-rose-500">*</span>
                                    </label>

                                    <div class="relative">
                                        <span
                                            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-semibold text-sm pointer-events-none"
                                        >
                                            ৳
                                        </span>

                                        <input
                                            v-model="expenseForm.amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            class="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                                            :class="{
                                                '!border-rose-500 focus:!ring-rose-500/10':
                                                    expenseErrors.amount
                                            }"
                                        />
                                    </div>

                                    <p
                                        v-if="expenseErrors.amount"
                                        class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                                    >
                                        <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                        {{ expenseErrors.amount[0] }}
                                    </p>
                                </div>

                                <!-- Remark -->
                                <div>
                                    <label
                                        class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                                    >
                                        Remark
                                    </label>

                                    <textarea
                                        v-model="expenseForm.remark"
                                        rows="3"
                                        placeholder="Write any additional notes..."
                                        class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20 resize-none"
                                    ></textarea>

                                    <p
                                        v-if="expenseErrors.remark"
                                        class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                                    >
                                        <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                        {{ expenseErrors.remark[0] }}
                                    </p>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div
                                class="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3 backdrop-blur-sm"
                            >
                                <button
                                    type="button"
                                    @click="closeExpenseEditModal"
                                    :disabled="updatingExpense"
                                    class="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:border-slate-700/80 rounded-xl transition-all shadow-xs disabled:opacity-50 active:scale-95 shrink-0"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    :disabled="updatingExpense"
                                    class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow-indigo-500/25 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                                >
                                    <i
                                        v-if="updatingExpense"
                                        class="fa-solid fa-spinner fa-spin text-xs"
                                    ></i>

                                    <i
                                        v-else
                                        class="fa-solid fa-check text-xs"
                                    ></i>

                                    <span>
                                        {{
                                            updatingExpense
                                                ? 'Updating...'
                                                : 'Update Expense'
                                        }}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
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



const isExpenseModalOpen = ref(false);
const savingExpense = ref(false);

const isExpenseEditModalOpen = ref(false);
const updatingExpense = ref(false);
const editingExpenseId = ref(null);

const expenseForm = reactive({
    category_id: '',
    sub_category_id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    remark: '',
});

const expenseErrors = ref({});











// =============================
// Get orders
// =============================
const ExpensesVisiblePages = computed(() => {
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













const expenses = ref([]);
const categories = ref([]);
const subcategories = ref([]);
const searchQuery = ref('');

async function fetchExpenses(page = 1){
    
    try{
        loading.value = true;
        errorMsg.value = '';

        const res = await api.get('/expenses', {
            params: { 
                page,
            }
        });

        const data = res.data?.data;

        // Expenses pagination data
        const expensePagination = data?.expenses;

        expenses.value = expensePagination?.data ?? [];

        categories.value = data?.categories ?? [];
        subcategories.value = data?.subcategories ?? [];

        // Pagination
        pagination.value = {
            page: expensePagination?.current_page ?? 1,
            lastPage: expensePagination?.last_page ?? 1,
            total: expensePagination?.total ?? 0,
            perPage: expensePagination?.per_page ?? 20,
            from: expensePagination?.from ?? 0,
            to: expensePagination?.to ?? 0,
        };
        // console.log(expenses.value);
    } catch(err){
        console.error('Fetch expenses error:', err);

        errorMsg.value =
            err?.response?.data?.message ||
            err?.message ||
            'Something went wrong while fetching expenses.';

        expenses.value = [];

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



const filteredExpenses = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();

    if (!query) {
        return expenses.value;
    }

    return expenses.value.filter(expense => {
        return [
            expense.id,
            expense.title,
            expense.amount,
            expense.date,
            expense.remark,
            expense.category?.name,
            expense.subcategory?.name,
            expense.user?.name,
        ].some(value =>
            String(value ?? '').toLowerCase().includes(query)
        );
    });
});





const totalExpensesAmount = computed(() => {
    return filteredExpenses.value.reduce((sum, expense) => {
        return sum + (Number(expense.amount) || 0);
    }, 0);
});





async function changePage(page) {
    await fetchExpenses(page);
}













const filteredSubcategories = computed(() => {
    if (!expenseForm.category_id) {
        return [];
    }

    return subcategories.value.filter(
        sub => Number(sub.category_id) === Number(expenseForm.category_id)
    );
});

// open pop-up
const isExpensesModalOpen = ref(false);

function openExpenseModal() {
    expenseForm.category_id = '';
    expenseForm.sub_category_id = '';
    expenseForm.title = '';
    expenseForm.date = new Date().toISOString().split('T')[0];
    expenseForm.amount = '';
    expenseForm.remark = '';

    expenseErrors.value = {};

    isExpenseModalOpen.value = true;
}


function closeExpenseModal() {
    if (savingExpense.value) return;

    isExpenseModalOpen.value = false;
}

function onCategoryChange() {
    expenseForm.sub_category_id = '';
}

async function createExpense() {
    savingExpense.value = true;
    expenseErrors.value = {};

    try {
        const payload = {
            category_id: expenseForm.category_id,
            sub_category_id: expenseForm.sub_category_id || null,
            title: expenseForm.title,
            amount: expenseForm.amount,
            remark: expenseForm.remark || null,
        };

        const res = await api.post('/expenses', payload);
        isExpenseModalOpen.value = false;
        successMsg.value = res.data.message;
        // Expense list refresh
        await fetchExpenses(pagination.value.page);

    } catch (err) {

        console.error('Create expense error:', err);

        if (err?.response?.status === 422) {
            expenseErrors.value = err.response.data.errors ?? {};
        } else {
            errorMsg.value =
                err?.response?.data?.message ||
                err?.message ||
                'Something went wrong while creating expense.';
        }

    } finally {
        savingExpense.value = false;
    }
}
















function printExpense(expense){
    if (!expense) return;
    
    const win = window.open("about:blank", "_blank");

    if (!win) {
        alert("Popup blocked!");
        return;
    }

    const url = `/admin/expenses/print/${expense.id}`;
    // console.log("button clicked", url);

    win.location.href = url;
    win.focus();
}









function expensesDetails(expenses) {
    router.push(`/admin/expenses/details/${expenses.id}`)
}


async function deleteExpense(id) {
    if (!id) {
        errorMsg.value = "Expense ID not found.";
        return;
    }

    if (!confirm("Are you sure you want to delete this expense?")) {
        return;
    }

    try {
        loading.value = true;
        errorMsg.value = "";

        const res = await api.delete(`/expenses/${id}`);

        if (res.data?.success) {
            
            expenses.value = expenses.value.filter(
                expense => expense.id !== id
            );

            successMsg.value = res.data.message || "Expense deleted successfully.";
        }

    } catch (err) {
        console.error("Delete expense error:", err);

        errorMsg.value =
            err?.response?.data?.message ||
            Object.values(err?.response?.data?.errors || {})?.[0]?.[0] ||
            "Failed to delete expense.";

    } finally {
        loading.value = false;
    }
}





















function openEditExpense(expense) {
    editingExpenseId.value = expense.id;

    expenseForm.category_id = expense.category_id ?? "";
    expenseForm.sub_category_id = expense.sub_category_id ?? "";
    expenseForm.title = expense.title ?? "";
    expenseForm.amount = expense.amount ?? "";
    expenseForm.remark = expense.remark ?? "";

    expenseErrors.value = {};

    isExpenseEditModalOpen.value = true;
}


async function updateExpense() {
    if (!editingExpenseId.value) {
        errorMsg.value = "Expense ID not found.";
        return;
    }

    try {
        updatingExpense.value = true;
        expenseErrors.value = {};
        errorMsg.value = "";

        const payload = {
            category_id: expenseForm.category_id,
            sub_category_id: expenseForm.sub_category_id || null,
            title: expenseForm.title,
            amount: expenseForm.amount,
            remark: expenseForm.remark || null,
        };

        const res = await api.put(
            `/expenses/${editingExpenseId.value}`,
            payload
        );

        if (res.data?.success) {
            successMsg.value =
                res.data.message || "Expense updated successfully.";

            isExpenseEditModalOpen.value = false;
            editingExpenseId.value = null;

            await fetchExpenses();
        }

    } catch (err) {
        // console.error("Update expense error:", err);
        // console.error("Status:", err?.response?.status);
        // console.error("Response:", err?.response?.data);

        if (err?.response?.status === 422) {
            expenseErrors.value = err.response.data?.errors || {};
        }

        errorMsg.value =
            err?.response?.data?.message ||
            "Failed to update expense.";

    } finally {
        updatingExpense.value = false;
    }
}



function closeExpenseEditModal() {
    if (updatingExpense.value) return;

    isExpenseEditModalOpen.value = false;
    editingExpenseId.value = null;
    expenseErrors.value = {};
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
    fetchExpenses();


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