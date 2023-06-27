export type Ring = {
    name: string;
    title: string;
    displayName: string;
    description: string;
    createdAt: string;
    nsfw: boolean;
    subscribers: number;
    primaryColor: string;
};

export type Author = {
    username: string;
    displayName: string;
    createdAt: string;
    admin: boolean;
};

export type Badge = {
    id: string;
    backgroundColor: string;
    textColor: string;
}

export type ErrorMessage = {
    error: string;
};

export type User = {
    username: string;
    displayName: string;
    profilePicture: string;
    socialLinks: SocialLink[];
    createdAt: string;

    badges: Badge[];
    admin: boolean;
};

export type SocialLink = {
    username: string;
    platform: string;
    url: string;
};

export type SimplePost = {
    id: number;
    createdAt: string;
    ringName: string;
    ringColor: string;
    authorUsername: string;
    author: Author;
    title: string;
    body?: string;
    link: string;
    domain: string;
    score: number;
    commentsCount: number;
    ups: number;
    downs: number;
    nsfw: boolean;
};

export type Comment = {
    id: number;
    depth: number;
    createdAt: string;
    updatedAt: string;
    post_id: number;
    parent_id: number | null;
    author_id: string;
    author: Author;
    body: string;
    ups: number;
    downs: number;
    score: number;
    replies: Comment[] | null;

    votedUp: boolean;
    votedDown: boolean;
    _showComposer: boolean;
}


export type Post = {
    id: number;
    createdAt: string;
    updatedAt: string;
    ringName: string;
    ring: Ring;
    author_username: string;
    author: Author;
    body?: string;
    title: string;
    link: string;
    domain: string;
    score: number;
    commentsCount: number;
    ups: number;
    downs: number;
    nsfw: boolean;
};