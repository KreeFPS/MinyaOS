import {
    Evaluator,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    composeContext,
    generateObjectV2,
} from "@ai16z/eliza";
import { z } from "zod";

const ImportanceSchema = z.object({
    isImportant: z.boolean(),
    category: z.enum([
        "planning",
        "decision",
        "technical_detail",
        "requirement",
        "milestone",
        "blocker",
        "resolution",
        "general_chat",
    ]),
    importance: z.number().min(0).max(10),
    reason: z.string(),
    keyPoints: z.array(z.string()),
});

export type ImportanceAnalysis = z.infer<typeof ImportanceSchema>;

const importanceTemplate = `Analyze the importance of this message in the context of project planning and development.

Message Content:
{{messageContent}}

Recent Context:
{{recentContext}}

Guidelines for importance analysis:

Categories:
- planning: Project planning, roadmap discussions
- decision: Key decisions and approvals
- technical_detail: Important technical specifications
- requirement: Business or technical requirements
- milestone: Achievement of significant goals
- blocker: Issues blocking progress
- resolution: Solutions to problems
- general_chat: General conversation

Importance Scale (0-10):
0-2: General chat, greetings
3-4: Minor updates, clarifications
5-6: Useful information
7-8: Important decisions/information
9-10: Critical updates/blockers

Example response:
\`\`\`json
{
    "isImportant": true,
    "category": "technical_detail",
    "importance": 8,
    "reason": "Contains critical API specifications that affect multiple teams",
    "keyPoints": [
        "New authentication flow defined",
        "Rate limiting parameters specified",
        "Breaking changes identified"
    ]
}
\`\`\`

Analyze the message and provide a structured assessment of its importance.`;

export const importanceEvaluator: Evaluator = {
    name: "ANALYZE_IMPORTANCE",
    description:
        "Analyzes message importance and stores significant messages in global memory",
    similes: ["ASSESS_SIGNIFICANCE", "CHECK_RELEVANCE", "FILTER_IMPORTANCE"],
    examples: [
        {
            context: "Technical discussion about API changes",
            messages: [
                {
                    user: "{{user1}}",
                    content: {
                        text: "We need to update the authentication flow to use JWT tokens and implement rate limiting at 100 requests per minute per user.",
                    },
                },
            ],
            outcome: `{
                "isImportant": true,
                "category": "technical_detail",
                "importance": 8,
                "reason": "Critical API security and performance specifications",
                "keyPoints": [
                    "Switch to JWT authentication",
                    "Rate limit: 100 req/min/user"
                ]
            }`,
        },
    ],
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        return [];
    },
    validate: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ): Promise<boolean> => {
        try {
            // Get recent messages for context
            const recentMessages = await runtime.messageManager.getMemories({
                roomId: message.roomId,
                count: 10,
                unique: false,
            });

            const context = composeContext({
                state: {
                    ...state,
                    messageContent: message.content.text,
                    recentContext: recentMessages
                        .map((m) => m.content.text)
                        .join("\n"),
                },
                template: importanceTemplate,
            });

            const result = await generateObjectV2({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
                schema: ImportanceSchema,
            });

            const analysis = result.object as ImportanceAnalysis;

            // If message is important, store it in agent's global memory
            if (analysis.importance >= 5) {
                const globalMemory: Memory = {
                    id: message.id,
                    userId: message.userId,
                    agentId: runtime.agentId,
                    roomId: runtime.agentId, // Store in agent's global memory
                    content: {
                        text: message.content.text,
                        source: message.content.source,
                        url: message.content.url,
                        importance: analysis,
                        originalRoomId: message.roomId, // Keep track of original channel
                    },
                    createdAt: message.createdAt,
                };

                await runtime.messageManager.createMemory(globalMemory, true);

                // Cache the importance analysis
                const cacheKey = `${runtime.character.name}/message-importance/${message.id}`;
                await runtime.cacheManager?.set(cacheKey, analysis);
            }

            return true;
        } catch (error) {
            console.error("Error in importance evaluator:", error);
            return false;
        }
    },
};
