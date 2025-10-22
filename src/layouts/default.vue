<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { onMounted, ref } from 'vue'
import { Toaster } from 'vue-sonner'
import Button from '~/components/ui/button/Button.vue'
import { isDark, toggleDark } from '~/composables/dark'
import { useSessionsStore } from '~/stores/sessions'

const sessionsStore = useSessionsStore()
const { session } = storeToRefs(sessionsStore)

const openDialog = ref(false)

onMounted(async () => {
  await sessionsStore.getSession()
  openDialog.value = false
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
      <DialogRoot v-else v-model:open="openDialog">
        <DialogTrigger as-child>
          <Button
            class="rounded-md bg-white px-2 text-gray-800 shadow-md hover:bg-gray-200"
          >
            <i class="i-simple-icons-ethereum mr-2 text-xl" />
            {{ session.address }}
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <DialogContent class="fixed left-1/2 top-1/2 w-[300px] rounded-lg bg-white p-6 shadow-xl -translate-x-1/2 -translate-y-1/2">
            <DialogTitle class="text-lg text-gray-900 font-semibold">
              确认退出登录
            </DialogTitle>
            <DialogDescription class="mt-2 text-sm text-gray-600">
              你确定要退出当前钱包连接吗？
            </DialogDescription>

            <div class="mt-6 flex justify-end gap-3">
              <DialogClose as-child>
                <Button class="rounded-md bg-gray-200 px-3 py-1 text-gray-800 hover:bg-gray-300">
                  取消
                </Button>
              </DialogClose>

              <Button
                class="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                @click="sessionsStore.destroySession(); openDialog = false"
              >
                确认退出
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
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
