<template>
  <section class="min-h-screen bg-gradient-to-b from-[#1E4DAB] to-[#0A235D] text-white flex flex-col items-center justify-center p-6 selection:bg-[#FF782D]/20 selection:text-white transition-colors duration-500 font-sans">
    
    <Message
      :successMsg="successMsg"
      :errorMsg="errorMsg"
      @update:successMsg="successMsg = $event"
      @update:errorMsg="errorMsg = $event"
    />

    <div class="w-full max-w-sm flex flex-col items-center">
      
      <div class="text-center mb-8">
        <h2 class="text-4xl font-extrabold text-white leading-tight">
          Hello!
        </h2>
        <h2 class="text-4xl font-extrabold text-white leading-tight">
          Welcome
        </h2>
      </div>

      <div class="mb-10 w-28 h-28 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
        <img src="/logo/logo.avif" alt="Logo" class="w-20 h-20 object-contain" />
      </div>

      <div class="text-center mb-8">
        <p class="text-lg font-semibold text-white/90">Let's Login to Your Account</p>
      </div>

      <form @submit.prevent="handleLogin" class="w-full space-y-6">
        
        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-white/90">Username</label>
          <div class="relative group">
            <input
              type="text" v-model.trim="form.username"
              placeholder="Your username"
              class="w-full h-14 px-6 rounded-full border border-white bg-white text-[#111] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF782D] transition"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex justify-between items-center px-1">
            <label class="text-sm font-semibold text-white/90">Password</label>
          </div>
          <div class="relative group">
            <input
              :type="showPassword ? 'text' : 'password'" v-model="form.password"
              placeholder="Your password"
              class="w-full h-14 px-6 rounded-full border border-white bg-white text-[#111] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF782D] transition"
            />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition">
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>
        </div>

        <button
          type="submit" :disabled="loading"
          class="w-full h-14 bg-[#FF782D] text-white text-lg font-bold rounded-full hover:bg-[#e66c28] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-lg shadow-[#FF782D]/20 flex items-center justify-center gap-3"
        >
          <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
          {{ loading ? 'AUTHENTICATING...' : 'Login' }}
        </button>

        <p class="text-center text-white/80 text-sm mt-8">
          Don't have an account? 
          <router-link to="/register" class="text-white font-bold hover:text-[#FF782D] transition underline underline-offset-2">Sign In now</router-link>
        </p>
      </form>

      <footer class="mt-16 w-full flex justify-between text-xs text-white/80">
        <router-link to="/privacy-policy" class="hover:text-white transition">Privacy Policy</router-link>
        <button class="hover:text-white transition">Cookies Settings</button>
      </footer>

    </div>
  </section>
</template>