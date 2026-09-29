<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <HeaderSection
            :is-dark="isDark"
            @toggle-dark="toggleDarkMode"
            @toggle-menu="toggleMenu"
        />

        <div class="flex min-h-[calc(100vh-56px)]">
            <Navbar
                :mobile-menu="mobileMenu"
                @close="mobileMenu = false"
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
                    <div class="mx-auto px-4 sm:px-6 lg:px-8 pt-5">

                        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white"><i class="fa-solid fa-calendar-plus"></i> Product Setting</h2>

                        <div class="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                            <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                                <div>
                                    <h2 class="text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                        Brand Management
                                    </h2>
                                    <p class="text-xs text-slate-400 mt-1">Total registered active/inactive brands</p>
                                </div>
                                
                                <div class="flex items-center gap-3">
                                    <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 whitespace-nowrap">
                                        {{ brands.length }} Brands
                                    </span>
                                    
                                    <button @click="openAddBrandModal" class="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200">
                                        <i class="fa-solid fa-plus h-3.5 w-3.5"></i>
                                        Add Brand
                                    </button>
                                </div>
                            </div>

                            <Teleport to="body">
                                <Transition 
                                    enter-active-class="transition duration-300 ease-out"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition duration-200 ease-in"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div v-if="isBrandModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                                    
                                        <div 
                                            @click.stop 
                                            class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                            
                                            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Create New Brand</h3>
                                                <button @click="isBrandModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                    <i class="fa-solid fa-x h-6 w-6"></i>
                                                </button>
                                            </div>

                                            <div class="p-6 space-y-4">
                                                
                                                <!-- Brand Input -->
                                                <div>
                                                    <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Brand
                                                    </label>

                                                    <input
                                                        v-model="brand"
                                                        type="text"
                                                        required
                                                        placeholder="Enter brand name"
                                                        class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    >
                                                </div>

                                                <div class="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">Active Status</span>
                                                        <span class="text-xs text-slate-500 dark:text-slate-400">If active, this notice will be immediately broadcasted to all active channels.</span>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        @click="isActive = !isActive"
                                                        :class="isActive ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'"
                                                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                                                    >
                                                        <span 
                                                            :class="isActive ? 'translate-x-5' : 'translate-x-0'"
                                                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                        ></span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                                                <button
                                                    @click="isBrandModalOpen = false"
                                                    class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                                    Cancel
                                                </button>

                                                <button
                                                    @click="submitBrand" :disabled="loading"
                                                    class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
                                                    <span v-if="loading">Saving...</span>
                                                    <span v-else>Save</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </Teleport>

                            <Teleport to="body">
                                <Transition 
                                    enter-active-class="transition duration-300 ease-out"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition duration-200 ease-in"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div v-if="isBrandEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                                    
                                        <div 
                                            @click.stop 
                                            class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                            
                                            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Edit Brand</h3>
                                                <button @click="isBrandEditModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                    <i class="fa-solid fa-x h-6 w-6"></i>
                                                </button>
                                            </div>

                                            <div class="p-6 space-y-4">
                                                
                                                <!-- Brand Input -->
                                                <div>
                                                    <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Brand
                                                    </label>

                                                    <input
                                                        v-model="brand"
                                                        type="text"
                                                        required
                                                        placeholder="Enter brand name"
                                                        class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    >
                                                </div>

                                                <div class="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">Active Status</span>
                                                        <span class="text-xs text-slate-500 dark:text-slate-400">If active, this notice will be immediately broadcasted to all active channels.</span>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        @click="isActive = !isActive"
                                                        :class="isActive ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'"
                                                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                                                    >
                                                        <span 
                                                            :class="isActive ? 'translate-x-5' : 'translate-x-0'"
                                                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                        ></span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                                                <button
                                                    @click="isBrandEditModalOpen = false"
                                                    class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                                    Cancel
                                                </button>

                                                <button
                                                    @click="submitEditBrand" :disabled="loading"
                                                    class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
                                                    <span v-if="loading">
                                                        <i class="fa-solid fa-spinner fa-spin mr-1"></i>
                                                        Updating...
                                                    </span>
                                                    <span v-else>Save Changes</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </Teleport>

                            <div class="overflow-x-auto max-h-[700px]">
                                <table class="min-w-full text-sm">
                                    <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th class="px-6 py-4 text-left font-bold">ID</th>
                                            <th class="px-6 py-4 text-left font-bold">Brand Name</th>
                                            <th class="px-6 py-4 text-left font-bold">Slug / Code</th>
                                            <th class="px-6 py-4 text-left font-bold">Status</th>
                                            <th class="px-6 py-4 text-right font-bold">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                        <tr v-for="brand in brands" :key="brand.id" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                                            <td class="px-6 py-4 text-xs font-mono font-bold text-slate-400">
                                                #{{ brand.id }}
                                            </td>
                                            
                                            <td class="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {{ brand.name }}
                                            </td>

                                            <td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                                {{ brand.slug || brand.name.toLowerCase().replace(/ /g, '-') }}
                                            </td>

                                            <td class="px-6 py-4">
                                                <span :class="brand.is_active ?? true ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'"
                                                    class="px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                                                    <span class="h-1 w-1 rounded-full" :class="brand.is_active ?? true ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                                                    {{ (brand.is_active ?? true) ? 'Active' : 'Inactive' }}
                                                </span>
                                            </td>

                                            <td class="px-6 py-4 text-right whitespace-nowrap">
                                                <div class="flex items-center justify-end gap-2">
                                                    <button @click="openEditBrandModal(brand)" class="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:border-indigo-500/30 shadow-sm transition-colors" title="Edit">
                                                        <i class="fa-solid fa-pen-to-square h-3.5 w-3.5 flex items-center justify-center"></i>
                                                    </button>
                                                    <button @click="deleteBrand(brand.id)" class="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:border-rose-500/30 shadow-sm transition-colors" title="Delete">
                                                        <i class="fa-solid fa-trash h-3.5 w-3.5 flex items-center justify-center"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr v-if="!brands || brands.length === 0">
                                            <td colspan="5" class="px-6 py-12 text-center text-slate-400 italic">
                                                No brands found. Please add a new brand.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                            <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                                <div>
                                    <h2 class="text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                        Category
                                    </h2>
                                    <p class="text-xs text-slate-400 mt-1">Structure of main categories and sub-branches</p>
                                </div>
                                
                                <div class="flex items-center gap-3">
                                    <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 whitespace-nowrap">
                                        {{ categories.length }} Categories
                                    </span>
                                    
                                    <button @click="openAddCategoryModal" class="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200">
                                        <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                        </svg>
                                        Add Category
                                    </button>
                                </div>
                            </div>

                            <Teleport to="body">
                                <Transition 
                                    enter-active-class="transition duration-300 ease-out"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition duration-200 ease-in"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div v-if="isCategoryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                                    
                                        <div 
                                            @click.stop 
                                            class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                            
                                            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Create New Category</h3>
                                                <button @click="isCategoryModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                    <i class="fa-solid fa-x h-6 w-6"></i>
                                                </button>
                                            </div>

                                            <div class="p-6 space-y-4">
                                                
                                                <!-- Category Input -->
                                                <div>
                                                    <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Category
                                                    </label>

                                                    <input
                                                        v-model="category"
                                                        type="text"
                                                        required
                                                        placeholder="Enter category name"
                                                        class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    >
                                                </div>

                                                <div class="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">Active Status</span>
                                                        <span class="text-xs text-slate-500 dark:text-slate-400">If active, this notice will be immediately broadcasted to all active channels.</span>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        @click="isActive = !isActive"
                                                        :class="isActive ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'"
                                                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                                                    >
                                                        <span 
                                                            :class="isActive ? 'translate-x-5' : 'translate-x-0'"
                                                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                        ></span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                                                <button
                                                    @click="isCategoryModalOpen = false"
                                                    class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                                    Cancel
                                                </button>

                                                <button
                                                    @click="submitCategory" :disabled="loading"
                                                    class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
                                                    <span v-if="loading">Saving...</span>
                                                    <span v-else>Save</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </Teleport>

                            <Teleport to="body">
                                <Transition 
                                    enter-active-class="transition duration-300 ease-out"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition duration-200 ease-in"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div v-if="isCategoryEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                                    
                                        <div 
                                            @click.stop 
                                            class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                            
                                            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Edit Category</h3>
                                                <button @click="isCategoryEditModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                    <i class="fa-solid fa-x h-6 w-6"></i>
                                                </button>
                                            </div>

                                            <div class="p-6 space-y-4">
                                                
                                                <!-- Category Input -->
                                                <div>
                                                    <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Category
                                                    </label>

                                                    <input
                                                        v-model="category"
                                                        type="text"
                                                        required
                                                        placeholder="Enter category name"
                                                        class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    >
                                                </div>

                                                <div class="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">Active Status</span>
                                                        <span class="text-xs text-slate-500 dark:text-slate-400">If active, this notice will be immediately broadcasted to all active channels.</span>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        @click="isActive = !isActive"
                                                        :class="isActive ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'"
                                                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                                                    >
                                                        <span 
                                                            :class="isActive ? 'translate-x-5' : 'translate-x-0'"
                                                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                        ></span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                                                <button
                                                    @click="isCategoryEditModalOpen = false"
                                                    class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                                    Cancel
                                                </button>

                                                <button
                                                    @click="submitEditCategory()" :disabled="loading"
                                                    class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
                                                    <span v-if="loading">Saving...</span>
                                                    <span v-else>Save</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </Teleport>

                            <div class="overflow-x-auto max-h-[700px] rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <table class="w-full min-w-[700px] text-sm text-left border-collapse">
                                    <!-- Table Header -->
                                    <thead class="bg-slate-50 dark:bg-slate-800/60">
                                        <tr>
                                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Slug</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Description</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                            <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                                        </tr>
                                    </thead>

                                    <!-- Table Body -->
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                        <tr
                                            v-for="category in categories"
                                            :key="category.id"
                                            class="group hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-all duration-200">
                                            <!-- Category -->
                                            <td class="px-6 py-5">
                                                <div class="flex flex-col">
                                                    <h3
                                                        class="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                                        {{ category.name }}
                                                    </h3>
                                                    <span class="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">
                                                        Category ID #{{ category.id }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Slug -->
                                            <td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                                {{ category.slug || category.name.toLowerCase().replace(/ /g, '-') }}
                                            </td>

                                            <!-- Description -->
                                            <td class="px-6 py-5 max-w-xs">
                                                <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2"
                                                    :title="category.description">
                                                    {{ category.description || 'No description available' }}
                                                </p>
                                            </td>

                                            <!-- Status -->
                                            <td class="px-6 py-5">
                                                <span
                                                    v-if="category.is_active"
                                                    class="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Active
                                                </span>

                                                <span
                                                    v-else
                                                    class="inline-flex items-center gap-2 rounded-full bg-rose-50 dark:bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                                                    <span class="h-2 w-2 rounded-full bg-rose-500"></span>
                                                    Inactive
                                                </span>
                                            </td>

                                            <!-- Actions -->
                                            <td class="px-6 py-5 text-right">
                                                <div class="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                                                    <!-- Edit -->
                                                    <button
                                                        @click="editCategory(category)"
                                                        class="px-3 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 transition">
                                                        <i class="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                    <div class="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                                                    <!-- Delete -->
                                                    <button
                                                        @click="deleteCategory(category.id)"
                                                        class="px-3 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition">
                                                        <i class="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        <!-- Empty State -->
                                        <tr v-if="!categories || categories.length === 0">
                                            <td colspan="5" class="py-20">
                                                <div class="flex flex-col items-center justify-center">
                                                    <div
                                                        class="w-20 h-20 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <i class="fa-solid fa-folder-open text-3xl text-slate-400"></i>
                                                    </div>

                                                    <h3 class="mt-5 text-lg font-semibold text-slate-800 dark:text-slate-100">
                                                        No Categories Found
                                                    </h3>

                                                    <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
                                                        Start by creating your first category to organize products
                                                        efficiently and improve inventory management.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div class="rounded-2xl mt-4 border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                            <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                                <div>
                                    <h2 class="text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                                    Sub Category
                                    </h2>
                                    <p class="text-xs text-slate-400 mt-1">Structure of main sub-branches</p>
                                </div>
                                
                                <div class="flex items-center gap-3">
                                    <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 whitespace-nowrap">
                                        {{ subcategories.length }} Sub-Categories
                                    </span>
                                    
                                    <button @click="openAddSubCategoryModal" class="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200">
                                        <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                        </svg>
                                        Add Sub-Category
                                    </button>
                                </div>
                            </div>

                            <Teleport to="body">
                                <Transition 
                                    enter-active-class="transition duration-300 ease-out"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition duration-200 ease-in"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div v-if="isSubCategoryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                                    
                                        <div 
                                            @click.stop 
                                            class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                            
                                            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Create New Sub-Category</h3>
                                                <button @click="isSubCategoryModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                    <i class="fa-solid fa-x h-6 w-6"></i>
                                                </button>
                                            </div>

                                            <div class="p-6 space-y-4">

                                                <!-- Category Select -->
                                                <div>
                                                    <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Category
                                                    </label>
                                                    <select
                                                        v-model="selectedCategory"
                                                        class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                                                        <option value="" selected disabled>-- Select Category --</option>
                                                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                                                    </select>
                                                </div>
                                                
                                                <!-- Sub-Category Input -->
                                                <div>
                                                    <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Sub-Category
                                                    </label>

                                                    <input
                                                        v-model="subCategory"
                                                        type="text"
                                                        required
                                                        placeholder="Enter sub-category name"
                                                        class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    >
                                                </div>

                                                <div class="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">Active Status</span>
                                                        <span class="text-xs text-slate-500 dark:text-slate-400">If active, this notice will be immediately broadcasted to all active channels.</span>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        @click="isActive = !isActive"
                                                        :class="isActive ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'"
                                                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                                                    >
                                                        <span 
                                                            :class="isActive ? 'translate-x-5' : 'translate-x-0'"
                                                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                        ></span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                                                <button
                                                    @click="isSubCategoryModalOpen = false"
                                                    class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                                    Cancel
                                                </button>

                                                <button
                                                    @click="submitSubCategory" :disabled="loading"
                                                    class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
                                                    <span v-if="loading">Saving...</span>
                                                    <span v-else>Save</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </Teleport>

                            <Teleport to="body">
                                <Transition 
                                    enter-active-class="transition duration-300 ease-out"
                                    enter-from-class="opacity-0"
                                    enter-to-class="opacity-100"
                                    leave-active-class="transition duration-200 ease-in"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0">
                                    <div v-if="isSubCategoryEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                                    
                                        <div 
                                            @click.stop 
                                            class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                            
                                            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Edit Sub-Category</h3>
                                                <button @click="isSubCategoryEditModalOpen = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                    <i class="fa-solid fa-x h-6 w-6"></i>
                                                </button>
                                            </div>

                                            <div class="p-6 space-y-4">

                                                <!-- Category Select -->
                                                <div>
                                                    <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Category
                                                    </label>
                                                    <select
                                                        v-model="selectedCategory"
                                                        class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                                                        <option value="" selected disabled>-- Select Category --</option>
                                                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                                                    </select>
                                                </div>
                                                
                                                <!-- Sub-Category Input -->
                                                <div>
                                                    <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        Sub-Category
                                                    </label>

                                                    <input
                                                        v-model="subCategory"
                                                        type="text"
                                                        required
                                                        placeholder="Enter sub-category name"
                                                        class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    >
                                                </div>

                                                <div class="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-slate-900 dark:text-white">Active Status</span>
                                                        <span class="text-xs text-slate-500 dark:text-slate-400">If active, this notice will be immediately broadcasted to all active channels.</span>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        @click="isActive = !isActive"
                                                        :class="isActive ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'"
                                                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                                                    >
                                                        <span 
                                                            :class="isActive ? 'translate-x-5' : 'translate-x-0'"
                                                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                        ></span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                                                <button
                                                    @click="isSubCategoryEditModalOpen = false"
                                                    class="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                                    Cancel
                                                </button>

                                                <button
                                                    @click="submitEditSubCategory" :disabled="loading"
                                                    class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
                                                    <span v-if="loading">Saving...</span>
                                                    <span v-else>Save</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </Teleport>

                            <div class="overflow-x-auto max-h-[700px] rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <table class="w-full min-w-[700px] text-sm text-left border-collapse">
                                    <!-- Table Header -->
                                    <thead class="bg-slate-50 dark:bg-slate-800/60">
                                        <tr>
                                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Sub-Category</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Slug</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Description</th>
                                            <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                            <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                                        </tr>
                                    </thead>

                                    <!-- Table Body -->
                                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                        <tr
                                            v-for="subCategory in subcategories"
                                            :key="subCategory.id"
                                            class="group hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 transition-all duration-200">
                                            <!-- Category -->
                                            <td class="px-6 py-5">
                                                <div class="flex flex-col">
                                                    <h3
                                                        class="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                                        {{ subCategory.name }}
                                                    </h3>
                                                    <span class="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">
                                                        Sub-Category ID #{{ subCategory.id }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Category -->
                                            <td class="px-6 py-5">
                                                <div class="flex">
                                                    <span
                                                        class="inline-flex items-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                                        {{ subCategory.category.name }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Slug -->
                                            <td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                                {{ subCategory.slug || subCategory.name.toLowerCase().replace(/ /g, '-') }}
                                            </td>

                                            <!-- Description -->
                                            <td class="px-6 py-5 max-w-xs">
                                                <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2"
                                                    :title="subCategory.description">
                                                    {{ subCategory.description || 'No description available' }}
                                                </p>
                                            </td>

                                            <!-- Status -->
                                            <td class="px-6 py-5">
                                                <span
                                                    v-if="subCategory.is_active"
                                                    class="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Active
                                                </span>

                                                <span
                                                    v-else
                                                    class="inline-flex items-center gap-2 rounded-full bg-rose-50 dark:bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                                                    <span class="h-2 w-2 rounded-full bg-rose-500"></span>
                                                    Inactive
                                                </span>
                                            </td>

                                            <!-- Actions -->
                                            <td class="px-6 py-5 text-right">
                                                <div class="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                                                    <!-- Edit -->
                                                    <button
                                                        @click="editSubCategory(subCategory)"
                                                        class="px-3 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 transition">
                                                        <i class="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                    <div class="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                                                    <!-- Delete -->
                                                    <button
                                                        @click="deleteSubCategory(subCategory.id)"
                                                        class="px-3 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition">
                                                        <i class="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        <!-- Empty State -->
                                        <tr v-if="!subcategories || subcategories.length === 0">
                                            <td colspan="5" class="py-20">
                                                <div class="flex flex-col items-center justify-center">
                                                    <div
                                                        class="w-20 h-20 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <i class="fa-solid fa-folder-open text-3xl text-slate-400"></i>
                                                    </div>

                                                    <h3 class="mt-5 text-lg font-semibold text-slate-800 dark:text-slate-100">
                                                        No Sub-Categories Found
                                                    </h3>

                                                    <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
                                                        Start by creating your first category to organize products
                                                        efficiently and improve inventory management.
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
            </div>
        </div>
        
    </div>
    <FooterSection />
