import { Address, formatEther } from "viem";
import { createViemPublicClient } from "../viem/createViemPublicClient.js";
import { ToolConfig } from "./allTools.js";

interface GetBalanceArgs {
  wallet: Address;
}

export const getBalanceTool: ToolConfig<GetBalanceArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_balance",
      description: "Get the balance of a wallet",
      parameters: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            description: "The wallet address",
            pattern: "^0x[0-9a-fA-F]{40}$",
          },
        },
        required: ["wallet"],
      },
    },
  },
  handler: async ({ wallet }) => {
    const client = createViemPublicClient();
    const balance = await client.getBalance({ address: wallet });
    return formatEther(balance);
  },
};
