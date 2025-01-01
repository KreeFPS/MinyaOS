import axios, { AxiosInstance } from "axios";
import { WpConfig, WpPost } from "./types";
import { IAgentRuntime } from "@ai16z/eliza";

class RequestQueue {
    private queue: (() => Promise<any>)[] = [];
    private processing = false;

    async add<T>(request: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await request();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) {
            return;
        }

        this.processing = true;
        while (this.queue.length > 0) {
            const request = this.queue.shift();
            if (!request) continue;
            try {
                await request();
            } catch (error) {
                console.error("Error processing request:", error);
                this.queue.unshift(request);
                await this.exponentialBackoff(this.queue.length);
            }
            await this.randomDelay();
        }
        this.processing = false;
    }

    private async exponentialBackoff(retryCount: number) {
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    private async randomDelay() {
        const delay = Math.floor(Math.random() * 2000) + 1500;
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
}

export class WordpressClient {
    private client: AxiosInstance;
    private config: WpConfig;
    protected requestQueue: RequestQueue = new RequestQueue();

    constructor(config: WpConfig) {
        this.config = config;
        this.client = axios.create({
            baseURL: `${config.url}/wp-json/wp/v2`,
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${config.username}:${config.password}`
                ).toString("base64")}`,
                "Content-Type": "application/json",
            },
        });
    }

    async init() {
        // check if the client is initialized
        if (this.client) {
            return;
        }
    }

    public getPublicConfig() {
        const { username } = this.config;
        return { username };
    }

    async createPost(post: WpPost): Promise<any> {
        const response = await this.client.post("/posts", post);
        return response.data;
    }

    async getPosts(): Promise<any> {
        const response = await this.client.get("/posts");
        return response.data;
    }

    public async addToRequestQueue(task: () => Promise<any>) {
        return this.requestQueue.add(task);
    }
}
