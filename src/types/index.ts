export interface FilterState {
  search: string;
  category: string;
  tags: string[];
}

export interface AIReviewResponse {
  originalContent: string;
  improvedContent: string;
  readabilityScore: number;
  seoKeywords: string[];
  suggestions: AISuggestion[];
}

export interface AISuggestion {
  type: "seo" | "grammar" | "readability" | "style";
  message: string;
  severity: "info" | "warning" | "error";
}

export interface ThemeState {
  mode: "light" | "dark";
}

export interface EditorState {
  title: string;
  content: string;
  tags: string[];
  category: string;
  isPublished: boolean;
}
