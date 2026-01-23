import { useState } from 'react';
import { Wine, findWinesByPreference } from '@/data/wines';
import { WineResultCard } from './WineResultCard';

type WineStyle = 'red' | 'white' | 'sparkling' | 'any';
type WorldStyle = 'old' | 'new' | 'any';

export function PreferenceSection() {
  const [body, setBody] = useState(3);
  const [acidity, setAcidity] = useState(3);
  const [tannin, setTannin] = useState(3);
  const [wineStyle, setWineStyle] = useState<WineStyle>('any');
  const [worldStyle, setWorldStyle] = useState<WorldStyle>('any');
  const [flavorInput, setFlavorInput] = useState('');
  const [results, setResults] = useState<Wine[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleDiscover = () => {
    const type = wineStyle === 'any' ? undefined : wineStyle;
    const matches = findWinesByPreference({
      body,
      tannic: tannin,
      type,
      // We'll expand the matching later to include acidity and world style
    });
    
    // Filter by world style
    let filtered = matches;
    if (worldStyle === 'old') {
      filtered = matches.filter(w => ['France', 'Italy', 'Spain', 'Germany', 'Austria'].includes(w.country));
    } else if (worldStyle === 'new') {
      filtered = matches.filter(w => ['USA', 'Argentina', 'New Zealand', 'Australia', 'Chile'].includes(w.country));
    }
    
    // Filter by flavor notes if provided
    if (flavorInput.trim()) {
      const searchTerms = flavorInput.toLowerCase().split(',').map(s => s.trim());
      filtered = filtered.filter(w => 
        w.flavorNotes.some(note => 
          searchTerms.some(term => note.toLowerCase().includes(term))
        )
      );
    }
    
    setResults(filtered.length > 0 ? filtered : matches.slice(0, 4));
    setHasSearched(true);
  };

  const ToggleButton = ({ 
    active, 
    onClick, 
    children 
  }: { 
    active: boolean; 
    onClick: () => void; 
    children: React.ReactNode 
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-body text-xs uppercase tracking-wider transition-all border ${
        active
          ? 'bg-primary text-primary-foreground border-primary glow-pink'
          : 'bg-transparent text-foreground border-border hover:border-primary/50'
      }`}
    >
      {children}
    </button>
  );

  const SliderControl = ({
    label,
    value,
    onChange,
    leftLabel,
    rightLabel,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    leftLabel: string;
    rightLabel: string;
  }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="font-display text-xl text-foreground">{label}</label>
        <span className="font-body text-sm text-primary">{value}/5</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-body text-xs text-muted-foreground w-16">{leftLabel}</span>
        <div className="flex-1 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={`flex-1 h-3 transition-all ${
                n <= value
                  ? 'bg-neon-gradient'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            />
          ))}
        </div>
        <span className="font-body text-xs text-muted-foreground w-16 text-right">{rightLabel}</span>
      </div>
    </div>
  );

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Hero Text */}
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 italic">
            What are you <span className="text-neon-gradient">into?</span>
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto uppercase tracking-wider">
            Tell us your vibe. We'll find the bottle.
          </p>
        </div>

        {/* Preference Controls */}
        <div className="space-y-12 mb-12">
          {/* Wine Style */}
          <div>
            <label className="font-display text-xl text-foreground mb-4 block">Style</label>
            <div className="flex flex-wrap gap-2">
              <ToggleButton active={wineStyle === 'any'} onClick={() => setWineStyle('any')}>
                Any
              </ToggleButton>
              <ToggleButton active={wineStyle === 'red'} onClick={() => setWineStyle('red')}>
                Red
              </ToggleButton>
              <ToggleButton active={wineStyle === 'white'} onClick={() => setWineStyle('white')}>
                White
              </ToggleButton>
              <ToggleButton active={wineStyle === 'sparkling'} onClick={() => setWineStyle('sparkling')}>
                Sparkling
              </ToggleButton>
            </div>
          </div>

          {/* World Style */}
          <div>
            <label className="font-display text-xl text-foreground mb-4 block">World</label>
            <div className="flex flex-wrap gap-2">
              <ToggleButton active={worldStyle === 'any'} onClick={() => setWorldStyle('any')}>
                Any
              </ToggleButton>
              <ToggleButton active={worldStyle === 'old'} onClick={() => setWorldStyle('old')}>
                Old World
              </ToggleButton>
              <ToggleButton active={worldStyle === 'new'} onClick={() => setWorldStyle('new')}>
                New World
              </ToggleButton>
            </div>
          </div>

          {/* Sliders */}
          <div className="grid md:grid-cols-1 gap-8">
            <SliderControl
              label="Body"
              value={body}
              onChange={setBody}
              leftLabel="Light"
              rightLabel="Full"
            />
            <SliderControl
              label="Acidity"
              value={acidity}
              onChange={setAcidity}
              leftLabel="Soft"
              rightLabel="Bright"
            />
            <SliderControl
              label="Tannin"
              value={tannin}
              onChange={setTannin}
              leftLabel="Silky"
              rightLabel="Grippy"
            />
          </div>

          {/* Flavor Input */}
          <div>
            <label className="font-display text-xl text-foreground mb-4 block">
              Flavor notes <span className="text-muted-foreground text-sm">(optional)</span>
            </label>
            <input
              type="text"
              value={flavorInput}
              onChange={(e) => setFlavorInput(e.target.value)}
              placeholder="cherry, vanilla, earthy..."
              className="w-full bg-transparent border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mb-16">
          <button
            onClick={handleDiscover}
            className="px-12 py-4 bg-neon-gradient text-primary-foreground font-body text-sm uppercase tracking-widest hover:opacity-90 transition-opacity glow-pink"
          >
            Find My Wine
          </button>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="animate-fade-in-up">
            {results.length > 0 ? (
              <>
                <h3 className="font-display text-3xl md:text-4xl text-foreground mb-8 text-center italic">
                  Here's what we'd pour you
                </h3>
                <div className="grid md:grid-cols-2 gap-6 stagger-children">
                  {results.map((wine) => (
                    <WineResultCard key={wine.id} wine={wine} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 border border-border">
                <p className="font-body text-sm text-muted-foreground uppercase tracking-wider">
                  No matches found. Try adjusting your preferences.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
