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
          <div class="h-16 w-16 bg-[#A3D921] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-[#A3D921]/20 group hover:scale-110 transition-all">
            <i class="fa-solid fa-lock-open text-black text-2xl"></i>
          </div>
          <h2 class="text-4xl lg:text-5xl font-black text-white leading-tight">
            Secure your <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#A3D921] to-[#639d00]">Account.</span>
          </h2>
          <p class="text-slate-400 mt-6 text-lg leading-relaxed">
            Create a strong password to protect your data. Use a combination of letters, numbers, and symbols for maximum security.
          </p>
        </div>

        <div class="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
          <h4 class="text-xs font-black uppercase tracking-widest text-[#A3D921] mb-2">Security Checklist</h4>
          <div v-for="(val, label) in validationLabels" :key="label" class="flex items-center gap-3">
             <i :class="passwordValidation[label] ? 'fa-solid fa-circle-check text-[#A3D921]' : 'fa-regular fa-circle text-slate-600'" class="text-xs transition-colors"></i>
             <span class="text-sm font-medium transition-colors" :class="passwordValidation[label] ? 'text-slate-200' : 'text-slate-500'">{{ val }}</span>
          </div>
        </div>
      </div>

      <div class="p-8 lg:p-12 bg-[#111a3e]/60 backdrop-blur-xl">
        
        <div class="flex flex-col items-center mb-10 text-center">
          <div class="mb-6">
            <div class="h-24 w-24 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl transition-all duration-500 hover:rotate-3">
              <img src="/logo/white-logo.avif" alt="Logo" class="w-16 h-16 object-contain drop-shadow-[0_5px_15px_rgba(163,217,33,0.3)]" />
            </div>
          </div>
          <h3 class="text-3xl font-black text-white tracking-tighter uppercase italic">
            Reset <span class="text-[#A3D921]">Password</span>
          </h3>
          <p class="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Final Step</p>
        </div>

        <form @submit.prevent="resetPassword" class="space-y-6">
          
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Password</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fa-solid fa-shield text-slate-500 group-focus-within:text-[#A3D921] transition-colors"></i>
              </div>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                @input="validatePassword"
                placeholder="••••••••"
                class="auth-input pl-12 pr-12"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm New Password</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fa-solid fa-check-double text-slate-500 group-focus-within:text-[#A3D921] transition-colors"></i>
              </div>
              <input
                :type="showConfirm ? 'text' : 'password'"
                v-model="confirmPassword"
                placeholder="••••••••"
                class="auth-input pl-12 pr-12"
                :class="{ 'border-red-500/50 bg-red-500/5': confirmPassword && !passwordsMatch }"
              />
              <button type="button" @click="showConfirm = !showConfirm" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition">
                <i :class="showConfirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <p v-if="confirmPassword && !passwordsMatch" class="text-[11px] text-red-400 font-medium ml-1">Passwords do not match</p>
          </div>

          <button
            type="submit"
            :disabled="!canSubmit || loading"
            class="w-full h-14 bg-[#A3D921] text-black font-black rounded-2xl hover:bg-[#b4ec2b] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-xl shadow-[#A3D921]/10 flex items-center justify-center gap-3 mt-4"
          >
            <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-rotate text-sm"></i>
            {{ loading ? 'UPDATING...' : 'UPDATE PASSWORD' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import Message from '../Message/message.vue'

const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const passwordValidation = reactive({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
})

const validationLabels = {
    length: "Minimum 6 characters",
    uppercase: "One uppercase letter",
    lowercase: "One lowercase letter",
    number: "One numeric character",
    special: "One special character"
}

const passwordsMatch = computed(() => password.value && password.value === confirmPassword.value)

const canSubmit = computed(() => 
    passwordValidation.length &&
    passwordValidation.uppercase &&
    passwordValidation.lowercase &&
    passwordValidation.number &&
    passwordValidation.special &&
    passwordsMatch.value
)

function validatePassword() {
    passwordValidation.length = password.value.length >= 6
    passwordValidation.uppercase = /[A-Z]/.test(password.value)
    passwordValidation.lowercase = /[a-z]/.test(password.value)
    passwordValidation.number = /[0-9]/.test(password.value)
    passwordValidation.special = /[!@#$%^&*]/.test(password.value)
}

async function resetPassword() {
    if (!canSubmit.value) return

    loading.value = true
    errorMsg.value = ''
    successMsg.value = ''

    try {
        const email = localStorage.getItem('email')
        const res = await api.post('auth/reset-password', {
            email,
            password: password.value,
            password_confirmation: confirmPassword.value
        })
        
        successMsg.value = res.data.message || 'Password updated! Please login.'
        localStorage.removeItem('email')
        setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
        errorMsg.value = err?.response?.data?.message || 'Something went wrong'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.auth-input {
  @apply w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pr-4 text-slate-100 
         placeholder:text-slate-600 outline-none transition-all duration-300
         focus:ring-2 focus:ring-[#A3D921]/10 focus:border-[#A3D921] focus:bg-slate-900;
}

section {
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>