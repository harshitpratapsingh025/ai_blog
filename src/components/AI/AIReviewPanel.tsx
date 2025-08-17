import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { reviewContent } from "@/store/slices/aiSlice";
import type { RootState } from "@/store";
import { motion } from "framer-motion";

interface AIReviewPanelProps {
  content: string;
  title: string;
}

export const AIReviewPanel = ({ content, title }: AIReviewPanelProps) => {
  const dispatch = useDispatch();
  const { review, isReviewing, error } = useSelector((state: RootState) => state.ai);

  const handleReview = () => {
    if (content.trim()) {
      dispatch(reviewContent({ content, title }) as any);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:bg-green-900";
    if (score >= 60) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900";
    return "text-red-600 bg-red-100 dark:bg-red-900";
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "seo":
        return "fas fa-search text-blue-500";
      case "grammar":
        return "fas fa-spell-check text-amber-500";
      case "readability":
        return "fas fa-eye text-green-500";
      default:
        return "fas fa-lightbulb text-purple-500";
    }
  };

  const getSuggestionColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <i className="fas fa-magic mr-2 text-secondary"></i>
          AI Review
        </h3>
        <Button
          onClick={handleReview}
          disabled={isReviewing || !content.trim()}
          className="btn-secondary"
        >
          {isReviewing ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Analyzing...
            </>
          ) : (
            <>
              <i className="fas fa-robot mr-2"></i>
              Review Content
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {review && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Readability Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Readability Score</span>
              <Badge className={getScoreColor(review.readabilityScore)}>
                {review.readabilityScore}/100
              </Badge>
            </div>
            <Progress value={review.readabilityScore} className="h-2" />
          </div>

          {/* SEO Keywords */}
          {review.seoKeywords.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Suggested Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {review.seoKeywords.slice(0, 4).map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Suggestions</h4>
            {review.suggestions.slice(0, 3).map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 border rounded-lg ${getSuggestionColor(suggestion.severity)}`}
              >
                <div className="flex items-start">
                  <i className={`${getSuggestionIcon(suggestion.type)} mr-2 mt-1`}></i>
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {suggestion.type} {suggestion.severity === "error" ? "Issue" : "Suggestion"}
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">
                      {suggestion.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {!review && !isReviewing && (
        <div className="text-center py-8 text-muted-foreground">
          <i className="fas fa-robot text-4xl mb-4"></i>
          <p className="text-sm">
            Click "Review Content" to get AI-powered feedback on your post
          </p>
        </div>
      )}
    </div>
  );
};
