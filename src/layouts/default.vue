<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { Toaster } from 'vue-sonner'
import Button from '~/components/ui/button/Button.vue'
import { isDark, toggleDark } from '~/composables/dark'
import { useSessionsStore } from '~/stores/sessions'

const sessionsStore = useSessionsStore()
const { session } = storeToRefs(sessionsStore)

onMounted(async () => {
  await sessionsStore.getSession()
})
</script>

<template>
  <header class="h-16 w-full border-b border-gray-200 bg-white dark:border-gray-900 dark:bg-dark-500">
    <Toaster position="top-right" rich-colors close-button />
    <div class="h-full flex items-center gap-x-4 px-4">
      <RouterLink to="/">
        <div id="site-title" class="mr-15 text-xl font-bold">
          Zako Pako
        </div>
      </RouterLink>
      <RouterLink to="/create-vault">
        <Button class="rounded-md bg-white px-2 text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-200">
          创建金库
        </Button>
      </RouterLink>
      <RouterLink to="/my-vault">
        <Button class="rounded-md bg-white px-2 text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-200">
          查看捐款
        </Button>
      </RouterLink>
      <RouterLink to="/withdraw">
        <Button class="rounded-md bg-white px-2 text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-200">
          提款
        </Button>
      </RouterLink>
      <div class="flex-1" />
      <Button
        v-if="!session"
        class="rounded-md bg-white px-2 text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-200"
        @click="sessionsStore.createSession()"
      >
        <i class="i-simple-icons-ethereum mr-2 text-xl" />
        连接钱包
      </Button>
      <Button
        v-else
        class="rounded-md bg-white px-2 text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-200"
      >
        <i class="i-simple-icons-ethereum mr-2 text-xl" />
        {{ session.address }}
      </Button>
      <Button
        class="rounded-md bg-white px-2 shadow-md transition-colors duration-200 dark:bg-white hover:bg-gray-200 dark:hover:bg-gray-300"
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
