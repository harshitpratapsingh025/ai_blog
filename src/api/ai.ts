import { api } from "./index";
import type { AIReviewResponse } from '@/types';
import type { TopicSuggestion } from '@shared/schema';

export interface ReviewContentRequest {
  content: string;
  postId?: string;
}

export const aiAPI = {
  // Review content using AI
  reviewContent: async (data: ReviewContentRequest): Promise<AIReviewResponse> => {
    const response = await api.post('/ai/review', data);
    return response.data;
  },

  // Fetch topic suggestions
  fetchTopicSuggestions: async (): Promise<TopicSuggestion[]> => {
    const response = await api.get('/ai/topics');
    return response.data;
  },

  // Generate content suggestions
  generateSuggestions: async (prompt: string): Promise<string[]> => {
    const response = await api.post('/ai/suggestions', { prompt });
    return response.data;
  },

  // Analyze post performance
  analyzePost: async (postId: string): Promise<any> => {
    const response = await api.get(`/ai/analyze/${postId}`);
    return response.data;
  },
};
