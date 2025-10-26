/**
 * ZakoBox Contract Store
 * Handles interactions with ZakoBox treasury contracts
 */

import type { Address, Hash } from 'viem'
import type { WithdrawalProposal } from '~/contracts/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { ZakoBoxABI } from '~/contracts/abis'
import {
  approveToken,
  checkTokenAllowance,
  createContractPublicClient,
  createContractWalletClient,
  isETH,
  waitForTransaction,
} from '~/utils/contract'
import { useWalletStore } from './wallet'

export const useZakoBoxStore = defineStore('zakobox', () => {
  const walletStore = useWalletStore()

  // Current treasury address
  const currentTreasury = ref<Address | null>(null)

  // Treasury data
  const treasuryBalance = ref<Record<Address, bigint>>({})
  const totalDonations = ref<Record<Address, bigint>>({})
  const proposals = ref<Map<number, WithdrawalProposal>>(new Map())
  const proposalCount = ref<number>(0)
  const threshold = ref<bigint>(0n)
  const emergencyThreshold = ref<bigint>(0n)
  const isOwner = ref<boolean>(false)
  const isPaused = ref<boolean>(false)

  // Loading states
  const loading = ref<boolean>(false)

  /**
   * Set current treasury address
   */
  function setCurrentTreasury(address: Address) {
    currentTreasury.value = address
  }

  /**
   * Get treasury balance for a token
   */
  async function getBalance(tokenAddress: Address): Promise<bigint> {
    if (!currentTreasury.value) {
      toast.error('No treasury selected')
      return 0n
    }

    try {
      const publicClient = createContractPublicClient()
      const balance = await publicClient.readContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'getBalance',
        args: [tokenAddress],
      })

      treasuryBalance.value[tokenAddress] = balance
      return balance
    }
    catch (error) {
      console.error('Failed to get balance:', error)
      toast.error('Failed to get treasury balance')
      return 0n
    }
  }

  /**
   * Get total donations for a token
   */
  async function getTotalDonations(tokenAddress: Address): Promise<bigint> {
    if (!currentTreasury.value)
      return 0n

    try {
      const publicClient = createContractPublicClient()
      const total = await publicClient.readContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'getTotalDonations',
        args: [tokenAddress],
      })

      totalDonations.value[tokenAddress] = total
      return total
    }
    catch (error) {
      console.error('Failed to get total donations:', error)
      return 0n
    }
  }

  /**
   * Donate ETH or ERC20 tokens
   */
  async function donate(tokenAddress: Address, amount: bigint): Promise<Hash | null> {
    if (!currentTreasury.value) {
      toast.error('No treasury selected')
      return null
    }

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

      // Handle ETH donation
      if (isETH(tokenAddress)) {
        const hash = await walletClient.sendTransaction({
          to: currentTreasury.value,
          value: amount,
          account: walletStore.address,
        })

        toast.info('Donating ETH...')
        await waitForTransaction(hash, 'Donation successful!', 'Donation failed')

        // Refresh balance
        await getBalance(tokenAddress)
        await getTotalDonations(tokenAddress)

        return hash
      }

      // Handle ERC20 donation
      // Check allowance
      const allowance = await checkTokenAllowance(
        tokenAddress,
        walletStore.address,
        currentTreasury.value,
      )

      // Approve if needed
      if (allowance < amount) {
        toast.info('Approving token spending...')
        const approveHash = await approveToken(
          walletClient,
          tokenAddress,
          currentTreasury.value,
          amount,
        )
        if (!approveHash)
          return null
      }

      // Donate
      const hash = await walletClient.writeContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'donate',
        args: [tokenAddress, amount],
        account: walletStore.address,
      })

      toast.info('Processing donation...')
      await waitForTransaction(hash, 'Donation successful!', 'Donation failed')

      // Refresh balance
      await getBalance(tokenAddress)
      await getTotalDonations(tokenAddress)

      return hash
    }
    catch (error) {
      console.error('Donation failed:', error)
      toast.error('Failed to donate')
      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Propose withdrawal
   */
  async function proposeWithdrawal(
    tokenAddress: Address,
    recipient: Address,
    amount: bigint,
    description: string,
  ): Promise<number | null> {
    if (!currentTreasury.value) {
      toast.error('No treasury selected')
      return null
    }

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

      const hash = await walletClient.writeContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'proposeWithdrawal',
        args: [tokenAddress, recipient, amount, description],
        account: walletStore.address,
      })

      toast.info('Creating withdrawal proposal...')
      const receipt = await waitForTransaction(
        hash,
        'Proposal created successfully',
        'Failed to create proposal',
      )

      if (!receipt)
        return null

      // Extract proposal ID from event logs
      // TODO: Parse event logs to get actual proposal ID
      // const _log = receipt.logs.find(log =>
      //   log.topics[0] === '0x...' // WithdrawalProposed event signature
      // )

      // Refresh proposal count
      await getProposalCount()

      // Return the new proposal ID (current count)
      return proposalCount.value - 1
    }
    catch (error) {
      console.error('Failed to propose withdrawal:', error)
      toast.error('Failed to create proposal')
      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Approve withdrawal proposal
   */
  async function approveWithdrawal(proposalId: number): Promise<boolean> {
    if (!currentTreasury.value) {
      toast.error('No treasury selected')
      return false
    }

    if (!walletStore.address) {
      toast.error('Please connect your wallet')
      return false
    }

    loading.value = true

    try {
      const walletClient = createContractWalletClient()
      if (!walletClient) {
        toast.error('Failed to create wallet client')
        return false
      }

      const hash = await walletClient.writeContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'approveWithdrawal',
        args: [BigInt(proposalId)],
        account: walletStore.address,
      })

      toast.info('Approving withdrawal...')
      const receipt = await waitForTransaction(
        hash,
        'Withdrawal approved',
        'Failed to approve withdrawal',
      )

      if (!receipt)
        return false

      // Refresh proposal
      await getProposal(proposalId)

      return true
    }
    catch (error) {
      console.error('Failed to approve withdrawal:', error)
      toast.error('Failed to approve withdrawal')
      return false
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Execute withdrawal proposal
   */
  async function executeWithdrawal(proposalId: number): Promise<boolean> {
    if (!currentTreasury.value) {
      toast.error('No treasury selected')
      return false
    }

    if (!walletStore.address) {
      toast.error('Please connect your wallet')
      return false
    }

    loading.value = true

    try {
      const walletClient = createContractWalletClient()
      if (!walletClient) {
        toast.error('Failed to create wallet client')
        return false
      }

      const hash = await walletClient.writeContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'executeWithdrawal',
        args: [BigInt(proposalId)],
        account: walletStore.address,
      })

      toast.info('Executing withdrawal...')
      const receipt = await waitForTransaction(
        hash,
        'Withdrawal executed successfully',
        'Failed to execute withdrawal',
      )

      if (!receipt)
        return false

      // Refresh proposal and balance
      await getProposal(proposalId)
      const proposal = proposals.value.get(proposalId)
      if (proposal)
        await getBalance(proposal.token)

      return true
    }
    catch (error) {
      console.error('Failed to execute withdrawal:', error)
      toast.error('Failed to execute withdrawal')
      return false
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Get withdrawal proposal details
   */
  async function getProposal(proposalId: number): Promise<WithdrawalProposal | null> {
    if (!currentTreasury.value)
      return null

    try {
      const publicClient = createContractPublicClient()
      const proposal = await publicClient.readContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'getWithdrawalProposal',
        args: [BigInt(proposalId)],
      })

      const withdrawalProposal: WithdrawalProposal = {
        token: proposal[0],
        recipient: proposal[1],
        amount: proposal[2],
        description: proposal[3],
        approvalCount: proposal[4],
        executed: proposal[5],
        proposedAt: proposal[6],
      }

      proposals.value.set(proposalId, withdrawalProposal)
      return withdrawalProposal
    }
    catch (error) {
      console.error('Failed to get proposal:', error)
      return null
    }
  }

  /**
   * Get proposal count
   */
  async function getProposalCount(): Promise<number> {
    if (!currentTreasury.value)
      return 0

    try {
      const publicClient = createContractPublicClient()
      const count = await publicClient.readContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'proposalCount',
      })

      proposalCount.value = Number(count)
      return proposalCount.value
    }
    catch (error) {
      console.error('Failed to get proposal count:', error)
      return 0
    }
  }

  /**
   * Check if user has approved a proposal
   */
  async function hasApproved(proposalId: number, owner: Address): Promise<boolean> {
    if (!currentTreasury.value)
      return false

    try {
      const publicClient = createContractPublicClient()
      const approved = await publicClient.readContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'hasApproved',
        args: [BigInt(proposalId), owner],
      })

      return approved
    }
    catch (error) {
      console.error('Failed to check approval:', error)
      return false
    }
  }

  /**
   * Check if address is owner
   */
  async function checkIsOwner(address: Address): Promise<boolean> {
    if (!currentTreasury.value)
      return false

    try {
      const publicClient = createContractPublicClient()
      const owner = await publicClient.readContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'isOwner',
        args: [address],
      })

      if (address === walletStore.address)
        isOwner.value = owner

      return owner
    }
    catch (error) {
      console.error('Failed to check owner:', error)
      return false
    }
  }

  /**
   * Get treasury threshold
   */
  async function getThreshold(): Promise<bigint> {
    if (!currentTreasury.value)
      return 0n

    try {
      const publicClient = createContractPublicClient()
      const t = await publicClient.readContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'threshold',
      })

      threshold.value = t
      return t
    }
    catch (error) {
      console.error('Failed to get threshold:', error)
      return 0n
    }
  }

  /**
   * Check if treasury is paused
   */
  async function checkPaused(): Promise<boolean> {
    if (!currentTreasury.value)
      return false

    try {
      const publicClient = createContractPublicClient()
      const paused = await publicClient.readContract({
        address: currentTreasury.value,
        abi: ZakoBoxABI,
        functionName: 'paused',
      })

      isPaused.value = paused
      return paused
    }
    catch (error) {
      console.error('Failed to check paused:', error)
      return false
    }
  }

  /**
   * Load all treasury data
   */
  async function loadTreasuryData() {
    if (!currentTreasury.value)
      return

    loading.value = true
    try {
      await Promise.all([
        getProposalCount(),
        getThreshold(),
        checkPaused(),
        walletStore.address ? checkIsOwner(walletStore.address) : Promise.resolve(),
      ])
    }
    finally {
      loading.value = false
    }
  }

  return {
    // State
    currentTreasury,
    treasuryBalance,
    totalDonations,
    proposals,
    proposalCount,
    threshold,
    emergencyThreshold,
    isOwner,
    isPaused,
    loading,

    // Actions
    setCurrentTreasury,
    getBalance,
    getTotalDonations,
    donate,
    proposeWithdrawal,
    approveWithdrawal,
    executeWithdrawal,
    getProposal,
    getProposalCount,
    hasApproved,
    checkIsOwner,
    getThreshold,
    checkPaused,
    loadTreasuryData,
  }
})
