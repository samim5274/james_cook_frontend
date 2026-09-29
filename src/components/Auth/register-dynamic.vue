<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <Message
                :successMsg="successMsg"
                :errorMsg="errorMsg"
                @update:successMsg="successMsg = $event"
                @update:errorMsg="errorMsg = $event"
            />

            <div class="flex-1 min-w-0">
                <main class="flex-1 min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 lg:px-8 py-6">
                    <!-- Header -->
                    <header class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <button 
                                @click="$router.back()" 
                                class="fixed top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-all group">
                                <div class="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-all">
                                    <i class="fa-solid fa-arrow-left text-sm"></i>
                                </div>
                                <span class="text-sm font-semibold tracking-wide">Go Back</span>
                            </button>
                            <div class="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
                                <i class="fa-solid fa-user-plus"></i>
                                <span>Administration</span>
                            </div>
                            <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create New Profile</h1>
                            <p class="text-slate-500 dark:text-slate-400 mt-1">Register a new member and assign network placement.</p>
                        </div>
                        <div class="flex gap-3">
                            <button @click="CreateUser()" :disabled="loading" 
                                class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50">
                                <i v-if="loading" class="fa-solid fa-circle-notch animate-spin"></i>
                                <i v-else class="fa-solid fa-cloud-arrow-up"></i>
                                {{ loading ? "Processing..." : "Save Profile" }}
                            </button>
                        </div>
                    </header>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                        <!-- Left Column: Form Fields (8 Columns) -->
                        <div class="lg:col-span-8 space-y-6">
                            
                            <Message :successMsg="successMsg" :errorMsg="errorMsg" 
                                @update:successMsg="successMsg = $event" @update:errorMsg="errorMsg = $event" />

                            <!-- Personal Info Card -->
                            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                    <h2 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Basic Information</h2>
                                </div>
                                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Field label="Full Name">
                                        <input v-model="form.name" type="text" required class="input-pro" placeholder="e.g. Rahim Uddin" />
                                    </Field>
                                    <Field label="Phone Number">
                                        <input v-model="form.phone" type="text" required class="input-pro" placeholder="01XXXXXXXXX" />
                                    </Field>
                                    <Field label="Email Address">
                                        <input v-model="form.email" type="email" required class="input-pro" placeholder="name@example.com" />
                                    </Field>
                                    <Field label="Date of Birth">
                                        <input v-model="form.dob" type="date" class="input-pro" />
                                    </Field>
                                    <Field label="Gender">
                                        <select v-model="form.gender" class="input-pro">
                                            <option value="" disabled>Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </Field>
                                    <Field label="Blood Group">
                                        <select v-model="form.blood_group" class="input-pro">
                                            <option value="" disabled>Select Blood Group</option>
                                            <option v-for="bg in ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']" :key="bg">{{bg}}</option>
                                        </select>
                                    </Field>
                                    <Field label="National ID (NID)">
                                        <input v-model="form.national_id" type="text" required class="input-pro" placeholder="123456789" />
                                    </Field>
                                    <Field label="Religion">
                                        <input v-model="form.religion" type="text" class="input-pro" placeholder="Islam/Hinduism..." />
                                    </Field>
                                </div>
                            </div>

                            <!-- Security Card -->
                            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800">
                                    <h2 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Security Credentials</h2>
                                </div>
                                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-1">
                                        <label class="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                                        <div class="relative">
                                            <input 
                                                v-model="form.password" 
                                                :type="showPassword ? 'text' : 'password'"
                                                :class="[
                                                    'w-full px-4 py-2.5 rounded-xl border bg-transparent focus:ring-2 outline-none transition-all dark:text-white',
                                                    form.password_confirmation && !isMatched ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                                                ]" 
                                                required
                                                placeholder="••••••••"
                                            />
                                            <button 
                                                type="button"
                                                @click="showPassword = !showPassword"
                                                class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-500 transition-colors">
                                                <i v-if="!showPassword" class="fa-solid fa-eye h-5 w-5"></i>
                                                <i v-else class="fa-solid fa-eye-slash h-5 w-5"></i>
                                            </button>
                                        </div>
                                        <div class="mt-2 flex flex-wrap gap-2">
                                            <span :class="form.password.length >= 8 ? 'text-green-500' : 'text-slate-400'" class="text-[11px] flex items-center">
                                                <span class="mr-1">●</span> 8+ Digits
                                            </span>
                                            <span :class="/[A-Za-z]/.test(form.password) ? 'text-green-500' : 'text-slate-400'" class="text-[11px] flex items-center">
                                                <span class="mr-1">●</span> Character
                                            </span>
                                            <span :class="/\d/.test(form.password) ? 'text-green-500' : 'text-slate-400'" class="text-[11px] flex items-center">
                                                <span class="mr-1">●</span> Number
                                            </span>
                                            <span :class="/[!@#$%^&*]/.test(form.password) ? 'text-green-500' : 'text-slate-400'" class="text-[11px] flex items-center">
                                                <span class="mr-1">●</span> Special Char
                                            </span>
                                        </div>
                                    </div>

                                    <div class="space-y-1">
                                        <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                                        <div class="relative">
                                            <input 
                                                v-model="form.password_confirmation" 
                                                :type="showPassword ? 'text' : 'password'" 
                                                :class="[
                                                    'w-full px-4 py-2.5 rounded-xl border bg-transparent focus:ring-2 outline-none transition-all dark:text-white',
                                                    form.password_confirmation && !isMatched ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                                                ]" 
                                                required
                                                placeholder="••••••••" 
                                            />
                                            <button 
                                                type="button"
                                                @click="showPassword = !showPassword"
                                                class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-500 transition-colors">
                                                <i v-if="!showPassword" class="fa-solid fa-eye h-5 w-5"></i>
                                                <i v-else class="fa-solid fa-eye-slash h-5 w-5"></i>
                                            </button>
                                        </div>
                                        <p v-if="form.password_confirmation && !isMatched" class="text-xs text-red-500 mt-1">
                                            Passwords do not match.
                                        </p>
                                        <p v-if="form.password_confirmation && isMatched" class="text-xs text-green-500 mt-1">
                                            Passwords matched!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Placement Card -->
                            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div class="px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                    <h2 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Placement & Network</h2>
                                </div>
                                <div class="p-6 space-y-6">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Field label="Referrer Code">
                                            <div class="relative">
                                                <input 
                                                    v-model="form.refer_id" 
                                                    type="text" required
                                                    :readonly="referUser?.user_id"
                                                    class="input-pro font-mono border-dashed" 
                                                    :class="referUser?.user_id ? 'bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed text-indigo-600 dark:text-indigo-400 font-bold' : 'bg-indigo-50/30 dark:bg-indigo-500/5'"
                                                    placeholder="DBMBL-XXXX" 
                                                />
                                                <div v-if="referUser?.user_id" class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                                    <span class="text-[10px] font-bold text-emerald-500 uppercase">Verified</span>
                                                    <i class="fa-solid fa-circle-check text-emerald-500"></i>
                                                </div>
                                            </div>
                                            <p v-if="referUser?.name" class="mt-1 text-[11px] text-slate-500">
                                                Referred by: <span class="font-bold text-slate-700 dark:text-slate-300">{{ referUser.name }}</span>
                                            </p>
                                        </Field>
                                        <Field label="Search Placement User">
                                            <div class="relative flex items-center">
                                                <input 
                                                    type="text" 
                                                    v-model="search" 
                                                    required 
                                                    placeholder="Type User ID to auto-select..." 
                                                    class="input-pro pl-11 w-full border-indigo-100 dark:border-indigo-900/30" 
                                                />
                                            </div>
                                        </Field>
                                    </div>

                                    <Field label="Select Parent Node">
                                        <select v-model="form.root_user_id" required class="input-pro">
                                            <option disabled value="">-- Choose Placement Parent -- </option>
                                            <option v-for="u in filteredRootUsers" :key="u.id" :value="u.id">{{ u.name }} ({{ u.user_id }})</option>
                                        </select>
                                    </Field>

                                    <Field label="Placement">
                                        <div class="grid grid-cols-2 gap-4">
                                            <label :class="[
                                                'relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all duration-300',
                                                selectedRootUser?.left_child_id 
                                                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed' 
                                                    : (placement === 'left' 
                                                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' 
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-500')
                                            ]">
                                                <input type="radio" v-model="placement" value="left" :disabled="selectedRootUser?.left_child_id" class="sr-only" />
                                                
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">A Group</span>
                                                    <div v-if="placement === 'left' && !selectedRootUser?.left_child_id" class="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div class="mt-2 flex items-center gap-1.5">
                                                    <span :class="['h-2 w-2 rounded-full', selectedRootUser?.left_child_id ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse']"></span>
                                                    <span class="text-[10px] font-semibold uppercase tracking-wide" :class="selectedRootUser?.left_child_id ? 'text-rose-500' : 'text-emerald-500'">
                                                        {{ selectedRootUser?.left_child_id ? 'Occupied' : 'Available' }}
                                                    </span>
                                                </div>
                                            </label>

                                            <label :class="[
                                                'relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all duration-300',
                                                selectedRootUser?.right_child_id 
                                                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed' 
                                                    : (placement === 'right' 
                                                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' 
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-slate-500')
                                            ]">
                                                <input type="radio" v-model="placement" value="right" :disabled="selectedRootUser?.right_child_id" class="sr-only" />
                                                
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">B Group</span>
                                                    <div v-if="placement === 'right' && !selectedRootUser?.right_child_id" class="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                <div class="mt-2 flex items-center gap-1.5">
                                                    <span :class="['h-2 w-2 rounded-full', selectedRootUser?.right_child_id ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse']"></span>
                                                    <span class="text-[10px] font-semibold uppercase tracking-wide" :class="selectedRootUser?.right_child_id ? 'text-rose-500' : 'text-emerald-500'">
                                                        {{ selectedRootUser?.right_child_id ? 'Occupied' : 'Available' }}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Avatar & Summary (4 Columns) -->
                        <div class="lg:col-span-4 space-y-6">
                            
                            <!-- Avatar Card -->
                            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center">
                                <div class="relative inline-block group">
                                    <img :src="photoPreview || photoUrl" class="h-32 w-32 rounded-3xl object-cover ring-4 ring-slate-50 dark:ring-slate-800 shadow-xl mx-auto" />
                                    <label class="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <i class="fa-solid fa-camera text-2xl"></i>
                                        <input type="file" @change="onPhotoChange" class="hidden" accept="image/*" />
                                    </label>
                                </div>
                                <h3 class="mt-4 font-bold text-slate-800 dark:text-white">Profile Picture</h3>
                                <p class="text-xs text-slate-500 mt-1">Click to upload JPG, PNG</p>
                            </div>

                            <!-- Product Card -->
                            <div class="bg-indigo-900 rounded-3xl p-6 dark:text-white text-black shadow-xl">
                                <div class="flex items-center gap-3 mb-6">
                                    <div class="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <i class="fa-solid fa-box-open text-indigo-300"></i>
                                    </div>
                                    <div>
                                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Select Package</p>
                                        <h3 class="font-bold">Subscription Product</h3>
                                    </div>
                                </div>
                                <select v-model="form.product_id" class="input">
                                    <option value="" disabled selected>-- Select Product --</option>
                                    <option v-for="product in products" :key="product.id" :value="product.id">
                                        {{ product.id }} - {{ product.name }} - ৳{{ product.price }} - {{ product.point }}
                                    </option>
                                </select>
                                
                                <div v-if="form.product_id" class="space-y-2 pt-4 border-t border-white/10">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-indigo-200">Price</span>
                                        <span class="font-bold text-xl">৳{{ products.find(p => p.id == form.product_id)?.price }}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-indigo-200">Points</span>
                                        <span class="font-medium">{{ products.find(p => p.id == form.product_id)?.point }} PV</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Address Card -->
                            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                                <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">Address Information</h3>
                                <Field label="Present Address">
                                    <textarea v-model="form.present_address" rows="2" class="input-pro text-sm" placeholder="Full address..."></textarea>
                                </Field>
                                <Field label="Permanent Address">
                                    <textarea v-model="form.permanent_address" rows="2" class="input-pro text-sm" placeholder="Full address..."></textarea>
                                </Field>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, h, watch, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api, { makeImg } from "../../services/api.js";

