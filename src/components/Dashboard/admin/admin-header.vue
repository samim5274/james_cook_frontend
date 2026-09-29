<template>
    <header class="sticky top-0 z-30 border-b backdrop-blur transition-colors duration-300
                bg-white/90 text-slate-900 border-slate-200
                dark:bg-slate-900/90 dark:text-slate-100 dark:border-white/10">
        
        <!-- Main Container -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row lg:items-center lg:h-16 py-3 lg:py-0 gap-3 lg:gap-6">
            
            <!-- Left Side: Desktop Actions Block -->
            <div class="flex items-center justify-between w-full lg:w-auto gap-4">

                <button
                    type="button"
                    aria-label="Toggle sidebar menu"
                    class="flex lg:hidden items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl
                        bg-slate-100 text-slate-700 hover:bg-slate-200
                        dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10
                        transition-colors shrink-0"
                    @click="emit('toggle-menu')">
                    <i class="fa-solid fa-bars text-sm"></i>
                </button>
            
                <!-- Brand Logo -->
                <div class="font-semibold tracking-wide text-lg text-slate-900 dark:text-white shrink-0">
                    <router-link 
                    to="/" aria-label="Go to homepage"
                    class="flex items-center gap-3 group transition-all duration-300 hover:opacity-90">
                    <div class="relative flex items-center justify-center overflow-hidden h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-transform group-hover:scale-105">
                        <img src="/logo/logo.avif" alt="Brand Logo" class="w-7 h-7 object-contain drop-shadow-sm dark:hidden" />
                        <img src="/logo/white-logo.avif" alt="Brand Logo" class="hidden dark:block w-7 h-7 object-contain drop-shadow-[0_4px_10px_rgba(163,217,33,0.3)]" />
                    </div>
                    <span class="text-lg font-black tracking-tighter uppercase text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                        <span class="text-[#F97316]">James Cook</span>
                    </span>
                    </router-link>
                </div>

                <div class="flex items-center gap-1.5 sm:gap-2 lg:hidden">

                    <!-- Theme Toggle -->
                    <ThemeToggle :isDark="isDark" @toggle-theme="$emit('toggle-dark')" />
                    
                    <!-- Mobile Profile Dropdown Wrapper -->
                    <div class="relative">
                        <button
                            class="flex items-center rounded-full p-0.5 transition hover:bg-slate-100 dark:hover:bg-white/10"
                            aria-label="Profile menu"
                            @click.stop="toggleProfile">
                            <img class="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-white/10" :src="avatarUrl" alt="User" />
                        </button>
                    
                        <!-- Dropdown Card for Mobile -->
                        <div
                            v-show="profileOpen"
                            class="absolute z-50 right-0 mt-2 w-52 rounded-xl border shadow-xl overflow-hidden bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-white/10">
                            <div class="px-4 py-2.5 border-b border-slate-200 dark:border-white/10">
                                <div class="text-xs font-semibold truncate">{{ authUser?.name || "Guest User" }}</div>
                            </div>
                            <div class="py-1">
                                <button class="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-white/10" @click="pickProfile('profile')">Profile</button>
                                <button class="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-white/10" @click="pickProfile('accounts')">Account</button>
                                <button v-if="isLoggedIn" class="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-slate-50 dark:text-red-300 dark:hover:bg-white/10 border-t border-slate-100 dark:border-white/5 mt-1" @click="pickProfile('logout')">Logout</button>
                                <button v-else class="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-slate-50 dark:text-red-300 dark:hover:bg-white/10 border-t border-slate-100 dark:border-white/5 mt-1" @click="pickProfile('login')">Login</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Middle: Desktop Actions Block -->
            <div class="w-full flex-1 max-w-2xl mx-auto lg:mx-0">
                <div class="relative group w-full">
                    
                </div>
            </div>

            <!-- Right Side: Desktop Actions Block -->
            <div class="hidden lg:flex items-center gap-3 min-w-[180px] justify-end">
            
                <!-- Theme Toggle -->
                <ThemeToggle :isDark="isDark" @toggle-theme="$emit('toggle-dark')" />

                <!-- Notifications Dropdown -->
                <div class="relative" ref="notifWrap">
                    <button
                        class="relative w-10 h-10 flex items-center justify-center rounded-xl transition
                                bg-slate-100 text-slate-700 hover:bg-slate-200
                                dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                        aria-label="Notifications"
                        @click.stop="toggleNotif">
                        <i class="fa-regular fa-bell"></i>
                        <span v-if="notices.length > 0" class="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                    </button>

                    <!-- Dropdown Card -->
                    <div v-show="notifOpen" 
                        class="absolute z-50 right-0 mt-2 w-80 rounded-xl border shadow-xl overflow-hidden
                                bg-white text-slate-900 border-slate-200
                                dark:bg-slate-900 dark:text-slate-100 dark:border-white/10">
                    
                        <div class="px-4 py-3 border-b border-slate-200 font-semibold dark:border-white/10 flex items-center justify-between">
                            <span>Notifications</span>
                            <span v-if="notices.length > 0" class="text-xs bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                            {{ notices.length }} New
                            </span>
                        </div>
                    
                        <ul class="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
                            
                            <template v-if="notices && notices.length > 0">
                                <li
                                    v-for="notice in notices"
                                    :key="notice.id" 
                                    @click="NoticeDetailsShow(notice)"
                                    :class="[
                                        'relative px-5 py-3.5 cursor-pointer transition-all flex gap-3.5 items-start border-b border-slate-100 dark:border-slate-800/60 last:border-0',
                                        notice.is_read 
                                            ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-75 hover:opacity-100' 
                                            : 'bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40'
                                    ]">
                                    
                                    <!-- Icon Section -->
                                    <div class="flex-shrink-0 mt-0.5">
                                        <span :class="[
                                            'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                                            notice.is_read 
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' 
                                                : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                                        ]">
                                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                            </svg>
                                        </span>
                                    </div>

                                    <!-- Content Section -->
                                    <div class="flex-1 min-w-0 pr-3">
                                        <div class="flex items-center justify-between gap-2">
                                            <p :class="[
                                                'text-sm truncate transition-colors',
                                                notice.is_read 
                                                    ? 'font-medium text-slate-700 dark:text-slate-300' 
                                                    : 'font-bold text-slate-900 dark:text-white'
                                            ]">
                                                {{ notice.title }}
                                            </p>
                                        </div>
                                        
                                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed" 
                                        v-html="notice.description ? notice.description.slice(0, 120) + '...' : ''">
                                        </p>
                                    </div>

                                    <!-- Unread Indicator Dot -->
                                    <div v-if="!notice.is_read" class="flex-shrink-0 self-center">
                                        <span class="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500 inline-block ring-4 ring-indigo-50 dark:ring-indigo-950/50"></span>
                                    </div>
                                </li>
                            </template>

                            <li v-else class="flex flex-col items-center justify-center py-10 px-4 text-center select-none animate-fade-in">
                                <div class="relative flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 text-slate-400 dark:bg-slate-800/40 dark:text-slate-500 mb-3.5 border border-dashed border-slate-200 dark:border-slate-700">
                                    
                                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                    </svg>
                                    
                                    <span class="absolute top-3.5 right-4 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                </div>
                                <p class="text-sm font-medium text-slate-700 dark:text-slate-300">All caught up!</p>
                                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">You have no unread notifications at this time.</p>
                            </li>
                        </ul>

                        <div v-if="notices && notices.length > 0" class="px-4 py-2.5 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900">
                            <button class="w-full text-xs font-medium py-2 rounded-xl transition-all duration-200
                                        bg-slate-900 text-white hover:bg-slate-800
                                        dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15">
                            View all notifications
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Desktop Profile Dropdown -->
                <div class="relative" ref="profileWrap">
                    <button
                        class="ml-1 flex items-center gap-2 rounded-full p-1 pr-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
                        aria-label="Profile menu"
                        @click.stop="toggleProfile">
                        <img class="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-white/10" :src="avatarUrl" alt="User" />
                        <svg class="h-4 w-4 hidden sm:block text-slate-500 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div
                        v-show="profileOpen"
                        class="absolute z-50 right-0 mt-2 w-56 rounded-xl border shadow-xl overflow-hidden
                                bg-white text-slate-900 border-slate-200
                                dark:bg-slate-900 dark:text-slate-100 dark:border-white/10">
                        <div class="px-4 py-3 border-b border-slate-200 dark:border-white/10">
                            <div class="text-sm font-semibold">{{ authUser?.name || "Guest User" }}</div>
                            <div class="text-xs text-slate-500 dark:text-slate-400">{{ authUser?.email || "No email" }}</div>
                        </div>
                        <div class="py-2">
                            <button class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/10" @click="pickProfile('profile')">Profile</button>
                            <!-- <button class="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/10" @click="pickProfile('accounts')">Account</button> -->
                        </div>
                        <div v-if="isLoggedIn" class="border-t border-slate-200 dark:border-white/10">
                            <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:text-red-300 dark:hover:bg-white/10" @click="pickProfile('logout')">
                            Logout
                            </button>
                        </div>
                        <div v-else class="border-t border-slate-200 dark:border-white/10">
                            <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:text-red-300 dark:hover:bg-white/10" @click="pickProfile('login')">
                            Login
                            </button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </header>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import api, { makeImg } from '../../../services/api';