</template>

<script setup>
import { ref, onMounted } from 'vue'
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


const router = useRouter();
const successMsg = ref('');
const errorMsg = ref('');
const loading = ref(false);
const active = ref('dashboard');








// get category
const categories = ref([]);
async function fetchCategories(){
    try{
        const res = await api.get('/products/get-categories')
        categories.value = res.data.data;
    }catch(err){
        console.error('Failed to fetch categories:', err)
    }
}

// get subcategory
const subcategories = ref([]);
async function fetchSubCategories(){
    try{
        const res = await api.get('/products/get-subcategories')
        subcategories.value = res.data.data;
    }catch(err){
        console.error('Failed to fetch subcategories:', err)
    }
}

// get brand
const brands = ref([]);
async function fetchBrands(){
    try{
        const res = await api.get('/products/get-brands')
        brands.value = res.data.data;
    }catch(err){
        console.error('Failed to fetch brands:', err)
    }
}














// Brand create modal
const isBrandModalOpen = ref(false);
const isBrandEditModalOpen = ref(false);
const selectedBrand = ref(null);
const brand = ref('');
const isActive = ref(true);

function openAddBrandModal() {
    brand.value = '';
    isActive.value = true;
    isBrandModalOpen.value = true;
}

function openEditBrandModal(item) {
    selectedBrand.value = item;
    brand.value = item.name;
    isActive.value = Boolean(item.is_active);
    isBrandEditModalOpen.value = true;

    errorMsg.value = null;
    successMsg.value = null;
}

