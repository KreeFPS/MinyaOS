import type { Plugin, Provider, IAgentRuntime } from "@elizaos/core";
import { transfer } from "./actions/transfer";
import { confiPump } from "./actions/confiPump";
import { bridgeTransfer } from "./actions/bridgeTransfer";
import { swap } from "./actions/swap";
import { erc20Transfer } from "./actions/erc20Transfer";
import { eSpaceTransfer } from "./actions/eSpaceTransfer";
import {
    getCoreWalletClient,
    getCoreWalletProvider,
    getESpaceWalletClient,
    getESpaceWalletProvider,
} from "./providers/wallet";

const plugin: Plugin = {
    name: "conflux",
    description:
        "Conflux Plugin for Eliza - supports transfers, swaps, and bridging on both Core Space and eSpace networks",
    actions: [
        swap,
        transfer,
        confiPump,
        bridgeTransfer,
        erc20Transfer,
        eSpaceTransfer,
    ],
    providers: [
        // Core wallet provider
        {
            get: async (runtime: IAgentRuntime) => {
                const settings = Object.fromEntries(
                    Object.entries(process.env).filter(([key]) =>
                        key.startsWith("CONFLUX_")
                    )
                );
                const client = getCoreWalletClient({ settings });
                const provider = getCoreWalletProvider(client);
                return provider.get();
            },
        },
        // eSpace wallet provider
        {
            get: async (runtime: IAgentRuntime) => {
                const settings = Object.fromEntries(
                    Object.entries(process.env).filter(([key]) =>
                        key.startsWith("CONFLUX_")
                    )
                );
                const client = getESpaceWalletClient({ settings });
                const provider = getESpaceWalletProvider(client);
                return provider.get();
            },
        },
    ],
};

// Export both names for compatibility
export { plugin as confluxPlugin };
export { plugin };
