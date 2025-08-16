import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fetchTopicSuggestions } from "@/store/slices/aiSlice";
import type { RootState } from "@/store";

export const TopicSuggestions = () => {
  const dispatch = useDispatch();
  const { topicSuggestions, isFetchingTopics, error } = useSelector((state: RootState) => state.ai);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFetchTopics = () => {
    // @ts-expect-error: dispatch type mismatch for async thunk
    dispatch(fetchTopicSuggestions());
    setIsExpanded(true);
  };

  const handleToggle = () => {
    if (topicSuggestions.length > 0) {
      setIsExpanded(!isExpanded);
    } else {
      handleFetchTopics();
    }
  };

  const getTrendingIcon = (trending: boolean) => {
    return trending ? (
      <i className="fas fa-fire text-orange-500 mr-2"></i>
    ) : (
      <i className="fas fa-arrow-trend-up text-green-500 mr-2"></i>
    );
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <i className="fas fa-brain mr-2 text-primary"></i>
          Topic Ideas
        </h3>
        <Button
          onClick={handleToggle}
          disabled={isFetchingTopics}
          className="btn-primary text-sm"
        >
          {isFetchingTopics ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Loading...
            </>
          ) : isExpanded && topicSuggestions.length > 0 ? (
            "Hide Ideas"
          ) : (
            "Get Ideas"
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {topicSuggestions.length > 0 ? (
              <div className="space-y-3">
                {topicSuggestions.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                          {getTrendingIcon(topic.trending)}
                          {topic.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : !isFetchingTopics ? (
              <div className="text-center py-8 text-muted-foreground">
                <i className="fas fa-lightbulb text-4xl mb-4"></i>
                <p className="text-sm">
                  No topic suggestions available. Try again later.
                </p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && !isFetchingTopics && (
        <div className="text-center py-8 text-muted-foreground">
          <i className="fas fa-brain text-4xl mb-4"></i>
          <p className="text-sm">
            Get AI-powered topic suggestions to inspire your next post
          </p>
        </div>
      )}
    </div>
  );
};
