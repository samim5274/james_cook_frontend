<template>
    <section class="min-h-screen flex items-center justify-center bg-radial-gradient from-[#1f2937] to-[#111827] px-6 relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div class="relative z-10 text-center max-w-lg">
            <div class="relative inline-block">
                <h1 class="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-800 leading-none">
                    403
                </h1>
                <span class="absolute -bottom-2 left-0 w-full h-4 bg-red-500/20 blur-md rounded-full"></span>
            </div>

            <div class="mt-8 space-y-4">
                <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Access Restricted
                </h2>
                
                <div class="inline-flex items-center px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    System Maintenance Mode
                </div>

                <p class="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
                    The configuration module is currently under maintenance or you lack the necessary credentials.
                </p>
            </div>

            <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <router-link 
                    to="/" 
                    class="w-full sm:w-auto px-8 py-3 bg-white text-[#111827] rounded-xl font-bold transition-all hover:bg-gray-200 active:scale-95 shadow-lg shadow-white/5">
                    Return to Home
                </router-link>
                
                <button 
                    onclick="history.back()"
                    class="w-full sm:w-auto px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold backdrop-blur-sm transition-all hover:bg-white/10">
                    Go Back
                </button>
            </div>
            
            <p class="mt-12 text-sm text-gray-500">
                Ref ID: <span class="font-mono text-red-500/70 uppercase">ERR_403_SET_MAINT</span>
            </p>
        </div>
    </section>
</template>

<script setup>

</script>

<style>

</style>