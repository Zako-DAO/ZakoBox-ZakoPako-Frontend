<script setup lang="ts">
import type { Address } from 'viem'
import type { TreasuryConfig } from '~/contracts/types'
import { isAddress } from 'viem'
import { computed, ref } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'
import Label from '~/components/ui/label/Label.vue'
import Textarea from '~/components/ui/textarea/Textarea.vue'
import { ZERO_ADDRESS } from '~/contracts/addresses'
import { useWalletStore } from '~/stores/wallet'
import { useZakoBoxFactoryStore } from '~/stores/zakobox-factory'
import { getTokenAddresses, parseTokenAmount } from '~/utils/contract'

const walletStore = useWalletStore()
const factoryStore = useZakoBoxFactoryStore()

// Form state
const treasuryName = ref<string>('')
const treasuryDescription = ref<string>('')
const ownerAddresses = ref<string>('')
const threshold = ref<string>('2')
const emergencyThreshold = ref<string>('1')
const dailyLimit = ref<string>('1000')
const vestingDurationDays = ref<string>('365')
const vestingCliffDays = ref<string>('90')

// Validation
const isFormValid = computed(() => {
  if (!walletStore.address)
    return false
  if (!treasuryName.value.trim())
    return false
  if (!treasuryDescription.value.trim())
    return false
  if (!ownerAddresses.value.trim())
    return false

  // Validate all owner addresses
  const owners = ownerAddresses.value.split(',').map(s => s.trim()).filter(s => s)
  if (owners.length === 0)
    return false
  if (!owners.every(addr => isAddress(addr)))
    return false

  return true
})

// Parse owner addresses
const parsedOwners = computed(() => {
  return ownerAddresses.value
    .split(',')
    .map(s => s.trim())
    .filter(s => s && isAddress(s)) as Address[]
})

// Handle treasury creation
async function handleCreateTreasury() {
  if (!isFormValid.value)
    return

  try {
    const tokenAddresses = getTokenAddresses()

    // Build treasury config
    const config: TreasuryConfig = {
      owners: parsedOwners.value,
      threshold: BigInt(threshold.value),
      emergencyThreshold: BigInt(emergencyThreshold.value),
      dailyLimit: parseTokenAmount(dailyLimit.value, 6), // Assuming USDC decimals
      whitelistedTokens: [
        ZERO_ADDRESS,
        tokenAddresses.PYUSD,
        tokenAddresses.USDC,
        tokenAddresses.USDT,
      ],
      whitelistedRecipients: [], // Empty = no restrictions
      vestingStart: BigInt(Math.floor(Date.now() / 1000)), // Now
      vestingDuration: BigInt(Number(vestingDurationDays.value) * 24 * 60 * 60), // Convert days to seconds
      vestingCliff: BigInt(Number(vestingCliffDays.value) * 24 * 60 * 60),
    }

    const treasuryAddress = await factoryStore.createTreasury(
      config,
      treasuryName.value.trim(),
      treasuryDescription.value.trim(),
    )

    if (treasuryAddress) {
      // Clear form
      treasuryName.value = ''
      treasuryDescription.value = ''
      ownerAddresses.value = ''
      threshold.value = '2'
      emergencyThreshold.value = '1'
      dailyLimit.value = '1000'
      vestingDurationDays.value = '365'
      vestingCliffDays.value = '90'
    }
  }
  catch (error) {
    console.error('Failed to create treasury:', error)
  }
}
</script>

<template>
  <div class="border border-border rounded-lg bg-card p-6 space-y-6">
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">
        Create New Treasury
      </h3>
      <p class="text-sm text-muted-foreground">
        Deploy a new multi-signature treasury contract
      </p>
    </div>

    <div class="space-y-4">
      <!-- Treasury Name -->
      <div class="space-y-2">
        <Label for="name-input">Treasury Name</Label>
        <Input
          id="name-input"
          v-model="treasuryName"
          type="text"
          placeholder="e.g., ZakoDAO Operations Fund"
        />
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <Label for="description-input">Description</Label>
        <Textarea
          id="description-input"
          v-model="treasuryDescription"
          placeholder="Describe the purpose of this treasury..."
          class="min-h-[80px]"
        />
      </div>

      <!-- Owner Addresses -->
      <div class="space-y-2">
        <Label for="owners-input">Owner Addresses (comma-separated)</Label>
        <Textarea
          id="owners-input"
          v-model="ownerAddresses"
          placeholder="0x..., 0x..., 0x..."
          class="min-h-[100px] text-xs font-mono"
        />
        <p class="text-xs text-muted-foreground">
          {{ parsedOwners.length }} valid owner(s)
        </p>
      </div>

      <!-- Multi-sig Settings -->
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <Label for="threshold-input">Approval Threshold</Label>
          <Input
            id="threshold-input"
            v-model="threshold"
            type="number"
            min="1"
            placeholder="2"
          />
          <p class="text-xs text-muted-foreground">
            Required approvals for withdrawals
          </p>
        </div>

        <div class="space-y-2">
          <Label for="emergency-threshold-input">Emergency Threshold</Label>
          <Input
            id="emergency-threshold-input"
            v-model="emergencyThreshold"
            type="number"
            min="1"
            placeholder="1"
          />
          <p class="text-xs text-muted-foreground">
            Required approvals for emergency withdrawals
          </p>
        </div>
      </div>

      <!-- Daily Limit -->
      <div class="space-y-2">
        <Label for="daily-limit-input">Daily Withdrawal Limit (USDC)</Label>
        <Input
          id="daily-limit-input"
          v-model="dailyLimit"
          type="number"
          step="0.01"
          min="0"
          placeholder="1000"
        />
      </div>

      <!-- Vesting Settings -->
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <Label for="vesting-duration-input">Vesting Duration (days)</Label>
          <Input
            id="vesting-duration-input"
            v-model="vestingDurationDays"
            type="number"
            min="0"
            placeholder="365"
          />
        </div>

        <div class="space-y-2">
          <Label for="vesting-cliff-input">Vesting Cliff (days)</Label>
          <Input
            id="vesting-cliff-input"
            v-model="vestingCliffDays"
            type="number"
            min="0"
            placeholder="90"
          />
        </div>
      </div>

      <!-- Info Box -->
      <div class="rounded-md bg-blue-50 p-3 text-xs text-blue-900 dark:bg-blue-950 dark:text-blue-100">
        <p class="font-medium">
          Note:
        </p>
        <ul class="mt-1 list-disc list-inside space-y-1">
          <li>Treasury uses CREATE2 for deterministic deployment</li>
          <li>All owners will have equal voting power</li>
          <li>Whitelisted tokens: ETH, PYUSD, USDC, USDT</li>
          <li>Vesting schedule starts immediately upon creation</li>
        </ul>
      </div>

      <!-- Submit Button -->
      <Button
        :disabled="!isFormValid || factoryStore.loading"
        class="w-full"
        @click="handleCreateTreasury"
      >
        <span v-if="factoryStore.loading">Deploying Treasury...</span>
        <span v-else-if="!walletStore.address">Connect Wallet First</span>
        <span v-else>Deploy Treasury</span>
      </Button>
    </div>
  </div>
</template>
