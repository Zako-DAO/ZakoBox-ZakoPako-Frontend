<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'
</script>

<template>
  <div mt-40 space-y-5 class="flex flex-col items-center">
    <Input type="vault-name" placeholder="金库要叫什么呢" />
    <Input type="vault-owner" placeholder="给谁建的呢" />
    <Input type="vault-coin" placeholder="要用什么币呢" />
    <Input type="vault-end-height" placeholder="到什么高度结束呢" />
    <Button type="submit">
      开建！
    </Button>
  </div>
</template>
