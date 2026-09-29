<template>
    <section class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#1F2937] dark:via-[#111827] dark:to-[#0D1117] text-gray-800 dark:text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#16A34A]/30 selection:text-white transition-colors duration-500 font-sans relative overflow-hidden">
        
        <div class="absolute top-[-25%] left-[-15%] w-[600px] h-[600px] bg-[#16A34A]/5 dark:bg-[#16A34A]/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div class="absolute bottom-[-25%] right-[-15%] w-[600px] h-[600px] bg-[#F97316]/5 dark:bg-[#F97316]/10 rounded-full blur-[140px] pointer-events-none"></div>

        <Message
            :successMsg="successMsg"
            :errorMsg="errorMsg"
            @update:successMsg="successMsg = $event"
            @update:errorMsg="errorMsg = $event"
        />

        <div class="w-full max-w-md bg-white dark:bg-[#1F2937]/90 backdrop-blur-2xl rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 relative z-10">
            
        <!-- HEADER AREA -->
        <div class="flex flex-col items-center mb-8 text-center">
            <div class="mb-5 group">
            <!-- Logo Container supporting both modes -->
            <div class="h-20 w-20 bg-gray-50 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:border-[#16A34A]/40">
                <img src="/logo/logo.avif" alt="Logo" class="w-13 h-13 object-contain drop-shadow-sm dark:hidden rounded-2xl" />
                <img src="/logo/white-logo.avif" alt="Logo" class="hidden dark:block w-13 h-13 rounded-2xl object-contain drop-shadow-[0_4px_12px_rgba(22,163,74,0.35)]" />
            </div>
            </div>
            <h3 class="text-2xl font-black text-[#1F2937] dark:text-white tracking-tight uppercase">
            Welcome <span class="text-[#16A34A]">Back</span>
            </h3>
            <p class="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-[0.25em] mt-1.5">Professional Access</p>
        </div>

        <!-- FORM -->
        <form @submit.prevent="handleLogin" class="space-y-5">
            
            <!-- Email Field -->
            <div class="space-y-1.5">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">Email Address</label>
            <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fa-regular fa-envelope text-gray-400 dark:text-gray-500 group-focus-within:text-[#16A34A] transition-colors"></i>
                </div>
                <input
                type="email" v-model.trim="form.email"
                placeholder="name@example.com"
                class="auth-input pl-11 pr-4"
                :class="{ 'border-red-500 bg-red-50 dark:bg-red-500/5 focus:border-red-500': errors.email }"
                />
            </div>
            <p v-if="errors.email" class="text-[11px] text-red-500 dark:text-red-400 font-medium ml-1">{{ errors.email[0] }}</p>
            </div>

            <!-- Password Field -->
            <div class="space-y-1.5">
            <div class="flex justify-between items-center px-1">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Password</label>
                <router-link to="/forget-password" class="text-xs font-bold text-[#16A34A] dark:text-[#22C55E] hover:underline transition-colors">Forgot Password?</router-link>
            </div>
            <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fa-solid fa-lock text-gray-400 dark:text-gray-500 group-focus-within:text-[#16A34A] transition-colors"></i>
                </div>
                <input
                :type="showPassword ? 'text' : 'password'" v-model="form.password"
                placeholder="••••••••"
                class="auth-input pl-11 pr-11"
                :class="{ 'border-red-500 bg-red-50 dark:bg-red-500/5 focus:border-red-500': errors.password }"
                />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1F2937] dark:hover:text-white transition-colors">
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
            </div>
            <p v-if="errors.password" class="text-[11px] text-red-500 dark:text-red-400 font-medium ml-1">{{ errors.password[0] }}</p>
            </div>

            <!-- Remember Me Checkbox -->
            <div class="flex items-center gap-3 px-1 py-0.5">
            <label class="flex items-center gap-3 cursor-pointer group select-none">
                <div class="relative">
                <input v-model="form.remember" type="checkbox" class="peer hidden" />
                <div class="h-5 w-5 rounded-md border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111827] peer-checked:bg-[#16A34A] peer-checked:border-[#16A34A] transition-all"></div>
                <i class="fa-solid fa-check absolute top-1 left-1 text-[11px] text-white opacity-0 peer-checked:opacity-100 transition-all"></i>
                </div>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-[#1F2937] dark:group-hover:text-gray-200 transition-colors">Stay logged in</span>
            </label>
            </div>

            <!-- Submit Button (Orange CTA) -->
            <button
            type="submit" :disabled="loading"
            class="w-full h-13 bg-[#F97316] py-4 text-white font-bold uppercase text-sm tracking-wider rounded-xl hover:bg-[#EA580C] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 shadow-md shadow-[#F97316]/10 flex items-center justify-center gap-3"
            >
            <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            {{ loading ? 'AUTHENTICATING...' : 'SIGN IN' }}
            </button>

            <!-- Divider -->
            <!-- <div class="relative flex items-center gap-4 py-2">
            <div class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
            <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Or connect with</span>
            <div class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
            </div> -->

            <!-- Social Logins (Perfectly adapt to both dark/light backgrounds) -->
            <!-- <div class="grid grid-cols-3 gap-3">
            <button v-for="social in ['google', 'github', 'facebook']" :key="social" type="button" @click="handleSocialLogin(social)"
                class="h-11 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 hover:border-[#16A34A] hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center justify-center group"
            >
                <i :class="`fa-brands fa-${social} text-gray-400 dark:text-gray-500 group-hover:text-[#1F2937] dark:group-hover:text-white transition-colors`"></i>
            </button>
            </div> -->

            <!-- Register Link -->
            <!-- <p class="text-center text-gray-400 dark:text-gray-500 text-sm mt-6">
            New here? 
            <router-link to="/register" class="text-[#1F2937] dark:text-white font-bold hover:text-[#16A34A] dark:hover:text-[#22C55E] transition-colors underline underline-offset-4">Register</router-link>
            </p> -->
        </form>

        <!-- Footer Policy Links -->
        <footer class="mt-8 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between text-[11px] text-gray-400 dark:text-gray-500">
            <router-link to="/privacy-policy" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy Policy</router-link>
            <router-link to="/return-policy" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Return Policy</router-link>
            <router-link to="terms-and-conditions" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms & Conditions</router-link>
            <router-link to="/cookies-settings" class="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Cookies Settings</router-link>
        </footer>

        </div>
    </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../../services/api.js';
import Message from '../Message/message.vue';

const router = useRouter();
const route = useRoute();
const features = ['Enterprise-grade security', 'Cloud-based dashboard', 'Real-time analytics'];

// States
const showPassword = ref(false);
const loading = ref(false);
const successMsg = ref("");
const errorMsg = ref("");
const errors = reactive({});

const form = reactive({
    email: "admin@gmail.com",
    password: "password",
    remember: true
});

// Helper: Get redirect config based on role
const getRoleRedirect = (role) => {
    const configs = {
        'super_admin':  { path: "/super-admin/dashboard", name: "Super Admin" },
        'admin':        { path: "/admin/dashboard",       name: "Admin" },
        'customer':     { path: "/vendor",                name: "Vendor" },
    };
    return configs[role] || { path: "/", name: "User" };
};

const handleLogin = async () => {
    // Reset previous state
    Object.keys(errors).forEach(key => delete errors[key]);
    successMsg.value = errorMsg.value = "";

    if (!form.email || !form.password) {
        errorMsg.value = "Email and password are required.";
        return;
    }

    loading.value = true;

    try {
        const { data } = await api.post("auth/login", form);

        if (!data?.token) throw new Error("Invalid response from server.");

        // Storage persistence
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Role-based Navigation
        const { path, name } = getRoleRedirect(data.user?.role);
        successMsg.value = `Welcome back! Redirecting to ${name} dashboard...`;

        setTimeout(() => router.push(path), 600);

    } catch (err) {
        const response = err.response;
        
        if (response?.status === 422) {
        Object.assign(errors, response.data?.errors || {});
        errorMsg.value = "Please validate your inputs.";
        } else {
        errorMsg.value = response?.data?.message || "Authentication failed. Please try again.";
        }
    } finally {
        loading.value = false;
    }
};

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

<style scoped>
/* Custom Utility for Inputs with Light/Dark support */
.auth-input {
    @apply w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-3.5 pr-4 outline-none transition-all
            text-[#1F2937] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 
            focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white dark:focus:bg-gray-900;
}

/* Animations */
section {
    animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>