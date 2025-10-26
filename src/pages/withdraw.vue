<script lang="ts" setup>
import type { Address } from 'viem'
import { ref } from 'vue'
import CreateProposalForm from '~/components/treasury/CreateProposalForm.vue'
import ProposalList from '~/components/treasury/ProposalList.vue'
import TreasurySelector from '~/components/treasury/TreasurySelector.vue'

const selectedTreasury = ref<Address | null>(null)

function onTreasurySelected(address: Address) {
  selectedTreasury.value = address
}
</script>

<template>
  <div class="container mx-auto py-8 space-y-8">
    <!-- Header -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold">
        Withdrawal Management
      </h1>
      <p class="text-muted-foreground">
        Create and manage withdrawal proposals for your treasuries
      </p>
    </div>

    <!-- Treasury Selector -->
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-1">
        <TreasurySelector @treasury-selected="onTreasurySelected" />
      </div>

      <!-- Create Proposal Form -->
      <div v-if="selectedTreasury" class="lg:col-span-2">
        <CreateProposalForm />
      </div>
    </div>

    <!-- Proposal List -->
    <div v-if="selectedTreasury" class="mt-8">
      <ProposalList />
    </div>

    <!-- No Treasury Selected State -->
    <div v-else class="border border-border rounded-lg bg-muted p-12 text-center">
      <h3 class="text-lg font-semibold">
        No Treasury Selected
      </h3>
      <p class="mt-2 text-sm text-muted-foreground">
        Select a treasury from the list above to manage withdrawals
      </p>
    </div>
  </div>
</template>
