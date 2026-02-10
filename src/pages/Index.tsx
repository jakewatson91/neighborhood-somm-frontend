 import { useState } from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { ChatInput } from '@/components/ChatInput'; 
import { WineResult } from '@/components/WineResultCard';
import { findWine } from '@/utils/Sommelier'; 
import { Loader2 } from 'lucide-react';
import { SearchResult } from '@/data/wines';

const Index = () => {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVibe, setLastVibe] = useState<string>("");
  
  // HISTORY: Strictly typed as number array
  const [history, setHistory] = useState<number[]>([]);

  // 1. HANDLER FOR NEW SEARCH
  const handleSearch = async (vibe: string) => {
    setLastVibe(vibe);
    setHistory([]); 
    await performSearch(vibe, false, []); 
  };

  // 2. HANDLER FOR SHUFFLE
  const handleShuffle = async () => {
    if (!lastVibe) return;
    await performSearch(lastVibe, true, history);
  };

  // 3. COMMON SEARCH FUNCTION
  const performSearch = async (vibe: string, isShuffle: boolean, currentHistory: number[]) => {
    setIsLoading(true);
    setError(null);
    if (!isShuffle) setResult(null);

    try {
      const data = await findWine({ 
        vibe: vibe, 
        maxPrice: 100,
        shuffle: isShuffle,
        excludeIds: currentHistory
      });
      
      if (data) {
        setResult(data);
        setHistory(prev => [...prev, Number(data.wine.id)]);
      } else {
        setLastVibe("");
        setError("No matches found. Try describing it differently?");
      }
    } catch (err) {
      setLastVibe("");
      setError("The cellar is currently closed (API Error).");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to check if we are in "Search Mode"
  const isSearching = !!lastVibe;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">

      {/* DECORATIVE BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 1. Start with Pure Black at the top (0% to 40%) to hide the logo box.
           2. Transition to a subtle Maroon sheen at the bottom.
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-black from-40% via-background to-primary/20" />
        
        {/* Floating orbs - Keep them, but ensure they don't float behind the logo */}
        {/* <div className="floating-orb w-96 h-96 bg-primary/10 -bottom-24 -left-24 animate-pulse-glow" />
        <div className="floating-orb w-72 h-72 bg-primary/5 top-1/2 -right-24" style={{ animationDelay: '2s' }} /> */}
      </div>
      
      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col items-center justify-center transition-all duration-700 relative z-10">        
        <div className="container mx-auto px-6 max-w-4xl w-full flex flex-col items-center">
          
          {/* HERO SECTION with LOGO (Only visible when NOT searching) */}
          {!isSearching && (
            <div className="text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* HERO LOGO with subtle glow */}
              <div className="mb-6 flex justify-center relative">
                {/* Subtle pink glow behind logo */}
                <div className="absolute inset-0 bg-primary/15 blur-[80px] scale-90 rounded-full animate-pulse-glow" />
                <img 
                  src="/logo_dark.png" 
                  alt="Neighborhood Somm" 
                  className="h-48 sm:h-56 md:h-72 lg:h-80 w-auto relative z-10 mix-blend-lighten"
                />
              </div>
              
              {/* Tagline - refined typography */}
              <p className="text-muted-foreground font-body text-xs tracking-[0.2em] uppercase mb-8">
                Describe the vibe • We'll find the bottle
              </p>

              {/* CHAT INPUT */}
              <div className="w-full max-w-4xl mx-auto px-4">
                <ChatInput 
                  onSearch={handleSearch} 
                  isLoading={isLoading}
                  variant="glass"                
                />
                {error && (
                  <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-body text-sm animate-in fade-in slide-in-from-top-2">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* SEARCH RESULTS MODE */}
          {isSearching && (
            <>
              {/* LOGO - Top Left, clickable to reset */}
              <button 
                onClick={() => {
                  setLastVibe("");
                  setResult(null);
                  setHistory([]);
                }}
                className="absolute top-6 left-6 z-20 hover:opacity-80 transition-opacity"
              >
                <img 
                  src="/logo_dark.png" 
                  alt="Neighborhood Somm" 
                  className="h-12 md:h-16 w-auto"
                />
              </button>
              {/* 1. LOADING: Centered Spinner */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center animate-in fade-in duration-700 py-20">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                  <p className="font-body text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
                    Checking the cellar...
                  </p>
                </div>
              )}

              {/* 2. RESULTS: Wine Card Only (No Logo) */}
              {!isLoading && result && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 pt-16 pb-6">
                  <WineResult 
                    data={result} 
                    onReset={handleShuffle} 
                  />
                </div>
              )}

              {/* Use the glass variant here. No extra CSS needed. */}
              <div className="w-full max-w-4xl mx-auto px-4 mb-6 z-20">
                <ChatInput 
                  onSearch={handleSearch} 
                  isLoading={isLoading}
                  variant="glass"
                />
              </div>

              {/* ERROR MESSAGE */}
              {error && !isLoading && (
                <div className="text-center mt-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-body text-sm animate-in fade-in">
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 mt-auto relative z-10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-xs text-muted-foreground">
            © 2026 Neighborhood Somm. Drink responsibly. {' • '}
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger className="text-xxs cursor-pointer font-medium underline underline-offset-2">
                  Disclaimer
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] text-left text-xs p-2 [transition-duration:0ms] text-muted-foreground">
                  <p>Neighborhood Somm is not affiliated with Neighborhood Wines. This is just a personal project. You should visit their shop and buy their wines.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;