async function submitBrand() {

    if (!brand.value) {
        errorMsg.value = 'Please enter a valid brand'
        return
    }

    loading.value = true;
    errorMsg.value = null;
    successMsg.value = null;

    try{
        const response = await api.post('/products/create-brand', {
            name: brand.value.trim(),
            is_active: isActive.value
        });

        if (response.data.success) {
            successMsg.value = response.data.message;
            fetchBrands();
            brand.value = '';
            isBrandModalOpen.value = false; 
        } else {
            errorMsg.value = response.data.message
        }

    } catch(err) {
        console.error('Submit Brands Error:', err);

        errorMsg.value =
            err?.response?.data?.message ||
            'Something went wrong while connecting to the server.';
    } finally {
        loading.value = false;
    }

}

// Delete brand
async function deleteBrand(brandId)
{
    const confirmed = window.confirm(
        'Are you sure you want to delete this brand? This action cannot be undone.'
    );

    if (!confirmed) {
        return;
    }

    loading.value = true;
    errorMsg.value = null;
    successMsg.value = null;

    try{
        const response = await api.delete(`/products/delete-brand/${brandId}`);

        if (response.data.success) {
            successMsg.value = response.data.message;
            fetchBrands();
        } else {
            errorMsg.value = response.data.message
        }

    } catch(err) {
        console.error('Delete Error:', err);

        errorMsg.value =
            err?.response?.data?.message ||
            'Something went wrong while connecting to the server.';
    } finally {
        loading.value = false;
    }
}

