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
                @close="mobileMenu = false" />

            <Message
                :successMsg="successMsg"
                :errorMsg="errorMsg"
                @update:successMsg="successMsg = $event"
                @update:errorMsg="errorMsg = $event"
            />

            <!-- Content -->
            <div class="min-h-screen w-full bg-gray-50 dark:bg-slate-950 transition-colors duration-200 p-6">
                <div class="mx-auto bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-4">

                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <i class="fa-solid fa-dolly"></i> Notice Details
                        </h2>

                        <!-- <div>
                            <button 
                                @click="openCreateModal" 
                                class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400">
                                <i class="fa-regular fa-calendar-plus"></i>
                                Create Notice
                            </button>
                        </div> -->
                    </div>

                    <input type="search" v-model="searchQuery" @input="onSearch" placeholder="Search products..." class="mb-4 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-blue-400 dark:focus:ring-blue-900/30">
                    
                    <div class="overflow-x-auto max-h-[800px] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                        <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead class="bg-slate-50 dark:bg-slate-900">
                                <tr>
                                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 sm:pl-6">Notice Title</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">Type</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">Publish Date</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">Status</th>
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"><span class="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                                <tr v-if="loading" class="w-full flex flex-col items-center justify-center py-20">
                                    <div class="animate-spin h-10 w-10 border-4 border-[#A3D921] border-t-transparent rounded-full"></div>
                                    <p class="mt-4 text-sm text-gray-500">Updating Tree...</p>
                                </tr>

                                    <tr v-for="notice in filterNotice" :key="notice.id" 
                                    class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        
                                        <!-- Title & Description -->
                                        <td @click="NoticeDetailsShow(notice)" class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                            <div class="font-medium text-slate-900 dark:text-slate-100 hover:underline cursor-pointer">{{ notice.title }}</div>
                                            <div class="text-slate-500 dark:text-slate-400 max-w-xs truncate hover:underline cursor-pointer" :title="notice.description">
                                                {{ notice.description }}
                                            </div>
                                        </td>
                                        
                                        <!-- Type -->
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span class="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                                                {{ notice.notice_type }}
                                            </span>
                                        </td>
                                        
                                        <!-- Publish Date -->
                                        <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            <i class="fa-regular fa-calendar-days"></i>
                                            {{ formatDate(notice.publish_date) }}
                                        </td>

                                        <!-- Status -->
                                        <td class="whitespace-nowrap px-3 py-4 text-sm">
                                            <span v-if="notice.is_active" class="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">Active</span>
                                            <span v-else class="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-900/30 px-2 py-1 text-xs font-medium text-rose-700 dark:text-rose-400">Inactive</span>
                                        </td>
                                        
                                        <!-- Actions -->
                                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <div class="flex justify-end gap-3">
                                                <button @click="NoticeDetailsShow(notice)" 
                                                class="text-amber-600 dark:text-amber-400 hover:text-amber-900">
                                                    <i class="fa-regular fa-eye"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr v-if="filterNotice.length === 0">
                                        <td colspan="6" class="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400 italic">
                                        No notices match your search criteria.
                                        </td>
                                    </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <FooterSection />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
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

const loading = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const active = ref('dashboard');



// get notice
const notices = ref([]);
const searchQuery = ref('');
async function fetchNotice(){
    loading.value = true;
    errorMsg.value = '';

    try{
        const res = await api.get('/notice/user');
        notices.value = res.data.data || res.data;
        // console.log(notices.value)
    }catch(err){
        console.error('Failed to fetch notice:', err);
        errorMsg.value = err.response?.data?.message || 'Failed to load notice.';
    } finally{
        loading.value = false;
    }
}

// filter notice by search query
const filterNotice = computed(() => {
    if (!searchQuery.value) return notices.value; // fixed: notice -> notices

    const q = searchQuery.value.toLowerCase();
    return notices.value.filter(n => 
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.description && n.description.toLowerCase().includes(q))
    );
});

// Date time
const formatDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString; 

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
};






function NoticeDetailsShow(notice){
    router.push(`/notice/${notice.id}/details`);
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

    fetchNotice();


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