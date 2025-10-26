/**
 * Contract interaction utilities
 */

import type { Address, Hash, WalletClient } from 'viem'
import { createPublicClient, createWalletClient, custom, http, parseUnits } from 'viem'
import { sepolia } from 'viem/chains'
import { toast } from 'vue-sonner'
import { ERC20ABI } from '~/contracts/abis'
import { CONTRACTS, TOKENS, ZERO_ADDRESS } from '~/contracts/addresses'

// Public client for reading contract data
export function createContractPublicClient() {
  return createPublicClient({
    chain: sepolia,
    transport: http(),
  })
}

// Wallet client for writing to contracts
export function createContractWalletClient() {
  // @ts-expect-error window.ethereum is not typed
  if (typeof window === 'undefined' || !window.ethereum)
    return null

  return createWalletClient({
    chain: sepolia,
    // @ts-expect-error window.ethereum is not typed
    transport: custom(window.ethereum),
  })
}

/**
 * Wait for transaction and show toast notifications
 */
export async function waitForTransaction(
  hash: Hash,
  successMessage = 'Transaction confirmed',
  errorMessage = 'Transaction failed',
) {
  try {
    const publicClient = createContractPublicClient()
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    if (receipt.status === 'success') {
      toast.success(successMessage)
      return receipt
    }
    else {
      toast.error(errorMessage)
      return null
    }
  }
  catch (error) {
    console.error('Transaction error:', error)
    toast.error(errorMessage)
    return null
  }
}

/**
 * Parse token amount with decimals
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  return parseUnits(amount, decimals)
}

/**
 * Format token amount from wei
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals)
  const integerPart = amount / divisor
  const fractionalPart = amount % divisor

  if (fractionalPart === 0n)
    return integerPart.toString()

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  return `${integerPart}.${fractionalStr.replace(/0+$/, '')}`
}

/**
 * Get current network contract addresses
 */
export function getContractAddresses() {
  // For now, we only support Sepolia
  return CONTRACTS.sepolia
}

/**
 * Get current network token addresses
 */
export function getTokenAddresses() {
  // For now, we only support Sepolia
  return TOKENS.sepolia
}

/**
 * Check if address is ETH (zero address)
 */
export function isETH(tokenAddress: Address): boolean {
  return tokenAddress.toLowerCase() === ZERO_ADDRESS.toLowerCase()
}

/**
 * Get token decimals
 */
export async function getTokenDecimals(tokenAddress: Address): Promise<number> {
  if (isETH(tokenAddress))
    return 18

  try {
    const publicClient = createContractPublicClient()
    const decimals = await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20ABI,
      functionName: 'decimals',
    })
    return decimals
  }
  catch (error) {
    console.error('Failed to get token decimals:', error)
    return 18 // Default to 18
  }
}

/**
 * Get token info (name, symbol, decimals)
 */
export async function getTokenInfo(tokenAddress: Address) {
  if (isETH(tokenAddress)) {
    return {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: tokenAddress,
    }
  }

  try {
    const publicClient = createContractPublicClient()
    const [name, symbol, decimals] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: 'name',
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: 'symbol',
      }),
      publicClient.readContract({
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: 'decimals',
      }),
    ])

    return {
      name,
      symbol,
      decimals,
      address: tokenAddress,
    }
  }
  catch (error) {
    console.error('Failed to get token info:', error)
    throw error
  }
}

/**
 * Check token allowance
 */
export async function checkTokenAllowance(
  tokenAddress: Address,
  owner: Address,
  spender: Address,
): Promise<bigint> {
  if (isETH(tokenAddress))
    return BigInt(Number.MAX_SAFE_INTEGER) // ETH doesn't need approval

  try {
    const publicClient = createContractPublicClient()
    const allowance = await publicClient.readContract({
      address: tokenAddress,
      abi: ERC20ABI,
      functionName: 'allowance',
      args: [owner, spender],
    })
    return allowance
  }
  catch (error) {
    console.error('Failed to check allowance:', error)
    return 0n
  }
}

/**
 * Approve token spending
 */
export async function approveToken(
  walletClient: WalletClient,
  tokenAddress: Address,
  spender: Address,
  amount: bigint,
): Promise<Hash | null> {
  if (isETH(tokenAddress))
    return null // ETH doesn't need approval

  try {
    const [account] = await walletClient.getAddresses()

    const hash = await walletClient.writeContract({
      address: tokenAddress,
      abi: ERC20ABI,
      functionName: 'approve',
      args: [spender, amount],
      account,
    } as any)

    toast.info('Approving token spending...')
    await waitForTransaction(hash, 'Token approved successfully')

    return hash
  }
  catch (error) {
    console.error('Failed to approve token:', error)
    toast.error('Failed to approve token')
    return null
  }
}
