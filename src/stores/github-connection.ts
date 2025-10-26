import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Api } from '~/api'

export const useGithubConnectionStore = defineStore('github-connection', () => {
  const githubConnection = ref<any | null>(null)

  async function getGithubConnection() {
    try {
      const response = await Api.githubConnections.index()
      githubConnection.value = response.data
    }
    catch (err) {
      console.error('Failed to get GitHub connection:', err)
      toast.error('Failed to get GitHub connection status.')
    }
  }

  async function destroyGithubConnection() {
    try {
      await Api.githubConnections.destroy()
      githubConnection.value = null
    }
    catch (err) {
      console.error('Failed to disconnect from GitHub:', err)
      toast.error('Failed to disconnect from GitHub.')
    }
  }

  return {
    githubConnection,
    getGithubConnection,
    destroyGithubConnection,
  }
})