import Message from '../Message/message.vue';

const router = useRouter()
const route = useRoute()

const successMsg = ref('');
const errorMsg = ref('');
const loading = ref(false);


const Field = (props, { slots }) =>
    h("div", { class: props.class || "" }, [
        h("label", { class: "mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200" }, props.label),
        slots.default?.(),
    ]);

const photoFile = ref(null);
const photoPreview = ref("");

function onPhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    photoFile.value = file;
    photoPreview.value = URL.createObjectURL(file);
}

const photoUrl = computed(() => {
    const p = users.value?.photo;
    if (!p) return "/images/avatar.png";
    return makeImg(p);
});













const referUser = ref(null);
async function fetchRefer(){
    try
    {
        loading.value = true;
        errorMsg.value = "";

        const referCode = route.params.refer_code;

        if (!referCode) {
            return;
        }

        const res = await api.get(`/register/get-refer/${referCode}`);
        referUser.value = res.data.data;
        // console.log(referUser.value);
    } catch (error) {
        console.error("Failed to fetch refer user:", error);
        errorMsg.value =
            error?.res?.data?.message ||
            "Unable to fetch referral information.";

    } finally {
        loading.value = false;
    }
}

// referUser আপডেট হলে অটোমেটিক ফর্মে refer_id সেট হবে
watch(() => referUser.value, (newUser) => {
    if (newUser && newUser.user_id) {
        form.value.refer_id = newUser.user_id;
    }
}, { immediate: true });











