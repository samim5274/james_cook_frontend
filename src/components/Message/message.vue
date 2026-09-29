<template>
  <!-- Main Container: Keeps multiple toasts stacked neatly without overlapping -->
  <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
    
    <!-- SUCCESS TOAST -->
    <Transition name="toast">
      <div
        v-if="successMsg"
        class="pointer-events-auto w-[320px] md:w-[360px] overflow-hidden rounded-xl border border-emerald-100 bg-white/95 backdrop-blur-md shadow-2xl shadow-emerald-500/10 transition-all dark:border-emerald-900/30 dark:bg-slate-900/95"
      >
        <div class="flex items-start gap-3 p-4">
          <!-- Icon -->
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <i class="fa-solid fa-check text-sm"></i>
          </div>

          <!-- Message -->
          <div class="flex-1 pt-0.5">
            <p class="text-[13px] font-bold tracking-wide text-slate-800 uppercase dark:text-slate-100">Success</p>
            <p class="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{{ successMsg }}</p>
          </div>

          <!-- Close Button -->
          <button
            class="shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 active:scale-95"
            @click="closeSuccess"
            aria-label="Close"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Dynamic Progress Bar -->
        <div class="h-1 w-full bg-emerald-50 dark:bg-slate-800/50">
          <div class="toast-bar h-full bg-emerald-500 dark:bg-emerald-400" :style="{ animationDuration: `${duration}ms` }"></div>
        </div>
      </div>
    </Transition>

    <!-- ERROR TOAST -->
    <Transition name="toast">
      <div
        v-if="errorMsg"
        class="pointer-events-auto w-[320px] md:w-[360px] overflow-hidden rounded-xl border border-rose-100 bg-white/95 backdrop-blur-md shadow-2xl shadow-rose-500/10 transition-all dark:border-rose-900/30 dark:bg-slate-900/95"
      >
        <div class="flex items-start gap-3 p-4">
          <!-- Icon -->
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            <i class="fa-solid fa-triangle-exclamation text-sm"></i>
          </div>

          <!-- Message -->
          <div class="flex-1 pt-0.5">
            <p class="text-[13px] font-bold tracking-wide text-slate-800 uppercase dark:text-slate-100">Error</p>
            <p class="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{{ errorMsg }}</p>
          </div>

          <!-- Close Button -->
          <button
            class="shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300 active:scale-95"
            @click="closeError"
            aria-label="Close"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Dynamic Progress Bar -->
        <div class="h-1 w-full bg-rose-50 dark:bg-slate-800/50">
          <div class="toast-bar h-full bg-rose-500 dark:bg-rose-500" :style="{ animationDuration: `${duration}ms` }"></div>
        </div>
      </div>
    </Transition>
    
  </div>
</template>

<script setup>
import { watch } from "vue"

const props = defineProps({
  successMsg: { type: String, default: "" },
  errorMsg: { type: String, default: "" },
  duration: { type: Number, default: 3000 }, // Default changed to 3s for better readability
})

const emit = defineEmits(["update:successMsg", "update:errorMsg"])

function closeSuccess() {
  emit("update:successMsg", "")
}

function closeError() {
  emit("update:errorMsg", "")
}

let successTimer = null
let errorTimer = null

// Auto hide logic
watch(() => props.successMsg, (v) => {
  if (successTimer) clearTimeout(successTimer)

  if (v) {
    successTimer = setTimeout(() => {
      emit("update:successMsg", "")
    }, props.duration)
  }
})

watch(() => props.errorMsg, (v) => {
  if (errorTimer) clearTimeout(errorTimer)

  if (v) {
    errorTimer = setTimeout(() => {
      emit("update:errorMsg", "")
    }, props.duration)
  }
})
</script>

<style>
/* Snappier Transitions for E-commerce */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy effect */
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95); /* Slides in from the right */
}

/* Progress bar animation */
.toast-bar {
  width: 100%;
  transform-origin: left;
  animation: shrink linear forwards;
}

@keyframes shrink {
  0% { width: 100%; }
  100% { width: 0%; }
}
</style>