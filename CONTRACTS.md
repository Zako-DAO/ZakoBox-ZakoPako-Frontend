# Contract Integration Guide

This document provides an overview of the smart contract integration in the ZakoBox frontend application.

## Overview

The application integrates with two main smart contracts deployed on Sepolia testnet:

- **ZakoBoxFactory**: Factory contract for deploying new treasury instances
- **ZakoBox**: Treasury contract instances with multi-signature withdrawal functionality

## Architecture

### Contract ABIs

Located in `src/contracts/abis/`:

- `ZakoBox.ts` - Main treasury contract ABI (donations, withdrawals, proposals)
- `ZakoBoxFactory.ts` - Factory contract ABI (treasury deployment)
- `ERC20.ts` - Standard ERC20 token interface

### Contract Addresses

Defined in `src/contracts/addresses.ts`:

```typescript
export const CONTRACTS = {
  sepolia: {
    ZakoBoxFactory: '0x0000000000000000000000000000000000000000', // TODO: Update
    ZakoBox: '0x0000000000000000000000000000000000000000', // TODO: Update
  }
}

export const TOKENS = {
  sepolia: {
    PYUSD: '0x0000000000000000000000000000000000000000', // TODO: Update
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
    USDT: '0x...', // TODO: Add Sepolia USDT
    WETH: '0x...', // TODO: Add Sepolia WETH
  }
}
```

**⚠️ Before Testing:** Update these addresses with your deployed contract addresses on Sepolia.

### Type Definitions

TypeScript interfaces in `src/contracts/types.ts`:

- `TreasuryConfig` - Configuration for deploying new treasuries
- `WithdrawalProposal` - Withdrawal proposal structure
- `TreasuryInfo` - Treasury metadata (name, description, deployer)
- `TokenInfo` - ERC20 token information

### Utilities

Contract interaction helpers in `src/utils/contract.ts`:

- `createContractPublicClient()` - Read-only Sepolia client
- `createContractWalletClient()` - Wallet client for transactions
- `waitForTransaction()` - Transaction confirmation with toast notifications
- `parseTokenAmount()` / `formatTokenAmount()` - Token decimal handling
- `getTokenInfo()` - Fetch ERC20 token metadata
- `checkTokenAllowance()` / `approveToken()` - ERC20 approval flow

## Pinia Stores

### ZakoBoxStore (`src/stores/zakobox.ts`)

Manages interactions with ZakoBox treasury contracts.

**State:**

- `currentTreasury` - Selected treasury address
- `treasuryBalance` - Token balances per treasury
- `proposals` - Withdrawal proposals map
- `threshold` - Required approvals for withdrawals
- `isOwner` - Whether connected wallet is a treasury owner
- `isPaused` - Treasury pause status

**Key Actions:**

- `donate(token, amount)` - Donate ETH or ERC20 to treasury
- `proposeWithdrawal(token, recipient, amount, description)` - Create proposal
- `approveWithdrawal(proposalId)` - Approve a proposal
- `executeWithdrawal(proposalId)` - Execute approved proposal
- `getBalance(token)` - Get treasury balance for token
- `loadTreasuryData()` - Load all treasury information

### ZakoBoxFactoryStore (`src/stores/zakobox-factory.ts`)

Manages treasury deployment via factory contract.

**State:**

- `treasuryCount` - Total deployed treasuries
- `userTreasuries` - User's deployed treasury addresses
- `treasuryInfoMap` - Cached treasury metadata

**Key Actions:**

- `createTreasury(config, name, description)` - Deploy new treasury
- `createTreasuryBatch(configs, names, descriptions)` - Batch deploy
- `computeTreasuryAddress(salt, config)` - Predict deployment address (CREATE2)
- `getUserTreasuries()` - Get user's deployed treasuries
- `getTreasuryInfo(address)` - Get treasury metadata
- `generateSalt(name)` - Generate unique salt for deployment

## UI Components

All components are located in `src/components/treasury/` and exported via `index.ts`.

### Treasury Management

**TreasuryDashboard** - Complete treasury management interface

- Treasury selector
- Balance display
- Donation form
- Proposal list with tabs (all/pending/ready/executed)
- Create proposal form (owners only)

