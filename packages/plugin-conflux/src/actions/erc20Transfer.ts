import type { Action, ActionExample, Memory } from "@elizaos/core";
import {
    createWalletClient,
    http,
    parseUnits,
    type SendTransactionParameters,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { confluxESpace } from "viem/chains";

// Token addresses on eSpace
const TOKEN_ADDRESSES = {
    USDT: "0xfe97e85d13abd9c1c33384e796f10b73905637ce",
    BTC: "0x1f545487c62e5acfea45dcadd9c627361d1616d8",
    WCFX: "0x14b2d3bc65e74dae1030eafd8ac30c533c976a9b",
} as const;

// Token decimals
const TOKEN_DECIMALS = {
    USDT: 18,
    BTC: 18,
    WCFX: 18,
} as const;

interface TransferEntities {
    amount?: string | number;
    to?: string;
    token?: string;
}

export const erc20Transfer: Action = {
    name: "SEND_TOKEN_ESPACE",
    description:
        "Send ERC20 tokens (USDT, BTC, WCFX) on Conflux eSpace network",
    examples: [
        [
            {
                user: "user1",
                content: {
                    text: "Send 0.1 USDT to 0x123... on eSpace",
                    entities: {
                        amount: "0.1",
                        to: "0x1234567890123456789012345678901234567890",
                        token: "USDT",
                    },
                },
            },
            {
                user: "assistant",
                content: {
                    text: "Transaction sent on eSpace! Hash: 0x123...",
                },
            },
        ],
        [
            {
                user: "user1",
                content: {
                    text: "Send 0.001 BTC to 0x123... on eSpace",
                    entities: {
                        amount: "0.001",
                        to: "0x1234567890123456789012345678901234567890",
                        token: "BTC",
                    },
                },
            },
            {
                user: "assistant",
                content: {
                    text: "Transaction sent on eSpace! Hash: 0x123...",
                },
            },
        ],
    ],
    handler: async (runtime, message: Memory, state, options, callback) => {
        // Extract entities from the message
        const content = message.content?.text?.match(
            /Send ([\d.]+) ([A-Za-z]+) to (0x[a-fA-F0-9]+) on eSpace/i
        );
        if (!content) {
            callback?.({
                text: "Could not parse transfer details. Please use format: Send <amount> <token> to <address> on eSpace",
            });
            return false;
        }

        const amount = content[1];
        const tokenSymbol = content[2].toUpperCase();
        const to = content[3].toLowerCase();

        // Validate token
        if (!Object.keys(TOKEN_ADDRESSES).includes(tokenSymbol)) {
            callback?.({
                text: `Invalid token symbol. Supported tokens: ${Object.keys(TOKEN_ADDRESSES).join(", ")}`,
            });
            return false;
        }

        // Validate address - must be a 0x prefixed address for eSpace
        if (!to.startsWith("0x") || to.length !== 42) {
            callback?.({
                text: `Invalid eSpace address format. Address must start with '0x' and be 42 characters long.`,
            });
            return false;
        }

        try {
            const settings = Object.fromEntries(
                Object.entries(process.env).filter(([key]) =>
                    key.startsWith("CONFLUX_")
                )
            );

            const privateKey = settings.CONFLUX_ESPACE_PRIVATE_KEY;
            if (!privateKey) {
                callback?.({
                    text: "eSpace wallet not configured. Please set CONFLUX_ESPACE_PRIVATE_KEY.",
                });
                return false;
            }

            const rpcUrl =
                settings.CONFLUX_ESPACE_RPC_URL || "https://evm.confluxrpc.com";
            const account = privateKeyToAccount(privateKey as `0x${string}`);

            const client = createWalletClient({
                account,
                chain: confluxESpace,
                transport: http(rpcUrl),
            });

            // ERC20 transfer function signature (without 0x prefix)
            const transferFunctionSignature = "a9059cbb";

            // Remove '0x' prefix for parameter encoding
            const cleanTo = to.toLowerCase().replace("0x", "");

            // Convert amount to hex and pad to 64 characters
            const amountHex = parseUnits(
                amount,
                TOKEN_DECIMALS[tokenSymbol as keyof typeof TOKEN_DECIMALS]
            )
                .toString(16)
                .padStart(64, "0");

            // Construct the data parameter
            const data = `0x${transferFunctionSignature}${"000000000000000000000000"}${cleanTo}${amountHex}`;

            const hash = await client.sendTransaction({
                to: TOKEN_ADDRESSES[
                    tokenSymbol as keyof typeof TOKEN_ADDRESSES
                ] as `0x${string}`,
                data: data as `0x${string}`,
                type: "legacy" as const,
            } as unknown as SendTransactionParameters<typeof confluxESpace>);

            callback?.({
                text: `Transaction sent on eSpace! Hash: ${hash}`,
                content: { hash },
            });
            return true;
        } catch (error) {
            console.error("Failed to send tokens on eSpace network:", error);
            callback?.({
                text: `Failed to send ${amount} ${tokenSymbol} to ${to} on eSpace network: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    validate: async () => true,
    similes: [
        "like sending digital tokens through the eSpace express lane",
        "like making a token transfer in the eSpace dimension",
        "like beaming tokens through the eSpace network",
    ],
};
