import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [selectedText, setSelectedText] = useState("");

  const formatText = (format: string) => {
    const textarea = document.querySelector('textarea[data-editor="true"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let replacement = "";
    switch (format) {
      case "bold":
        replacement = `**${selectedText}**`;
        break;
      case "italic":
        replacement = `*${selectedText}*`;
        break;
      case "code":
        replacement = `\`${selectedText}\``;
        break;
      case "link":
        replacement = `[${selectedText}](url)`;
        break;
      case "list":
        replacement = `\n- ${selectedText}`;
        break;
      case "heading":
        replacement = `## ${selectedText}`;
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  return (
    <div className="border border-border rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center px-3 py-2 border-b border-border bg-muted/50 rounded-t-lg">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("bold")}
          className="p-2 h-8 w-8"
        >
          <i className="fas fa-bold"></i>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("italic")}
          className="p-2 h-8 w-8"
        >
          <i className="fas fa-italic"></i>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("code")}
          className="p-2 h-8 w-8"
        >
          <i className="fas fa-code"></i>
        </Button>
        
        <Separator orientation="vertical" className="mx-2 h-4" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("heading")}
          className="p-2 h-8 w-8"
        >
          <i className="fas fa-heading"></i>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("list")}
          className="p-2 h-8 w-8"
        >
          <i className="fas fa-list-ul"></i>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("link")}
          className="p-2 h-8 w-8"
        >
          <i className="fas fa-link"></i>
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        data-editor="true"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Start writing your post..."}
        className="min-h-[300px] border-0 resize-none focus-visible:ring-0 rounded-t-none"
      />
    </div>
  );
};
