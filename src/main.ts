import type { UserModule } from './types'
import { setupLayouts } from 'layouts-generated'
import { createApp, vaporInteropPlugin } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useSessionsStore } from '~/stores/sessions'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'vue-sonner/style.css'
import './styles/main.css'
import 'uno.css'

const routesWithLayouts = setupLayouts(routes)

const router = createRouter({
  history: createWebHistory(),
  routes: routesWithLayouts,
})

router.beforeEach(async (to) => {
  const sessionsStore = useSessionsStore()
  if (!sessionsStore.session)
    await sessionsStore.getSession()
  const isLoggedIn = !!sessionsStore.session
  const signinRoutes = ['/create-vault', '/my-vault', '/withdraw']
  if (signinRoutes.includes(to.path) && !isLoggedIn)
    return '/'
})

const app = createApp(App)
app.use(router)
app.use(vaporInteropPlugin)

Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
  .forEach(i => i.install?.(app, router))

app.mount('#app')
