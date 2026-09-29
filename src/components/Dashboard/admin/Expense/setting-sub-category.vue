<template>
    <div>
        
        <Message
            :successMsg="successMsg"
            :errorMsg="errorMsg"
            @update:successMsg="successMsg = $event"
            @update:errorMsg="errorMsg = $event"
        />

        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <!-- Title & Subtitle Section -->
            <div class="flex items-start gap-3.5">
                <!-- Icon Badge -->
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                    <i class="fa-solid fa-gears text-lg"></i>
                </div>

                <div>
                    <div class="flex items-center gap-2.5">
                        <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Sub-Category Management
                        </h1>
                    </div>
                    
                    <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Track, organize, and monitor all your business expenses in real-time.
                    </p>
                </div>
            </div>

            <div class="flex items-center gap-2 self-start sm:self-auto">
                <button type="button" @click="openSubCategoryModal"
                    class="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 shrink-0">
                    <i class="fa-solid fa-plus text-xs sm:text-sm"></i>
                    <span>Create Sub-Category</span>
                </button>
            </div>
        </div>

        
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div class="overflow-x-auto max-h-[850px] scrollbar-thin">

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

                <table class="w-full text-left border-collapse whitespace-nowrap">
                    <!-- Table Header -->
                    <thead class="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 sticky top-0 backdrop-blur-md z-10">
                        <tr>
                            <th class="pl-5 pr-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                ID
                            </th>
                            <th class="pl-5 pr-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Category Name
                            </th>
                            <th class="pl-5 pr-4 py-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Name
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
                            v-for="exSubCategory in filteredExpensesSubCategory" 
                            :key="exSubCategory.id"
                            class="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                        >
                            <!-- ID & Date -->
                            <td class="pl-5 pr-4 py-3.5">
                                <div class="font-bold text-slate-900 dark:text-slate-100">
                                    #EXC-{{ exSubCategory.id }}
                                </div>
                            </td>

                            <td class="px-4 py-3.5 max-w-xs">
                                <div class="font-semibold text-slate-800 dark:text-slate-200 truncate" :title="exSubCategory.name">
                                    {{ exSubCategory.category.name }}
                                </div>
                            </td>

                            <td class="px-4 py-3.5 max-w-xs">
                                <div class="font-semibold text-slate-800 dark:text-slate-200 truncate" :title="exSubCategory.name">
                                    {{ exSubCategory.name }}
                                </div>
                                <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5" :title="exSubCategory.remark">
                                    <span class="font-medium">Remark:</span> {{ exSubCategory.remark || 'N/A' }}
                                </div>
                            </td>

                            <!-- Action Buttons -->
                            <td class="pl-4 pr-5 py-3.5 text-end">
                                <div class="flex items-center justify-center gap-1.5">
                                    <button 
                                        @click.stop="openEditExpenseSubCategory(exSubCategory)"
                                        type="button"
                                        class="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        title="Edit Expense"
                                    >
                                        <i class="fa-solid fa-pen-to-square text-xs sm:text-sm"></i>
                                    </button>
                                    
                                    <button 
                                        @click.stop="deleteExpenseSubCategory(exSubCategory.id)"
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
                        <tr v-if="subCategories.length === 0">
                            <td colspan="6" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                <div class="flex flex-col items-center justify-center gap-2">
                                    <i class="fa-solid fa-receipt text-3xl text-slate-300 dark:text-slate-600"></i>
                                    <p class="text-sm font-medium">No expenses category found.</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                        v-for="page in ExpSubCategoryVisiblePages"
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
        </div>

        



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
                    v-if="isExpenseSubCategoryModalOpen"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
                    @click.self="closeExpenseSubCategoryModal"
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
                                        Create New Expense Sub-Category
                                    </h3>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Enter details to record a new business expense.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="closeExpenseSubCategoryModal"
                                class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                            >
                                <i class="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>

                        <!-- Form -->
                        <form @submit.prevent="createExpenseSubCategory">
                            <div class="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">

                                <div>
                                    <div>
                                        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                                            Category <span class="text-rose-500">*</span>
                                        </label>
                                        <select
                                            v-model="expenseSubCategoryForm.category_id"
                                            class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                                            :class="{
                                                '!border-rose-500 focus:!ring-rose-500/10':
                                                    expenseSubCategoryErrors.category_id
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
                                            v-if="expenseSubCategoryErrors.category_id"
                                            class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                                        >
                                            <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                            {{ expenseSubCategoryErrors.category_id[0] }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Name categories -->
                                <div>
                                    <label
                                        class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                                    >
                                        Sub-Category Name <span class="text-rose-500">*</span>
                                    </label>

                                    <input
                                        v-model.trim="expenseSubCategoryForm.name"
                                        type="text"
                                        placeholder="e.g. Electricity Bill"
                                        class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                                        :class="{
                                            '!border-rose-500 focus:!ring-rose-500/10':
                                                expenseSubCategoryErrors.name
                                        }"
                                    />

                                    <p
                                        v-if="expenseSubCategoryErrors.name"
                                        class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                                    >
                                        <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                        {{ expenseSubCategoryErrors.name[0] }}
                                    </p>
                                </div>

                            </div>

                            <!-- Footer -->
                            <div class="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3 backdrop-blur-sm">
                                <!-- Cancel Button -->
                                <button
                                    type="button"
                                    @click="closeExpenseSubCategoryModal"
                                    :disabled="savingExpenseSubCategory"
                                    class="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:border-slate-700/80 rounded-xl transition-all shadow-xs disabled:opacity-50 active:scale-95 shrink-0"
                                >
                                    Cancel
                                </button>

                                <!-- Submit Button -->
                                <button
                                    type="submit"
                                    :disabled="savingExpenseSubCategory"
                                    class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow-indigo-500/25 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                                >
                                    <i v-if="savingExpenseSubCategory" class="fa-solid fa-spinner fa-spin text-xs"></i>
                                    <i v-else class="fa-solid fa-plus text-xs"></i>
                                    <span> {{ savingExpenseSubCategory ? 'Saving...' : 'Create Sub-Category' }}</span>
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
                    v-if="isExpenseSubCategoryEditModalOpen"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
                    @click.self="closeExpenseSubCategoryEditModal"
                >
                    <div
                        @click.stop
                        class="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
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
                                        Edit Expense Sub-Category
                                    </h3>

                                    <p class="text-xs text-slate-500 dark:text-slate-400">
                                        Update the expense sub-category information below.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="closeExpenseSubCategoryEditModal"
                                :disabled="updatingExpenseSubCategory"
                                class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
                            >
                                <i class="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>

                        <!-- Form -->
                        <form @submit.prevent="updateExpenseSubCategory">
                            <div class="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                                <div>
                                    <label
                                        class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                                    >
                                        Category <span class="text-rose-500">*</span>
                                    </label>

                                    <select
                                        v-model="expenseSubCategoryForm.category_id"
                                        class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800"
                                        :class="{
                                            '!border-rose-500':
                                                expenseSubCategoryErrors.category_id
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
                                        v-if="expenseSubCategoryErrors.category_id"
                                        class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                                    >
                                        <i class="fa-solid fa-circle-exclamation text-[10px]"></i>

                                        {{ expenseSubCategoryErrors.category_id[0] }}
                                    </p>
                                </div>

                                <!-- Sub Category Name -->
                                <div>
                                    <label
                                        class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                                    >
                                        Sub-Category Name
                                        <span class="text-rose-500">*</span>
                                    </label>

                                    <input
                                        v-model.trim="expenseSubCategoryForm.name"
                                        type="text"
                                        placeholder="e.g. Office Electricity Bill"
                                        maxlength="255"
                                        autocomplete="off"
                                        class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 dark:border-slate-700/80 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20"
                                        :class="{
                                            '!border-rose-500 focus:!ring-rose-500/10':
                                                expenseSubCategoryErrors.name
                                        }"
                                    />

                                    <p
                                        v-if="expenseSubCategoryErrors.name"
                                        class="text-xs text-rose-500 mt-1.5 flex items-center gap-1"
                                    >
                                        <i class="fa-solid fa-circle-exclamation text-[10px]"></i>
                                        {{ expenseSubCategoryErrors.name[0] }}
                                    </p>
                                </div>

                            </div>

                            <!-- Footer -->
                            <div
                                class="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-3"
                            >
                                <button
                                    type="button"
                                    @click="closeExpenseSubCategoryEditModal"
                                    :disabled="updatingExpenseSubCategory"
                                    class="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:border-slate-700/80 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    :disabled="
                                        updatingExpenseSubCategory ||
                                        !expenseSubCategoryForm.name.trim()
                                    "
                                    class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <i
                                        v-if="updatingExpenseSubCategory"
                                        class="fa-solid fa-spinner fa-spin text-xs"
                                    ></i>

                                    <i
                                        v-else
                                        class="fa-solid fa-check text-xs"
                                    ></i>

                                    <span>
                                        {{
                                            updatingExpenseSubCategory
                                                ? 'Updating...'
                                                : 'Update Sub-Category'
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
import { ref, reactive, onMounted, computed } from "vue";
import api from '../../../../services/api.js'
import Message from '../../../Message/message.vue'


const successMsg = ref('');
const errorMsg = ref('');
const loading = ref(false);



const isExpenseSubCategoryModalOpen = ref(false);
const savingExpenseSubCategory = ref(false);

const isExpenseSubCategoryEditModalOpen = ref(false);
const updatingExpenseSubCategory = ref(false);
const editingExpenseSubCategoryId = ref(null);

const categories = ref([]);

const expenseSubCategoryForm = reactive({
    category_id: '',
    name: '',
});

const expenseSubCategoryErrors = ref({});












async function fetchExpensesCategory() {
    try {
        loading.value = true;
        errorMsg.value = '';

        const res = await api.get('/expenses/category-sub-category');
        const data = res.data?.data;
        categories.value = data?.categories ?? [];
    } catch (err) {
        console.error('Fetch category error:', err);

        errorMsg.value =
            err?.response?.data?.message ||
            err?.message ||
            'Something went wrong while fetching categories.';

        categories.value = [];

    } finally {
        loading.value = false;
    }
}










// =============================
// Get orders
// =============================
const ExpSubCategoryVisiblePages = computed(() => {
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














const subCategories = ref([]);
const searchQuery = ref('');

async function fetchExpensesSubCategory(page = 1){
    
    try{
        loading.value = true;
        errorMsg.value = '';

        const res = await api.get('/expenses/sub-category', {
            params: { 
                page,
            }
        });

        const subCategoriesPagination = res.data?.data;

        subCategories.value = subCategoriesPagination?.data ?? [];

        pagination.value = {
            page: subCategoriesPagination?.current_page ?? 1,
            lastPage: subCategoriesPagination?.last_page ?? 1,
            total: subCategoriesPagination?.total ?? 0,
            perPage: subCategoriesPagination?.per_page ?? 20,
            from: subCategoriesPagination?.from ?? 0,
            to: subCategoriesPagination?.to ?? 0,
        };
        
    } catch(err){
        console.error('Fetch category error:', err);

        errorMsg.value =
            err?.response?.data?.message ||
            err?.message ||
            'Something went wrong while fetching category.';

        subCategories.value = [];

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



const filteredExpensesSubCategory = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();

    if (!query) {
        return subCategories.value;
    }

    return subCategories.value.filter(exSubCategory => {
        return [
            exSubCategory.category.name,
            exSubCategory.name,
        ].some(value =>
            String(value ?? '').toLowerCase().includes(query)
        );
    });
});











async function changePage(page) {
    await fetchExpensesSubCategory(page);
}















// open pop-up
function openSubCategoryModal() {
    expenseSubCategoryForm.category_id = '';
    expenseSubCategoryForm.name = '';

    expenseSubCategoryErrors.value = {};

    isExpenseSubCategoryModalOpen.value = true;

    // Load categories if not already loaded
    if (!categories.value.length) {
        fetchExpensesCategory();
    }
}


function closeExpenseSubCategoryModal() {
    if (savingExpenseSubCategory.value) {
        return;
    }

    isExpenseSubCategoryModalOpen.value = false;

    expenseSubCategoryForm.category_id = '';
    expenseSubCategoryForm.name = '';

    expenseSubCategoryErrors.value = {};
}

async function createExpenseSubCategory() {
    if (savingExpenseSubCategory.value) {
        return;
    }

    savingExpenseSubCategory.value = true;
    expenseSubCategoryErrors.value = {};
    errorMsg.value = '';

    try {
        const payload = {
            category_id: expenseSubCategoryForm.category_id,
            name: expenseSubCategoryForm.name.trim(),
        };

        const res = await api.post(
            '/expenses/sub-category',
            payload
        );

        successMsg.value =
            res.data?.message ||
            'Expense sub-category created successfully.';

        isExpenseSubCategoryModalOpen.value = false;

        // Reset form
        expenseSubCategoryForm.category_id = '';
        expenseSubCategoryForm.name = '';
        expenseSubCategoryErrors.value = {};

        // Refresh sub-category list
        await fetchExpensesSubCategory(
            pagination.value.page
        );

    } catch (err) {
        console.error(
            'Create expense sub-category error:',
            err
        );

        if (err?.response?.status === 422) {
            expenseSubCategoryErrors.value =
                err.response?.data?.errors ?? {};
        } else {
            errorMsg.value =
                err?.response?.data?.message ||
                err?.message ||
                'Something went wrong while creating expense sub-category.';
        }

    } finally {
        savingExpenseSubCategory.value = false;
    }
}













async function deleteExpenseSubCategory(id) {
    if (!id) {
        errorMsg.value = "Expense ID not found.";
        return;
    }

    if (!confirm("Are you sure you want to delete this expense sub category?")) {
        return;
    }

    try {
        loading.value = true;
        errorMsg.value = "";

        const res = await api.delete(`/expenses/sub-category/${id}`);

        if (res.data?.success) {
            
            categories.value = categories.value.filter(
                expense => expense.id !== id
            );

            successMsg.value = res.data.message || "Expense sub-category deleted successfully.";
        }

    } catch (err) {
        console.error("Delete expense error:", err);

        errorMsg.value =
            err?.response?.data?.message ||
            Object.values(err?.response?.data?.errors || {})?.[0]?.[0] ||
            "Failed to delete expense sub-category.";

    } finally {
        loading.value = false;
    }
}





















function openEditExpenseSubCategory(exSubCategory) {
    if (!exSubCategory?.id) {
        errorMsg.value = 'Expense sub-category ID not found.';
        return;
    }

    editingExpenseSubCategoryId.value = exSubCategory.id;

    expenseSubCategoryForm.category_id =
        exSubCategory.category_id ?? '';

    expenseSubCategoryForm.name =
        exSubCategory.name ?? '';

    expenseSubCategoryErrors.value = {};
    errorMsg.value = '';

    isExpenseSubCategoryEditModalOpen.value = true;

    if (!categories.value.length) {
        fetchExpensesCategory();
    }
}


async function updateExpenseSubCategory() {
    const id = editingExpenseSubCategoryId.value;

    if (!id) {
        errorMsg.value = 'Expense sub-category ID not found.';
        return;
    }

    if (updatingExpenseSubCategory.value) {
        return;
    }

    try {
        updatingExpenseSubCategory.value = true;
        expenseSubCategoryErrors.value = {};
        errorMsg.value = '';

        const payload = {
            category_id: expenseSubCategoryForm.category_id,
            name: expenseSubCategoryForm.name.trim(),
        };

        const res = await api.put(
            `/expenses/sub-category/${id}`,
            payload
        );

        if (res.data?.success) {
            successMsg.value =
                res.data.message ||
                'Expense sub-category updated successfully.';

            // Close directly
            isExpenseSubCategoryEditModalOpen.value = false;
            editingExpenseSubCategoryId.value = null;

            expenseSubCategoryForm.category_id = '';
            expenseSubCategoryForm.name = '';
            expenseSubCategoryErrors.value = {};

            await fetchExpensesSubCategory(
                pagination.value?.page || 1
            );
        }

    } catch (err) {
        console.error(
            'Update expense sub-category error:',
            err
        );

        if (err?.response?.status === 422) {
            expenseSubCategoryErrors.value =
                err.response?.data?.errors ?? {};

            return;
        }

        errorMsg.value =
            err?.response?.data?.message ||
            err?.message ||
            'Failed to update expense sub-category.';

    } finally {
        updatingExpenseSubCategory.value = false;
    }
}



function closeExpenseSubCategoryEditModal() {
    if (updatingExpenseSubCategory.value) {
        return;
    }

    isExpenseSubCategoryEditModalOpen.value = false;

    editingExpenseSubCategoryId.value = null;

    expenseSubCategoryForm.category_id = '';
    expenseSubCategoryForm.name = '';

    expenseSubCategoryErrors.value = {};
}
















/* ESC to close drawer */
onMounted(() => {
    fetchExpensesCategory();
    fetchExpensesSubCategory();
});
</script>

<style>

</style>