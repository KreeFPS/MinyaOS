import { IAgentRuntime, elizaLogger } from "@ai16z/eliza";
import { RedditProvider } from "../providers/redditProvider";
import { RedditPostClient } from "./redditPostClient";
import Snoowrap from "snoowrap";

export class RedditClient {
    provider: RedditProvider;
    postClient: RedditPostClient;
    runtime: IAgentRuntime;

    constructor(runtime: IAgentRuntime) {
        this.runtime = runtime;
        const reddit = new Snoowrap({
            userAgent: runtime.getSetting("REDDIT_USER_AGENT"),
            clientId: runtime.getSetting("REDDIT_CLIENT_ID"),
            clientSecret: runtime.getSetting("REDDIT_CLIENT_SECRET"),
            refreshToken: runtime.getSetting("REDDIT_REFRESH_TOKEN")
        });
        this.provider = new RedditProvider(runtime, reddit);
        this.postClient = new RedditPostClient(runtime, this.provider);
    }

    async start() {
        elizaLogger.info("Starting Reddit client");
        await this.provider.start();

        const autoPost = this.runtime.getSetting("REDDIT_AUTO_POST") === "true";
        if (autoPost) {
            elizaLogger.info("Auto-posting enabled for Reddit");
            await this.postClient.start(true);
        }
    }

    async stop() {
        elizaLogger.info("Stopping Reddit client");
        await this.postClient.stop();
    }

    async submitPost(subreddit: string, title: string, content: string) {
        try {
            const post = await this.provider.submitSelfpost({
                subredditName: subreddit,
                title,
                text: content
            });
            return post;
        } catch (error) {
            elizaLogger.error("Error submitting Reddit post:", error);
            throw error;
        }
    }
}