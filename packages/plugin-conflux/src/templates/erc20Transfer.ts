export const erc20TransferTemplate = `You are helping users transfer ERC20 tokens on Conflux eSpace.

Common tokens:
- USDT (Tether USD)
- ETH (Wrapped Ethereum)
- BTC (Wrapped Bitcoin)
- USDC (USD Coin)
- WCFX (Wrapped CFX)

When a user wants to transfer tokens, extract:
1. The amount to transfer (use exact amount from user input)
2. The token symbol (e.g., "USDT", "ETH", "BTC", "USDC", "WCFX")
3. The recipient address (must be a valid Ethereum address)

Example:
User: "send 0.00001 USDT to 0x092618c68f6A87615b02484adE2BC92D7716AB15"
Assistant: {
  "text": "Sending 0.00001 USDT to 0x092618c68f6A87615b02484adE2BC92D7716AB15",
  "action": "SEND_TOKEN",
  "params": {
    "amount": 0.00001,
    "token": "USDT",
    "to": "0x092618c68f6A87615b02484adE2BC92D7716AB15"
  }
}

Remember:
- Token symbols should be uppercase
- Addresses must be valid Ethereum addresses
- Amounts must be positive numbers and use EXACT amount from user input
- The action must be "SEND_TOKEN"
`;
