<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <Header
        @open-sidebar="sidebarOpen = true"
        @search="onSearch"
        :isDark="isDark" @toggle-theme="toggleTheme"
        />

        <div class="flex  min-h-[calc(100vh-56px)]">
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
                <main class="flex-1 min-h-screen min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 lg:px-8 py-6 transition-colors duration-300">

                    <div>
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div class="flex items-center gap-4">
                                <button @click="$router.back()" class="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
                                    <i class="fa-solid fa-arrow-left-long h-5 w-5 text-slate-600 dark:text-slate-400"></i>
                                </button>
                                <div>
                                    <h1 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    Customer <span class="text-indigo-600 dark:text-indigo-400">#{{ customer?.user_id || "User" }}</span>
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div v-if="customer" class="grid grid-cols-1 gap-6">
                            <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                            
                            <div class="h-20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20"></div>

                            <div class="px-6 pb-6">
                                <div class="relative -mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                                <div class="relative">
                                    <img v-if="customer?.photo" :src="photoUrl" alt="Customer" 
                                        class="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-lg ring-1 ring-slate-200 dark:border-slate-900 dark:ring-slate-700"/>
                                    
                                    <div v-else class="h-20 w-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30">
                                        {{ customer?.name.substring(0, 2).toUpperCase() }}
                                    </div>

                                    <div v-if="customer?.is_active" 
                                        class="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500 dark:border-slate-900" 
                                        title="Active Now"></div>
                                </div>
                                
                                <div class="mb-1 flex-1">
                                    <h2 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {{ customer?.name }}
                                    </h2>
                                    <div class="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <span class="font-medium">{{ customer?.email }}</span>
                                    <span v-if="customer?.email" 
                                            :class="customer?.email_verified_at ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'" 
                                            class="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
                                        <i class="fa-solid" :class="customer?.email_verified_at ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
                                        {{ customer?.email_verified_at ? 'Verified' : 'Unverified' }}
                                    </span>
                                    </div>
                                </div>

                                <div class="mb-1">
                                    <span class="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                                    <i class="fa-solid fa-user-shield mr-2"></i>
                                    {{ customer?.role || 'Customer' }}
                                    </span>
                                </div>
                                </div>

                                <div class="mt-6 flex flex-wrap gap-3 border-y border-slate-100 py-4 dark:border-slate-800">
                                <div class="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/50">
                                    <div class="h-2 w-2 rounded-full" :class="customer?.is_active ? 'bg-emerald-500' : 'bg-red-500'"></div>
                                    <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ customer?.is_active ? 'Account Active' : 'Account Disabled' }}</span>
                                </div>

                                <div class="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/50">
                                    <i class="fa-solid text-xs" :class="customer?.is_profile_completed ? 'fa-check-double text-indigo-500' : 'fa-triangle-exclamation text-amber-500'"></i>
                                    <span class="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        {{ customer?.is_profile_completed ? 'Profile Completed' : 'Incomplete Profile' }}
                                    </span>
                                </div>
                                </div>

                                <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                <InfoRow label="Phone" icon="fa-phone">
                                    <div class="flex items-center gap-2">
                                    <span class="font-bold">{{ customer?.phone || 'N/A' }}</span>
                                    <span v-if="customer?.phone" 
                                            :class="customer?.phone_verified_at ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'" 
                                            class="rounded px-1.5 py-0.5 text-[10px] font-black uppercase">
                                        {{ customer?.phone_verified_at ? 'Verified' : 'Unverified' }}
                                    </span>
                                    </div>
                                </InfoRow>

                                <InfoRow label="Personal Info" icon="fa-user-tag">
                                    <span class="font-bold tracking-tight">
                                        {{ customer?.gender || 'N/A' }} • {{ customer?.blood_group || 'N/A' }} • {{ customer?.religion || 'N/A' }}
                                    </span>
                                </InfoRow>

                                <InfoRow label="Birthday" icon="fa-cake-candles">
                                    <span class="font-bold">{{ formatOnlyDate(customer?.dob) }}</span>
                                </InfoRow>

                                <InfoRow label="National ID" icon="fa-id-card">
                                    <span class="font-bold">{{ customer?.national_id || 'N/A' }}</span>
                                </InfoRow>

                                <div class="mt-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
                                    <p class="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Security & Access</p>
                                    <div class="space-y-3">
                                    <div class="flex justify-between text-xs">
                                        <span class="text-slate-500">Last Login:</span>
                                        <span class="font-bold text-slate-700 dark:text-slate-200">{{ formatDateTime(customer?.last_login_at) }}</span>
                                    </div>
                                    <div class="flex justify-between text-xs">
                                        <span class="text-slate-500">Access IP:</span>
                                        <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ customer?.last_login_ip || '0.0.0.0' }}</span>
                                    </div>
                                    </div>
                                </div>
                                </div>

                            </div>
                            </section>
                        </div>
                    </div>
                        
                </main>
            </div>
        </div>
        
    </div>



</template>

<script setup>
import { onMounted, ref, computed, h } from "vue";
import { useRouter, useRoute } from "vue-router";
import api, {makeImg} from '../../../services/api';

import Navbar from '../admin/admin-navbar.vue';
import Header from '../admin/admin-header.vue';
import Message from '../../Message/message.vue';

const sidebarOpen = ref(false);
const active = ref("dashboard");

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const successMsg = ref('');
const errorMsg = ref('');








// =============================
// Get customer
// =============================
const customer = ref(null);
async function fetchCustomerDetails(){
    loading.value = true;
    try{
        const userId = route.params.user_id;
        if (!userId) {
            errorMsg.value = "Invalid user !.";
            return;
        }

        const res = await api.get(`/orders/customer/${route.params.user_id}`);
        customer.value = res.data.data;
        // console.log(customer.value);
    } catch (err) {
        errorMsg.value =
            err.response?.data?.message ||
            err.message ||
            "Something went wrong while fetching customer details.";

        console.log(err);
    } finally {
        loading.value = false;
    }
}


const photoUrl = computed(() => {
    const p = customer.value?.photo;
    if (!p) return "/images/avatar.png";
    return makeImg(p);
});



/** small inline components */
const InfoRow = (props, { slots }) => h(
    "div",
    { class: "flex items-center justify-between p-1 group" },
    [
        h("div", { class: "flex items-center gap-3 text-slate-500 dark:text-slate-400" }, [
            props.icon ? h("i", { class: `fa-solid ${props.icon} w-4 text-[12px] opacity-70` }) : null,
            h("span", { class: "text-xs font-medium uppercase tracking-tight" }, props.label)
        ]),
        h("div", { class: "text-sm text-slate-900 dark:text-slate-100" }, slots.default?.() || props.value)
    ]
);

function formatOnlyDate(d) {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatDateTime(date) {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
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

function onSearch(q) {
    console.log("search:", q);
}



/* ESC to close drawer */
onMounted(() => {

    fetchCustomerDetails();
    
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

<style>

</style>