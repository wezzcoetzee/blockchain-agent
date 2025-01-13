import { Address, parseEther } from "viem";
import { createViemWalletClient } from "../viem/createViemWalletClient.js";
import { ToolConfig } from "./allTools.js";
import { optimism } from "viem/chains";

interface SendTransactionArgs {
  to: Address;
  value?: string;
}

export const sendTransactionTool: ToolConfig<SendTransactionArgs> = {
  definition: {
    type: "function",
    function: {
      name: "send_transaction",
      description: "Send ETH to an address",
      parameters: {
        type: "object",
        properties: {
          to: {
            type: "string",
            description: "The recipient address",
            pattern: "^0x[0-9a-fA-F]{40}$",
          },
          value: {
            type: "string",
            description: "The amount of ETH to send (in ETH, not Wei)",
            pattern: "^\\d+(\\.\\d+)?$",
            optional: true,
          },
        },
        required: ["to"],
      },
    },
  },
  handler: async ({ to, value }) => {
    try {
      const walletClient = createViemWalletClient();
      const hash = await walletClient.sendTransaction({
        to,
        value: value ? parseEther(value) : undefined,
      });
      return hash;
    } catch (error) {
      throw new Error(
        `Failed to send transaction: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  },
};
