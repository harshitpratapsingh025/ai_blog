import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMyPosts } from "@/store/slices/postsSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { PostWithAuthor } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { AppDispatch, RootState } from "@/store";
import { postsAPI } from "@/api";

export function MyPosts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const dispatch = useDispatch<AppDispatch>();
  const { myPosts, loading, error } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    dispatch(fetchMyPosts());
  }, [dispatch]);

  const filteredPosts = myPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.tags || []).some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "technology":
        return "bg-primary/10 text-primary";
      case "design":
        return "bg-secondary/10 text-secondary";
      case "business":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postsAPI.deletePost(postId);
      dispatch(fetchMyPosts());
      toast({
        title: "Post Deleted",
        description: "Your post has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
      });
    }
  };
  const PostCard = ({ post }: { post: PostWithAuthor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover-lift"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge className={getCategoryColor(post.category)}>
            {post.category}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <i className="fas fa-ellipsis-v"></i>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/posts/${post.id}`}>
                  <i className="fas fa-eye mr-2"></i>
                  View Post
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-edit mr-2"></i>
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeletePost(post.id)}
                className="text-destructive"
              >
                <i className="fas fa-trash mr-2"></i>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link
            href={`/posts/${post.id}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center">
              <i className="far fa-heart mr-1"></i>
              <span>{post.likesCount}</span>
            </div>
            <div className="flex items-center">
              <i className="far fa-comment mr-1"></i>
              <span>{post.commentsCount}</span>
            </div>
            <div className="flex items-center">
              <i className="far fa-eye mr-1"></i>
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          <div className="flex items-center">
            <Badge variant={post.isPublished ? "default" : "secondary"}>
              {post.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Created{" "}
              {post.createdAt
                ? formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })
                : "Unknown date"}
            </span>
            <span>
              Updated{" "}
              {post.updatedAt
                ? formatDistanceToNow(new Date(post.updatedAt), {
                    addSuffix: true,
                  })
                : "Unknown date"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const PostTableRow = ({ post }: { post: PostWithAuthor }) => (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded flex items-center justify-center">
            <i className="fas fa-file-alt text-muted-foreground"></i>
          </div>
          <div>
            <Link
              href={`/posts/${post.id}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {post.title}
            </Link>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {post.excerpt}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getCategoryColor(post.category)}>
          {post.category}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={post.isPublished ? "default" : "secondary"}>
          {post.isPublished ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {post.createdAt
          ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
          : "Unknown date"}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>{post.likesCount || 0} likes</span>
          <span>{post.commentsCount} comments</span>
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <i className="fas fa-ellipsis-v"></i>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/posts/${post.id}`}>
                <i className="fas fa-eye mr-2"></i>
                View Post
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="fas fa-edit mr-2"></i>
              Edit Post
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeletePost(post.id)}
              className="text-destructive"
            >
              <i className="fas fa-trash mr-2"></i>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <i className="fas fa-exclamation-triangle text-6xl text-destructive mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Failed to load posts</h3>
          <p className="text-muted-foreground mb-6">
            There was an error loading your posts. Please try again.
          </p>
          <Button onClick={() => console.log("Refetch")} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Posts</h1>
            <p className="text-muted-foreground">
              Manage and track the performance of your published content
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/new-post">
              <Button className="btn-primary">
                <i className="fas fa-plus mr-2"></i>
                Create New Post
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <i className="fas fa-file-alt text-primary text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold">{myPosts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <i className="fas fa-check-circle text-green-600 dark:text-green-400 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold">
                {myPosts.filter((p) => p.isPublished).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <i className="fas fa-edit text-yellow-600 dark:text-yellow-400 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Drafts</p>
              <p className="text-2xl font-bold">
                {myPosts.filter((p) => !p.isPublished).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <i className="fas fa-heart text-red-600 dark:text-red-400 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">Total Likes</p>
              <p className="text-2xl font-bold">
                {myPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative max-w-md">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            <Input
              type="text"
              placeholder="Search your posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8"
              >
                <i className="fas fa-th mr-2"></i>
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8"
              >
                <i className="fas fa-list mr-2"></i>
                Table
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg shadow-sm border border-border p-6"
                >
                  <Skeleton className="h-4 w-20 mb-4" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-12 h-12 rounded" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <i className="fas fa-file-alt text-6xl text-muted-foreground mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm ? "No posts found" : "No posts yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm
              ? "Try adjusting your search terms to find what you're looking for."
              : "Start creating amazing content with AI assistance."}
          </p>
          {!searchTerm && (
            <Link href="/new-post">
              <Button className="btn-primary">
                <i className="fas fa-plus mr-2"></i>
                Create Your First Post
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <PostTableRow key={post.id} post={post} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
