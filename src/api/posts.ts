import { PostWithAuthor } from "@shared/schema";
import { api } from "./index";

export interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  is_published?: boolean;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export const postsAPI = {
  // Get all posts with pagination
  getPosts: async (): Promise<PostWithAuthor[]> => {
    const response = await api.get(`/posts`);
    return response.data;
  },

  // Get single post by ID
  getPost: async (id: string): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const response = await api.post("/posts", data);
    return response.data;
  },

  // Update post
  updatePost: async (data: UpdatePostRequest): Promise<Post> => {
    const response = await api.put(`/posts/${data.id}`, data);
    return response.data;
  },

  // Delete post
  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  // Publish/unpublish post
  togglePublish: async (id: string): Promise<Post> => {
    const response = await api.patch(`/posts/${id}/publish`);
    return response.data;
  },

  // Get user's posts
  getMyPosts: async (): Promise<PostWithAuthor[]> => {
    const response = await api.get(`/posts/my_posts`);
    return response.data;
  },

  // Like a post
  likePost: async (id: string): Promise<Post> => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },
};
