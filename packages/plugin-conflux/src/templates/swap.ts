export const swapTemplate = `Given the recent messages below:

{{recentMessages}}

Extract the following information about the requested swap:
- Amount to swap: Must be a number (e.g., 0.0001)
- From token: The token to swap from (e.g., CFX, USDT, ETH)
- To token: The token to swap to (e.g., CFX, USDT, ETH)

Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    "action": "swap",
    "params": {
        "text": "swap {{amount}} {{fromToken}} for {{toToken}}",
        "amount": number,
        "fromToken": string,
        "toToken": string
    }
}
\`\`\`
`;
