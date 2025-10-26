<script setup lang="ts">
import CreateTreasuryForm from '~/components/treasury/CreateTreasuryForm.vue'
</script>

<template>
  <div class="container mx-auto py-8 space-y-8">
    <!-- Header -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold">
        Create Treasury
      </h1>
      <p class="text-muted-foreground">
        Deploy a new multi-signature treasury contract on Sepolia
      </p>
    </div>

    <!-- Create Form -->
    <div class="mx-auto max-w-3xl">
      <CreateTreasuryForm />
    </div>
  </div>
</template>
