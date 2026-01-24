import { useState } from 'react';
import { findMockWine, BackendWine } from '../utils/Sommelier';
// import { WineResultCard } from './WineResultCard'; // You can keep using this if you adapt the props, or use the inline one below for now

type WineStyle = 'red' | 'white' | 'sparkling' | 'any';
type WorldStyle = 'old' | 'new' | 'any';

export function PreferenceSection() {
  // --- NEW STATE ---
  const [body, setBody] = useState(3);
  const [acidity, setAcidity] = useState(3);
  const [tannin, setTannin] = useState(3);
  const [wineStyle, setWineStyle] = useState<WineStyle>('any');
  const [worldStyle, setWorldStyle] = useState<WorldStyle>('any');
  const [flavorInput, setFlavorInput] = useState('');
  const [maxPrice, setMaxPrice] = useState(50); // Added Budget Slider
  
  // Backend State
  const [result, setResult] = useState<BackendWine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- LOGIC HELPER ---
  const getIntensityParams = () => {
    const parts = [];
    if (body <= 2) parts.push("Light bodied");
    if (body >= 4) parts.push("Full bodied");
    if (acidity >= 4) parts.push("High acidity");
    if (acidity <= 2) parts.push("Low acidity");
    if (tannin >= 4) parts.push("High tannins");
    if (tannin <= 2) parts.push("Low tannins");
    return parts.join(". ");
  };

  const handleDiscover = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    // Construct the Vibe String
    const technicalVibe = getIntensityParams();
    const worldString = worldStyle !== 'any' ? `${worldStyle} world style.` : "";
    const flavorString = flavorInput ? `Notes of ${flavorInput}.` : "";
    
    const combinedVibe = `${worldString} ${technicalVibe} ${flavorString}`.trim() || "Balanced and delicious.";

    console.log("🚀 Sending Vibe:", combinedVibe);

    // Call Backend
    const wine = await findMockWine({
      vibe: combinedVibe,
      type: wineStyle === 'any' ? 'Any' : wineStyle.charAt(0).toUpperCase() + wineStyle.slice(1), // Fix case for backend
      maxPrice: maxPrice
    });

    if (wine) {
      setResult(wine);
    } else {
      setError("No matches found. Try adjusting your preferences.");
    }
    
    setIsLoading(false);
  };

  // --- YOUR ORIGINAL COMPONENTS (Unchanged) ---
  const ToggleButton = ({ active, onClick, children }: any) => (
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

  const SliderControl = ({ label, value, onChange, leftLabel, rightLabel }: any) => (
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
        <div className="space-y-12 mb-12 border border-border p-8 rounded-xl bg-background/50 backdrop-blur-sm">
          
          {/* Wine Style */}
          <div>
            <label className="font-display text-xl text-foreground mb-4 block">Style</label>
            <div className="flex flex-wrap gap-2">
              {['any', 'red', 'white', 'sparkling'].map(s => (
                <ToggleButton key={s} active={wineStyle === s} onClick={() => setWineStyle(s as any)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </ToggleButton>
              ))}
            </div>
          </div>

          {/* World Style */}
          <div>
            <label className="font-display text-xl text-foreground mb-4 block">World</label>
            <div className="flex flex-wrap gap-2">
              <ToggleButton active={worldStyle === 'any'} onClick={() => setWorldStyle('any')}>Any</ToggleButton>
              <ToggleButton active={worldStyle === 'old'} onClick={() => setWorldStyle('old')}>Old World</ToggleButton>
              <ToggleButton active={worldStyle === 'new'} onClick={() => setWorldStyle('new')}>New World</ToggleButton>
            </div>
          </div>

          {/* NEW: Budget Slider (Styled to match) */}
          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <label className="font-display text-xl text-foreground">Max Budget</label>
                <span className="font-body text-sm text-primary">${maxPrice}</span>
             </div>
             <input 
               type="range" min="20" max="150" step="5" 
               value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
               className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
             />
          </div>

          {/* Sliders */}
          <div className="grid md:grid-cols-1 gap-8">
            <SliderControl label="Body" value={body} onChange={setBody} leftLabel="Light" rightLabel="Full" />
            <SliderControl label="Acidity" value={acidity} onChange={setAcidity} leftLabel="Soft" rightLabel="Bright" />
            <SliderControl label="Tannin" value={tannin} onChange={setTannin} leftLabel="Silky" rightLabel="Grippy" />
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
            disabled={isLoading}
            className="px-12 py-4 bg-neon-gradient text-primary-foreground font-body text-sm uppercase tracking-widest hover:opacity-90 transition-opacity glow-pink disabled:opacity-50"
          >
            {isLoading ? "Consulting Sommelier..." : "Find My Wine"}
          </button>
        </div>

        {/* RESULTS SECTION (Adapted for Single Result) */}
        {error && <div className="text-center text-red-500 font-body mb-8">{error}</div>}

        {result && (
          <div className="animate-fade-in-up">
              <h3 className="font-display text-3xl md:text-4xl text-foreground mb-8 text-center italic">
                Here's what we'd pour you
              </h3>
              
              <div className="max-w-md mx-auto bg-card border border-border rounded-lg overflow-hidden shadow-2xl glow-pink">
                 <div className="aspect-[4/5] relative bg-muted">
                    <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
                 </div>
                 <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                       <h4 className="font-display text-2xl text-foreground leading-tight">{result.title}</h4>
                       <span className="font-body text-lg font-bold text-primary">${result.price}</span>
                    </div>
                    
                    <div className="relative pl-4 border-l-2 border-primary">
                       <p className="font-body text-sm text-muted-foreground italic">
                         "{result.note}"
                       </p>
                    </div>

                    <a 
                      href={`https://neighborhoodwines.com/products/${result.handle}`}
                      target="_blank"
                      className="block w-full py-3 bg-primary text-primary-foreground text-center font-body text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
                    >
                      Buy Now
                    </a>
                 </div>
              </div>
          </div>
        )}

      </div>
    </section>
  );
}