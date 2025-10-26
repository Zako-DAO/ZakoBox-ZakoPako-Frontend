/**
 * ZakoBoxFactory Contract Store
 * Handles treasury deployment and management
 */

import type { Address, Hex } from 'viem'
import type { TreasuryConfig, TreasuryInfo } from '~/contracts/types'
import { defineStore } from 'pinia'
import { encodePacked, keccak256 } from 'viem'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { ZakoBoxFactoryABI } from '~/contracts/abis'
import { createContractPublicClient, createContractWalletClient, getContractAddresses, waitForTransaction } from '~/utils/contract'
import { useWalletStore } from './wallet'

export const useZakoBoxFactoryStore = defineStore('zakobox-factory', () => {
  const walletStore = useWalletStore()

  // Factory data
  const treasuryCount = ref<number>(0)
  const userTreasuries = ref<Address[]>([])
  const treasuryInfoMap = ref<Map<Address, TreasuryInfo>>(new Map())

  // Loading state
  const loading = ref<boolean>(false)

  /**
   * Generate a unique salt for CREATE2 deployment
   */
  function generateSalt(treasuryName: string): Hex {
    const timestamp = Date.now()
    const userAddress = walletStore.address || '0x0000000000000000000000000000000000000000'

    return keccak256(
      encodePacked(
        ['address', 'uint256', 'string'],
        [userAddress as Address, BigInt(timestamp), treasuryName],
      ),
    )
  }

  /**
   * Compute treasury address before deployment
   */
  async function computeTreasuryAddress(
    salt: Hex,
    config: TreasuryConfig,
  ): Promise<Address | null> {
    try {
      const publicClient = createContractPublicClient()
      const addresses = getContractAddresses()

      const address = await publicClient.readContract({
        address: addresses.ZakoBoxFactory,
        abi: ZakoBoxFactoryABI,
        functionName: 'computeTreasuryAddress',
        args: [salt, config],
      })

      return address
    }
    catch (error) {
      console.error('Failed to compute treasury address:', error)
      toast.error('Failed to compute treasury address')
      return null
    }
  }

  /**
   * Create a new treasury
   */
  async function createTreasury(
    config: TreasuryConfig,
    name: string,
    description: string,
  ): Promise<Address | null> {
    if (!walletStore.address) {
      toast.error('Please connect your wallet')
      return null
    }

    loading.value = true

    try {
      const walletClient = createContractWalletClient()
      if (!walletClient) {
        toast.error('Failed to create wallet client')
        return null
      }

      const addresses = getContractAddresses()
      const salt = generateSalt(name)

      // Predict address
      const predictedAddress = await computeTreasuryAddress(salt, config)
      if (predictedAddress)
        toast.info(`Treasury will be deployed at: ${predictedAddress.slice(0, 10)}...`)

      // Deploy treasury
      const hash = await walletClient.writeContract({
        address: addresses.ZakoBoxFactory,
        abi: ZakoBoxFactoryABI,
        functionName: 'createTreasury',
        args: [salt, config, name, description],
        account: walletStore.address,
      })

      toast.info('Deploying treasury...')
      const receipt = await waitForTransaction(
        hash,
        'Treasury deployed successfully!',
        'Failed to deploy treasury',
      )

      if (!receipt)
        return null

      // Extract treasury address from event logs
      // TODO: Parse event logs to get actual treasury address
      // const _log = receipt.logs.find(log =>
      //   log.topics[0] === '0x...' // TreasuryCreated event signature
      // )

      // Refresh user treasuries
      await getUserTreasuries()

      return predictedAddress
    }
    catch (error) {
      console.error('Failed to create treasury:', error)
      toast.error('Failed to create treasury')
      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Create multiple treasuries in batch
   */
  async function createTreasuryBatch(
    configs: TreasuryConfig[],
    names: string[],
    descriptions: string[],
  ): Promise<Address[] | null> {
    if (!walletStore.address) {
      toast.error('Please connect your wallet')
      return null
    }

    if (configs.length !== names.length || configs.length !== descriptions.length) {
      toast.error('Arrays must have same length')
      return null
    }

    loading.value = true

    try {
      const walletClient = createContractWalletClient()
      if (!walletClient) {
        toast.error('Failed to create wallet client')
        return null
      }

      const addresses = getContractAddresses()
      const salts = names.map(name => generateSalt(name))

      // Deploy treasuries
      const hash = await walletClient.writeContract({
        address: addresses.ZakoBoxFactory,
        abi: ZakoBoxFactoryABI,
        functionName: 'createTreasuryBatch',
        args: [salts, configs, names, descriptions],
        account: walletStore.address,
      })

      toast.info(`Deploying ${configs.length} treasuries...`)
      const receipt = await waitForTransaction(
        hash,
        'Treasuries deployed successfully!',
        'Failed to deploy treasuries',
      )

      if (!receipt)
        return null

      // Refresh user treasuries
      await getUserTreasuries()

      // Compute all addresses
      const deployedAddresses = await Promise.all(
        salts.map((salt, i) => computeTreasuryAddress(salt, configs[i])),
      )

      return deployedAddresses.filter(addr => addr !== null) as Address[]
    }
    catch (error) {
      console.error('Failed to create treasuries:', error)
      toast.error('Failed to create treasuries')
      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Get total treasury count
   */
  async function getTreasuryCount(): Promise<number> {
    try {
      const publicClient = createContractPublicClient()
      const addresses = getContractAddresses()

      const count = await publicClient.readContract({
        address: addresses.ZakoBoxFactory,
        abi: ZakoBoxFactoryABI,
        functionName: 'getTreasuryCount',
      })

      treasuryCount.value = Number(count)
      return treasuryCount.value
    }
    catch (error) {
      console.error('Failed to get treasury count:', error)
      return 0
    }
  }

  /**
   * Get treasury by index
   */
  async function getTreasuryByIndex(index: number): Promise<Address | null> {
    try {
      const publicClient = createContractPublicClient()
      const addresses = getContractAddresses()

      const treasury = await publicClient.readContract({
        address: addresses.ZakoBoxFactory,
        abi: ZakoBoxFactoryABI,
        functionName: 'getTreasuryByIndex',
        args: [BigInt(index)],
      })

      return treasury
    }
    catch (error) {
      console.error('Failed to get treasury by index:', error)
      return null
    }
  }

  /**
   * Get user's deployed treasuries
   */
  async function getUserTreasuries(): Promise<Address[]> {
    if (!walletStore.address)
      return []

    try {
      const publicClient = createContractPublicClient()
      const addresses = getContractAddresses()

      const treasuries = await publicClient.readContract({
        address: addresses.ZakoBoxFactory,
        abi: ZakoBoxFactoryABI,
        functionName: 'getTreasuriesByDeployer',
        args: [walletStore.address],
      })

      userTreasuries.value = treasuries
      return treasuries
    }
    catch (error) {
      console.error('Failed to get user treasuries:', error)
      return []
    }
  }

  /**
   * Get treasury info
   */
  async function getTreasuryInfo(treasuryAddress: Address): Promise<TreasuryInfo | null> {
    try {
      const publicClient = createContractPublicClient()
      const addresses = getContractAddresses()

      const info = await publicClient.readContract({
        address: addresses.ZakoBoxFactory,
        abi: ZakoBoxFactoryABI,
        functionName: 'getTreasuryInfo',
        args: [treasuryAddress],
      })

      const treasuryInfo: TreasuryInfo = {
        name: info[0],
        description: info[1],
        deployer: info[2],
        createdAt: info[3],
      }

      treasuryInfoMap.value.set(treasuryAddress, treasuryInfo)
      return treasuryInfo
    }
    catch (error) {
      console.error('Failed to get treasury info:', error)
      return null
    }
  }

  /**
   * Get implementation address
   */
  async function getImplementation(): Promise<Address | null> {
    try {
      const publicClient = createContractPublicClient()
      const addresses = getContractAddresses()

      const implementation = await publicClient.readContract({
        address: addresses.ZakoBoxFactory,
        abi: ZakoBoxFactoryABI,
        functionName: 'implementation',
      })

      return implementation
    }
    catch (error) {
      console.error('Failed to get implementation:', error)
      return null
    }
  }

  /**
   * Load all factory data
   */
  async function loadFactoryData() {
    loading.value = true
    try {
      await Promise.all([
        getTreasuryCount(),
        walletStore.address ? getUserTreasuries() : Promise.resolve(),
      ])
    }
    finally {
      loading.value = false
    }
  }

  return {
    // State
    treasuryCount,
    userTreasuries,
    treasuryInfoMap,
    loading,

    // Actions
    generateSalt,
    computeTreasuryAddress,
    createTreasury,
    createTreasuryBatch,
    getTreasuryCount,
    getTreasuryByIndex,
    getUserTreasuries,
    getTreasuryInfo,
    getImplementation,
    loadFactoryData,
  }
})
