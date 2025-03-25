export interface RentalViewStats {
    id: number;
    title: string;
    viewCount: number;
    postedDate: string;
    status: string;
}

export interface RentalStatusStats {
    totalPosts: number;
    activePosts: number;
    expiredPosts: number;
    pendingPosts: number;
} 