async function submitEditBrand() {

    if (!selectedBrand.value) {
        errorMsg.value = 'Brand not found.';
        return;
    }

    if (!brand.value?.trim()) {
        errorMsg.value = 'Brand name is required.';
        return;
    }

    loading.value = true;
    errorMsg.value = null;
    successMsg.value = null;

    try{
        const response = await api.put(`/products/edit-brand/${selectedBrand.value.id}`, {
            name: brand.value.trim(),
            is_active: isActive.value
        });

        if (response.data.success) {
            successMsg.value = response.data.message;
            fetchBrands();
            isBrandEditModalOpen.value = false;
        } else {
            errorMsg.value = response.data.message
        }

    } catch(err) {
        console.error('Update Error:', err);

        errorMsg.value =
            err?.response?.data?.message ||
            'Something went wrong while connecting to the server.';
    } finally {
        loading.value = false;
    }
}








// Category create modal
const isCategoryModalOpen = ref(false);
const isCategoryEditModalOpen = ref(false);
const selectedCategory = ref(null);
const category = ref('');

function openAddCategoryModal() {
    category.value = '';
    isActive.value = true;
    isCategoryModalOpen.value = true;
}

function editCategory(item) {
    selectedCategory.value = item;
    category.value = item.name;
    isActive.value = Boolean(item.is_active);
    isCategoryEditModalOpen.value = true;
}

