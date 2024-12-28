import { Provider, IAgentRuntime, elizaLogger } from "@ai16z/eliza";
import Snoowrap from "snoowrap";
import { RedditPostClient } from "../clients/redditPostClient";

export class RedditProvider {
    postClient: RedditPostClient;
    runtime: IAgentRuntime;
    reddit: Snoowrap;

    constructor(runtime: IAgentRuntime, reddit?: Snoowrap) {
        this.runtime = runtime;
        if (reddit) {
            this.reddit = reddit;
        } else {
            // Use the provided user agent or build one
            const userAgent = this.runtime.getSetting("REDDIT_USER_AGENT");

            this.reddit = new Snoowrap({
                userAgent,
                clientId: runtime.getSetting("REDDIT_CLIENT_ID"),
                clientSecret: runtime.getSetting("REDDIT_CLIENT_SECRET"),
                refreshToken: runtime.getSetting("REDDIT_REFRESH_TOKEN"),
                accessToken: this.runtime.getSetting("REDDIT_ACCESS_TOKEN"),
                // Add these options for better auth handling
                endpointDomain: 'oauth.reddit.com',
                requestDelay: 1000,
                continueAfterRatelimitError: true,
                retryErrorCodes: [502, 503, 504, 522],
                maxRetryAttempts: 3
            });

            // Configure additional options
            this.reddit.config({
                debug: true,
                proxies: false,
                requestTimeout: 30000
            });
        }
        this.postClient = new RedditPostClient(runtime, this);
    }

    async start() {
        try {
            elizaLogger.info("Starting Reddit authentication with:", {
                userAgent: this.reddit.userAgent,
                clientIdExists: !!this.runtime.getSetting("REDDIT_CLIENT_ID"),
                secretExists: !!this.runtime.getSetting("REDDIT_CLIENT_SECRET"),
                tokenExists: !!this.runtime.getSetting("REDDIT_REFRESH_TOKEN"),
                accessTokenExists: !!this.runtime.getSetting("REDDIT_ACCESS_TOKEN")
            });

            // Test authentication
            const me = await this.reddit.getMe();
            elizaLogger.info("Reddit authentication successful", {
                username: me.name,
                karma: me.link_karma + me.comment_karma
            });

            // Start the post client after successful auth
            const postImmediately = this.runtime.getSetting("POST_IMMEDIATELY") === "true";
            await this.postClient.start(postImmediately);

        } catch (error) {
            elizaLogger.error("Reddit authentication failed", {
                error: error.message,
                response: error.response?.body,
                statusCode: error.statusCode,
                headers: error.response?.headers
            });
            throw error;
        }
    }

    async submitSelfpost({ subredditName, title, text }: {
        subredditName: string;
        title: string;
        text: string;
    }) {
        try {
            elizaLogger.info(`Attempting to submit post to r/${subredditName}:`, {
                title,
                contentLength: text.length
            });

            const subreddit = await this.reddit.getSubreddit(subredditName);
            const post = await subreddit.submitSelfpost({ title, text });

            elizaLogger.success(`Successfully posted to Reddit:`, {
                url: `https://reddit.com${post.permalink}`,
                subreddit: subredditName,
                title: post.title,
                upvotes: post.score
            });

            return post;
        } catch (error) {
            elizaLogger.error("Failed to submit post", {
                error: error.message,
                subreddit: subredditName,
                isAuthenticated: !!this.reddit.accessToken
            });
            throw error;
        }
    }
}

export const redditProvider: Provider = {
    provide: async (runtime: IAgentRuntime) => {
        const userAgent = runtime.getSetting("REDDIT_USER_AGENT");

        const reddit = new Snoowrap({
            userAgent,
            clientId: runtime.getSetting("REDDIT_CLIENT_ID"),
            clientSecret: runtime.getSetting("REDDIT_CLIENT_SECRET"),
            refreshToken: runtime.getSetting("REDDIT_REFRESH_TOKEN"),
            endpointDomain: 'oauth.reddit.com'
        });

        const provider = new RedditProvider(runtime, reddit);
        await provider.start();
        return { reddit: provider };
    }
};