**TreasurySelector** - Select treasury to interact with

- Lists user's deployed treasuries
- Displays treasury name and description
- Shows owner badge if applicable
- Refresh treasury list

**TreasuryBalance** - Display treasury token balances

- Shows balances for ETH, PYUSD, USDC, USDT
- Displays total donations per token
- Estimated USD value (stablecoins only)
- Auto-refresh capability

### Donations

**DonationForm** - Donate to treasury

- Token selection (ETH, PYUSD, USDC, USDT)
- Amount input with token symbol
- Current treasury balance display
- Handles ETH donations and ERC20 approvals automatically

### Withdrawals

**CreateProposalForm** - Create withdrawal proposal (owners only)

- Token and amount selection
- Recipient address input
- Description (required)
- Shows available balance
- Displays approval threshold

**ProposalList** - View all proposals with filtering

- Tabs: All, Pending, Ready, Executed
- Real-time proposal counts
- Refresh functionality

**ProposalCard** - Individual proposal display

- Proposal status badge (Pending/Ready/Executed)
- Approval progress (X/Y approvals)
- Token, amount, recipient details
- Actions: Approve, Execute (based on status and permissions)

### Treasury Creation

**CreateTreasuryForm** - Deploy new treasury

- Treasury name and description
- Owner addresses (comma-separated)
- Approval thresholds (regular and emergency)
- Daily withdrawal limit
- Vesting schedule (duration and cliff)
- Automatic token whitelisting (ETH, PYUSD, USDC, USDT)

## Pages

### `/my-vault` (My Vault)

Complete treasury management interface using `TreasuryDashboard`.

**Features:**

- View all user treasuries
- Donate to treasuries
- View and vote on proposals
- Create withdrawal proposals (if owner)

### `/withdraw` (Withdrawal Management)

Focused withdrawal proposal interface.

**Features:**

- Create withdrawal proposals
- View proposal list with filtering
- Approve and execute proposals

### `/create-vault` (Create Treasury)

Deploy new treasury contracts.

**Features:**

- Configure multi-sig settings
- Set vesting schedules
- Define withdrawal limits
- Deploy with CREATE2 (deterministic addresses)

## Supported Tokens

The application supports the following tokens on Sepolia:

| Token      | Symbol | Decimals | Use Case                  |
| ---------- | ------ | -------- | ------------------------- |
| Ethereum   | ETH    | 18       | Native currency donations |
| PayPal USD | PYUSD  | 6        | Priority stablecoin       |
| USD Coin   | USDC   | 6        | Stablecoin                |
| Tether USD | USDT   | 6        | Stablecoin                |

## Transaction Flow

### Donating Tokens

1. User selects treasury and token
2. User enters amount
3. **If ETH:**
   - Direct transfer to treasury address
4. **If ERC20:**
   - Check allowance
   - If insufficient: request approval transaction
   - User approves in wallet
   - Wait for approval confirmation
   - Execute donation transaction
5. Show success toast and refresh balance

### Creating Withdrawal Proposal

1. Verify user is treasury owner
2. User fills form (token, recipient, amount, description)
3. Submit proposal transaction
4. Transaction confirmed
5. Proposal ID assigned
6. Proposal appears in list (Pending status)

### Approving Proposal

1. User clicks "Approve" on proposal card
2. Submit approval transaction
3. Approval count increments
4. If threshold reached: status changes to "Ready"

### Executing Proposal

1. Verify proposal has enough approvals
2. User clicks "Execute"
3. Submit execution transaction
4. Funds transferred to recipient
5. Proposal marked as "Executed"
6. Treasury balance updates

## Error Handling

All contract interactions include comprehensive error handling:

1. **Toast Notifications** (via vue-sonner)
   - Info: Transaction submitted
   - Success: Transaction confirmed
   - Error: Transaction failed with reason

2. **Loading States**
   - Buttons disabled during transactions
   - Loading text shown ("Processing...", "Deploying...")
   - Store-level loading state

3. **Validation**
   - Wallet connection checks
   - Owner permission checks
   - Balance sufficiency checks
   - Address format validation
   - Amount validation

