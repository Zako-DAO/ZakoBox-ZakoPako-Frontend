/**
 * Contract addresses for different networks
 */

export const CONTRACTS = {
  // Sepolia Testnet
  sepolia: {
    ZakoBoxFactory: '0x53ada14a75e18a8f5ce0e65a87442857f472924a', // Factory Proxy (main entry point)
    ZakoBox: '0x48f6337fc82b3571cb16f0271e9d08ce73be7df8', // ZakoBox Implementation
  },
  // Ethereum Mainnet
  mainnet: {
    ZakoBoxFactory: '0x0000000000000000000000000000000000000000',
    ZakoBox: '0x0000000000000000000000000000000000000000',
  },
} as const

// Token addresses
export const TOKENS = {
  sepolia: {
    PYUSD: '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9', // Sepolia PYUSD
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
    USDT: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0', // Sepolia USDT
    WETH: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9', // Sepolia WETH
  },
  mainnet: {
    PYUSD: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
} as const

// Zero address for ETH
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const
