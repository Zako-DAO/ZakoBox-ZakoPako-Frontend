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
} from 'reka-ui'
import { onMounted, ref } from 'vue'
import { Toaster } from 'vue-sonner'
import Button from '~/components/ui/button/Button.vue'
import { isDark, toggleDark } from '~/composables/dark'
import { useGithubConnectionStore } from '~/stores/github-connection'
import { useSessionsStore } from '~/stores/sessions'

const sessionsStore = useSessionsStore()
const { session } = storeToRefs(sessionsStore)

const githubConnectionStore = useGithubConnectionStore()
const { githubConnection } = storeToRefs(githubConnectionStore)

const openDialog = ref(false)
const dialogTitle = ref('')
const dialogDescription = ref('')
const dialogCancelText = ref('')
const dialogActionText = ref('')
const dialogAction = ref<() => Promise<void>>()

onMounted(async () => {
  await sessionsStore.getSession()
  await githubConnectionStore.getGithubConnection()
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
      <RouterLink v-if="session" to="/create-vault">
        <Button class="rounded-md bg-white px-2 text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-200">
          创建金库
        </Button>
      </RouterLink>
      <RouterLink v-if="session" to="/my-vault">
        <Button class="rounded-md bg-white px-2 text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-200">
          查看捐款
        </Button>
      </RouterLink>
      <RouterLink v-if="session" to="/withdraw">
        <Button class="rounded-md bg-white px-2 text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-200">
          提款
        </Button>
      </RouterLink>
      <div class="flex-1" />
      <template v-if="session">
        <Button
          v-if="!githubConnection"
          class="rounded-md bg-white px-2 text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-200"
          href="/api/v1/github-connections/authorize" target="_blank" as="a"
        >
          <i class="i-simple-icons-github mr-2 text-xl" />
          连接 GitHub
        </Button>
        <Button
          v-else
          class="rounded-md bg-white px-2 text-gray-800 shadow-md hover:bg-gray-200"
          @click="openDialog = true; dialogTitle = '确认断开 GitHub 连接'; dialogDescription = '你确定要断开 GitHub 连接吗？'; dialogCancelText = '取消'; dialogActionText = '确认断开'; dialogAction = githubConnectionStore.destroyGithubConnection"
        >
          <i class="i-simple-icons-github mr-2 text-xl" />
          {{ githubConnection.login }}
        </Button>
      </template>
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
        @click="openDialog = true; dialogTitle = '确认登出'; dialogDescription = '你确定要登出吗？'; dialogCancelText = '取消'; dialogActionText = '确认登出'; dialogAction = sessionsStore.destroySession"
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
    <main class="w-full flex flex-1 flex-col place-items-center overflow-auto">
      <RouterView />
    </main>
    <DialogRoot v-model:open="openDialog">
      <DialogPortal>
        <DialogOverlay class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <DialogContent class="fixed left-1/2 top-1/2 w-[300px] rounded-lg bg-white p-6 shadow-xl -translate-x-1/2 -translate-y-1/2">
          <DialogTitle class="text-lg text-gray-900 font-semibold">
            {{ dialogTitle }}
          </DialogTitle>
          <DialogDescription class="mt-2 text-sm text-gray-600">
            {{ dialogDescription }}
          </DialogDescription>

          <div class="mt-6 flex justify-end gap-3">
            <DialogClose as-child>
              <Button class="rounded-md bg-gray-200 px-3 py-1 text-gray-800 hover:bg-gray-300">
                {{ dialogCancelText }}
              </Button>
            </DialogClose>

            <Button
              class="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              @click="dialogAction?.(); openDialog = false; dialogAction = undefined; dialogTitle = ''; dialogDescription = ''; dialogCancelText = ''; dialogActionText = '';"
            >
              {{ dialogActionText }}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
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
