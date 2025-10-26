<script setup lang="ts">
import type { Address } from 'viem'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import { ZERO_ADDRESS } from '~/contracts/addresses'
import { useZakoBoxStore } from '~/stores/zakobox'
import { formatTokenAmount, getTokenAddresses } from '~/utils/contract'

const props = defineProps<{
  treasuryAddress: Address
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
}>()

const zakoBoxStore = useZakoBoxStore()

// Token list
const tokenAddresses = getTokenAddresses()
const tokens = ref([
  { address: ZERO_ADDRESS, symbol: 'ETH', decimals: 18 },
  { address: tokenAddresses.PYUSD, symbol: 'PYUSD', decimals: 6 },
  { address: tokenAddresses.USDC, symbol: 'USDC', decimals: 6 },
  { address: tokenAddresses.USDT, symbol: 'USDT', decimals: 6 },
])

// Set current treasury
zakoBoxStore.setCurrentTreasury(props.treasuryAddress)

// Get balance for a token
function getTokenBalance(tokenAddress: Address, decimals: number): string {
  const balance = zakoBoxStore.treasuryBalance[tokenAddress]
  return balance ? formatTokenAmount(balance, decimals) : '0'
}

// Get total donations for a token
function getTokenDonations(tokenAddress: Address, decimals: number): string {
  const total = zakoBoxStore.totalDonations[tokenAddress]
  return total ? formatTokenAmount(total, decimals) : '0'
}

// Load all balances
async function loadAllBalances() {
  const promises = tokens.value.map(async (token) => {
    await zakoBoxStore.getBalance(token.address)
    await zakoBoxStore.getTotalDonations(token.address)
  })
  await Promise.all(promises)
}

// Refresh interval
let refreshIntervalId: ReturnType<typeof setInterval> | null = null

// Calculate total value (simplified - assumes all stablecoins = $1)
const totalValueUSD = computed(() => {
  let total = 0

  // Add stablecoins (PYUSD, USDC, USDT)
  tokens.value.forEach((token) => {
    if (token.symbol !== 'ETH') {
      const balance = zakoBoxStore.treasuryBalance[token.address]
      if (balance) {
        const amount = Number.parseFloat(formatTokenAmount(balance, token.decimals))
        total += amount
      }
    }
  })

  return total.toFixed(2)
})

onMounted(async () => {
  await loadAllBalances()

  // Set up auto-refresh if enabled
  if (props.autoRefresh) {
    const interval = props.refreshInterval || 30000 // Default 30 seconds
    refreshIntervalId = setInterval(() => {
      loadAllBalances()
    }, interval)
  }
})

// Cleanup
onUnmounted(() => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
  }
})
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">
        Treasury Balances
      </h3>
      <p class="text-sm text-muted-foreground">
        Current holdings and total donations received
      </p>
    </div>

    <!-- Total Value Card -->
    <div class="border border-border rounded-lg from-blue-50 to-indigo-50 bg-gradient-to-br p-6 dark:from-blue-950 dark:to-indigo-950">
      <div class="space-y-1">
        <p class="text-sm text-muted-foreground font-medium">
          Estimated Total Value (Stablecoins)
        </p>
        <p class="text-3xl font-bold">
          ${{ totalValueUSD }}
        </p>
      </div>
    </div>

    <!-- Token Balances -->
    <div class="space-y-3">
      <div
        v-for="token in tokens"
        :key="token.address"
        class="border border-border rounded-lg bg-card p-4 transition-colors hover:bg-accent"
      >
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <p class="font-medium">
              {{ token.symbol }}
            </p>
            <p class="text-xs text-muted-foreground">
              Total Donations: {{ getTokenDonations(token.address, token.decimals) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold">
              {{ getTokenBalance(token.address, token.decimals) }}
            </p>
            <p class="text-xs text-muted-foreground">
              {{ token.symbol }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Refresh Button -->
    <Button
      variant="outline"
      class="w-full"
      :disabled="zakoBoxStore.loading"
      @click="loadAllBalances"
    >
      <span v-if="zakoBoxStore.loading">Refreshing...</span>
      <span v-else>Refresh Balances</span>
    </Button>
  </div>
</template>
