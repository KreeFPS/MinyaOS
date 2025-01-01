import { Client, IAgentRuntime, elizaLogger } from "@ai16z/eliza";
import { WordpressClient } from "./client";
import { validateWordpressConfig } from "./environment";
import { WordpressBlogClient } from "./blog";

export class WordpressManager {
    client: WordpressClient;
    blog: WordpressBlogClient;
    constructor(runtime: IAgentRuntime) {
        this.client = new WordpressClient({
            url: runtime.getSetting("WORDPRESS_URL"),
            username: runtime.getSetting("WORDPRESS_USERNAME"),
            password: runtime.getSetting("WORDPRESS_PASSWORD"),
        });
        this.blog = new WordpressBlogClient(this.client, runtime);
    }
}

export const WordpressClientInterface: Client = {
    async start(runtime: IAgentRuntime) {
        await validateWordpressConfig(runtime);
        const wp = new WordpressManager(runtime);

        wp.blog.start();

        return wp;
    },
    async stop(_runtime: IAgentRuntime) {
        elizaLogger.warn("Wordpress client does not support stopping yet");
    },
};

export default WordpressClientInterface;
