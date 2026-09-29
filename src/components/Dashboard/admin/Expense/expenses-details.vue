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
                <main class="flex-1 min-h-screen min-w-0 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-6 transition-colors">
                    
                    <!-- Header & Navigation -->
                    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 shadow-xs">
                                <i class="fa-solid fa-file-invoice-dollar text-lg"></i>
                            </div>
                            <div>
                                <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Expense Details
                                </h1>
                                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    View and manage financial expense transaction records.
                                </p>
                            </div>
                        </div>

                        <div>
                            <button 
                                @click="router.back()" 
                                class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-transparent dark:border-slate-700 transition-all active:scale-95"
                            >
                                <i class="fa-solid fa-arrow-left-long"></i>
                                <span>Back</span>
                            </button>
                        </div>
                    </div>

                    <!-- Main Expense Card -->
                    <section class="rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">

                        <!-- Top Bar -->
                        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-6 py-5 bg-slate-50/60 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800">
                            <div class="min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">
                                        EXP-{{ expenseDetails?.id || '0000' }}
                                    </span>
                                </div>

                                <h2 class="mt-1 text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                                    {{ expenseDetails?.title || "Expense Title" }}
                                </h2>

                                <!-- Badges -->
                                <div class="mt-2.5 flex flex-wrap items-center gap-2">
                                    <span class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white dark:bg-slate-800 dark:border-slate-700/80 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
                                        <i class="fa-regular fa-calendar text-slate-400 dark:text-slate-500"></i>
                                        {{ expenseDetails?.date ? formatDate(expenseDetails.date) : "-" }}
                                    </span>

                                    <span class="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200/60 bg-indigo-50/80 dark:bg-indigo-500/10 dark:border-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-2xs">
                                        <i class="fa-solid fa-layer-group text-indigo-500 dark:text-indigo-400"></i>
                                        {{ expenseDetails?.category?.name || "N/A" }}
                                    </span>

                                    <span v-if="expenseDetails?.subcategory?.name" class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-100/80 dark:bg-slate-800/80 dark:border-slate-700/80 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
                                        <i class="fa-solid fa-tag text-slate-400 dark:text-slate-500"></i>
                                        {{ expenseDetails.subcategory.name }}
                                    </span>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex items-center gap-2.5 sm:justify-end shrink-0">
                                <button
                                    type="button"
                                    @click="printExpense(expenseDetails?.id)"
                                    class="h-10 inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-800 dark:border-slate-700 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-2xs transition-all active:scale-95"
                                >
                                    <i class="fa-solid fa-print text-slate-400 dark:text-slate-400"></i>
                                    <span>Print</span>
                                </button>

                                <!-- <button
                                    type="button"
                                    @click="deleteExpense()"
                                    class="h-10 inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 dark:bg-rose-600/90 dark:hover:bg-rose-500 px-4 text-xs font-semibold text-white shadow-xs transition-all active:scale-95"
                                >
                                    <i class="fa-solid fa-trash-can"></i>
                                    <span>Delete</span>
                                </button> -->
                            </div>
                        </div>

                        <!-- Body Section -->
                        <div class="p-6 space-y-6">

                            <!-- Amount Highlight Banner -->
                            <div class="rounded-2xl border border-rose-200/70 bg-gradient-to-r from-rose-50/50 via-white to-rose-50/20 dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900 dark:border-rose-900/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                                <div>
                                    <p class="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                                        Total Expenses Amount
                                    </p>
                                    <p class="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                        Recorded transaction amount deducted from total accounts.
                                    </p>
                                </div>

                                <div class="sm:text-right">
                                    <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">CURRENCY (BDT)</p>
                                    <p class="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 leading-none tracking-tight">
                                        ৳{{ Number(expenseDetails?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}
                                    </p>
                                </div>
                            </div>

                            <!-- Info Grid -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                <!-- Metadata Card -->
                                <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5">
                                    <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <i class="fa-solid fa-circle-info text-indigo-500"></i>
                                        General Information
                                    </h3>

                                    <div class="space-y-3.5 text-xs sm:text-sm">
                                        <div class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                                            <span class="text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
                                                <i class="fa-regular fa-folder text-slate-400 dark:text-slate-500 w-4"></i> Category
                                            </span>
                                            <span class="font-semibold text-slate-800 dark:text-slate-200">
                                                {{ expenseDetails?.category?.name || "N/A" }}
                                            </span>
                                        </div>

                                        <div class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                                            <span class="text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
                                                <i class="fa-solid fa-tags text-slate-400 dark:text-slate-500 w-4"></i> Subcategory
                                            </span>
                                            <span class="font-semibold text-slate-800 dark:text-slate-200">
                                                {{ expenseDetails?.subcategory?.name || "N/A" }}
                                            </span>
                                        </div>

                                        <div class="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                                            <span class="text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
                                                <i class="fa-regular fa-calendar-days text-slate-400 dark:text-slate-500 w-4"></i> Expense Date
                                            </span>
                                            <span class="font-semibold text-slate-800 dark:text-slate-200">
                                                {{ expenseDetails?.date ? formatDate(expenseDetails.date) : "N/A" }}
                                            </span>
                                        </div>

                                        <div class="flex items-center justify-between py-1.5">
                                            <span class="text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
                                                <i class="fa-regular fa-user text-slate-400 dark:text-slate-500 w-4"></i> Recorded By
                                            </span>
                                            <span class="font-semibold text-slate-800 dark:text-slate-200">
                                                {{ expenseDetails?.user?.name || "System Admin" }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Remark / Note Card -->
                                <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 flex flex-col">
                                    <h3 class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <i class="fa-regular fa-note-sticky text-indigo-500"></i>
                                        Remark & Notes
                                    </h3>

                                    <div class="flex-1 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 p-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {{ expenseDetails?.remark || "No additional remark or note was added to this expense record." }}
                                    </div>
                                </div>

                            </div>

                        </div>

                    </section>

                </main>
            </div>
        </div>
        <FooterSection />

    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from 'vue-router'
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
const route = useRoute();
const successMsg = ref('');
const errorMsg = ref('');
const loading = ref(false);



const isExpenseModalOpen = ref(false);
const savingExpense = ref(false);

const expenseForm = reactive({
    category_id: '',
    sub_category_id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    remark: '',
});

const expenseErrors = ref({});







const expenseDetails = ref(null);

async function fetchExpense() {
    try {
        loading.value = true;
        errorMsg.value = "";

        const id = route.params.id;
        if (!id) {
            errorMsg.value = "Expense ID not found.";
            return;
        }

        const res = await api.get(`/expenses/details/${id}`);
        expenseDetails.value = res.data?.data ?? null;
    } catch (err) {
        console.error("Fetch expense error:", err);

        const msg =
            err?.response?.data?.message ||
            Object.values(err?.response?.data?.errors || {})?.[0]?.[0] ||
            "Failed to load expense details.";

        errorMsg.value = msg;

        expenseDetails.value = null;

    } finally {
        loading.value = false;
    }
}








function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);

    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}











function printExpense(id){
    if (!id) return;
    
    const win = window.open("about:blank", "_blank");

    if (!win) {
        alert("Popup blocked!");
        return;
    }

    const url = `/admin/expenses/print/${id}`;
    // console.log("button clicked", url);

    win.location.href = url;
    win.focus();
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
    fetchExpense();


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