const users = ref([]);
const loadingUsers = ref(false);
// fetch all admin and customer
async function fetchedUsers() {
    loadingUsers.value = true;
    try {
        const res = await api.get('/register/root-users');
        if (res.data?.success) {
            users.value = res.data.data;
        }
    } catch (err) {
        console.error(err);
    } finally {
        loadingUsers.value = false;
    }
}














const search = ref("");
const filteredRootUsers = computed(() => {
    if (!users.value || !users.value.length) return [];

    const term = search.value.toLowerCase();

    return users.value.filter(user => {
        if (!term) return true;

        return (
            user.name?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term) ||
            user.user_id?.toLowerCase().includes(term) ||
            String(user.id).includes(term)
        );
  });
});

// সার্চ ভ্যালু ওয়াচ করে অটোমেটিক ইউজার সিলেক্ট করা
watch(search, (newVal) => {
    if (!newVal) return;

    const term = newVal.trim().toLowerCase();
    
    // চেক করা হচ্ছে কোনো ইউজারের user_id বা email এর সাথে হুবহু মিলে যায় কি না
    const exactMatch = users.value.find(user => 
        user.user_id?.toLowerCase() === term || 
        user.email?.toLowerCase() === term
    );

    if (exactMatch) {
        // যদি মিলে যায়, তবে root_user_id আপডেট হবে
        form.value.root_user_id = exactMatch.id;
    }
});























