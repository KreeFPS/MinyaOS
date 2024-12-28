import { Action, IAgentRuntime, Memory } from "@ai16z/eliza";

export const createComment: Action = {
    name: "CREATE_REDDIT_COMMENT",
    similes: ["COMMENT_ON_REDDIT", "REPLY_ON_REDDIT"],
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

        // Extract post ID and comment content from message
        const postId = options.postId; // This should be a fullname (t3_postid)
        const content = message.content.text;

        try {
            await reddit.getSubmission(postId).reply(content);
            return true;
        } catch (error) {
            console.error("Failed to create Reddit comment:", error);
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Comment on this Reddit post: t3_abc123 with: Great post!"
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll add that comment to the Reddit post",
                    action: "CREATE_REDDIT_COMMENT",
                },
            },
        ],
    ],
};
