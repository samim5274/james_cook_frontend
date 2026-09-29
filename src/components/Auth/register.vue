<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#1F2937] dark:via-[#111827] dark:to-[#0D1117] text-gray-800 dark:text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#16A34A]/30 selection:text-white transition-colors duration-500 font-sans relative overflow-hidden">

        <!-- Background Glow Accents -->
        <div class="absolute top-[-25%] left-[-15%] w-[600px] h-[600px] bg-[#16A34A]/5 dark:bg-[#16A34A]/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div class="absolute bottom-[-25%] right-[-15%] w-[600px] h-[600px] bg-[#F97316]/5 dark:bg-[#F97316]/10 rounded-full blur-[140px] pointer-events-none"></div>

        <!-- Notification Message Component -->
        <Message
            :successMsg="successMsg"
            :errorMsg="errorMsg"
            @update:successMsg="successMsg = $event"
            @update:errorMsg="errorMsg = $event"
        />

        <!-- Main Wrapper Card -->
        <div class="w-full max-w-7xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 relative z-10">
            
            <!-- Page Header Section -->
            <header class="mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    <!-- Left Section: Back Button, Logo & Title Info -->
                    <div class="flex items-start gap-4 sm:gap-5">
                        <!-- Brand / Application Logo -->
                        <div class="h-20 w-20 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:border-[#16A34A]/40">
                            <img src="/logo/logo.avif" alt="Logo" class="w-13 h-13 object-contain drop-shadow-sm rounded-2xl dark:hidden" />
                            <img src="/logo/white-logo.avif" alt="Logo" class="hidden dark:block w-13 h-13 rounded-2xl object-contain drop-shadow-[0_4px_12px_rgba(22,163,74,0.35)]" />
                        </div>

                        <!-- Header Titles & Navigation -->
                        <div class="space-y-1">
                            <!-- Back Action -->
                            <button 
                                @click="$router.back()" 
                                class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors group">
                                <i class="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-0.5"></i>
                                <span>Go Back</span>
                            </button>

                            <!-- Main Title -->
                            <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Create New Profile
                            </h1>

                            <!-- Subtitle / Meta -->
                            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                Register a new member and assign network placement.
                            </p>
                        </div>
                    </div>

                    <!-- Right Section: Header Actions -->
                    <div class="flex items-center gap-3 self-end md:self-center shrink-0">
                        <!-- Cancel / Reset Button -->
                        <button 
                            type="button" 
                            @click="$router.back()"
                            class="px-4 py-2.5 text-xs font-medium  text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border dark:border-slate-700">
                            Cancel
                        </button>
                    </div>

                </div>
            </header>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
                <!-- Left Column: Form Fields (8 Columns) -->
                <div class="lg:col-span-8 space-y-6">

                    <!-- Basic Information Card -->
                    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
                        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                            <h2 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                <i class="fa-regular fa-id-card text-emerald-600 dark:text-emerald-400"></i>
                                Basic Information
                            </h2>
                        </div>
                        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <!-- Full Name -->
                            <div>
                                <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Full Name</label>
                                <input v-model="form.name" type="text" required class="input-pro" placeholder="e.g. Rahim Uddin" />
                            </div>

                            <!-- Phone Number -->
                            <div>
                                <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Phone Number</label>
                                <input v-model="form.phone" type="text" required class="input-pro" placeholder="01XXXXXXXXX" />
                            </div>

                            <!-- Email Address -->
                            <div>
                                <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Email Address</label>
                                <input v-model="form.email" type="email" required class="input-pro" placeholder="name@example.com" />
                            </div>

                            <!-- Date of Birth -->
                            <div>
                                <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Date of Birth</label>
                                <input v-model="form.dob" type="date" class="input-pro" />
                            </div>

                            <!-- Gender -->
                            <div>
                                <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Gender</label>
                                <select v-model="form.gender" class="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-orange-500/20 focus:border-emerald-500 dark:focus:border-orange-500 text-slate-800 dark:text-slate-100 transition-all cursor-pointer">
                                    <option value="" disabled>-- Select Gender --</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <!-- Blood Group -->
                            <div>
                                <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Blood Group</label>
                                <select v-model="form.blood_group" class="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-orange-500/20 focus:border-emerald-500 dark:focus:border-orange-500 text-slate-800 dark:text-slate-100 transition-all cursor-pointer">
                                    <option value="" disabled>-- Select Blood Group --</option>
                                    <option v-for="bg in ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']" :key="bg">{{bg}}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Security Credentials Card -->
                    <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
                        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                            <h2 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                <i class="fa-solid fa-lock text-emerald-600 dark:text-emerald-400"></i>
                                Security Credentials
                            </h2>
                        </div>
                        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <!-- Password Field -->
                            <div class="space-y-1.5">
                                <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                                <div class="relative">
                                    <input 
                                        v-model="form.password" 
                                        :type="showPassword ? 'text' : 'password'"
                                        :class="[
                                            'w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900/50 text-sm outline-none transition-all dark:text-white',
                                            form.password_confirmation && !isMatched ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:focus:border-orange-500 dark:focus:ring-orange-500/20'
                                        ]" 
                                        required
                                        placeholder="••••••••"
                                    />
                                    <button 
                                        type="button"
                                        @click="showPassword = !showPassword"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-600 transition-colors">
                                        <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-xs"></i>
                                    </button>
                                </div>
                                <div class="pt-2 flex flex-wrap gap-x-3 gap-y-1">
                                    <span :class="form.password.length >= 8 ? 'text-emerald-500' : 'text-slate-400'" class="text-[11px] font-medium flex items-center gap-1">
                                        <i class="fa-solid fa-circle text-[6px]"></i> 8+ Digits
                                    </span>
                                    <span :class="/[A-Za-z]/.test(form.password) ? 'text-emerald-500' : 'text-slate-400'" class="text-[11px] font-medium flex items-center gap-1">
                                        <i class="fa-solid fa-circle text-[6px]"></i> Letters
                                    </span>
                                    <span :class="/\d/.test(form.password) ? 'text-emerald-500' : 'text-slate-400'" class="text-[11px] font-medium flex items-center gap-1">
                                        <i class="fa-solid fa-circle text-[6px]"></i> Numbers
                                    </span>
                                    <span :class="/[!@#$%^&*]/.test(form.password) ? 'text-emerald-500' : 'text-slate-400'" class="text-[11px] font-medium flex items-center gap-1">
                                        <i class="fa-solid fa-circle text-[6px]"></i> Special
                                    </span>
                                </div>
                            </div>

                            <!-- Confirm Password Field -->
                            <div class="space-y-1.5">
                                <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                                <div class="relative">
                                    <input 
                                        v-model="form.password_confirmation" 
                                        :type="showPassword ? 'text' : 'password'" 
                                        :class="[
                                            'w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-900/50 text-sm outline-none transition-all dark:text-white',
                                            form.password_confirmation && !isMatched ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:focus:border-orange-500 dark:focus:ring-orange-500/20'
                                        ]" 
                                        required
                                        placeholder="••••••••" 
                                    />
                                    <button 
                                        type="button"
                                        @click="showPassword = !showPassword"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-600 transition-colors">
                                        <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-xs"></i>
                                    </button>
                                </div>
                                <p v-if="form.password_confirmation && !isMatched" class="text-xs text-red-500 font-medium pt-1 flex items-center gap-1">
                                    <i class="fa-solid fa-triangle-exclamation"></i> Passwords do not match.
                                </p>
                                <p v-if="form.password_confirmation && isMatched" class="text-xs text-emerald-500 font-medium pt-1 flex items-center gap-1">
                                    <i class="fa-solid fa-circle-check"></i> Passwords matched!
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Right Column: Avatar & Address (4 Columns) -->
                <div class="lg:col-span-4 space-y-6">
    
                    <!-- Avatar Upload Card -->
                    <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 text-center shadow-sm">
                        <div class="relative inline-block group">
                            <img :src="photoPreview || photoUrl || 'https://via.placeholder.com/150'" class="h-28 w-28 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 shadow-md mx-auto transition-transform duration-300 group-hover:scale-105" />
                            <label class="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
                                <i class="fa-solid fa-camera text-xl mb-1"></i>
                                <span class="text-[10px] font-bold uppercase tracking-wider">Change</span>
                                <input type="file" @change="onPhotoChange" class="hidden" accept="image/*" />
                            </label>
                        </div>
                        <h3 class="mt-4 font-bold text-sm text-slate-800 dark:text-slate-100">Profile Picture</h3>
                        <p class="text-xs text-slate-400 mt-0.5">JPG, PNG or WEBP (Max 2MB)</p>
                    </div>

                    <!-- Address Card -->
                    <div class="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-4 shadow-sm">
                        <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                            <i class="fa-solid fa-location-dot text-emerald-600 dark:text-emerald-400"></i>
                            Address Information
                        </h3>
                        
                        <!-- Present Address -->
                        <div>
                            <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Present Address</label>
                            <textarea v-model="form.present_address" rows="2" class="input-pro text-sm resize-none" placeholder="House, Road, Area..."></textarea>
                        </div>

                        <!-- Permanent Address -->
                        <div>
                            <label class="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200">Permanent Address</label>
                            <textarea v-model="form.permanent_address" rows="2" class="input-pro text-sm resize-none" placeholder="House, Road, Area..."></textarea>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div>
                        <button @click="CreateUser()" :disabled="loading" 
                            class="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 dark:bg-orange-500 hover:dark:bg-orange-700 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-md shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                            <i v-if="loading" class="fa-solid fa-circle-notch animate-spin text-xs"></i>
                            <i v-else class="fa-solid fa-cloud-arrow-up text-xs"></i>
                            <span>{{ loading ? "Processing..." : "Create Profile" }}</span>
                        </button>
                    </div>

                </div>
            </div>

            <!-- Divider -->
            <!-- <div class="relative flex items-center gap-4 py-2">
                <div class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
                <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Or connect with</span>
                <div class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
            </div> -->

            <!-- Social Logins (Perfectly adapt to both dark/light backgrounds) -->
            <!-- <div class="grid grid-cols-3 gap-3">
                <button v-for="social in ['google', 'github', 'facebook']" :key="social" type="button" @click="handleSocialLogin(social)"
                    class="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 hover:border-[#16A34A] hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center justify-center group">
                    <i :class="`fa-brands fa-${social} text-gray-400 dark:text-gray-500 group-hover:text-[#1F2937] dark:group-hover:text-white transition-colors`"></i>
                </button>
            </div> -->

            <footer class="mt-8 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between text-[11px] text-gray-400 dark:text-gray-500">
                <router-link to="/privacy-policy" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy Policy</router-link>
                <router-link to="/return-policy" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Return Policy</router-link>
                <router-link to="terms-and-conditions" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms & Conditions</router-link>
                <router-link to="/cookies-settings" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Cookies Settings</router-link>
            </footer>

        </div>

        
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api, { makeImg } from "../../services/api.js";

