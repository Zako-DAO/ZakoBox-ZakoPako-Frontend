<script setup lang="ts">
import type { Address } from 'viem'
import { isAddress } from 'viem'
import { computed, ref } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'
import Label from '~/components/ui/label/Label.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import Textarea from '~/components/ui/textarea/Textarea.vue'
import { ZERO_ADDRESS } from '~/contracts/addresses'
import { useWalletStore } from '~/stores/wallet'
import { useZakoBoxStore } from '~/stores/zakobox'
import { formatTokenAmount, getTokenAddresses, parseTokenAmount } from '~/utils/contract'

const walletStore = useWalletStore()
const zakoBoxStore = useZakoBoxStore()

// Form state
const selectedToken = ref<Address>(ZERO_ADDRESS)
const recipientAddress = ref<string>('')
const withdrawalAmount = ref<string>('')
const description = ref<string>('')
const tokenDecimals = ref<number>(18)

// Available tokens
const tokens = computed(() => {
  const tokenAddresses = getTokenAddresses()
  return [
    { address: ZERO_ADDRESS, symbol: 'ETH', name: 'Ethereum' },
    { address: tokenAddresses.PYUSD, symbol: 'PYUSD', name: 'PayPal USD' },
    { address: tokenAddresses.USDC, symbol: 'USDC', name: 'USD Coin' },
    { address: tokenAddresses.USDT, symbol: 'USDT', name: 'Tether USD' },
  ]
})

// Treasury balance for selected token
const availableBalance = computed(() => {
  const balance = zakoBoxStore.treasuryBalance[selectedToken.value]
  return balance ? formatTokenAmount(balance, tokenDecimals.value) : '0'
})

// Validate recipient address
const isValidRecipient = computed(() => {
  if (!recipientAddress.value)
    return false
  return isAddress(recipientAddress.value)
})

// Check if form is valid
const isFormValid = computed(() => {
  if (!walletStore.address)
    return false
  if (!zakoBoxStore.currentTreasury)
    return false
  if (!zakoBoxStore.isOwner)
    return false
  if (!isValidRecipient.value)
    return false
  if (!withdrawalAmount.value || Number(withdrawalAmount.value) <= 0)
    return false
  if (!description.value.trim())
    return false
  return true
})

// Handle token selection
function onTokenSelect(value: string) {
  selectedToken.value = value as Address

  // Update decimals
  if (value === ZERO_ADDRESS) {
    tokenDecimals.value = 18
  }
  else {
    tokenDecimals.value = 6
  }

  // Refresh balance
  if (zakoBoxStore.currentTreasury) {
    zakoBoxStore.getBalance(selectedToken.value)
  }
}

// Handle proposal creation
async function handleCreateProposal() {
  if (!isFormValid.value)
    return

  try {
    const amount = parseTokenAmount(withdrawalAmount.value, tokenDecimals.value)
    const proposalId = await zakoBoxStore.proposeWithdrawal(
      selectedToken.value,
      recipientAddress.value as Address,
      amount,
      description.value.trim(),
    )

    if (proposalId !== null) {
      // Clear form on success
      recipientAddress.value = ''
      withdrawalAmount.value = ''
      description.value = ''
    }
  }
  catch (error) {
    console.error('Failed to create proposal:', error)
  }
}

// Get selected token info
const selectedTokenInfo = computed(() => {
  return tokens.value.find(t => t.address === selectedToken.value)
})
</script>

<template>
  <div class="border border-border rounded-lg bg-card p-6 space-y-6">
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">
        Create Withdrawal Proposal
      </h3>
      <p class="text-sm text-muted-foreground">
        Propose a withdrawal from the treasury. Requires multi-sig approval.
      </p>
    </div>

    <!-- Owner Check -->
    <div v-if="!zakoBoxStore.isOwner && walletStore.address" class="rounded-md bg-yellow-50 p-4 dark:bg-yellow-950">
      <p class="text-sm text-yellow-900 dark:text-yellow-100">
        Only treasury owners can create withdrawal proposals.
      </p>
    </div>

    <!-- Form -->
    <div v-else class="space-y-4">
      <!-- Token Selection -->
      <div class="space-y-2">
        <Label for="token-select">Token</Label>
        <Select :model-value="selectedToken" @update:model-value="onTokenSelect">
          <SelectTrigger id="token-select" class="w-full">
            <SelectValue placeholder="Select token to withdraw" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Tokens</SelectLabel>
              <SelectItem
                v-for="token in tokens"
                :key="token.address"
                :value="token.address"
              >
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ token.symbol }}</span>
                  <span class="text-xs text-muted-foreground">{{ token.name }}</span>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <p class="text-xs text-muted-foreground">
          Available: {{ availableBalance }} {{ selectedTokenInfo?.symbol }}
        </p>
      </div>

      <!-- Recipient Address -->
      <div class="space-y-2">
        <Label for="recipient-input">Recipient Address</Label>
        <Input
          id="recipient-input"
          v-model="recipientAddress"
          type="text"
          placeholder="0x..."
          :class="{ 'border-red-500': recipientAddress && !isValidRecipient }"
        />
        <p v-if="recipientAddress && !isValidRecipient" class="text-xs text-red-500">
          Invalid Ethereum address
        </p>
      </div>

      <!-- Amount -->
      <div class="space-y-2">
        <Label for="amount-input">Amount</Label>
        <div class="relative">
          <Input
            id="amount-input"
            v-model="withdrawalAmount"
            type="number"
            step="0.000001"
            min="0"
            placeholder="0.0"
            class="pr-16"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <span class="text-sm text-muted-foreground">{{ selectedTokenInfo?.symbol }}</span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <Label for="description-input">Description</Label>
        <Textarea
          id="description-input"
          v-model="description"
          placeholder="Describe the purpose of this withdrawal..."
          class="min-h-[100px]"
        />
        <p class="text-xs text-muted-foreground">
          {{ description.length }}/500 characters
        </p>
      </div>

      <!-- Threshold Info -->
      <div v-if="zakoBoxStore.threshold > 0n" class="rounded-md bg-blue-50 p-3 dark:bg-blue-950">
        <p class="text-sm text-blue-900 dark:text-blue-100">
          This proposal will require <span class="font-medium">{{ zakoBoxStore.threshold.toString() }} approval(s)</span> from treasury owners to execute.
        </p>
      </div>

      <!-- Submit Button -->
      <Button
        :disabled="!isFormValid || zakoBoxStore.loading"
        class="w-full"
        @click="handleCreateProposal"
      >
        <span v-if="zakoBoxStore.loading">Creating Proposal...</span>
        <span v-else-if="!walletStore.address">Connect Wallet First</span>
        <span v-else-if="!zakoBoxStore.currentTreasury">Select Treasury First</span>
        <span v-else-if="!zakoBoxStore.isOwner">Not a Treasury Owner</span>
        <span v-else>Create Proposal</span>
      </Button>
    </div>
  </div>
</template>
