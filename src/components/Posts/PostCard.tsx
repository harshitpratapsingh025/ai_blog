import { motion } from "framer-motion";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { PostWithAuthor } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: PostWithAuthor;
}

export const PostCard = ({ post }: PostCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover-lift cursor-pointer group"
    >
      <Link href={`/posts/${post.id}`}>
        {/* Featured Image Placeholder */}
        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <i className="fas fa-image text-4xl text-muted-foreground"></i>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-3">
            <Badge className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
            <span className="ml-auto text-sm text-muted-foreground">
              {post.readingTime} min read
            </span>
          </div>

          <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-sm">
                  {getInitials(post.author.first_name + ' ' + post.author.last_name)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{post.author.first_name + ' ' + post.author.last_name}</p>
                <p className="text-xs text-muted-foreground">
                  {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Unknown date'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <i className="far fa-heart mr-1"></i>
                <span>{post.likesCount}</span>
              </div>
              <div className="flex items-center">
                <i className="far fa-comment mr-1"></i>
                <span>{post.commentsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