4. **Transaction Waiting**
   - Automatic transaction receipt polling
   - Success/failure toast on completion
   - Return null on failure for error handling

## Testing Checklist

Before deploying to production, test the following:

### Contract Deployment

- [ ] Deploy ZakoBox implementation contract
- [ ] Deploy ZakoBoxFactory contract
- [ ] Verify contracts on Etherscan
- [ ] Update contract addresses in `src/contracts/addresses.ts`

### Token Addresses

- [ ] Add Sepolia PYUSD address
- [ ] Add Sepolia USDT address
- [ ] Add Sepolia WETH address
- [ ] Verify all token decimals

### Treasury Creation

- [ ] Create treasury with single owner
- [ ] Create treasury with multiple owners
- [ ] Verify CREATE2 address prediction
- [ ] Check treasury info retrieval
- [ ] Verify owner permissions

### Donations

- [ ] Donate ETH to treasury
- [ ] Donate PYUSD (with approval)
- [ ] Donate USDC (with approval)
- [ ] Verify balance updates
- [ ] Check total donations tracking

### Withdrawal Proposals

- [ ] Create proposal as owner
- [ ] Fail to create as non-owner
- [ ] View proposal details
- [ ] Filter proposals by status
- [ ] Check approval count

### Multi-Sig Workflow

- [ ] Approve proposal (first approval)
- [ ] Approve proposal (second approval)
- [ ] Verify status changes to "Ready"
- [ ] Execute approved proposal
- [ ] Verify funds transferred
- [ ] Check executed status

### Edge Cases

- [ ] Insufficient balance withdrawal
- [ ] Duplicate approvals (should fail)
- [ ] Execute before threshold (should fail)
- [ ] Re-execute executed proposal (should fail)
- [ ] Invalid recipient address
- [ ] Zero amount donations/withdrawals

### UI/UX

- [ ] All loading states work
- [ ] Toast notifications appear
- [ ] Error messages are clear
- [ ] Wallet connection prompts
- [ ] Transaction confirmations in MetaMask
- [ ] Responsive layout (mobile/desktop)

## Known TODOs

1. **Event Log Parsing**: Extract proposal IDs and treasury addresses from transaction receipts
   - `src/stores/zakobox.ts:238` - Extract proposal ID from WithdrawalProposed event
   - `src/stores/zakobox-factory.ts:119` - Extract treasury address from TreasuryCreated event

2. **Contract Addresses**: Update placeholder addresses after Sepolia deployment
   - ZakoBoxFactory address
   - ZakoBox implementation address
   - PYUSD Sepolia address
   - USDT Sepolia address
   - WETH Sepolia address

3. **Token Decimals**: Dynamic decimal fetching for non-standard tokens
   - Currently hardcoded (ETH: 18, stablecoins: 6)
   - Should call `getTokenDecimals()` for accuracy

4. **Batch Operations**: Add UI for batch treasury creation
   - Currently only `createTreasury()` is exposed
   - `createTreasuryBatch()` is implemented in store but not in UI

## Development Commands

```bash
# Run development server
pnpm dev

# Type check
pnpm typecheck

# Lint and fix
pnpm lint:fix

# Build for production
pnpm build
```

## Troubleshooting

### "Please connect your wallet"

- Install MetaMask browser extension
- Switch to Sepolia network in MetaMask
- Click connect wallet in the app

### "Transaction failed" on donation

- Check you have enough balance
- Check you approved sufficient amount (ERC20)
- Verify treasury address is correct
- Check gas price and retry

### "Not a Treasury Owner"

- Verify your wallet address is in the treasury owners list
- Call `checkIsOwner()` to confirm
- Only owners can create proposals

### Proposal not appearing

- Wait for transaction confirmation
- Click "Refresh" on proposal list
- Check proposal count increased

### Balance not updating

- Click "Refresh Balances"
- Clear browser cache
- Check transaction was confirmed on Etherscan

## Additional Resources

- [Viem Documentation](https://viem.sh/)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Sepolia Explorer](https://sepolia.etherscan.io/)
- [MetaMask Setup Guide](https://metamask.io/download/)
