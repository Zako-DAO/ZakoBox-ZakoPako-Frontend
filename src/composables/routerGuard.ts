import type { Router } from 'vue-router'
import { useSessionsStore } from '~/stores/sessions'

export function routerGuard(router: Router) {
  router.beforeEach(async (to) => {
    const sessionsStore = useSessionsStore()
    if (!sessionsStore.session)
      await sessionsStore.getSession()
    const loggingIn = !!sessionsStore.session
    const loggingInRoutes = ['/create-vault', '/my-vault', '/withdraw']
    if (loggingInRoutes.includes(to.path) && !loggingIn)
      return '/'
  })
}
