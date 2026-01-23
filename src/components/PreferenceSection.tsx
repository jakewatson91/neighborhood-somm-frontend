import { useState } from 'react';
import { Sliders, Grape } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { WineCard } from './WineCard';
import { findWinesByPreference, Wine } from '@/data/wines';

type WineType = 'red' | 'white' | 'rosé' | 'sparkling' | 'any';

export function PreferenceSection() {
  const [fruity, setFruity] = useState(3);
  const [earthy, setEarthy] = useState(3);
  const [tannic, setTannic] = useState(3);
  const [body, setBody] = useState(3);
  const [wineType, setWineType] = useState<WineType>('any');
  const [results, setResults] = useState<Wine[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleDiscover = () => {
    const matches = findWinesByPreference({
      fruity,
      earthy,
      tannic,
      body,
      type: wineType === 'any' ? undefined : wineType
    });
    setResults(matches);
    setHasSearched(true);
  };

  const wineTypes: { value: WineType; label: string }[] = [
    { value: 'any', label: 'Any' },
    { value: 'red', label: 'Red' },
    { value: 'white', label: 'White' },
    { value: 'rosé', label: 'Rosé' },
    { value: 'sparkling', label: 'Sparkling' },
  ];

  return (
    <section id="discover" className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-sm mb-4">
            <Sliders className="w-4 h-4 text-primary" />
            <span className="font-body text-sm uppercase tracking-wider text-primary font-semibold">
              Discover Your Style
            </span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Build your perfect wine
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            Slide around. Tell us what you like. We'll find wines that match your vibe.
          </p>
        </div>

        <div className="bg-background border-2 border-border rounded-sm p-8 mb-8">
          {/* Wine type selector */}
          <div className="mb-8">
            <label className="font-display text-sm font-semibold text-foreground mb-3 block">
              Type of Wine
            </label>
            <div className="flex flex-wrap gap-2">
              {wineTypes.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setWineType(value)}
                  className={`px-4 py-2 font-body text-sm rounded-sm transition-colors ${
                    wineType === value
                      ? 'bg-wine-gradient text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-wine-burgundy/20'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-display text-sm font-semibold text-foreground">Fruity</label>
                <span className="font-body text-sm text-muted-foreground">{fruity}/5</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Subtle</span>
                <Slider
                  value={[fruity]}
                  onValueChange={(v) => setFruity(v[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">Intense</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-display text-sm font-semibold text-foreground">Earthy</label>
                <span className="font-body text-sm text-muted-foreground">{earthy}/5</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Clean</span>
                <Slider
                  value={[earthy]}
                  onValueChange={(v) => setEarthy(v[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">Funky</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-display text-sm font-semibold text-foreground">Tannins</label>
                <span className="font-body text-sm text-muted-foreground">{tannic}/5</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Silky</span>
                <Slider
                  value={[tannic]}
                  onValueChange={(v) => setTannic(v[0])}
                  min={0}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">Grippy</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-display text-sm font-semibold text-foreground">Body</label>
                <span className="font-body text-sm text-muted-foreground">{body}/5</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Light</span>
                <Slider
                  value={[body]}
                  onValueChange={(v) => setBody(v[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground">Full</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={handleDiscover}
              className="px-8 py-6 bg-wine-gradient hover:opacity-90 text-primary-foreground font-body font-semibold uppercase tracking-wider rounded-sm text-lg"
            >
              <Grape className="w-5 h-5 mr-2" />
              Find My Wine
            </Button>
          </div>
        </div>

        {hasSearched && (
          <div className="animate-fade-in-up">
            {results.length > 0 ? (
              <>
                <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                  Wines that match your style
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
                  No perfect matches. Try adjusting your preferences!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
