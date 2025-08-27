export interface IBlog {
    blog_id: string;
    blog_topic: string;
    blog_content: string;
    created_at: string;
    updated_at: string;
    images: {
        image_id: string;
        image_url: string;
    }[];
    cover_image: {
        image_id: string;
        image_url: string;
    };
}