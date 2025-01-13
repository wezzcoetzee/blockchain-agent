import { Address, parseEther } from "viem";
import { createViemWalletClient } from "../viem/createViemWalletClient.js";
import { ToolConfig } from "./allTools.js";
import { createViemPublicClient } from "../viem/createViemPublicClient.js";
import { ERC20_ABI, ERC20_BYTECODE } from "../const/contractDetails.js";

interface DeployErc20Args {
  name: string;
  symbol: string;
  initialSupply?: string; // Optional initial supply
}

export const deployErc20Tool: ToolConfig<DeployErc20Args> = {
  definition: {
    type: "function",
    function: {
      name: "deploy_erc20_token",
      description: "Deploy an ERC20 token contract",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the token",
          },
          symbol: {
            type: "string",
            description: "The symbol of the token",
          },
          initialSupply: {
            type: "string",
            description: "The initial supply of the token (in tokens)",
            pattern: "^\\d+$",
            optional: true,
          },
        },
        required: ["name", "symbol"],
      },
    },
  },
  handler: async ({ name, symbol, initialSupply }) => {
    try {
      const walletClient = createViemWalletClient();
      const publicClient = createViemPublicClient();
      const supply = BigInt(initialSupply || "1000000000");

      const hash = await walletClient.deployContract({
        account: walletClient.account,
        abi: ERC20_ABI,
        bytecode: ERC20_BYTECODE,
        args: [name, symbol, supply],
      });

      return await publicClient.waitForTransactionReceipt({ hash });
    } catch (error) {
      throw new Error(
        `Failed to deploy ERC20 token: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  },
};
