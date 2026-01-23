import { useState } from 'react';
import { Search, Utensils } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WineCard } from './WineCard';
import { findWinesByFood, Wine } from '@/data/wines';

export function FoodPairingSection() {
  const [food, setFood] = useState('');
  const [results, setResults] = useState<Wine[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!food.trim()) return;
    const matches = findWinesByFood(food);
    setResults(matches);
    setHasSearched(true);
  };

  const quickSuggestions = ['Steak', 'Sushi', 'Pasta', 'Thai Food', 'Cheese', 'Seafood'];

  return (
    <section id="pair" className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-wine-burgundy/10 rounded-sm mb-4">
            <Utensils className="w-4 h-4 text-wine-burgundy" />
            <span className="font-body text-sm uppercase tracking-wider text-wine-burgundy font-semibold">
              Food Pairing
            </span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            What's for dinner?
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            Tell us what you're eating and we'll find the perfect wine to make it sing.
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <Input
            type="text"
            placeholder="e.g., grilled salmon, beef tacos, mushroom risotto..."
            value={food}
            onChange={(e) => setFood(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 h-14 text-lg font-body bg-background border-2 border-border focus:border-primary rounded-sm"
          />
          <Button 
            onClick={handleSearch}
            className="h-14 px-8 bg-wine-gradient hover:opacity-90 text-primary-foreground font-body font-semibold uppercase tracking-wider rounded-sm"
          >
            <Search className="w-5 h-5 mr-2" />
            Pair It
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-12">
          <span className="text-sm text-muted-foreground font-body">Quick picks:</span>
          {quickSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setFood(suggestion);
                const matches = findWinesByFood(suggestion);
                setResults(matches);
                setHasSearched(true);
              }}
              className="px-3 py-1 bg-secondary hover:bg-wine-burgundy hover:text-primary-foreground text-sm font-body rounded-sm transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {hasSearched && (
          <div className="animate-fade-in-up">
            {results.length > 0 ? (
              <>
                <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                  Perfect pairings for "{food}"
                </h3>
                <div className="grid md:grid-cols-2 gap-6 stagger-children">
                  {results.map((wine) => (
                    <WineCard key={wine.id} wine={wine} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="font-body text-muted-foreground text-lg">
                  No specific matches found. Try describing your dish differently!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
