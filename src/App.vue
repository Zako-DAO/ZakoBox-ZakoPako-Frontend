<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRouterGuard } from '~/composables/routerGuard'

const router = useRouter()

useRouterGuard(router)
</script>

<template>
  <RouterView />
</template>