const selectedRootUser = computed(() => {
    return users.value.find(u => u.id == form.value.root_user_id) || null;
});



// Set placement
const placement = ref(null);

watch(() => selectedRootUser.value, (newUser) => {
    if (newUser) {
        if (!newUser.left_child_id && newUser.right_child_id) {
            placement.value = 'left';
        } else if (newUser.left_child_id && !newUser.right_child_id) {
            placement.value = 'right';
        } else if (!newUser.left_child_id && !newUser.right_child_id) {
            placement.value = 'left'; 
        } else {
            placement.value = null;
        }
    } else {
        placement.value = null;
    }
}, { immediate: true });

watch(placement, (val) => {
    form.value.position = val;
});

















const emit = defineEmits(['userCreated']);

const form = ref({
    name: "",
    phone: "",
    dob: "",
    email: "",
    gender: "",
    blood_group: "",
    present_address: "",
    permanent_address: "",
    national_id: "",
    religion: "",
    refer_id: "",
    root_user_id: "",
    position: '',
    password: '',
    password_confirmation: '',
    product_id: '',
});

const showPassword = ref(false);

// Password Validation Logic (form.value use koro jodi ref hoy)
const passwordErrors = computed(() => {
    const errors = [];
    const p = form.value.password; // ref hole .value lagbe
    
    if (p.length < 8) errors.push("At least 8 characters long.");
    if (!/[A-Z]/.test(p) && !/[a-z]/.test(p)) errors.push("Include letters.");
    if (!/\d/.test(p)) errors.push("Include at least one number.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(p)) errors.push("Include a special character.");
    
    return errors;
});

const isMatched = computed(() => {
    return form.value.password && form.value.password === form.value.password_confirmation;
});


async function CreateUser() {
    loading.value = true;

    // Simple frontend check
    if(!form.value.email) {
        errorMsg.value = "Email is required";
        loading.value = false;
        return;
    }

    const payload = new FormData();
    Object.keys(form.value).forEach(key => payload.append(key, form.value[key] || ""));
    if(photoFile.value) payload.append("photo", photoFile.value);

    try {
        const res = await api.post("/register/create-user", payload, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        successMsg.value = res.data.message || "User created successfully!";
        
        // fetch users
        emit('userCreated');
        fetchedUsers();
        Object.keys(form.value).forEach(key => form.value[key] = "");
        photoPreview.value = null;
    } catch(err) {
        errorMsg.value = err.response?.data?.message || "Failed to create user";
    } finally {
        loading.value = false;
    }
}


















const products = ref([]);
// fetch all admin and customer
async function fetchProducts() {
    loading.value = true;
    errorMsg.value = '';
    try {
        const res = await api.get('/register/products');
        if (res.data?.success) {
            products.value = res.data.data;
            // console.log(products.value);
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










onMounted(() => {
    fetchRefer();
    fetchedUsers();
    fetchProducts();
});
</script>

<style>
.input{
    @apply w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100;
}
.inputDisabled{
    @apply w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600
        dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300;
}

.input-pro {
    @apply w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
        dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 transition-all duration-200;
}
</style>