/**
 * ZakoBoxFactory Contract ABI
 * Factory contract for deploying ZakoBox treasury instances
 */

export const ZakoBoxFactoryABI = [
  // Create Treasury
  {
    type: 'function',
    name: 'createTreasury',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'salt', type: 'bytes32' },
      {
        name: 'config',
        type: 'tuple',
        components: [
          { name: 'owners', type: 'address[]' },
          { name: 'threshold', type: 'uint256' },
          { name: 'emergencyThreshold', type: 'uint256' },
          { name: 'dailyLimit', type: 'uint256' },
          { name: 'whitelistedTokens', type: 'address[]' },
          { name: 'whitelistedRecipients', type: 'address[]' },
          { name: 'vestingStart', type: 'uint256' },
          { name: 'vestingDuration', type: 'uint256' },
          { name: 'vestingCliff', type: 'uint256' },
        ],
      },
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  // Batch Create
  {
    type: 'function',
    name: 'createTreasuryBatch',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'salts', type: 'bytes32[]' },
      {
        name: 'configs',
        type: 'tuple[]',
        components: [
          { name: 'owners', type: 'address[]' },
          { name: 'threshold', type: 'uint256' },
          { name: 'emergencyThreshold', type: 'uint256' },
          { name: 'dailyLimit', type: 'uint256' },
          { name: 'whitelistedTokens', type: 'address[]' },
          { name: 'whitelistedRecipients', type: 'address[]' },
          { name: 'vestingStart', type: 'uint256' },
          { name: 'vestingDuration', type: 'uint256' },
          { name: 'vestingCliff', type: 'uint256' },
        ],
      },
      { name: 'names', type: 'string[]' },
      { name: 'descriptions', type: 'string[]' },
    ],
    outputs: [{ name: '', type: 'address[]' }],
  },
  // Compute Address
  {
    type: 'function',
    name: 'computeTreasuryAddress',
    stateMutability: 'view',
    inputs: [
      { name: 'salt', type: 'bytes32' },
      {
        name: 'config',
        type: 'tuple',
        components: [
          { name: 'owners', type: 'address[]' },
          { name: 'threshold', type: 'uint256' },
          { name: 'emergencyThreshold', type: 'uint256' },
          { name: 'dailyLimit', type: 'uint256' },
          { name: 'whitelistedTokens', type: 'address[]' },
          { name: 'whitelistedRecipients', type: 'address[]' },
          { name: 'vestingStart', type: 'uint256' },
          { name: 'vestingDuration', type: 'uint256' },
          { name: 'vestingCliff', type: 'uint256' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  // View Functions
  {
    type: 'function',
    name: 'getTreasuryCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getTreasuryByIndex',
    stateMutability: 'view',
    inputs: [{ name: 'index', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'getTreasuriesByDeployer',
    stateMutability: 'view',
    inputs: [{ name: 'deployer', type: 'address' }],
    outputs: [{ name: '', type: 'address[]' }],
  },
  {
    type: 'function',
    name: 'getTreasuryInfo',
    stateMutability: 'view',
    inputs: [{ name: 'treasury', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'deployer', type: 'address' },
          { name: 'createdAt', type: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'implementation',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  // Update Implementation
  {
    type: 'function',
    name: 'updateImplementation',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'newImplementation', type: 'address' }],
    outputs: [],
  },
  // Events
  {
    type: 'event',
    name: 'TreasuryCreated',
    inputs: [
      { name: 'treasury', type: 'address', indexed: true },
      { name: 'deployer', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ImplementationUpdated',
    inputs: [
      { name: 'oldImplementation', type: 'address', indexed: true },
      { name: 'newImplementation', type: 'address', indexed: true },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const
