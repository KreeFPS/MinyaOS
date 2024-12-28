export interface RedditPost {
    id: string;
    subreddit: string;
    title: string;
    content: string;
    author: string;
    score: number;
    created: Date;
}

export interface RedditComment {
    id: string;
    postId: string;
    content: string;
    author: string;
    score: number;
    created: Date;
}
