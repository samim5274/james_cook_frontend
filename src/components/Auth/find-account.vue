<template>
  <section class="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center px-4 py-12 selection:bg-[#A3D921] selection:text-black">
    <Message
      v-if="successMsg || errorMsg"
      :successMsg="successMsg"
      :errorMsg="errorMsg"
      @update:successMsg="successMsg = $event"
      @update:errorMsg="errorMsg = $event"
    />

    <div class="w-full max-w-5xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] border border-slate-800 shadow-2xl bg-[#111a3e]/40 backdrop-blur-sm">
      
      <div class="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-[#111a3e] to-[#0f172a] border-r border-slate-800">
        <div class="mb-10">
          <div class="h-16 w-16 bg-[#A3D921] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-[#A3D921]/20 group hover:rotate-6 transition-all">
            <i class="fa-solid fa-key text-black text-2xl"></i>
          </div>
          <h2 class="text-4xl lg:text-5xl font-black text-white leading-tight">
            Account <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#A3D921] to-[#639d00]">Recovery.</span>
          </h2>
          <p class="text-slate-400 mt-6 text-lg leading-relaxed">
            Don't worry! Enter your registered email address and we'll help you find your account and reset your password.
          </p>
        </div>

        <div class="space-y-5">
          <div v-for="item in ['Secure OTP Verification', 'Quick Password Reset', '24/7 Account Protection']" :key="item" class="flex items-center gap-4 group">
            <div class="h-6 w-6 rounded-full bg-[#A3D921]/10 flex items-center justify-center group-hover:bg-[#A3D921]/20 transition">
              <i class="fa-solid fa-shield-check text-[#A3D921] text-xs"></i>
            </div>
            <span class="text-sm font-semibold text-slate-300 tracking-wide">{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="p-8 lg:p-12 bg-[#111a3e]/60 backdrop-blur-xl">
        
        <div class="flex flex-col items-center mb-10 text-center">
          <div class="mb-6 group">
            <div class="h-24 w-24 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl transition-all duration-500 hover:scale-105">
              <img src="/logo/white-logo.avif" alt="Logo" class="w-16 h-16 object-contain drop-shadow-[0_5px_15px_rgba(163,217,33,0.3)]" />
            </div>
          </div>
          <h3 class="text-3xl font-black text-white tracking-tighter uppercase italic">
            Find <span class="text-[#A3D921]">Account</span>
          </h3>
          <p class="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Recovery Service</p>
        </div>

        <form @submit.prevent="FindLogin" class="space-y-6">
          
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Registered Email</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fa-regular fa-envelope text-slate-500 group-focus-within:text-[#A3D921] transition-colors"></i>
              </div>
              
              <input
                type="email"
                v-model.trim="email"
                placeholder="you@example.com"
                class="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-100 
                       placeholder:text-slate-600 outline-none transition-all duration-300
                       focus:ring-2 focus:ring-[#A3D921]/10 focus:border-[#A3D921] focus:bg-slate-900"
                :class="{ 'border-red-500/50 bg-red-500/5': errors.email }"
              />
            </div>
            <p v-if="errors.email" class="text-[11px] text-red-400 font-medium ml-1">{{ errors.email[0] }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-14 bg-[#A3D921] text-black font-black rounded-2xl hover:bg-[#b4ec2b] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-xl shadow-[#A3D921]/10 flex items-center justify-center gap-3"
          >
            <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-magnifying-glass text-sm"></i>
            {{ loading ? 'SEARCHING...' : 'FIND ACCOUNT' }}
          </button>

          <div class="space-y-4 pt-4">
            <p class="text-center text-slate-500 text-sm">
              Remembered your password? 
              <router-link to="/login" class="text-white font-bold hover:text-[#A3D921] transition">Login</router-link>
            </p>
            
            <div class="relative flex items-center gap-4">
              <div class="h-px flex-1 bg-slate-800"></div>
              <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Or</span>
              <div class="h-px flex-1 bg-slate-800"></div>
            </div>

            <p class="text-center text-slate-500 text-sm">
              Don’t have an account? 
              <router-link to="/register" class="text-white font-bold hover:text-[#A3D921] transition">Create one</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import Message from '../Message/message.vue';

const router = useRouter();

const loading = ref(false);
const generalError = ref("");
const errors = reactive({});

const successMsg = ref("");
const errorMsg = ref("");

const email = ref("");

function resetErrors() {
    generalError.value = "";
    Object.keys(errors).forEach((k) => delete errors[k]);
}

function resetForm() {
    email.value = "";
}

async function FindLogin() {
    resetErrors();
    loading.value = true;
    successMsg.value = "";
    errorMsg.value = "";

    if (!email.value) {
        errorMsg.value = "Please insert your email.";
        loading.value = false;
        return;
    }

    try {
        const res = await api.post("auth/find-account", { email: email.value });
        
        if (!res?.data?.user) {
            errorMsg.value = res?.data?.message || "Your account not found.";
            return;
        }

        // save data
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        successMsg.value = res?.data?.message || "Account found! Sending OTP...";
        resetForm();

        setTimeout(() => router.push("/otp-verification"), 1000);
    } catch (err) {
        const status = err?.response?.status;
        const data = err?.response?.data;

        if (status === 422) {
            Object.assign(errors, data?.errors || {});
            errorMsg.value = "Email validation failed.";
        } else {
            errorMsg.value = data?.message || "Something went wrong!";
        }
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
/* Smooth Fade-in Animation */
section {
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>