async function submitCategory() {

    if (!category.value) {
        errorMsg.value = 'Please enter a valid category'
        return
    }

    loading.value = true;
    errorMsg.value = null;
    successMsg.value = null;

    try{
        const response = await api.post('/products/create-category', {
            name: category.value.trim(),
            is_active: isActive.value
        });

        if (response.data.success) {
            successMsg.value = response.data.message;
            fetchCategories();
            category.value = '';
            isCategoryModalOpen.value = false; 
        } else {
            errorMsg.value = response.data.message
        }

    } catch(err) {
        console.error('Submit Category Error:', err);

        errorMsg.value =
            err?.response?.data?.message ||
            'Something went wrong while connecting to the server.';
    } finally {
        loading.value = false;
    }

}

async function deleteCategory(categoryId)
{
    const confirmed = window.confirm(
        'Are you sure you want to delete this category? This action cannot be undone.'
    );

    if (!confirmed) {
        return;
    }

    loading.value = true;
    errorMsg.value = null;
    successMsg.value = null;

    try{
        const response = await api.delete(`/products/delete-category/${categoryId}`);

        if (response.data.success) {
            successMsg.value = response.data.message;
            fetchCategories();
        } else {
            errorMsg.value = response.data.message
        }

    } catch(err) {
        console.error('Delete Error:', err);

        errorMsg.value =
            err?.response?.data?.message ||
            'Something went wrong while connecting to the server.';
    } finally {
        loading.value = false;
    }
}

