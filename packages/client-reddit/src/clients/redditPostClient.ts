import { IAgentRuntime, elizaLogger, generateText, ModelClass, composeContext } from "@ai16z/eliza";
import { RedditProvider } from "../providers/redditProvider";

const redditPostTemplate = `
# Areas of Expertise
{{knowledge}}

# About {{agentName}}:
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{characterPostExamples}}

{{postDirections}}

# Task: Generate a Reddit post in the voice and style of {{agentName}}.
Write a post for r/{{subreddit}} that is {{adjective}} about {{topic}}.
Title should be brief, engaging, and use only basic alphanumeric characters.
Content should be 2-4 sentences, natural and conversational. No markdown, emojis, or special characters.

Format your response as:
Title: <your title>
Content: <your content>`;

export class RedditPostClient {
    runtime: IAgentRuntime;
    reddit: RedditProvider;
    private stopProcessing: boolean = false;

    constructor(runtime: IAgentRuntime, reddit: RedditProvider) {
        this.runtime = runtime;
        this.reddit = reddit;
    }

    async start(postImmediately: boolean = false) {
        if (postImmediately) {
            await this.generateNewPost();
        }

        this.startPostingLoop();
    }

    private async startPostingLoop() {
        while (!this.stopProcessing) {
            try {
                const lastPost = await this.runtime.cacheManager.get<{
                    timestamp: number;
                }>("reddit/lastPost");

                const lastPostTimestamp = lastPost?.timestamp ?? 0;
                const minMinutes = parseInt(this.runtime.getSetting("POST_INTERVAL_MIN")) || 90;
                const maxMinutes = parseInt(this.runtime.getSetting("POST_INTERVAL_MAX")) || 180;
                const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
                const delay = randomMinutes * 60 * 1000;

                if (Date.now() > lastPostTimestamp + delay) {
                    await this.generateNewPost();
                }

                elizaLogger.log(`Next Reddit post scheduled in ${randomMinutes} minutes`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } catch (error) {
                elizaLogger.error("Error in Reddit posting loop:", error);
                await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); // Wait 5 minutes on error
            }
        }
    }

    private async submitWithRateLimit(subreddit: string, title: string, content: string) {
        elizaLogger.debug("Applying rate limit before submission");
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // Validate content lengths
            if (title.length === 0 || title.length > 300) {
                throw new Error(`Title length must be between 1-300 characters (current: ${title.length})`);
            }
            if (content.length > 40000) {
                throw new Error(`Content exceeds maximum length of 40,000 characters (current: ${content.length})`);
            }

            // Clean up the content
            const cleanTitle = title
                .replace(/[^\w\s-]/g, '') // Remove all non-word chars except spaces and hyphens
                .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
                .trim();

            const cleanContent = content
                .replace(/\*[^*]*\*/g, '')  // Remove markdown asterisks and content between them
                .replace(/[^\w\s.,!?-]/g, '') // Keep only basic punctuation
                .replace(/\s+/g, ' ')       // Replace multiple spaces with single space
                .trim();

            // Validate after cleaning
            if (!cleanTitle || !cleanContent) {
                throw new Error("Title or content is empty after cleaning");
            }

            // Log submission attempt
            elizaLogger.info("Attempting Reddit submission:", {
                subreddit,
                cleanTitle,
                titleLength: cleanTitle.length,
                contentLength: cleanContent.length,
                userAgent: this.reddit.reddit.userAgent,
                hasAuth: !!this.reddit.reddit.accessToken
            });

            const post = await this.reddit.submitSelfpost({
                subredditName: subreddit,
                title: cleanTitle,
                text: cleanContent
            });

            elizaLogger.info("Post submitted successfully:", {
                url: `https://reddit.com${post.permalink}`,
                subreddit: post.subreddit_name_prefixed,
                title: post.title,
                upvotes: post.score
            });

            return post;
        } catch (error) {
            const errorDetails = error.response?.body || error.message;
            elizaLogger.error("Reddit API submission error:", {
                error: {
                    name: error.name,
                    message: error.message,
                    details: errorDetails,
                    status: error.statusCode,
                    stack: error.stack
                },
                submission: {
                    subreddit,
                    titleLength: title.length,
                    contentLength: content.length,
                    hasAuth: !!this.reddit.reddit.accessToken,
                    userAgent: this.reddit.reddit.userAgent
                }
            });
            throw error;
        }
    }

    private async generateNewPost() {
        elizaLogger.info("=== Starting Reddit Post Generation ===");

        try {
            // Log settings check
            elizaLogger.debug("Checking Reddit credentials:", {
                hasClientId: !!this.runtime.getSetting("REDDIT_CLIENT_ID"),
                hasClientSecret: !!this.runtime.getSetting("REDDIT_CLIENT_SECRET"),
                hasRefreshToken: !!this.runtime.getSetting("REDDIT_REFRESH_TOKEN")
            });

            // Subreddit selection
            const subreddits = (this.runtime.getSetting("REDDIT_SUBREDDITS") || "test").split(",");
            const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)].trim();
            elizaLogger.info(`Selected subreddit: r/${subreddit}`);

            // State composition
            elizaLogger.debug("Composing state for post generation");
            const state = await this.runtime.composeState(
                {
                    userId: this.runtime.agentId,
                    roomId: `reddit-${this.runtime.agentId}`,
                    content: { text: "", action: "POST" }
                },
                { subreddit }
            );
            elizaLogger.debug("State composed successfully", { state });

            // Context creation
            elizaLogger.debug("Creating context with template");
            const context = composeContext({
                state,
                template: redditPostTemplate
            });
            elizaLogger.debug("Context created successfully");

            // Text generation
            elizaLogger.info("Generating post content...");
            const response = await generateText({
                runtime: this.runtime,
                context,
                modelClass: ModelClass.MEDIUM
            });
            elizaLogger.debug("Raw generated response:", response);

            // Response parsing
            const titleMatch = response.match(/Title:\s*(.*)/i);
            const contentMatch = response.match(/Content:\s*(.*)/is);

            if (!titleMatch || !contentMatch) {
                elizaLogger.error("Failed to parse post content:", {
                    response,
                    hasTitleMatch: !!titleMatch,
                    hasContentMatch: !!contentMatch
                });
                return;
            }

            const title = titleMatch[1].trim();
            const content = contentMatch[1].trim();
            elizaLogger.info("Parsed post content:", {
                title,
                content,
                titleLength: title.length,
                contentLength: content.length
            });

            // Dry run check
            if (this.runtime.getSetting("REDDIT_DRY_RUN") === "true") {
                elizaLogger.info(`[DRY RUN] Would post to r/${subreddit}:`, {
                    title,
                    content
                });
                return;
            }

            // Post submission
            elizaLogger.info(`Attempting to submit post to r/${subreddit}`);
            try {
                const post = await this.submitWithRateLimit(subreddit, title, content);

                // Cache update
                elizaLogger.debug("Updating last post cache");
                await this.runtime.cacheManager.set("reddit/lastPost", {
                    id: post.id,
                    timestamp: Date.now()
                });

                elizaLogger.success(`Successfully posted to Reddit: ${post.url}`);
            } catch (error) {
                // ... existing error handling ...
            }

        } catch (error) {
            elizaLogger.error("Error in Reddit post generation:", {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error,
                runtime: {
                    agentId: this.runtime.agentId,
                    hasRedditProvider: !!this.reddit
                }
            });
        }
    }

    async stop() {
        this.stopProcessing = true;
    }
}