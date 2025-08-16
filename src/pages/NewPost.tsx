import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/Editor/RichTextEditor";
import { AIReviewPanel } from "@/components/AI/AIReviewPanel";
import { TopicSuggestions } from "@/components/AI/TopicSuggestions";
import { useToast } from "@/hooks/use-toast";
import type { RootState } from "@/store";
import type { EditorState } from "@/types";
import { postsAPI } from "@/api/posts";

export function NewPost() {
  const { toast } = useToast();
  const [post, setPost] = useState<EditorState>({
    title: "",
    content: "",
    tags: [],
    category: "",
    isPublished: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    "Technology",
    "Design",
    "Business",
    "Lifestyle",
    "Tutorial",
  ];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !post.tags.includes(tag)) {
        setPost((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = async (publish = false) => {
    if (!post.title.trim() || !post.content.trim() || !post.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, content, and category.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await postsAPI.createPost({
        title: post.title.trim(),
        content: post.content,
        tags: post.tags,
        category: post.category,
        is_published: publish,
      });
      toast({
        title: publish ? "Post Published!" : "Draft Saved!",
        description: publish
          ? "Your post is now live and visible to readers."
          : "Your draft has been saved successfully.",
      });

      if (publish) {
        // Redirect to home or post details
        window.history.pushState(null, "", "/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
        <p className="text-muted-foreground">
          Use AI to enhance your writing and discover trending topics
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            {/* Post Title */}
            <div className="mb-6">
              <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                Post Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter your post title..."
                value={post.title}
                onChange={(e) =>
                  setPost((prev) => ({ ...prev, title: e.target.value }))
                }
                className="text-lg"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Category</Label>
              <Select
                value={post.category}
                onValueChange={(value) =>
                  setPost((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rich Text Editor */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Content</Label>
              <RichTextEditor
                value={post.content}
                onChange={(content) =>
                  setPost((prev) => ({ ...prev, content }))
                }
                placeholder="Start writing your post..."
              />
            </div>

            {/* Tags Input */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">Tags</Label>
              <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-background min-h-[48px]">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </Badge>
                ))}
                <Input
                  type="text"
                  placeholder="Add tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="flex-1 min-w-0 border-0 shadow-none focus-visible:ring-0 px-0"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Press Enter or comma to add tags
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                variant="outline"
                className="flex items-center"
              >
                {isSaving ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-save mr-2"></i>
                )}
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={
                  isSaving ||
                  !post.title.trim() ||
                  !post.content.trim() ||
                  !post.category
                }
                className="btn-primary flex items-center"
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Publish Post
              </Button>
            </div>
          </div>
        </motion.div>

        {/* AI Assistant Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <AIReviewPanel content={post.content} />
          <TopicSuggestions />
        </motion.div>
      </div>
    </div>
  );
}
