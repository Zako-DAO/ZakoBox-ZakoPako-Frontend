<script setup lang="ts">
import type { Address } from 'viem'
import { computed, onMounted, ref } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useWalletStore } from '~/stores/wallet'
import { useZakoBoxStore } from '~/stores/zakobox'
import { useZakoBoxFactoryStore } from '~/stores/zakobox-factory'

const props = defineProps<{
  showAllTreasuries?: boolean // Show all treasuries or just user's
}>()

const emit = defineEmits<{
  treasurySelected: [address: Address]
}>()

const walletStore = useWalletStore()
const factoryStore = useZakoBoxFactoryStore()
const zakoBoxStore = useZakoBoxStore()

const selectedTreasury = ref<Address | null>(null)
const treasuryInfos = ref<Map<Address, { name: string, description: string }>>(new Map())

// Get treasury list based on showAllTreasuries prop
const treasuryList = computed(() => {
  if (props.showAllTreasuries) {
    // Show all treasuries (would need to implement getAllTreasuries in factory store)
    return factoryStore.userTreasuries
  }
  else {
    // Show only user's treasuries
    return factoryStore.userTreasuries
  }
})

// Load treasury info for display
async function loadTreasuryInfo(address: Address) {
  const info = await factoryStore.getTreasuryInfo(address)
  if (info) {
    treasuryInfos.value.set(address, {
      name: info.name,
      description: info.description,
    })
  }
}

// Handle treasury selection
function onTreasurySelect(value: any) {
  if (typeof value !== 'string')
    return
  selectedTreasury.value = value as Address
  zakoBoxStore.setCurrentTreasury(value as Address)
  emit('treasurySelected', value as Address)

  // Load treasury data
  zakoBoxStore.loadTreasuryData()
}

// Load user treasuries on mount
onMounted(async () => {
  if (walletStore.address) {
    await factoryStore.getUserTreasuries()

    // Load info for each treasury
    for (const address of factoryStore.userTreasuries) {
      await loadTreasuryInfo(address)
    }
  }
})

// Format address for display
function formatAddress(address: Address): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Get treasury display name
function getTreasuryName(address: Address): string {
  const info = treasuryInfos.value.get(address)
  return info?.name || formatAddress(address)
}
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">
        Select Treasury
      </h3>
      <p class="text-sm text-muted-foreground">
        {{ showAllTreasuries ? 'Choose any treasury to interact with' : 'Choose from your deployed treasuries' }}
      </p>
    </div>

    <!-- No wallet connected -->
    <div v-if="!walletStore.address" class="border border-border rounded-lg bg-muted p-6 text-center">
      <p class="text-sm text-muted-foreground">
        Connect your wallet to view treasuries
      </p>
    </div>

    <!-- No treasuries found -->
    <div v-else-if="treasuryList.length === 0" class="border border-border rounded-lg bg-muted p-6 text-center">
      <p class="text-sm text-muted-foreground">
        No treasuries found. Create one to get started!
      </p>
    </div>

    <!-- Treasury selector -->
    <div v-else class="space-y-4">
      <Select :model-value="selectedTreasury || undefined" @update:model-value="onTreasurySelect">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Choose a treasury" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Available Treasuries</SelectLabel>
            <SelectItem
              v-for="address in treasuryList"
              :key="address"
              :value="address"
            >
              <div class="space-y-1">
                <div class="font-medium">
                  {{ getTreasuryName(address) }}
                </div>
                <div class="text-xs text-muted-foreground font-mono">
                  {{ formatAddress(address) }}
                </div>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <!-- Selected treasury info -->
      <div v-if="selectedTreasury" class="border border-border rounded-lg bg-card p-4">
        <div class="space-y-2">
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <h4 class="font-medium">
                {{ getTreasuryName(selectedTreasury) }}
              </h4>
              <p class="text-xs text-muted-foreground font-mono">
                {{ selectedTreasury }}
              </p>
            </div>
            <Button
              v-if="zakoBoxStore.isOwner"
              variant="outline"
              size="sm"
            >
              Owner
            </Button>
          </div>
          <p v-if="treasuryInfos.get(selectedTreasury)?.description" class="text-sm text-muted-foreground">
            {{ treasuryInfos.get(selectedTreasury)?.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Refresh button -->
    <Button
      v-if="walletStore.address"
      variant="outline"
      class="w-full"
      :disabled="factoryStore.loading"
      @click="factoryStore.getUserTreasuries()"
    >
      <span v-if="factoryStore.loading">Loading...</span>
      <span v-else>Refresh Treasury List</span>
    </Button>
  </div>
</template>