import Message from '../Message/message.vue';

const router = useRouter()
const route = useRoute()

const successMsg = ref('');
const errorMsg = ref('');
const loading = ref(false);

const photoFile = ref(null);
const photoPreview = ref("");

function onPhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    photoFile.value = file;
    photoPreview.value = URL.createObjectURL(file);
}

const photoUrl = computed(() => {
    if (photoPreview.value) {
        return photoPreview.value;
    }

    return "/images/avatar.png";
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
    password: '',
    password_confirmation: '',
});

const showPassword = ref(false);


const passwordErrors = computed(() => {
    const errors = [];
    const p = form.value.password;
    
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

        Object.keys(form.value).forEach(key => form.value[key] = "");
        photoPreview.value = null;
    } catch(err) {
        errorMsg.value = err.response?.data?.message || "Failed to create user";
    } finally {
        loading.value = false;
    }
}











const API_URL = import.meta.env.VITE_STORAGE_URL;
const handleSocialLogin = (provider) => {
    window.location.href = `${API_URL}/auth/${provider}/redirect`;
};

onMounted(() => {
    if (route.query.error) {
        errorMsg.value = decodeURIComponent(route.query.error);
    }
});
</script>

<style>
.input{
    @apply w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100;
}

.input-pro {
    @apply w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 dark:focus:border-orange-500 dark:focus:ring-orange-500/20;
}
</style>