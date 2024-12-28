import { Action, IAgentRuntime, Memory } from "@ai16z/eliza";

export const vote: Action = {
    name: "REDDIT_VOTE",
    similes: ["UPVOTE_ON_REDDIT", "DOWNVOTE_ON_REDDIT"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const hasCredentials = !!runtime.getSetting("REDDIT_CLIENT_ID") &&
                             !!runtime.getSetting("REDDIT_CLIENT_SECRET") &&
                             !!runtime.getSetting("REDDIT_REFRESH_TOKEN");
        return hasCredentials;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: any,
        options: any
    ) => {
        const { reddit } = await runtime.getProvider("redditProvider");

        // Extract target ID and vote direction
        const targetId = options.targetId; // fullname of post/comment
        const direction = options.direction; // 1 for upvote, -1 for downvote

        try {
            await reddit.getSubmission(targetId).upvote(); // or downvote()
            return true;
        } catch (error) {
            console.error("Failed to vote on Reddit:", error);
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Upvote this Reddit post: t3_abc123"
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll upvote that post for you",
                    action: "REDDIT_VOTE",
                },
            },
        ],
    ],
};
