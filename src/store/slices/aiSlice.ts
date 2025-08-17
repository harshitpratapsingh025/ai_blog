import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { AIReviewResponse, AISuggestion } from "@/types";
import type { TopicSuggestion } from "@shared/schema";
import { aiAPI } from "@/api/ai";

interface AIState {
  review: AIReviewResponse | null;
  topicSuggestions: TopicSuggestion[];
  isReviewing: boolean;
  isFetchingTopics: boolean;
  error: string | null;
}

const initialState: AIState = {
  review: null,
  topicSuggestions: [],
  isReviewing: false,
  isFetchingTopics: false,
  error: null,
};

export const reviewContent = createAsyncThunk(
  "ai/reviewContent",
  async ({ content, title }: { content: string; title: string }) => {
    return await aiAPI.reviewContent({ content, title });
  }
);

export const fetchTopicSuggestions = createAsyncThunk(
  "ai/fetchTopicSuggestions",
  async () => {
    return await aiAPI.fetchTopicSuggestions();
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearReview: (state) => {
      state.review = null;
    },
    clearTopicSuggestions: (state) => {
      state.topicSuggestions = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reviewContent.pending, (state) => {
        state.isReviewing = true;
        state.error = null;
      })
      .addCase(reviewContent.fulfilled, (state, action) => {
        state.isReviewing = false;
        state.review = action.payload;
      })
      .addCase(reviewContent.rejected, (state, action) => {
        state.isReviewing = false;
        state.error = action.error.message || "Failed to review content";
      })
      .addCase(fetchTopicSuggestions.pending, (state) => {
        state.isFetchingTopics = true;
        state.error = null;
      })
      .addCase(fetchTopicSuggestions.fulfilled, (state, action) => {
        state.isFetchingTopics = false;
        state.topicSuggestions = action.payload;
      })
      .addCase(fetchTopicSuggestions.rejected, (state, action) => {
        state.isFetchingTopics = false;
        state.error = action.error.message || "Failed to fetch topic suggestions";
      });
  },
});

export const { clearReview, clearTopicSuggestions, clearError } = aiSlice.actions;
export { aiSlice };
