import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setFilter } from "@/store/slices/postsSlice";
import type { RootState } from "@/store";

export const FilterBar = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state: RootState) => state.posts.filter);
  const [searchInput, setSearchInput] = useState(filter.search);

  const categories = ["All", "Technology", "Design", "Business"];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilter({ search: searchInput }));
  };

  const handleCategoryClick = (category: string) => {
    dispatch(setFilter({ category }));
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </form>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter.category === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(category)}
              className={
                filter.category === category
                  ? "btn-primary"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(filter.search || filter.category !== "All" || filter.tags.length > 0) && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filter.search && (
            <Badge variant="secondary">
              Search: {filter.search}
              <button
                onClick={() => {
                  setSearchInput("");
                  dispatch(setFilter({ search: "" }));
                }}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </Badge>
          )}
          {filter.category !== "All" && (
            <Badge variant="secondary">
              Category: {filter.category}
              <button
                onClick={() => dispatch(setFilter({ category: "All" }))}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
