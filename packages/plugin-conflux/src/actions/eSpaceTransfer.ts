import type { Action, ActionExample, Memory } from "@elizaos/core";
import {
    createWalletClient,
    http,
    parseEther,
    type SendTransactionParameters,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { confluxESpace } from "viem/chains";

interface TransferEntities {
    amount?: string | number;
    to?: string;
}

export const eSpaceTransfer: Action = {
    name: "SEND_CFX_ESPACE",
    description: "Send CFX on Conflux eSpace network",
    examples: [
        [
            {
                user: "user1",
                content: {
                    text: "Send 0.1 CFX to 0x123... on eSpace",
                    entities: {
                        amount: "0.1",
                        to: "0x1234567890123456789012345678901234567890",
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
            /Send ([\d.]+) CFX to (0x[a-fA-F0-9]+) on eSpace/i
        );
        if (!content) {
            callback?.({
                text: "Could not parse transfer details. Please use format: Send <amount> CFX to <address> on eSpace",
            });
            return false;
        }

        const amount = content[1];
        const to = content[2].toLowerCase();

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

            // Cast transaction parameters to unknown first to bypass type checking
            const txParams = {
                to: to as `0x${string}`,
                value: parseEther(amount),
                type: "legacy" as const,
                kzg: undefined,
            } as unknown as SendTransactionParameters<typeof confluxESpace>;

            const hash = await client.sendTransaction(txParams);

            callback?.({
                text: `Transaction sent on eSpace! Hash: ${hash}`,
                content: { hash },
            });
            return true;
        } catch (error) {
            console.error("Failed to send CFX on eSpace network:", error);
            callback?.({
                text: `Failed to send ${amount} CFX to ${to} on eSpace network: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    validate: async () => true,
    similes: [
        "like sending a digital letter through the eSpace express lane",
        "like making an instant transfer in the eSpace dimension",
        "like beaming CFX through the eSpace network",
    ],
};
