# GameHub Smart Contract Integration

This directory contains the smart contract integration for the GameHub contract.

## Files

- `GameHubABI.ts` - Contract ABI and TypeScript types for GameHub
- `GameRegistryABI.ts` - Legacy GameRegistry ABI (kept for reference)
- `config.ts` - Contract addresses and RPC configuration

## Configuration

### Contract Addresses

Update the contract addresses in `config.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  [flowTestnet.id]: {
    GameHub: "0xFd860D2FDeE44Bc6810251b6E7369CD3119C8527", // GameHub contract address
  },
} as const
```

### RPC URLs

Configure your RPC URLs in `config.ts`:

```typescript
export const RPC_URLS = {
  [flowTestnet.id]: "https://testnet.evm.nodes.onflow.org",
} as const
```

## Usage

The integration automatically fetches game events from the GameHub contract and displays them as tournaments in the UI. The process:

1. Calls `gameEventCount()` to get the total number of game events
2. Loops through all event IDs (0 to count-1)
3. Calls `gamesEvents(eventId)` for each event
4. Converts the GameEvent data to tournament format

## GameEvent Structure

Each game event contains:
- `active`: Whether the event is active
- `eventName`: Name of the event
- `startTime`: Event start timestamp
- `endTime`: Event end timestamp
- `referencedGameId`: ID of the referenced game
- `durationMinutes`: Event duration in minutes
- `minStakeAmt`: Minimum stake amount in wei
- `pooledAmt`: Total pooled amount in wei
- `scoresFinalized`: Whether scores are finalized
- `playersCount`: Number of players
- `winnersCount`: Number of winners

## Features

- Automatic game event fetching from GameHub contract
- Real-time status determination (upcoming/active/ended)
- Wei to ETH conversion for display
- Error handling and retry mechanisms
- Loading states
- Fallback to dummy data if blockchain is unavailable
- Type-safe contract interactions
