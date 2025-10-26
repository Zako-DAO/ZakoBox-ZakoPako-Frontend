<script setup lang="ts">
import type { WithdrawalProposal } from '~/contracts/types'
import { computed, onMounted, ref } from 'vue'
import ProposalCard from '~/components/treasury/ProposalCard.vue'
import Button from '~/components/ui/button/Button.vue'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/tabs'
import { useZakoBoxStore } from '~/stores/zakobox'

const zakoBoxStore = useZakoBoxStore()

// Proposal data
const proposalsArray = ref<Array<{ id: number, proposal: WithdrawalProposal }>>([])
const activeTab = ref<'all' | 'pending' | 'ready' | 'executed'>('all')

// Filter proposals
const filteredProposals = computed(() => {
  switch (activeTab.value) {
    case 'pending':
      return proposalsArray.value.filter(p => !p.proposal.executed && p.proposal.approvalCount < zakoBoxStore.threshold)
    case 'ready':
      return proposalsArray.value.filter(p => !p.proposal.executed && p.proposal.approvalCount >= zakoBoxStore.threshold)
    case 'executed':
      return proposalsArray.value.filter(p => p.proposal.executed)
    default:
      return proposalsArray.value
  }
})

// Count by status
const counts = computed(() => ({
  all: proposalsArray.value.length,
  pending: proposalsArray.value.filter(p => !p.proposal.executed && p.proposal.approvalCount < zakoBoxStore.threshold).length,
  ready: proposalsArray.value.filter(p => !p.proposal.executed && p.proposal.approvalCount >= zakoBoxStore.threshold).length,
  executed: proposalsArray.value.filter(p => p.proposal.executed).length,
}))

// Load all proposals
async function loadProposals() {
  if (!zakoBoxStore.currentTreasury)
    return

  proposalsArray.value = []
  const count = await zakoBoxStore.getProposalCount()

  // Load each proposal
  const promises = []
  for (let i = 0; i < count; i++) {
    promises.push(zakoBoxStore.getProposal(i))
  }

  const proposals = await Promise.all(promises)
  proposalsArray.value = proposals
    .map((proposal, index) => ({ id: index, proposal: proposal! }))
    .filter(p => p.proposal !== null)
    .reverse() // Show newest first
}

onMounted(() => {
  loadProposals()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h3 class="text-lg font-semibold">
          Withdrawal Proposals
        </h3>
        <p class="text-sm text-muted-foreground">
          Review and vote on withdrawal proposals
        </p>
      </div>
      <Button
        variant="outline"
        :disabled="zakoBoxStore.loading"
        @click="loadProposals"
      >
        <span v-if="zakoBoxStore.loading">Loading...</span>
        <span v-else>Refresh</span>
      </Button>
    </div>

    <!-- No treasury selected -->
    <div v-if="!zakoBoxStore.currentTreasury" class="border border-border rounded-lg bg-muted p-6 text-center">
      <p class="text-sm text-muted-foreground">
        Select a treasury to view proposals
      </p>
    </div>

    <!-- Proposals -->
    <div v-else>
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid grid-cols-4 w-full">
          <TabsTrigger value="all">
            All ({{ counts.all }})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({{ counts.pending }})
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready ({{ counts.ready }})
          </TabsTrigger>
          <TabsTrigger value="executed">
            Executed ({{ counts.executed }})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" class="mt-6">
          <div v-if="filteredProposals.length === 0" class="border border-border rounded-lg bg-muted p-6 text-center">
            <p class="text-sm text-muted-foreground">
              No proposals found
            </p>
          </div>
          <div v-else class="space-y-4">
            <ProposalCard
              v-for="item in filteredProposals"
              :key="item.id"
              :proposal-id="item.id"
              :proposal="item.proposal"
            />
          </div>
        </TabsContent>

        <TabsContent value="pending" class="mt-6">
          <div v-if="filteredProposals.length === 0" class="border border-border rounded-lg bg-muted p-6 text-center">
            <p class="text-sm text-muted-foreground">
              No pending proposals
            </p>
          </div>
          <div v-else class="space-y-4">
            <ProposalCard
              v-for="item in filteredProposals"
              :key="item.id"
              :proposal-id="item.id"
              :proposal="item.proposal"
            />
          </div>
        </TabsContent>

        <TabsContent value="ready" class="mt-6">
          <div v-if="filteredProposals.length === 0" class="border border-border rounded-lg bg-muted p-6 text-center">
            <p class="text-sm text-muted-foreground">
              No proposals ready for execution
            </p>
          </div>
          <div v-else class="space-y-4">
            <ProposalCard
              v-for="item in filteredProposals"
              :key="item.id"
              :proposal-id="item.id"
              :proposal="item.proposal"
            />
          </div>
        </TabsContent>

        <TabsContent value="executed" class="mt-6">
          <div v-if="filteredProposals.length === 0" class="border border-border rounded-lg bg-muted p-6 text-center">
            <p class="text-sm text-muted-foreground">
              No executed proposals
            </p>
          </div>
          <div v-else class="space-y-4">
            <ProposalCard
              v-for="item in filteredProposals"
              :key="item.id"
              :proposal-id="item.id"
              :proposal="item.proposal"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
