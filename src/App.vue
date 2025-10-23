<script setup lang="ts">
import { useRouter } from 'vue-router'
import { routerGuard } from '~/composables/routerGuard'

const router = useRouter()

routerGuard(router)
</script>

<template>
  <RouterView />
</template>
