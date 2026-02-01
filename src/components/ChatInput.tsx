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
  const baseStyles = "relative flex items-center w-full transition-all rounded-xl focus-within:ring-2 focus-within:ring-primary/20";
  
  const variants = {
    solid: "bg-card border border-border shadow-sm",
    glass: "bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl hover:bg-black/40"
  };

  return (
    <div className={cn(baseStyles, variants[variant], "w-full max-w-4xl mx-auto md:ml-[min(20vw,240px)] md:mx-0")}>
      <form onSubmit={handleSubmit} className="relative w-full flex items-center h-14">
        <div className="absolute left-4 text-muted-foreground">
          <Sparkles className="w-4 h-4" />
        </div>
        
        <input
          type="text"
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          placeholder="Describe your vibe..."
          disabled={isLoading}
          className="w-full bg-transparent border-none py-3 pl-12 pr-14 text-sm focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50 text-foreground"
        />

        <div className="absolute right-2">
          <button 
            type="submit" 
            disabled={!vibe || isLoading}
            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-primary-foreground disabled:opacity-50 transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
};