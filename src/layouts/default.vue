<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import Button from '~/components/ui/button/Button.vue'
import { isDark, toggleDark } from '~/composables/dark'
</script>

<template>
  <header class="h-16 w-full border-b border-gray-200 bg-white dark:border-gray-900 dark:bg-dark-500">
    <Toaster position="top-right" rich-colors close-button />
    <div class="h-full flex items-center gap-x-4 px-4">
      <div id="site-title" class="text-xl font-bold">
        Zako Pako
      </div>
      <div class="flex-1" />
      <Button
        class="border rounded-md bg-white px-2 shadow-sm transition-colors duration-200 dark:bg-white hover:bg-gray-200 dark:hover:bg-gray-300"
        @click="toggleDark()"
      >
        <i v-if="isDark" class="i-carbon-moon text-xl text-gray-800" />
        <i v-else class="i-carbon-sun text-xl text-gray-800" />
      </Button>
    </div>
  </header>
  <div class="relative h-[calc(100vh-4rem)] flex flex-1">
    <!-- Main content -->
    <main class="w-full flex flex-1 flex-col place-items-center overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

<style>
#app {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}
*:focus,
*:focus-visible {
  outline: none !important;
}
</style>