import ThemeToggle from "../../ThemeToggle.vue";

defineProps({
    isDark: { type: Boolean, default: false },
    mobileMenu: { type: Boolean, default: false }
});

const emit = defineEmits(["toggle-menu", "toggle-dark", "search", "profile-action"]);

const router = useRouter();
const loading = ref(false);
const authUser = ref(null);
const isLoggedIn = ref(false);
const q = ref("");

/* dropdown states */
const notifOpen = ref(false);
const profileOpen = ref(false);
const notifWrap = ref(null);
const profileWrap = ref(null);

async function loadAuthUser() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            isLoggedIn.value = false;
            authUser.value = null;
            loading.value = false;
            return;
        }
        const res = await api.get("/user");
        authUser.value = res.data;
        isLoggedIn.value = true;
    } catch (err) {
        isLoggedIn.value = false;
        authUser.value = null;
        localStorage.removeItem("token");
    }
}

const notices = ref([]);
async function loadNotice() {
    try {
        const res = await api.get("/notice/user");
        notices.value = res.data?.data || [];
    } catch (err) {
        console.error("Notification load failed:", err);
    }
}

function NoticeDetailsShow(notice){
    router.push(`/notice/${notice.id}/details`);
}

function toggleNotif() {
    notifOpen.value = !notifOpen.value;
    if (notifOpen.value) profileOpen.value = false;
}

