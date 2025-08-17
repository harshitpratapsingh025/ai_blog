import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { AudioPlayer } from "@/components/Common/AudioPlayer";
import { fetchPostById, likePost } from "@/store/slices/postsSlice";
import { useToast } from "@/hooks/use-toast";
import type { RootState, AppDispatch } from "@/store";

export function PostDetails() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { currentPost: post, loading, error } = useSelector((state: RootState) => state.posts);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, id]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLike = () => {
    if (post) {
      dispatch(likePost(post.id));
      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Removed from likes" : "Added to likes",
        description: isLiked ? "Post removed from your likes" : "Thanks for liking this post!",
      });
    }
  };

  const handleShare = (platform: string) => {
    if (!post) return;
    
    const url = window.location.href;
    const text = `Check out this post: ${post.title}`;
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    
    // Simulate comment submission
    toast({
      title: "Comment posted!",
      description: "Your comment has been added successfully.",
    });
    setNewComment("");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <i className="fas fa-exclamation-triangle text-6xl text-destructive mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Post not found</h3>
          <p className="text-muted-foreground mb-6">
            {error || "The post you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <article className="fade-in">
        {/* Post Header */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Badge className="bg-primary/10 text-primary">
              {post.category}
            </Badge>
            <span className="ml-4 text-muted-foreground text-sm">
              Published {formatDistanceToNow(new Date(post.createdAt || Date.now()), { addSuffix: true })} • {post.readingTime} min read
            </span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                  {getInitials(post.author.first_name + ' ' + post.author.last_name)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="font-medium">{post.author.first_name + ' ' + post.author.last_name}</p>
                <p className="text-sm text-muted-foreground">{post.author.bio}</p>
              </div>
            </div>
            
            {/* Social Actions */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleLike}
                variant="outline"
                className={`${
                  isLiked 
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-800" 
                    : "hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                }`}
              >
                <i className={`${isLiked ? "fas" : "far"} fa-heart mr-2`}></i>
                {(post.likesCount || 0) + (isLiked ? 1 : 0)}
              </Button>
              <Button
                variant="outline"
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
              >
                <i className="fas fa-share mr-2"></i>
                Share
              </Button>
            </div>
          </div>
        </header>

       


        {/* Featured Image Placeholder */}
        <div className="w-full h-64 md:h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg shadow-lg mb-8 flex items-center justify-center">
          <i className="fas fa-image text-6xl text-muted-foreground"></i>
        </div>

        {/* Post Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(post.tags || []).map((tag: string) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              #{tag}
            </Button>
          ))}
        </div>

         {/* TL;DR Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-l-4 border-primary p-6 rounded-lg mb-8">
          <h3 className="font-semibold text-lg mb-3 flex items-center">
            <i className="fas fa-clock mr-2 text-primary"></i>
            TL;DR Summary
          </h3>
          <p className="text-muted-foreground">
            {post.excerpt}
          </p>
        </div>


        {/* Audio Player */}
        <div className="mb-8">
          <AudioPlayer 
            title={post.title}
            audioUrl={post.audioUrl}
            id={post.id}
          />
        </div>

        {/* Engagement Section */}
        <div className="border-t border-border pt-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <Button
                onClick={handleLike}
                variant="outline"
                className={`px-6 py-3 ${
                  isLiked 
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-800" 
                    : "hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                }`}
              >
                <i className={`${isLiked ? "fas" : "far"} fa-heart mr-2`}></i>
                <span>{(post.likesCount || 0) + (isLiked ? 1 : 0)} Likes</span>
              </Button>
              <Button
                variant="outline"
                className="px-6 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
              >
                <i className="fas fa-comment mr-2"></i>
                <span>{post.commentsCount || 0} Comments</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare("twitter")}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500"
              >
                <i className="fab fa-twitter"></i>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare("facebook")}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
              >
                <i className="fab fa-facebook"></i>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare("linkedin")}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500"
              >
                <i className="fab fa-linkedin"></i>
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Comments ({post.commentsCount || 0})</h3>
            
            {/* Comment Form */}
            <div className="bg-muted/50 rounded-lg p-6">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4 resize-none"
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="btn-primary"
                >
                  Post Comment
                </Button>
              </div>
            </div>

            {/* Sample Comments */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                    SA
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Sarah Adams</span>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm mb-3">
                      Great insights! I've been using GitHub Copilot for a few months now and it's incredible how much it speeds up development. The future is definitely exciting.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <button className="hover:text-red-500 transition-colors">
                        <i className="far fa-heart mr-1"></i>
                        <span>12</span>
                      </button>
                      <button className="hover:text-blue-500 transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    DL
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">David Lee</span>
                      <span className="text-sm text-muted-foreground">5 hours ago</span>
                    </div>
                    <p className="text-sm mb-3">
                      While AI tools are impressive, I think we need to be careful about over-reliance. Understanding the fundamentals is still crucial for any developer.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <button className="hover:text-red-500 transition-colors">
                        <i className="far fa-heart mr-1"></i>
                        <span>8</span>
                      </button>
                      <button className="hover:text-blue-500 transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
