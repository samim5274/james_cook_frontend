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
          <div class="h-16 w-16 bg-[#A3D921] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-[#A3D921]/20 group hover:rotate-12 transition-all">
            <i class="fa-solid fa-shield-lock text-black text-2xl"></i>
          </div>
          <h2 class="text-4xl lg:text-5xl font-black text-white leading-tight">
            Verify your <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#A3D921] to-[#639d00]">Identity.</span>
          </h2>
          <p class="text-slate-400 mt-6 text-lg leading-relaxed">
            We've sent a 6-digit verification code to your email. Please enter the code to continue with password reset.
          </p>
        </div>

        <div class="space-y-5">
          <div class="flex items-center gap-4 group">
            <div class="h-6 w-6 rounded-full bg-[#A3D921]/10 flex items-center justify-center group-hover:bg-[#A3D921]/20 transition">
              <i class="fa-solid fa-clock text-[#A3D921] text-xs"></i>
            </div>
            <span class="text-sm font-semibold text-slate-300 tracking-wide">Code expires in 5 minutes</span>
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
            Two-Factor <span class="text-[#A3D921]">Auth</span>
          </h3>
          <p class="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Enter 6-Digit Code</p>
        </div>

        <div class="space-y-8">
          <div class="flex justify-between gap-2 sm:gap-4">
            <input
              v-for="(digit, index) in otp"
              :key="index"
              ref="inputs"
              type="text"
              maxlength="1"
              inputmode="numeric"
              class="w-full h-14 sm:h-16 text-center text-2xl font-black rounded-2xl bg-slate-900 border border-slate-800 text-[#A3D921] 
                     focus:ring-2 focus:ring-[#A3D921]/20 focus:border-[#A3D921] outline-none transition-all duration-300 placeholder:text-slate-800"
              v-model="otp[index]"
              @input="handleInput(index)"
              @keydown.backspace="handleBackspace(index)"
              @paste="handlePaste"
              placeholder="-"
            />
          </div>

          <button
            @click="submitOtp"
            :disabled="loading"
            class="w-full h-14 bg-[#A3D921] text-black font-black rounded-2xl hover:bg-[#b4ec2b] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-xl shadow-[#A3D921]/10 flex items-center justify-center gap-3"
          >
            <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-fingerprint"></i>
            {{ loading ? 'VERIFYING...' : 'VERIFY OTP' }}
          </button>

          <div class="text-center space-y-4">
            <p class="text-sm text-slate-500 font-medium">
              Didn't receive the code? 
              <button class="text-white font-bold hover:text-[#A3D921] transition hover:underline">Resend Code</button>
            </p>
            <router-link to="/login" class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition uppercase tracking-widest">
              <i class="fa-solid fa-arrow-left"></i> Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import Message from '../Message/message.vue' // নিশ্চিত করুন আপনার মেসেজ কম্পোনেন্টটি ইমপোর্ট করা আছে

const router = useRouter()

const otp = ref(["", "", "", "", "", ""])
const inputs = ref([])
const loading = ref(false)
const errorMsg = ref("")
const successMsg = ref("")

// Auto move next logic
function handleInput(index) {
    // Only numbers allowed
    otp.value[index] = otp.value[index].replace(/[^0-9]/g, "");
    
    if (otp.value[index] && index < 5) {
        nextTick(() => inputs.value[index + 1].focus())
    }
}

// Backspace previous
function handleBackspace(index) {
    if (!otp.value[index] && index > 0) {
        nextTick(() => inputs.value[index - 1].focus())
    }
}

// Paste support (Perfectly handles 6 digits)
function handlePaste(e) {
    const paste = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(paste)) return

    paste.split("").forEach((char, i) => {
        if (i < 6) otp.value[i] = char
    })
    // Focus the last filled input or the next empty one
    const lastIdx = Math.min(paste.length, 5);
    nextTick(() => inputs.value[lastIdx].focus());
}

// Submit verification
async function submitOtp() {
    const finalOtp = otp.value.join("")
    errorMsg.value = ""
    successMsg.value = ""

    if (finalOtp.length < 6) {
        errorMsg.value = "Please enter the complete 6-digit code."
        return
    }

    loading.value = true
    const email = localStorage.getItem("email")

    try {
        const res = await api.post("auth/verify-otp", {
            email,
            otp: finalOtp
        })
        successMsg.value = res?.data?.message || "Verification successful!"
        setTimeout(() => router.push("/reset-password"), 800)
    } catch (err) {
        errorMsg.value = err?.response?.data?.message || "Invalid or expired OTP"
        // Clear OTP inputs on error for security
        otp.value = ["", "", "", "", "", ""];
        inputs.value[0].focus();
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
section {
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Chrome, Safari, Edge, Opera - Remove arrows from number input if used */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>