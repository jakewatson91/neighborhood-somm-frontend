 import { useState } from 'react';
import { ChatInput } from '@/components/ChatInput'; 
import { WineResult } from '@/components/WineResultCard';
import { findWine } from '@/utils/Sommelier'; 
import { Loader2 } from 'lucide-react';
import { SearchResult } from '@/data/wines';

// Mock data for previewing the card layout
const MOCK_RESULT: SearchResult = {
  wine: {
    id: 1,
    title: "Domaine de la Côte Pinot Noir",
    handle: "domaine-de-la-cote-pinot-noir",
    price: 78,
    image_url: "https://cdn.shopify.com/s/files/1/0513/5611/3473/files/2022MaisonNoirOPNOPinotNoir.png?v=1724878641",
    product_type: "Red Wine",
    description: "A stunning expression of cool-climate Pinot Noir from the Sta. Rita Hills. Bright red fruit, crushed flowers, and a whisper of earth. The palate is silky with fine-grained tannins and a long, mineral-driven finish. Perfect for those who love Burgundy but want to explore California's potential.",
    tags: ["pinot noir", "california", "organic"],
    features: {
      type: "Red",
      grape: "Pinot Noir",
      acidity: "High",
      body: "Medium-bodied",
      pairings: ["Duck", "Mushrooms", "Grilled Salmon", "Aged Cheese"]
    },
    match_score: 95
  },
  note: "This is exactly the kind of silky, elegant Pinot you're looking for. It's got that Burgundian soul but with California sunshine."
};

const Index = () => {
  // Set mock data to preview the card
  const [result, setResult] = useState<SearchResult | null>(MOCK_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVibe, setLastVibe] = useState<string>("elegant pinot noir");
  
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

      {/* MAIN CONTENT */}
      {/* Dynamic Class: 'justify-center' keeps it in the middle initially. 'justify-start' moves it up when searching. */}
      <main className={`flex-grow flex flex-col transition-all duration-700 ${isSearching ? 'justify-start pt-6' : 'justify-center'}`}>
        <div className="container mx-auto px-6 max-w-4xl w-full">
          
          {/* HERO TEXT (Only visible when NOT searching) */}
          {!isSearching && (
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="font-display text-5xl md:text-7xl mb-6">
                What are you <span className="text-primary">into?</span>
              </h2>
              <p className="text-muted-foreground font-body text-lg">
                Describe the vibe. We'll find the bottle.
              </p>
            </div>
          )}

          {/* STICKY CHAT INPUT */}
          {/* We keep the sticky class so it pins to top when scrolling results, but margin depends on state */}
          <div className={`sticky top-4 z-50 transition-all duration-700 ${isSearching ? 'mb-8' : 'mb-0'}`}>
             <ChatInput 
               onSearch={handleSearch} 
               isLoading={isLoading} 
             />
          </div>

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
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
              <WineResult 
                data={result} 
                onReset={handleShuffle} 
              />
            </div>
          )}

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