import type { AxiosError } from 'feaxios'
import type { User } from '~/types/sessions'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Api } from '~/api'
import { useWalletStore } from './wallet'

export const useSessionsStore = defineStore('sessions', () => {
  const walletStore = useWalletStore()
  const { address } = storeToRefs(walletStore)
  const router = useRouter()

  const session = ref<User | null>(null)

  async function getSession() {
    try {
      const response = await Api.sessions.index()
      session.value = response.data
    }
    catch (err) {
      const error = err as AxiosError
      if (session.value && error.response?.status === 401) {
        toast.error('Session expired, please login again.')
        router.replace('/')
      }
    }
  }

  async function createSession() {
    await walletStore.connect()
    if (!address.value) {
      toast.error('No address found.')
      return
    }

    const message = (await Api.sessionMessages.create(address.value)).data
    const signature = await walletStore.signMessage(message)
    if (!signature) {
      toast.error('Failed to sign message.')
      return
    }

    const response = await Api.sessions.create(address.value, signature)
    session.value = response.data
  }

  async function destroySession() {
    try {
      await Api.sessions.destroy()
    }
    catch (err) {
      console.error('Failed to destroy session:', err)
    }
    session.value = null
    walletStore.address = null
    router.replace('/')
  }

  return {
    session,
    getSession,
    createSession,
    destroySession,
  }
})
