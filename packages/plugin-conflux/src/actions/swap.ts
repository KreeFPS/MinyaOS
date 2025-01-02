import type {
    Action,
    ActionExample,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
} from "@elizaos/core";
import { generateObject, composeContext, ModelClass } from "@elizaos/core";
import { ethers } from "ethers";
import type { SwapContent } from "../types";
import { isSwapContent, SwapSchema } from "../types";
import SwappiRouterABI from "../abi/SwappiRouter.json";
import { swapTemplate } from "../templates/swap";

// Swappi Router contract address on Conflux eSpace
const SWAPPI_ROUTER_ADDRESS = "0x62b0873055bf896dd869e172119871ac24aea305";

// Token addresses on Conflux eSpace
const WCFX_ADDRESS = "0x14b2D3bC65e74DAE1030EAFd8ac30c533c976A9b";
const USDT_ADDRESS = "0xfe97e85d13abd9c1c33384e796f10b73905637ce";
const ETH_ADDRESS = "0xa47f43de2f9623acb395ca4905746496d2014d57";
const BTC_ADDRESS = "0x1f545487c62e5acfea45dcadd9c627361d1616d8";
const USDC_ADDRESS = "0x6963efed0ab40f6c3d7bda44a05dcf1437c44372";

// Token symbols to addresses mapping
const TOKEN_MAP: { [key: string]: string } = {
    CFX: WCFX_ADDRESS,
    WCFX: WCFX_ADDRESS,
    USDT: USDT_ADDRESS,
    ETH: ETH_ADDRESS,
    BTC: BTC_ADDRESS,
    USDC: USDC_ADDRESS,
};

// Common token decimals
const DECIMALS_MAP: { [key: string]: number } = {
    [WCFX_ADDRESS]: 18,
    [USDT_ADDRESS]: 18,
    [ETH_ADDRESS]: 18,
    [BTC_ADDRESS]: 18,
    [USDC_ADDRESS]: 18,
};

// Helper to format amount with decimals
function parseAmount(amount: number, decimals: number): bigint {
    return BigInt(Math.floor(amount * 10 ** decimals));
}

