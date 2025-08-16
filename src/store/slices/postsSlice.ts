import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { PostWithAuthor, Post } from "@shared/schema";
import type { FilterState } from "@/types";
import { postsAPI } from "@/api/posts";

interface PostsState {
  posts: PostWithAuthor[];
  myPosts: PostWithAuthor[];
  currentPost: PostWithAuthor | null;
  filter: FilterState;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  offset: number;
}

const initialState: PostsState = {
  posts: [],
  myPosts: [],
  currentPost: null,
  filter: {
    search: "",
    category: "All",
    tags: [],
  },
  loading: false,
  error: null,
  hasMore: true,
  offset: 0,
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async () => {
    const response = await postsAPI.getPosts();
    return response as PostWithAuthor[];
  }
);

export const fetchMyPosts = createAsyncThunk("posts/fetchMyPosts", async () => {
  const response = await postsAPI.getMyPosts();
  return response as PostWithAuthor[];
});

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id: string) => {
    const response = await postsAPI.getPost(id);
    return response as PostWithAuthor;
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId: string) => {
    await postsAPI.likePost(postId);
    return postId;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filter = { ...state.filter, ...action.payload };
      state.offset = 0;
      state.hasMore = true;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.offset = 0;
      state.hasMore = true;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })
      .addCase(fetchMyPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.myPosts = action.payload;
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch post";
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const postId = action.payload;
        const post = state.posts.find((p: PostWithAuthor) => p.id === postId);
        if (post) {
          post.likesCount += 1;
        }
        if (state.currentPost?.id === postId) {
          state.currentPost.likesCount += 1;
        }
      });
  },
});

export const { setFilter, clearPosts, clearCurrentPost } = postsSlice.actions;
export { postsSlice };
