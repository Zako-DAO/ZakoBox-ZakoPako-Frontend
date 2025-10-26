<script setup lang="ts">
import type { WithdrawalProposal } from '~/contracts/types'
import { computed, onMounted, ref } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import { ZERO_ADDRESS } from '~/contracts/addresses'
import { useWalletStore } from '~/stores/wallet'
import { useZakoBoxStore } from '~/stores/zakobox'
import { formatTokenAmount, getTokenAddresses } from '~/utils/contract'

const props = defineProps<{
  proposalId: number
  proposal: WithdrawalProposal
}>()

const walletStore = useWalletStore()
const zakoBoxStore = useZakoBoxStore()

const hasUserApproved = ref<boolean>(false)

// Get token info
const tokenInfo = computed(() => {
  const tokenAddresses = getTokenAddresses()
  const tokens = [
    { address: ZERO_ADDRESS, symbol: 'ETH', decimals: 18 },
    { address: tokenAddresses.PYUSD, symbol: 'PYUSD', decimals: 6 },
    { address: tokenAddresses.USDC, symbol: 'USDC', decimals: 6 },
    { address: tokenAddresses.USDT, symbol: 'USDT', decimals: 6 },
  ]

  return tokens.find(t => t.address.toLowerCase() === props.proposal.token.toLowerCase()) || {
    address: props.proposal.token,
    symbol: 'Unknown',
    decimals: 18,
  }
})

// Format amount
const formattedAmount = computed(() => {
  return formatTokenAmount(props.proposal.amount, tokenInfo.value.decimals)
})

// Format timestamp
const proposedDate = computed(() => {
  const date = new Date(Number(props.proposal.proposedAt) * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

// Check if can execute
const canExecute = computed(() => {
  return props.proposal.approvalCount >= zakoBoxStore.threshold && !props.proposal.executed
})

// Check if user can approve
const canApprove = computed(() => {
  return zakoBoxStore.isOwner && !hasUserApproved.value && !props.proposal.executed
})

// Handle approve
async function handleApprove() {
  const success = await zakoBoxStore.approveWithdrawal(props.proposalId)
  if (success) {
    hasUserApproved.value = true
  }
}

// Handle execute
async function handleExecute() {
  await zakoBoxStore.executeWithdrawal(props.proposalId)
}

// Load user approval status
onMounted(async () => {
  if (walletStore.address) {
    hasUserApproved.value = await zakoBoxStore.hasApproved(props.proposalId, walletStore.address)
  }
})
</script>

<template>
  <div class="border border-border rounded-lg bg-card p-6 transition-colors hover:border-primary">
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h4 class="font-semibold">
              Proposal #{{ proposalId }}
            </h4>
            <span
              v-if="proposal.executed"
              class="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 font-medium dark:bg-green-900 dark:text-green-100"
            >
              Executed
            </span>
            <span
              v-else-if="canExecute"
              class="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-100"
            >
              Ready
            </span>
            <span
              v-else
              class="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700 font-medium dark:bg-yellow-900 dark:text-yellow-100"
            >
              Pending
            </span>
          </div>
          <p class="text-xs text-muted-foreground">
            Proposed {{ proposedDate }}
          </p>
        </div>

        <!-- Approval Progress -->
        <div class="text-right">
          <p class="text-sm font-medium">
            {{ proposal.approvalCount.toString() }} / {{ zakoBoxStore.threshold.toString() }}
          </p>
          <p class="text-xs text-muted-foreground">
            Approvals
          </p>
        </div>
      </div>

      <!-- Description -->
      <div class="space-y-1">
        <p class="text-sm font-medium">
          Description:
        </p>
        <p class="text-sm text-muted-foreground">
          {{ proposal.description }}
        </p>
      </div>

      <!-- Details -->
      <div class="rounded-md bg-muted p-3 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Amount:</span>
          <span class="font-medium">{{ formattedAmount }} {{ tokenInfo.symbol }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Token:</span>
          <span class="text-xs font-mono">{{ proposal.token.slice(0, 10) }}...{{ proposal.token.slice(-8) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Recipient:</span>
          <span class="text-xs font-mono">{{ proposal.recipient.slice(0, 10) }}...{{ proposal.recipient.slice(-8) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="!proposal.executed" class="flex gap-2">
        <Button
          v-if="canApprove"
          variant="default"
          class="flex-1"
          :disabled="zakoBoxStore.loading"
          @click="handleApprove"
        >
          <span v-if="zakoBoxStore.loading">Approving...</span>
          <span v-else>Approve</span>
        </Button>
        <Button
          v-else-if="hasUserApproved"
          variant="outline"
          class="flex-1"
          disabled
        >
          Already Approved
        </Button>

        <Button
          v-if="canExecute && zakoBoxStore.isOwner"
          variant="default"
          class="flex-1"
          :disabled="zakoBoxStore.loading"
          @click="handleExecute"
        >
          <span v-if="zakoBoxStore.loading">Executing...</span>
          <span v-else>Execute</span>
        </Button>
      </div>

      <!-- Executed info -->
      <div v-else class="rounded-md bg-green-50 p-3 dark:bg-green-950">
        <p class="text-sm text-green-900 dark:text-green-100">
          This proposal has been executed successfully.
        </p>
      </div>
    </div>
  </div>
</template>