async function submitEditCategory() {

    if (!selectedCategory.value) {
        errorMsg.value = 'Category not found.';
        return;
    }

    if (!category.value?.trim()) {
        errorMsg.value = 'Category name is required.';
        return;
    }

    loading.value = true;
    errorMsg.value = null;
    successMsg.value = null;

    try {
        const response = await api.put(
            `/products/edit-category/${selectedCategory.value.id}`,
            {
                name: category.value.trim(),
                is_active: isActive.value
            }
        );
        if (response.data.success) {
            successMsg.value = response.data.message;
            await fetchCategories();
            isCategoryEditModalOpen.value = false;
        } else {
            errorMsg.value = response.data.message;
        }
    } catch (err) {
        console.error('Update Error:', err);
        if (err.response?.status === 422) {
            const errors = err.response.data.errors;
            errorMsg.value = Object.values(errors).flat().join(', ');
        } else {
            errorMsg.value =
                err?.response?.data?.message ||
                'Something went wrong while connecting to the server.';
        }
    } finally {
        loading.value = false;
    }
}







// Category create modal
const isSubCategoryModalOpen = ref(false);
const isSubCategoryEditModalOpen = ref(false);
const selectedSubCategory = ref(null);
const subCategory = ref('');

function openAddSubCategoryModal() {
    selectedCategory.value = '';
    subCategory.value = '';
    isActive.value = true;
    isSubCategoryModalOpen.value = true;
}

