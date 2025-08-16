import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PostCard } from "@/components/Posts/PostCard";
import { FilterBar } from "@/components/Posts/FilterBar";
import { fetchPosts, clearPosts } from "@/store/slices/postsSlice";
import type { RootState, AppDispatch } from "@/store";
import { Link } from "wouter";

export function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error, hasMore, filter } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(clearPosts());
    dispatch(fetchPosts());
  }, [dispatch, filter.category]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchPosts());
    }
  };

  const SkeletonCard = () => (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6">
        <Skeleton className="h-4 w-20 mb-3" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="ml-3">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Create{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI-Enhanced
          </span>{" "}
          Content
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Write better, faster, and smarter with our AI-assisted blogging platform. 
          Get suggestions, improve readability, and discover trending topics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/new-post">
            <Button className="btn-primary">
              Start Writing
            </Button>
          </Link>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Explore Posts
          </Button>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-destructive mr-3"></i>
            <div>
              <h3 className="font-medium text-destructive">Error loading posts</h3>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
          <Button 
            onClick={() => dispatch(fetchPosts())}
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {/* Loading Skeletons */}
        {loading && posts.length === 0 && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </>
        )}
      </div>

      {/* Empty State */}
      {!loading && posts.length === 0 && !error && (
        <div className="text-center py-16">
          <i className="fas fa-inbox text-6xl text-muted-foreground mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">No posts found</h3>
          <p className="text-muted-foreground mb-6">
            {filter.category !== "All" || filter.search
              ? "Try adjusting your filters to see more posts."
              : "Be the first to create a post!"}
          </p>
          <Link href="/new-post">
            <Button className="btn-primary">
              Create Your First Post
            </Button>
          </Link>
        </div>
      )}

      {/* Load More Button */}
      {posts.length > 0 && hasMore && (
        <div className="text-center mt-12">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Loading...
              </>
            ) : (
              "Load More Posts"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
