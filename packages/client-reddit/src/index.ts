import { Plugin, Client } from "@ai16z/eliza";
import { createPost } from "./actions/post";
import { createComment } from "./actions/comment";
import { vote } from "./actions/vote";
import { redditProvider } from "./providers/redditProvider";
import { RedditClient } from "./clients/redditClient";

export const RedditClientInterface: Client = {
    async start(runtime) {
        const client = new RedditClient(runtime);
        await client.start();
        return client;
    },
    async stop(runtime) {
        // Cleanup logic
    }
};

export const redditPlugin: Plugin = {
    name: "reddit",
    description: "Reddit Plugin for Eliza - Interact with Reddit posts, comments and voting",
    actions: [createPost, createComment, vote],
    providers: [redditProvider],
    evaluators: [],
    clients: [RedditClientInterface]
};

export default redditPlugin;
