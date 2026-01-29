 import { useState } from 'react';
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
        setError("No matches found. Try describing it differently?");
      }
    } catch (err) {
      setError("The cellar is currently closed (API Error).");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to check if we are in "Search Mode"
  const isSearching = !!lastVibe;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* HEADER */}
      <header className="border-b border-border bg-background/95 backdrop-blur z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl md:text-3xl italic text-foreground">
            Neighborhood Somm
          </h1>
          <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground hidden md:block">
            Beta
          </span>
        </div>
      </header>

      {/* MAIN CONTENT - Subtle gradient background */}
      <main className={`flex-grow flex flex-col transition-all duration-700 relative ${isSearching ? 'justify-start pt-6' : 'justify-center'}`}>
        {/* Background gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
        <div className="container mx-auto px-6 max-w-4xl w-full relative z-10">
          
          {/* HERO TEXT (Only visible when NOT searching) */}
          {!isSearching && (
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="font-display text-5xl md:text-7xl mb-6">
                What are you <span className="text-primary relative">
                  into?
                  <span className="absolute -inset-1 bg-primary/20 blur-xl rounded-full -z-10" />
                </span>
              </h2>
              <p className="text-muted-foreground font-body text-lg">
                Describe the vibe. We'll find the bottle.
              </p>
            </div>
          )}


          {/* LOADING */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
                Checking the cellar...
              </p>
            </div>
          )}

          {/* RESULT */}
          {result && !isLoading && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <WineResult 
                data={result} 
                onReset={handleShuffle} 
              />
            </div>
          )}

          {/* CHAT INPUT - Always below results */}
          <div className={`sticky bottom-4 z-50 transition-all duration-700 ${isSearching ? 'mt-8 pb-4' : ''}`}>
            <ChatInput 
              onSearch={handleSearch} 
              isLoading={isLoading} 
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="text-center mt-8 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 font-body text-sm animate-in fade-in">
              {error}
            </div>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-xs text-muted-foreground">
            © 2026 Neighborhood Somm. Drink responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;