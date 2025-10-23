<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionsStore } from '~/stores/sessions'

const router = useRouter()

router.beforeEach(async (to) => {
  const sessionsStore = useSessionsStore()
  if (!sessionsStore.session)
    await sessionsStore.getSession()
  const loggingIn = !!sessionsStore.session
  const loggingInRoutes = ['/create-vault', '/my-vault', '/withdraw']
  if (loggingInRoutes.includes(to.path) && !loggingIn)
    return '/'
})
</script>

<template>
  <RouterView />
</template>