export const swap: Action = {
    name: "SWAP_ESPACE",
    description:
        "Swap tokens using Swappi DEX on Conflux eSpace network. Only works with EVM-compatible tokens.",
    similes: [
        "exchange espace",
        "trade espace",
        "swap espace",
        "convert espace",
        "exchange tokens espace",
        "trade tokens espace",
        "swap tokens espace",
        "convert tokens espace",
        "use swappi espace",
        "swappi espace",
    ],
    examples: [
        [
            {
                user: "user",
                content: {
                    text: "swap 0.0001 CFX for USDT on eSpace",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "0.0001 CFX swapped for USDT on eSpace network: 0x1234567890abcdef",
                    action: "SWAP_ESPACE",
                    params: {
                        text: "swap 0.0001 CFX for USDT on eSpace",
                        amount: 0.0001,
                        fromToken: "CFX",
                        toToken: "USDT",
                    },
                },
            },
        ],
        [
            {
                user: "user",
                content: {
                    text: "exchange 100 USDT to ETH on eSpace",
                },
            },
            {
                user: "assistant",
                content: {
                    text: "100 USDT swapped for ETH on eSpace network: 0x1234567890abcdef",
                    action: "SWAP_ESPACE",
                    params: {
                        text: "exchange 100 USDT to ETH on eSpace",
                        amount: 100,
                        fromToken: "USDT",
                        toToken: "ETH",
                    },
                },
            },
        ],
    ],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return true; // Content validation happens in execute
    },
    handler: async (
        runtime: IAgentRuntime,
        initialMessage: Memory,
        initialState?: State,
        options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        const state = initialState
            ? await runtime.updateRecentMessageState(initialState)
            : ((await runtime.composeState(initialMessage)) as State);

        const context = composeContext({
            state,
            template: swapTemplate,
        });

        const content = await generateObject({
            runtime,
            context,
            modelClass: ModelClass.LARGE,
            schema: SwapSchema,
        });

        if (!isSwapContent(content.object)) {
            throw new Error("Invalid swap content");
        }

        const swapContent = content.object;
        console.log("Parsed swap content:", swapContent);

        const { amount, fromToken, toToken } = swapContent.params;

        // Get token addresses
        const tokenIn = TOKEN_MAP[fromToken] || WCFX_ADDRESS;
        const tokenOut = TOKEN_MAP[toToken] || USDT_ADDRESS;
        const decimalsIn = DECIMALS_MAP[tokenIn];
        const amountIn = parseAmount(amount, decimalsIn);

        console.log("Swap parameters:", {
            tokenIn,
            tokenOut,
            amountIn: amountIn.toString(),
            decimalsIn,
        });

        // Setup provider and signer
        const rpcUrl = runtime.getSetting("CONFLUX_ESPACE_RPC_URL");
        const privateKey = runtime.getSetting(
            "CONFLUX_ESPACE_PRIVATE_KEY"
        ) as string;
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const signer = new ethers.Wallet(privateKey, provider);

        const router = new ethers.Contract(
            SWAPPI_ROUTER_ADDRESS,
            SwappiRouterABI.abi,
            signer
        );

        const path = [tokenIn, tokenOut];
        const to = await signer.getAddress();
        const deadline = Math.floor(Date.now() / 1000) + 20 * 60; // 20 minutes
        const slippage = 0.5; // 0.5%

        let success = false;

        try {
            // Get current balance
            const balance = await provider.getBalance(to);
            console.log("Current balance:", ethers.utils.formatEther(balance));

            // Get gas price
            const feeData = await provider.getFeeData();
            const maxFeePerGas = feeData.maxFeePerGas || feeData.gasPrice;
            const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
            console.log(
                "Gas price:",
                ethers.utils.formatUnits(maxFeePerGas || 0, "gwei"),
                "gwei"
            );

            // Estimate gas for the swap
            const gasLimit = await router.estimateGas.swapExactETHForTokens(
                0, // We'll calculate this after getting amounts
                path,
                to,
                deadline,
                { value: amountIn }
            );
            console.log("Estimated gas:", gasLimit.toString());

            // Calculate total cost (swap amount + gas)
            const gasCost = gasLimit.mul(maxFeePerGas || 0);
            const totalCost = amountIn + gasCost.toBigInt();
            console.log("Total cost:", ethers.utils.formatEther(totalCost));

            if (balance.toBigInt() < totalCost) {
                throw new Error(
                    `Insufficient balance. Need ${ethers.utils.formatEther(totalCost)} CFX but have ${ethers.utils.formatEther(balance)} CFX`
                );
            }

            console.log("Getting amounts out for path:", path);
            const amounts = await router.getAmountsOut(amountIn, path);
            console.log("Amounts out:", amounts);

            const amountOutMin = amounts[1]
                .mul(ethers.BigNumber.from(1000 - slippage * 10))
                .div(1000);
            console.log("Minimum amount out:", amountOutMin.toString());

            // Check if dealing with native token (CFX)
            const isNativeTokenIn =
                tokenIn.toLowerCase() === WCFX_ADDRESS.toLowerCase();
            const isNativeTokenOut =
                tokenOut.toLowerCase() === WCFX_ADDRESS.toLowerCase();

            let tx: ethers.ContractTransaction;
            if (isNativeTokenIn) {
                console.log("Swapping native CFX for token");
                tx = await router.swapExactETHForTokens(
                    amountOutMin,
                    path,
                    to,
                    deadline,
                    {
                        value: amountIn,
                        maxFeePerGas,
                        maxPriorityFeePerGas,
                        gasLimit: gasLimit.mul(12).div(10), // Add 20% buffer
                    }
                );
            } else if (isNativeTokenOut) {
                console.log("Swapping token for native CFX");
                const token = new ethers.Contract(
                    tokenIn,
                    [
                        "function approve(address spender, uint256 amount) external returns (bool)",
                    ],
                    signer
                );
                console.log("Approving token spend");
                const approveTx = await token.approve(
                    SWAPPI_ROUTER_ADDRESS,
                    amountIn,
                    {
                        maxFeePerGas,
                        maxPriorityFeePerGas,
                    }
                );
                await approveTx.wait();

                tx = await router.swapExactTokensForETH(
                    amountIn,
                    amountOutMin,
                    path,
                    to,
                    deadline,
                    {
                        maxFeePerGas,
                        maxPriorityFeePerGas,
                        gasLimit: gasLimit.mul(12).div(10), // Add 20% buffer
                    }
                );
            } else {
                console.log("Swapping token for token");
                const token = new ethers.Contract(
                    tokenIn,
                    [
                        "function approve(address spender, uint256 amount) external returns (bool)",
                    ],
                    signer
                );
                console.log("Approving token spend");
                const approveTx = await token.approve(
                    SWAPPI_ROUTER_ADDRESS,
                    amountIn,
                    {
                        maxFeePerGas,
                        maxPriorityFeePerGas,
                    }
                );
                await approveTx.wait();

                tx = await router.swapExactTokensForTokens(
                    amountIn,
                    amountOutMin,
                    path,
                    to,
                    deadline,
                    {
                        maxFeePerGas,
                        maxPriorityFeePerGas,
                        gasLimit: gasLimit.mul(12).div(10), // Add 20% buffer
                    }
                );
            }

            console.log("Waiting for transaction:", tx.hash);
            await tx.wait();
            console.log("Swap completed successfully");
            success = true;

            if (callback) {
                callback({
                    text: `Swapped ${amount} ${fromToken} for ${toToken}: ${tx.hash}`,
                    content: swapContent,
                });
            }
        } catch (error: unknown) {
            console.error("Swap failed:", error);
            if (callback) {
                callback({
                    text:
                        error instanceof Error
                            ? `Swap failed: ${error.message}`
                            : "Swap failed with unknown error",
                });
            }
        }

        return success;
    },
};
