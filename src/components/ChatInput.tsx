import { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSearch: (vibe: string) => Promise<void> | void;
  isLoading: boolean;
  variant?: 'solid' | 'glass';
}

export const ChatInput = ({ onSearch, isLoading, variant = 'solid' }: ChatInputProps) => {
  const [vibe, setVibe] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibe.trim()) return;
    onSearch(vibe);
  };

  // Define the two distinct looks here
  const baseStyles = "relative flex items-center w-full transition-all rounded-2xl focus-within:ring-4 focus-within:ring-primary/30";
  
  const variants = {
    solid: "bg-card/80 backdrop-blur-md border-2 border-primary/30 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:border-primary/50",
    glass: "bg-card/80 backdrop-blur-md border-2 border-primary/30 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:border-primary/50"
  };

  return (
    <div className={cn(baseStyles, variants[variant], "w-full max-w-4xl mx-auto md:ml-[min(20vw,240px)] md:mx-0")}>
      <form onSubmit={handleSubmit} className="relative w-full flex items-center gap-3 p-4">
        <Sparkles className="w-5 h-5 text-primary flex-shrink-0 animate-pulse" />
        
        <input
          type="text"
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          placeholder="Describe your vibe... e.g. 'funky red under $40'"
          disabled={isLoading}
          className="flex-1 bg-transparent border-none text-sm text-foreground focus:outline-none focus:ring-0 placeholder:text-muted-foreground/70"
        />

        <button 
          type="submit" 
          disabled={!vibe || isLoading}
          className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};