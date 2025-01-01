import { IAgentRuntime } from "@ai16z/eliza";
import { z } from "zod";

export const wordpressEnvSchema = z.object({
    WORDPRESS_URL: z.string().min(1, "Wordpress url is required"),
    WORDPRESS_USERNAME: z.string().min(1, "Wordpress username is required"),
    WORDPRESS_PASSWORD: z.string().min(1, "Wordpress password is required"),
});

export type WordpressConfig = z.infer<typeof wordpressEnvSchema>;

export async function validateWordpressConfig(
    runtime: IAgentRuntime
): Promise<WordpressConfig> {
    try {
        const config = {
            WORDPRESS_URL:
                runtime.getSetting("WORDPRESS_URL") ||
                process.env.WORDPRESS_URL,
            WORDPRESS_USERNAME:
                runtime.getSetting("WORDPRESS_USERNAME") ||
                process.env.WORDPRESS_USERNAME,
            WORDPRESS_PASSWORD:
                runtime.getSetting("WORDPRESS_PASSWORD") ||
                process.env.WORDPRESS_PASSWORD,
        };

        return wordpressEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Wordpress configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
