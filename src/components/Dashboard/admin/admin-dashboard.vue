<template>
    <div :class="{ 'dark': isDark }">
        <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans">

            <AdminHeader
                :is-dark="isDark"
                @toggle-dark="toggleDarkMode"
                @toggle-menu="toggleMenu" />

            <div class="lg:flex">
                <AdminNavbar
                    :mobile-menu="mobileMenu"
                    @close="mobileMenu = false" />

                <div class="flex-1 min-w-0 flex flex-col">
                    <AdminMain />
                </div>
            </div>
            <FooterSection />

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';

import AdminNavbar from './admin-navbar.vue';
import AdminHeader from './admin-header.vue';
import AdminMain from './admin-main.vue';
import FooterSection from "../../footer.vue";

const router = useRouter();
const siteUrl = import.meta.env.VITE_SITE_URL;

const isDark = ref(false);
const mobileMenu = ref(false);

function toggleDarkMode() {
    isDark.value = !isDark.value;
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark.value);
}

function toggleMenu() {
    mobileMenu.value = !mobileMenu.value;
}

onMounted(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        isDark.value = true;
        document.documentElement.classList.add("dark");
    }
});
</script>