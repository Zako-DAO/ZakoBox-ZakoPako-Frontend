import type { AxiosInstance } from 'feaxios'
import type { GithubConnection } from '~/types/github-connections'

export function useGithubConnectionsApi(httpClient: AxiosInstance) {
  return {
    index: () => httpClient.get<GithubConnection>('/github-connections'),
    destroy: () => httpClient.delete<void>('/github-connections'),
  }
}
