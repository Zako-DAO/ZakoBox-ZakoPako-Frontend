/**
 * Contract type definitions
 */

import type { Address } from 'viem'

export interface TreasuryConfig {
  owners: readonly Address[]
  threshold: bigint
  emergencyThreshold: bigint
  dailyLimit: bigint
  whitelistedTokens: readonly Address[]
  whitelistedRecipients: readonly Address[]
  vestingStart: bigint
  vestingDuration: bigint
  vestingCliff: bigint
}

export interface WithdrawalProposal {
  token: Address
  recipient: Address
  amount: bigint
  description: string
  approvalCount: bigint
  executed: boolean
  proposedAt: bigint
}

export interface TreasuryInfo {
  name: string
  description: string
  deployer: Address
  createdAt: bigint
}

export interface TokenInfo {
  address: Address
  name: string
  symbol: string
  decimals: number
  balance: bigint
}

export type NetworkName = 'sepolia' | 'mainnet'

export interface ContractAddresses {
  ZakoBoxFactory: Address
  ZakoBox: Address
}

export interface TokenAddresses {
  PYUSD: Address
  USDC: Address
  USDT: Address
  WETH: Address
}
