import type { WalletClient } from 'viem'
import { defineStore } from 'pinia'
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

export const useWalletStore = defineStore('wallet', () => {
  const client = ref<WalletClient | null>(null)
  const address = ref<`0x${string}` | null>(null)

  async function connect() {
    client.value = createWalletClient({
      chain: sepolia,
      // @ts-expect-error window.ethereum is not typed
      transport: custom(window.ethereum!),
    })

    address.value = (await client.value.requestAddresses())[0]
  }

  async function signMessage(message: `0x${string}`) {
    if (!address.value) {
      toast.error('No address found')
      return
    }

    if (!client.value) {
      toast.error('No client found')
      return
    }

    return await client.value.signMessage({
      account: address.value,
      message: { raw: message },
    })
  }

  return {
    address,

    connect,
    signMessage,
  }
})
