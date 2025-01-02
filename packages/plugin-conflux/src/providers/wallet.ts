import {
    createPublicClient as createCorePublicClient,
    createWalletClient as createCoreWalletClient,
    http as coreHttp,
    type Chain as CoreChain,
} from "cive";
import { privateKeyToAccount as corePrivateKeyToAccount } from "cive/accounts";
import { mainnet as coreMainnet } from "cive/chains";
import {
    createPublicClient,
    createWalletClient,
    http,
    formatEther,
    type PublicClient,
    type WalletClient,
    type Chain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { confluxESpace } from "viem/chains";

// Helper function to format Drip to CFX (1 CFX = 1e18 Drip)
function formatDripToCFX(drip: string | bigint): string {
    const dripBigInt = BigInt(drip);
    const cfx = Number(dripBigInt) / 1e18;
    return cfx.toString();
}

export function getCoreWalletClient(runtime: {
    settings: Record<string, string>;
}) {
    const privateKey = runtime.settings.CONFLUX_CORE_PRIVATE_KEY;
    if (!privateKey) return null;

    const rpcUrl =
        runtime.settings.CONFLUX_CORE_SPACE_RPC_URL ||
        "https://main.confluxrpc.com";
    if (!rpcUrl) return null;

    const client = createCorePublicClient({
        transport: coreHttp(rpcUrl),
        chain: coreMainnet as CoreChain,
    });

    const account = corePrivateKeyToAccount(privateKey as `0x${string}`, {
        networkId: 1029, // Mainnet network ID
    });

    return {
        getAddress: () => account.address,
        getBalance: async () => {
            try {
                const balance = await client.getBalance({
                    address: account.address,
                });
                return formatDripToCFX(balance);
            } catch (error) {
                console.error("Error fetching Core balance:", error);
                throw error;
            }
        },
    };
}

export function getESpaceWalletClient(runtime: {
    settings: Record<string, string>;
}) {
    const privateKey = runtime.settings.CONFLUX_ESPACE_PRIVATE_KEY;
    if (!privateKey) return null;

    const rpcUrl =
        runtime.settings.CONFLUX_ESPACE_RPC_URL || "https://evm.confluxrpc.com";

    const client = createPublicClient({
        chain: confluxESpace as Chain,
        transport: http(rpcUrl),
    });

    const account = privateKeyToAccount(privateKey as `0x${string}`);

    return {
        getAddress: () => account.address,
        getBalance: async () => {
            try {
                const balance = await client.getBalance({
                    address: account.address,
                });
                return formatEther(balance);
            } catch (error) {
                console.error("Error fetching eSpace balance:", error);
                throw error;
            }
        },
    };
}

export function getCoreWalletProvider(
    walletClient: ReturnType<typeof getCoreWalletClient>
) {
    return {
        async get(): Promise<string | null> {
            if (!walletClient) {
                return "Conflux Core wallet not configured. Please set CONFLUX_CORE_PRIVATE_KEY and CONFLUX_CORE_SPACE_RPC_URL.";
            }

            try {
                const address = walletClient.getAddress();
                const balance = await walletClient.getBalance();
                return `Conflux Core Wallet Address: ${address}\nBalance: ${balance} CFX`;
            } catch (error) {
                console.error("Error in Conflux Core wallet provider:", error);
                return `Error fetching Core wallet information: ${error.message}`;
            }
        },
    };
}

export function getESpaceWalletProvider(
    walletClient: ReturnType<typeof getESpaceWalletClient>
) {
    return {
        async get(): Promise<string | null> {
            if (!walletClient) {
                return "Conflux eSpace wallet not configured. Please set CONFLUX_ESPACE_PRIVATE_KEY.";
            }

            try {
                const address = walletClient.getAddress();
                const balance = await walletClient.getBalance();
                return `Conflux eSpace Wallet Address: ${address}\nBalance: ${balance} CFX`;
            } catch (error) {
                console.error(
                    "Error in Conflux eSpace wallet provider:",
                    error
                );
                return `Error fetching eSpace wallet information: ${error.message}`;
            }
        },
    };
}
