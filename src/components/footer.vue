<template>
    <footer class="relative bg-white dark:bg-[#09090b] border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

            <!-- Back to Top Button (Light: Emerald | Dark: Orange) -->
            <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">

                <!-- Back to Top Button -->
                <button 
                    v-show="showButton"
                    @click="scrollToTop" aria-label="Back to top"
                    class="h-10 w-10 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 active:scale-95
                        bg-emerald-600 hover:bg-emerald-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white">
                    <i class="fa-solid fa-angle-up text-sm" aria-hidden="true"></i>
                </button>
            </div>
        
            <!-- Top Row: Identity & Live System Status -->
            <div class="flex flex-col lg:flex-row justify-between items-center gap-6 pb-6 border-b border-slate-200/60 dark:border-white/5">
                
                <!-- Logo & Text -->
                <div class="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <router-link to="/" target="_blank" aria-label="Go to homepage" class="flex items-center gap-3 group">
                        <div class="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-center transition-transform group-hover:scale-105">
                            <img src="/logo/logo.avif" alt="Mercuviax Logo" class="w-8 h-8 object-contain dark:hidden" />
                            <img src="/logo/white-logo.avif" alt="Mercuviax Logo" class="hidden dark:block w-8 h-8 object-contain" />
                        </div>
                        <span class="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase">
                            <span class="text-[#F97316]">James Cook</span>
                        </span>
                    </router-link>
                </div>

                <!-- Status Badge & Social Networks -->
                <div class="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-center">
                    <div class="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 shrink-0">
                        <span class="relative flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            System: <span class="text-emerald-500">Active</span>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Merged Bottom Row: Copyrights & Gateway Panel -->
            <div class="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                
                <!-- Copyright & Powered by text -->
                <div class="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2.5 sm:gap-4 flex-wrap text-center md:text-left">
                    <p>© {{ new Date().getFullYear() }} <a href="https://mercuviax.com" target="_blank" class="hover:text-emerald-600 dark:hover:text-orange-400 font-bold transition-colors">Mercuviax</a>. All Rights Reserved.</p>
                    <div class="hidden sm:block h-3.5 w-px bg-slate-200 dark:bg-slate-800"></div>
                    <p>Powered By: <a href="https://mercuviax.com" target="_blank" class="hover:text-emerald-600 dark:hover:text-orange-400 transition-colors font-bold italic">Mercuviax Software</a>.</p>
                </div>

                <!-- Payment Partners Premium Mock Icons -->
                <div class="flex items-center gap-5 text-slate-400 dark:text-slate-500">
                    <a href="https://www.facebook.com/mercuviax" target="_blank" rel="noopener noreferrer"  aria-label="Visit Ogrova on Facebook"  title="Facebook" class="hover:text-emerald-600 dark:hover:text-orange-500 transition-colors text-sm"><i class="fa-brands fa-facebook" aria-hidden="true"></i></a>
                    <a href="linkedin.com/company/131974060" target="_blank" rel="noopener noreferrer" aria-label="Visit Ogrova on LinkedIn" title="Instagram" class="hover:text-emerald-600 dark:hover:text-orange-500 transition-colors text-sm"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>
                    <a href="https://www.instagram.com/mercuviax/" target="_blank" rel="noopener noreferrer" aria-label="Visit Ogrova on Instagram"  title="LinkedIn" class="hover:text-emerald-600 dark:hover:text-orange-500 transition-colors text-sm"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>
                </div>
            </div>

        </div>
    </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showButton = ref(false)

const handleScroll = () => {
    showButton.value = window.scrollY > 300
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

onMounted(() => { window.addEventListener('scroll', handleScroll) })
onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })
</script>

<style scoped>
/* Subtle Dark Mode Glow Match */
.dark footer {
    box-shadow: 0 -10px 40px -20px rgba(249, 115, 22, 0.04);
}
</style>