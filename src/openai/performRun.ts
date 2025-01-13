import OpenAI from "openai";
import { MessageContent } from "openai/resources/beta/threads/messages.mjs";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import { handleRunToolCalls } from "./handleRunToolCalls.js";

export async function performRun(
  run: Run,
  client: OpenAI,
  thread: Thread
): Promise<MessageContent> {
  while (run.status === "requires_action") {
    run = await handleRunToolCalls(client, run, thread);
  }

  if (run.status === "failed") {
    const errorMessage = `I encountered a problem: ${
      run.last_error?.message || `Noone knows what happened`
    }`;

    console.error("Run failed:", run.last_error);

    await client.beta.threads.messages.create(thread.id, {
      role: "assistant",
      content: errorMessage,
    });

    return {
      type: "text",
      text: {
        value: errorMessage,
        annotations: [],
      },
    };
  }

  const messages = await client.beta.threads.messages.list(thread.id);
  const assistantMessage = messages.data.find(
    (message) => message.role === "assistant"
  );

  return (
    assistantMessage?.content[0] || {
      type: "text",
      text: { value: "No response from the assistant", annotations: [] },
    }
  );
}
