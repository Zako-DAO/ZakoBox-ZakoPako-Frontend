import type { AxiosInstance } from 'feaxios'
import type { User } from '~/types/sessions'

export function useSessionsApi(httpClient: AxiosInstance) {
  return {
    index: () => httpClient.get<User>('/sessions'),
    create: (address: string, signature: string) => httpClient.post<User>('/sessions', { address, signature }),
    destroy: () => httpClient.delete<void>('/sessions'),
  }
}
