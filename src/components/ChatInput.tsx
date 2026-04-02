import { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
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
    <div className={cn(baseStyles, variants[variant], "w-full max-w-5xl mx-auto md:ml-[min(20vw,240px)] md:mx-0")}>
      <form onSubmit={handleSubmit} className="relative w-full flex items-center gap-3 p-4">
        <Sparkles className="w-5 h-5 text-primary flex-shrink-0 animate-pulse" />
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder=""
            disabled={isLoading}
            className="w-full bg-transparent border-none text-sm text-foreground focus:outline-none focus:ring-0"
          />
          {!vibe && (
            <div className="absolute left-0 top-0 text-sm text-muted-foreground pointer-events-none">
              <TypeAnimation
                sequence={[
                  'funky red under $40',
                  2000,
                  'third date wine that says I have my life together',
                  2000,
                  'what pairs with spicy takeout?',
                  2000,
                  'orange wine that isn\'t too weird',
                  2000,
                  'impress my boss for exactly $50',
                  2000,
                  'pizza wine under $20',
                  2000,
                  'cooking pasta for someone out of my league',
                  2000,
                  'champagne taste on a prosecco budget',
                  2000,
                  'red wine for someone who only drinks IPAs',
                  2000,
                  'looks expensive but costs under $25',
                  2000,
                  'meeting the in-laws and need liquid courage',
                  2000,
                  'light chillable red for a park hang',
                  2000,
                  'crisp white for seafood',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>
          )}
        </div>

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