function toggleProfile() {
    profileOpen.value = !profileOpen.value;
    if (profileOpen.value) notifOpen.value = false;
}

function closeAll() {
    notifOpen.value = false;
    profileOpen.value = false;
}

async function pickProfile(action) {
    console.log("profile action:", action);
    closeAll(); 
    if (action === "profile") {
        return router.push("/admin/profile");
    }
    if (action === "accounts") {
        return router.push("/setting"); 
    }
    if (action === "login") {
        return router.push("/login"); 
    }
    if (action === "logout") {
        try {
            loading.value = true;
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed API side:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            authUser.value = null;   
            isLoggedIn.value = false;
            router.push("/"); 
        }
    }
}

const defaultAvatar = "/images/avatar.png";
const avatarUrl = computed(() => {
    const photo = authUser.value?.photo;
    return photo ? makeImg(photo) : defaultAvatar;
});

/* click outside -> close */
function onDocClick(e) {
    const t = e.target;
    const inNotif = notifWrap.value?.contains(t);
    const inProfile = profileWrap.value?.contains(t);
    if (!inNotif && !inProfile) closeAll();
}

/* ESC -> close */
function onKey(e) {
    if (e.key === "Escape") closeAll();
}


























// search section
const searchInput = ref(null);
const isMac = ref(false);

// Ctrl+K / Cmd+K 
function handleKeyDown(e) {
  // Mac-এর Meta (Cmd) এবং Windows-এর Ctrl চেক করা
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); // Browser default behave stop
        searchInput.value?.focus();
    }
}





const suggestions = ref({
    products: [],
    categories: [],
    brands: [],
});

let timeout = null;

watch(q, (value) => {

    clearTimeout(timeout);

    timeout = setTimeout(async () => {

        if (value.length < 2) {
            suggestions.value = {
                products: [],
                categories: [],
                brands: [],
            };
            return;
        }

        try {
            const { data } = await api.get('/search/suggestions', {
                params: {
                    q: value
                }
            });
            suggestions.value = data;
        } catch (e) {
            console.error(e);
            suggestions.value = {
                products: [],
                categories: [],
                brands: [],
            };
        }

    }, 300);

});

const clearSuggestions = () => {
    suggestions.value = {
        products: [],
        categories: [],
        brands: [],
    };

    q.value = '';
}

const defaultProductImage = "/images/product/default-product.webp"
const getProductImage = (product) => {
    if (!product || !product.images || product.images.length === 0) {
        return defaultProductImage;
    }
    const primaryImg = product.images.find(i => i.is_primary == 1);
    const selectedImg = primaryImg || product.images[0];
    return selectedImg.url ? selectedImg.url : defaultProductImage;
}

// Go to search
function goSearch() {

    const keyword = q.value.trim();

    if (!keyword) return;

    router.push({
        path: '/search',
        query: {
            q: keyword,
            page: 1
        }
    });

    clearSuggestions();

}
















onMounted(async () => {
    loadAuthUser();
    

    try {
        const token = localStorage.getItem("token");
        if (!token) return;
    } catch (error) {
        console.error('Navbar cart error:', error)
    }  

    document.addEventListener("click", onDocClick);
    window.addEventListener("keydown", onKey);

    isMac.value = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocClick);
    window.removeEventListener("keydown", onKey);

    window.removeEventListener('keydown', handleKeyDown);
});
</script>