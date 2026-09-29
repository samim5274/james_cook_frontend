<template>
  <section class="min-h-screen flex items-center justify-center bg-[#111827] text-white px-4">
    <div class="text-center max-w-md">
      <h1 class="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 class="text-2xl font-semibold mb-2">Unauthorized Access</h2>
      <p class="text-gray-400 mb-6">
        You do not have permission to view this page. Please contact the administrator if you think this is a mistake.
      </p>
      <router-link 
        to="/dashboard" 
        class="inline-block px-6 py-3 bg-[#046425] text-white rounded-full font-semibold hover:bg-transparent hover:text-[#A3D921] hover:border hover:border-[#A3D921] transition">
        Go to Home
      </router-link>
    </div>
  </section>
</template>

<script setup>
// Optional: No script needed unless you want custom behavior
</script>

<style scoped>
/* Optional: add animation for 403 number */
h1 {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>