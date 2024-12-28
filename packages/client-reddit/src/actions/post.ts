import { Action, IAgentRuntime, Memory } from "@ai16z/eliza";
import { RedditPost } from "../types";

export const createPost: Action = {
    name: "CREATE_REDDIT_POST",
    similes: ["POST_TO_REDDIT", "SUBMIT_REDDIT_POST"],
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

        // Parse the subreddit and content from the message
        // Expected format: "Post to r/subreddit: Title | Content"
        const messageText = message.content.text;
        const match = messageText.match(/Post to r\/(\w+):\s*([^|]+)\|(.*)/i);
        
        if (!match) {
            throw new Error("Invalid post format. Use: Post to r/subreddit: Title | Content");
        }

        const [_, subreddit, title, content] = match;

        try {
            const post = await reddit.submitSelfpost({
                subredditName: subreddit.trim(),
                title: title.trim(),
                text: content.trim()
            });

            return {
                success: true,
                data: {
                    id: post.id,
                    url: post.url,
                    subreddit: post.subreddit.display_name,
                    title: post.title
                }
            };
        } catch (error) {
            console.error("Failed to create Reddit post:", error);
            return {
                success: false,
                error: error.message
            };
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Post to r/test: My First Post | This is the content of my post"
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll create that post on r/test for you",
                    action: "CREATE_REDDIT_POST",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Post to r/AskReddit: What's your favorite book? | I'm curious to know what books everyone loves and why."
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Creating your post on r/AskReddit",
                    action: "CREATE_REDDIT_POST",
                },
            },
        ],
    ],
};
