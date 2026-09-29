<template>
    <button aria-label="Toggle dark mode"
        class="p-2 rounded-xl transition-all duration-300 relative group
            bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-[#16A34A]
            dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-300 dark:hover:text-white
            border border-gray-200/50 dark:border-white/5 active:scale-95"
        :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        @click="$emit('toggle-theme')"
    >
        <svg v-if="!isDark" class="h-5 w-5 transition-transform duration-500 group-hover:rotate-[360deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>

        <svg v-else class="h-5 w-5 text-[#ffffff] transition-transform duration-500 group-hover:rotate-[180deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 3v2M12 19v2M4.22 4.22l1.41 1.41M18.36 18.36l1.41 1.41M3 12h2M19 12h2M4.22 19.78l1.41-1.41M18.36 5.64l1.41-1.41" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
        </svg>
    </button>
</template>

<script setup>
    defineProps({
    isDark: { type: Boolean, default: false }
    });
defineEmits(['toggle-theme']);
</script>