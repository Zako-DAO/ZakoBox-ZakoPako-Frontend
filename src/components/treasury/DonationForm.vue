<script setup lang="ts">
import type { Address } from 'viem'
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
import { ZERO_ADDRESS } from '~/contracts/addresses'
import { useWalletStore } from '~/stores/wallet'
import { useZakoBoxStore } from '~/stores/zakobox'
import { formatTokenAmount, getTokenAddresses, parseTokenAmount } from '~/utils/contract'

const props = defineProps<{
  treasuryAddress?: Address
}>()

const walletStore = useWalletStore()
const zakoBoxStore = useZakoBoxStore()

// Form state
const selectedToken = ref<Address>(ZERO_ADDRESS)
const donationAmount = ref<string>('')
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

// Set treasury if provided
if (props.treasuryAddress) {
  zakoBoxStore.setCurrentTreasury(props.treasuryAddress)
}

// Treasury balance for selected token
const treasuryBalance = computed(() => {
  const balance = zakoBoxStore.treasuryBalance[selectedToken.value]
  return balance ? formatTokenAmount(balance, tokenDecimals.value) : '0'
})

// Check if form is valid
const isFormValid = computed(() => {
  if (!walletStore.address)
    return false
  if (!zakoBoxStore.currentTreasury)
    return false
  if (!donationAmount.value || Number(donationAmount.value) <= 0)
    return false
  return true
})

// Handle token selection
function onTokenSelect(value: any) {
  if (typeof value !== 'string')
    return
  selectedToken.value = value as Address

  // Update decimals based on token
  if (value === ZERO_ADDRESS) {
    tokenDecimals.value = 18
  }
  else {
    // For stablecoins (USDC, USDT, PYUSD), typically 6 decimals
    // But we should fetch actual decimals
    tokenDecimals.value = 6
  }

  // Refresh balance when token changes
  if (zakoBoxStore.currentTreasury) {
    zakoBoxStore.getBalance(selectedToken.value)
    zakoBoxStore.getTotalDonations(selectedToken.value)
  }
}

// Handle donation submission
async function handleDonate() {
  if (!isFormValid.value)
    return

  try {
    const amount = parseTokenAmount(donationAmount.value, tokenDecimals.value)
    const hash = await zakoBoxStore.donate(selectedToken.value, amount)

    if (hash) {
      // Clear form on success
      donationAmount.value = ''
    }
  }
  catch (error) {
    console.error('Donation failed:', error)
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
        Donate to Treasury
      </h3>
      <p class="text-sm text-muted-foreground">
        Support this treasury by donating ETH or stablecoins
      </p>
    </div>

    <!-- Treasury Info -->
    <div v-if="zakoBoxStore.currentTreasury" class="rounded-md bg-muted p-4 space-y-2">
      <div class="text-sm">
        <span class="font-medium">Treasury: </span>
        <span class="text-xs font-mono">{{ zakoBoxStore.currentTreasury.slice(0, 10) }}...{{ zakoBoxStore.currentTreasury.slice(-8) }}</span>
      </div>
      <div class="text-sm">
        <span class="font-medium">Current Balance: </span>
        <span>{{ treasuryBalance }} {{ selectedTokenInfo?.symbol }}</span>
      </div>
    </div>

    <!-- Donation Form -->
    <div class="space-y-4">
      <!-- Token Selection -->
      <div class="space-y-2">
        <Label for="token-select">Select Token</Label>
        <Select :model-value="selectedToken" @update:model-value="onTokenSelect">
          <SelectTrigger id="token-select" class="w-full">
            <SelectValue placeholder="Choose token to donate" />
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
      </div>

      <!-- Amount Input -->
      <div class="space-y-2">
        <Label for="amount-input">Amount</Label>
        <div class="relative">
          <Input
            id="amount-input"
            v-model="donationAmount"
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

      <!-- Action Button -->
      <Button
        :disabled="!isFormValid || zakoBoxStore.loading"
        class="w-full"
        @click="handleDonate"
      >
        <span v-if="zakoBoxStore.loading">Processing...</span>
        <span v-else-if="!walletStore.address">Connect Wallet First</span>
        <span v-else-if="!zakoBoxStore.currentTreasury">Select Treasury First</span>
        <span v-else>Donate {{ donationAmount || '0' }} {{ selectedTokenInfo?.symbol }}</span>
      </Button>
    </div>

    <!-- Info Note -->
    <div class="rounded-md bg-blue-50 p-3 text-xs text-blue-900 dark:bg-blue-950 dark:text-blue-100">
      <p class="font-medium">
        Note:
      </p>
      <ul class="mt-1 list-disc list-inside space-y-1">
        <li>ETH donations are sent directly to the treasury</li>
        <li>ERC20 tokens require approval before donation</li>
        <li>You'll be prompted to approve the transaction in your wallet</li>
      </ul>
    </div>
  </div>
</template>