function editSubCategory(item) {
    selectedSubCategory.value = item;
    selectedCategory.value = item.category_id;
    subCategory.value = item.name;
    isActive.value = Boolean(item.is_active);
    isSubCategoryEditModalOpen.value = true;
}

async function submitSubCategory() {

    if (!subCategory.value?.trim()) {
        errorMsg.value = 'Sub-category name is required.';
        return;
    }

    if (!selectedCategory.value) {
        errorMsg.value = 'Please select a category.';
        return;
    }

    loading.value = true;
    errorMsg.value = null;
    successMsg.value = null;

    try {

        const payload = {
            name: subCategory.value.trim(),
            category_id: Number(selectedCategory.value),
            is_active: isActive.value ? 1 : 0
        };

        const response = await api.post('/products/create-sub-category', payload);

        if (response.data.success) {

            successMsg.value = response.data.message;

            await fetchSubCategories();

            isSubCategoryModalOpen.value = false;

            // reset
            selectedCategory.value = '';
            subCategory.value = '';
            isActive.value = true;

        } else {
            errorMsg.value = response.data.message;
        }

    } catch (err) {

        console.error('SubCategory Error FULL:', err.response?.data || err);

        if (err.response?.status === 422) {
            errorMsg.value = Object.values(err.response.data.errors).flat().join(', ');
        } else {
            errorMsg.value =
                err?.response?.data?.message ||
                'Server error occurred.';
        }

    } finally {
        loading.value = false;
    }
}

async function deleteSubCategory(subCategoryId){
    const confirmed = window.confirm(
        'Are you sure you want to delete this sub-category? This action cannot be undone.'
    );

    if (!confirmed) {
        return;
    }

    loading.value = true;
    errorMsg.value = null;
    successMsg.value = null;

    try{
        const response = await api.delete(`/products/delete-sub-category/${subCategoryId}`);

        if (response.data.success) {
            successMsg.value = response.data.message;
            fetchSubCategories();
        } else {
            errorMsg.value = response.data.message;
        }

    } catch(err) {
        console.error('Delete Error:', err);

        errorMsg.value =
            err?.response?.data?.message ||
            'Something went wrong while connecting to the server.';
    } finally {
        loading.value = false;
    }
}

async function submitEditSubCategory() {

    if (!selectedSubCategory.value) {
        errorMsg.value = 'Sub-category not found.';
        return;
    }

    if (!subCategory.value?.trim()) {
        errorMsg.value = 'Sub-category name is required.';
        return;
    }

    if (!selectedCategory.value) {
        errorMsg.value = 'Please select a category.';
        return;
    }

    loading.value = true;
    errorMsg.value = null;
    successMsg.value = null;

    try {

        const response = await api.put(
            `/products/edit-sub-category/${selectedSubCategory.value.id}`,
            {
                name: subCategory.value.trim(),
                category_id: selectedCategory.value,  
                is_active: isActive.value
            }
        );

        if (response.data.success) {

            successMsg.value = response.data.message;

            await fetchSubCategories();

            isSubCategoryEditModalOpen.value = false;

            // reset
            selectedSubCategory.value = null;
            selectedCategory.value = '';
            subCategory.value = '';
            isActive.value = true;

        } else {
            errorMsg.value = response.data.message;
        }

    } catch (err) {

        console.error('Update Error:', err.response?.data || err);

        if (err.response?.status === 422) {
            errorMsg.value = Object.values(err.response.data.errors).flat().join(', ');
        } else {
            errorMsg.value =
                err?.response?.data?.message ||
                'Something went wrong while connecting to the server.';
        }

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
    fetchCategories();
    fetchBrands();
    fetchSubCategories();




    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") sidebarOpen.value = false;
    });
    const saved = localStorage.getItem("theme");
    if (saved === "dark") applyTheme(true);
    else if (saved === "light") applyTheme(false);
    else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
});
</script>

<style scoped>

</style>

