import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  // CHANGED: We now just pass a simple string, not complex JSON
  onSearch: (message: string) => void; 
  isLoading: boolean;
}

export function ChatInput({ onSearch, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // Direct pass-through. No parsing.
    onSearch(message.trim());
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-3 p-4 border border-border bg-card/50 backdrop-blur-sm rounded-xl shadow-sm focus-within:ring-2 ring-primary/20 transition-all">
        <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your vibe... e.g. 'funky red under $40'"
          disabled={isLoading}
          className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
             <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
             <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  );
}