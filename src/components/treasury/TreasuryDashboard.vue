<script setup lang="ts">
import type { Address } from 'viem'
import { ref } from 'vue'
import CreateProposalForm from '~/components/treasury/CreateProposalForm.vue'
import DonationForm from '~/components/treasury/DonationForm.vue'
import ProposalList from '~/components/treasury/ProposalList.vue'
import TreasuryBalance from '~/components/treasury/TreasuryBalance.vue'
import TreasurySelector from '~/components/treasury/TreasurySelector.vue'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/tabs'
import { useZakoBoxStore } from '~/stores/zakobox'

const zakoBoxStore = useZakoBoxStore()

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
        Treasury Management
      </h1>
      <p class="text-muted-foreground">
        Manage your treasuries, donations, and withdrawal proposals
      </p>
    </div>

    <!-- Treasury Selector -->
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-1">
        <TreasurySelector @treasury-selected="onTreasurySelected" />
      </div>

      <!-- Balance Display -->
      <div v-if="selectedTreasury" class="lg:col-span-2">
        <TreasuryBalance
          :treasury-address="selectedTreasury"
          :auto-refresh="true"
          :refresh-interval="30000"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="selectedTreasury">
      <Tabs default-value="donate" class="w-full">
        <TabsList class="grid grid-cols-3 w-full">
          <TabsTrigger value="donate">
            Donate
          </TabsTrigger>
          <TabsTrigger value="proposals">
            Proposals
          </TabsTrigger>
          <TabsTrigger v-if="zakoBoxStore.isOwner" value="create-proposal">
            New Proposal
          </TabsTrigger>
        </TabsList>

        <!-- Donate Tab -->
        <TabsContent value="donate" class="mt-6">
          <div class="mx-auto max-w-2xl">
            <DonationForm :treasury-address="selectedTreasury" />
          </div>
        </TabsContent>

        <!-- Proposals Tab -->
        <TabsContent value="proposals" class="mt-6">
          <ProposalList />
        </TabsContent>

        <!-- Create Proposal Tab (Owners Only) -->
        <TabsContent v-if="zakoBoxStore.isOwner" value="create-proposal" class="mt-6">
          <div class="mx-auto max-w-2xl">
            <CreateProposalForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>

    <!-- No Treasury Selected State -->
    <div v-else class="border border-border rounded-lg bg-muted p-12 text-center">
      <h3 class="text-lg font-semibold">
        No Treasury Selected
      </h3>
      <p class="mt-2 text-sm text-muted-foreground">
        Select a treasury from the list above to get started
      </p>
    </div>
  </div>
</template>
