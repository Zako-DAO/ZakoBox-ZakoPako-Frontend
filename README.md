# ZakoBox/ZakoPako Frontend

**An All-in-One On-Chain Governance and Fundraising Tool for Open Source Development Teams**

_Yet another Vue/Vite-based frontend for the ultimate funding tool for real Zakos only_

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-3.6-green.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple.svg)](https://vitejs.dev/)

---

## 📖 About

ZakoBox/ZakoPako is a dedicated on-chain governance and fundraising tool developed for Project Airi's Core-Dev-DAO (ZakoDAO). It addresses pain points in team collaboration, fund management, and decision governance for decentralized open-source projects.

Built as an ETHOnline 2025 hackathon project, ZakoBox aims to become an on-chain version of OpenCollective, combining features from Guild.xyz, SAFE frontend, and Snapshot/Aragon. Unlike traditional DAO platforms, it focuses on internal development team governance rather than large-scale community governance.

## ✨ Features

### MVP Stage (Hackathon)

**🏦 Treasury Management**
- ZakoBox smart contract vault for fund storage and management
- Multi-signature wallet integration (SAFE)
- Real-time treasury balance display
- Multi-token support (ETH, USDC, USDT, PYUSD)
- Secure fund withdrawal mechanisms

**💰 On-Chain Fundraising**
- GitHub integration with one-click donation to designated vaults
- Direct on-chain donation portal
- PYUSD stablecoin priority support (hackathon bonus points)
- Cross-chain asset bridging (Jumper aggregator integration)

**📊 Data Transparency**
- Deep integration with Blockscout SDK (hackathon bonus points)
- Simplified donation/crowdfunding data dashboard
- Real-time fund flow tracking
- Transaction history visualization

**🔐 Web3 Integration**
- Multi-wallet support (MetaMask, WalletConnect)
- Automatic network switching (Sepolia testnet)
- Real-time transaction status tracking
- Wallet signature-based authentication

### Future Roadmap

- DAO creation and management
- On-chain voting governance system
- Proposal system with execution mechanisms
- Token economic system
- Community incentive programs
- Multi-chain deployment support

## 🛠️ Tech Stack

### Core Framework
- **[Vue 3.6](https://vuejs.org/)** - Progressive JavaScript framework (Alpha with Vapor mode support)
- **[TypeScript 5.9+](https://www.typescriptlang.org/)** - Type-safe JavaScript superset
- **[Rolldown Vite 7.1](https://rolldown.rs/)** - Rust-based high-performance build tool

### State Management & Routing
- **[Pinia 3.0+](https://pinia.vuejs.org/)** - Intuitive state management for Vue
- **[Vue Router 4.5+](https://router.vuejs.org/)** - Official router for Vue.js
- **[unplugin-vue-router](https://github.com/posva/unplugin-vue-router)** - File-system based routing

### Web3 Integration
- **[Viem 2.38+](https://viem.sh/)** - Type-safe TypeScript Ethereum interface library
- Sepolia testnet support
- MetaMask wallet connection

### Styling & UI
- **[UnoCSS 66.5+](https://unocss.dev/)** - Instant on-demand atomic CSS engine
- **[shadcn-vue](https://www.shadcn-vue.com/)** - Accessible component library
- **[Reka UI](https://www.reka-ui.com/)** - Unstyled Vue component library
- **[Tailwind CSS](https://tailwindcss.com/)** compatible syntax

### Development Tools
- **[Vitest 3.2+](https://vitest.dev/)** - Unit testing framework powered by Vite
- **[Oxlint](https://oxc-project.github.io/)** - High-performance Rust linter
- **[ESLint 9](https://eslint.org/)** - JavaScript/TypeScript code linting
- **[pnpm 10.18+](https://pnpm.io/)** - Fast, disk space efficient package manager

### Other Libraries
- **[Vue I18n 11+](https://vue-i18n.intlify.dev/)** - Internationalization plugin for Vue.js
- **[VueUse](https://vueuse.org/)** - Collection of Vue Composition API utilities
- **[feaxios](https://github.com/huodoushigemi/feaxios)** - Enhanced Axios HTTP client

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 10.18.0
- Modern browser with MetaMask support

### Installation

```bash
# Clone the repository
git clone https://github.com/ZakoDAO/ZakoBox-ZakoPako-Frontend.git
cd ZakoBox-ZakoPako-Frontend

# Install dependencies
pnpm install
```

### Development Server

```bash
# Start development server on port 3334
pnpm dev
```

Visit [http://localhost:3334](http://localhost:3334) to view the application.

## 🧪 Local Testing Guide

### 1. Setup Prerequisites

#### Install MetaMask Wallet

1. Install the [MetaMask](https://metamask.io/) browser extension
2. Create a new wallet or import an existing one
3. Switch to **Sepolia Test Network**
   - Click the network dropdown in MetaMask
   - Enable "Show test networks" in Settings if needed
   - Select "Sepolia"

#### Get Test Tokens

You'll need Sepolia ETH to interact with the application:

1. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
2. Or use [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia)
3. Or [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
4. Enter your wallet address and request test ETH

### 2. Start Backend Service (Optional)

The development server proxies `/api/v1` requests to `http://localhost:3001/api/v1`.

If you have the backend service available:

```bash
# Navigate to backend directory
cd ../ZakoBox-ZakoPako-Backend

# Follow backend README to start the service
# Typically: npm run dev or similar
```

**Note:** The frontend can run without the backend for wallet connection and basic UI testing.

### 3. Start Frontend Development Server

```bash
# Start the development server
pnpm dev

# For HTTPS testing (if needed for wallet connections)
pnpm preview-https
```

The application will be available at [http://localhost:3334](http://localhost:3334)

### 4. Test Wallet Connection

1. Open your browser and navigate to [http://localhost:3334](http://localhost:3334)
2. Click the **"Connect Wallet"** button in the UI
3. A MetaMask popup will appear - click **"Connect"**
4. Select the account(s) you want to connect
5. Confirm the connection
6. If prompted, switch to Sepolia network
7. Verify that your wallet address is displayed correctly in the UI

**Troubleshooting Wallet Connection:**
- Ensure MetaMask is unlocked
- Check browser console for errors (F12 → Console tab)
- Try refreshing the page
- Restart your browser if issues persist

### 5. Test Core Features

#### Test GitHub Integration

1. Navigate to the GitHub connection page
2. Click **"Connect GitHub"** to authorize
3. Complete the OAuth flow
4. Verify GitHub account information is displayed correctly

#### Test Vault Features

1. Navigate to **"My Vault"** page
2. View current vault balance
3. Check transaction history
4. Test withdrawal operations (requires multi-sig wallet permissions)

#### Test Vault Creation

1. Navigate to **"Create Vault"** page
2. Fill in vault information:
   - Vault name
   - Description
   - Initial settings
3. Submit the transaction
4. Confirm the transaction in MetaMask
5. Wait for transaction confirmation
6. Verify the new vault appears in your vault list

### 6. Run Unit Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage report
pnpm test --coverage

# Run tests in watch mode (re-runs on file changes)
pnpm test --watch

# Run specific test file
pnpm test src/stores/wallet.test.ts
```

### 7. Code Quality Checks

```bash
# Run linters (Oxlint + ESLint)
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# TypeScript type checking
pnpm typecheck

# Find unused files, dependencies, and exports
pnpm knip
```

### 8. Build for Production

```bash
# Build production bundle
pnpm build

# Preview production build locally
pnpm preview

# Analyze bundle size
pnpm sizecheck
```

The build output will be in the `dist/` directory.

### 9. Common Issues & Solutions

#### Wallet Connection Issues

**Problem:** MetaMask not detected
- **Solution:** Ensure MetaMask extension is installed and enabled
- **Solution:** Try refreshing the page or restarting the browser

**Problem:** Wrong network
- **Solution:** Manually switch to Sepolia in MetaMask
- **Solution:** The app should prompt for network switch automatically

**Problem:** Connection rejected
- **Solution:** Check MetaMask is unlocked
- **Solution:** Review and accept the connection in MetaMask popup

#### API Request Failures

**Problem:** 404 errors on `/api/v1` endpoints
- **Solution:** Ensure backend service is running on `localhost:3001`
- **Solution:** Check proxy configuration in `vite.config.ts`

**Problem:** CORS errors
- **Solution:** Verify backend CORS settings allow `localhost:3334`
- **Solution:** Use the backend's configured allowed origins

#### Transaction Failures

**Problem:** Insufficient funds
- **Solution:** Get more test ETH from Sepolia faucets
- **Solution:** Check your wallet balance in MetaMask

**Problem:** Transaction reverted
- **Solution:** Check contract requirements (e.g., minimum amount, permissions)
- **Solution:** Review transaction details in block explorer
- **Solution:** Verify you're on the correct network (Sepolia)

**Problem:** Gas estimation failed
- **Solution:** Ensure you have enough ETH for gas fees
- **Solution:** Try increasing gas limit manually in MetaMask

#### Type Errors

**Problem:** TypeScript compilation errors
- **Solution:** Run `pnpm typecheck` to see detailed errors
- **Solution:** Ensure all dependencies are installed correctly
- **Solution:** Delete `node_modules` and `pnpm-lock.yaml`, then run `pnpm install`

**Problem:** Module not found
- **Solution:** Check the path alias (`~/`) is configured correctly
- **Solution:** Restart your IDE/editor TypeScript server

#### Build Errors

**Problem:** Out of memory during build
- **Solution:** Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`

**Problem:** Module resolution errors
- **Solution:** Check `tsconfig.json` and `vite.config.ts` path configurations
- **Solution:** Clear Vite cache: `rm -rf node_modules/.vite`

## 📁 Project Structure

```
ZakoBox-ZakoPako-Frontend/
├── docs/                       # Project documentation
│   └── requirements_zh.md      # Chinese requirements document
├── locales/                    # Internationalization translation files
│   ├── en.yml                 # English translations
│   └── zh-CN.yml              # Chinese translations
├── public/                     # Static assets
├── src/
│   ├── api/                   # API interface layer
│   │   ├── index.ts           # Unified HTTP client
│   │   ├── sessions.ts        # Session API
│   │   ├── sessionMessages.ts # Session messages API
│   │   └── github-connection.ts # GitHub connection API
│   ├── components/            # Vue components
│   │   └── ui/               # shadcn-vue UI components
│   ├── composables/           # Vue composable functions
│   │   └── dark.ts           # Dark mode composable
│   ├── layouts/               # Page layouts
│   │   ├── default.vue       # Default layout
│   │   └── 404.vue           # 404 page layout
│   ├── modules/               # Application modules
│   │   ├── i18n.ts           # Internationalization setup
│   │   ├── nprogress.ts      # Progress bar configuration
│   │   └── pinia.ts          # State management initialization
│   ├── pages/                 # Page routes (file-system routing)
│   │   ├── index.vue         # Home page
│   │   ├── create-vault.vue  # Create vault page
│   │   ├── my-vault.vue      # My vault page
│   │   └── withdraw.vue      # Withdraw page
│   ├── stores/                # Pinia state stores
│   │   ├── wallet.ts         # Wallet state
│   │   ├── sessions.ts       # Session state
│   │   └── github-connection.ts # GitHub connection state
│   ├── styles/                # Global styles
│   │   └── main.css          # Main stylesheet
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   ├── App.vue                # Root component
│   ├── main.ts                # Application entry point
│   └── typed-router.d.ts      # Router type definitions
├── CLAUDE.md                  # Claude Code guidance
├── README.md                  # Project documentation (this file)
├── components.json            # shadcn-vue configuration
├── eslint.config.ts           # ESLint configuration
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── uno.config.ts              # UnoCSS configuration
├── vite.config.ts             # Vite configuration
└── vitest.config.ts           # Vitest configuration
```

## 🔧 Development Guide

### Module System

The application uses a modular initialization pattern. Each module in `src/modules/` exports an `install` function that is automatically invoked during app startup.

**Creating a new module:**

```typescript
// src/modules/example.ts
import type { UserModule } from '~/types'

export const install: UserModule = (app, router) => {
  // Initialize plugin
  app.use(somePlugin)

  // Add router guards
  router.beforeEach((to, from) => {
    // Your logic here
  })
}
```

### File-Based Routing

Routes are automatically generated from the file structure in `src/pages/`.

**Adding a new page:**

1. Create a `.vue` file in `src/pages/`
2. The route is automatically generated based on the filename
3. Use type-safe navigation:

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
router.push({ name: '/my-vault' })
```

### API Integration

**Creating a new API module:**

```typescript
// src/api/example.ts
import type { AxiosInstance } from 'axios'

export const useExampleApi = (client: AxiosInstance) => ({
  getItems: () => client.get('/items'),
  createItem: (data: any) => client.post('/items', data),
})
```

**Registering the API:**

```typescript
// src/api/index.ts
import { useExampleApi } from './example'

export const Api = {
  // ... existing APIs
  example: useExampleApi(httpClient),
}
```

### State Management

**Creating a new Pinia store:**

```typescript
// src/stores/example.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

**Using the store in a component:**

```vue
<script setup lang="ts">
import { useExampleStore } from '~/stores/example'

const store = useExampleStore()
</script>

<template>
  <div>
    <p>Count: {{ store.count }}</p>
    <button @click="store.increment">Increment</button>
  </div>
</template>
```

### Styling with UnoCSS

UnoCSS provides Tailwind-compatible utility classes:

```vue
<template>
  <div class="flex items-center justify-center p-4 bg-teal-700 hover:bg-teal-800">
    <button class="btn">Click me</button>
  </div>
</template>
```

**Custom shortcuts** are defined in `uno.config.ts`:
- `btn` - Pre-styled button
- `icon-btn` - Icon button with hover effects

## 📝 Available Scripts

```bash
# Development
pnpm dev              # Start dev server on port 3334
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm preview-https    # Preview with HTTPS

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Run unit tests

# Code Quality
pnpm lint             # Run oxlint and eslint
pnpm lint:fix         # Auto-fix linting issues
pnpm typecheck        # Run TypeScript type checking

# Utilities
pnpm sizecheck        # Analyze bundle size
pnpm knip             # Find unused files/dependencies
pnpm up               # Update dependencies to latest major versions
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/ZakoBox-ZakoPako-Frontend.git`
3. **Create** a feature branch: `git checkout -b feature/AmazingFeature`
4. **Make** your changes
5. **Commit** your changes: `git commit -m 'Add some AmazingFeature'`
6. **Push** to the branch: `git push origin feature/AmazingFeature`
7. **Open** a Pull Request

### Code Standards

- Follow [@antfu/eslint-config](https://github.com/antfu/eslint-config) guidelines
- Pre-commit hooks automatically run lint-staged
- Maintain TypeScript type safety - no `any` types without justification
- Write unit tests for new features and bug fixes
- Update documentation for API changes

### Commit Messages

Follow the conventional commits specification:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- [Requirements Document](docs/requirements_zh.md) (Chinese)
- [Claude Code Guide](CLAUDE.md)
- [Smart Contracts Repository](../ZakoBox-ZakoPako-Contracts)
- [Project Documentation](../ZakoBox-ZakoPako-Docs)

## 📮 Contact & Support

- **GitHub Issues:** [Submit an issue](https://github.com/ZakoDAO/ZakoBox-ZakoPako-Frontend/issues)
- **ZakoDAO:** [Project homepage](https://github.com/ZakoDAO)
- **ETHOnline 2025:** Hackathon project submission

## 🙏 Acknowledgments

- Built for [ETHOnline 2025](https://ethglobal.com/events/ethonline2025) hackathon
- Developed by [ZakoDAO](https://github.com/ZakoDAO) for Project Airi
- Inspired by OpenCollective, Guild.xyz, SAFE, Snapshot, and Aragon

---

**Made with ❤️ by ZakoDAO**

_For real Zakos only_
