import type { AxiosInstance } from 'feaxios'

export function useSessionMessagesApi(httpClient: AxiosInstance) {
  return {
    create: (address: `0x${string}`) => httpClient.post<`0x${string}`>(`/session-messages`, { address }),
  }
}
