import { useState } from 'react';
import { findMockWine, getSommelierNote } from '../utils/Sommelier';
import { Wine } from '../data/wines';
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
  const [wines, setWines] = useState<Wine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentNote, setCurrentNote] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [error, setError] = useState('');

  const activeWine = wines[currentIndex];

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
    setWines([]);

    // Construct the Vibe String
    const technicalVibe = getIntensityParams();
    const worldString = worldStyle !== 'any' ? `${worldStyle} world style.` : "";
    const flavorString = flavorInput ? `Notes of ${flavorInput}.` : "";
    
    const combinedVibe = `${worldString} ${technicalVibe} ${flavorString}`.trim() || "Balanced and delicious.";

    console.log("🚀 Sending Vibe:", combinedVibe);

    // Call Backend
    const data = await findMockWine({
      vibe: combinedVibe,
      type: wineStyle === 'any' ? 'Any' : wineStyle.charAt(0).toUpperCase() + wineStyle.slice(1), // Fix case for backend
      maxPrice: maxPrice
    });

    if (data && data.wines.length > 0) {
      setWines(data.wines);
      setCurrentNote(data.firstNote);
      setCurrentIndex(0);

    } else {
      setError("No matches found. Try adjusting your preferences.");
    }
    
    setIsLoading(false);
  };

  const handleShuffle = async () => {
    if (wines.length === 0) return;
    setIsShuffling(true);

    const nextIndex = (currentIndex + 1) % wines.length;
    const nextWine = wines[nextIndex];
    setCurrentIndex(nextIndex);
    setCurrentNote("Asking the sommelier...");

    const note = await getSommelierNote("Best match for my taste", nextWine);

    setCurrentNote(note);
    setIsShuffling(false);
  }

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
        
        {/* 1. HERO TEXT */}
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 italic">
            What are you <span className="text-neon-gradient">into?</span>
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto uppercase tracking-wider">
            Tell us your vibe. We'll find the bottle.
          </p>
        </div>

        {/* 2. PREFERENCE CONTROLS */}
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

          {/* Budget Slider */}
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

          {/* Taste Sliders */}
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

        {/* 3. SUBMIT BUTTON */}
        <div className="text-center mb-16">
          <button
            onClick={handleDiscover}
            disabled={isLoading}
            className="px-12 py-4 bg-neon-gradient text-primary-foreground font-body text-sm uppercase tracking-widest hover:opacity-90 transition-opacity glow-pink disabled:opacity-50"
          >
            {isLoading ? "Consulting Sommelier..." : "Find My Wine"}
          </button>
        </div>

        {/* 4. RESULTS SECTION */}
        {error && <div className="text-center text-red-500 font-body mb-8">{error}</div>}

        {activeWine && (
          <div className="animate-fade-in-up">
              <h3 className="font-display text-3xl md:text-4xl text-foreground mb-8 text-center italic">
                Here's what we'd pour you
              </h3>
              
              <div className="max-w-md mx-auto bg-card border border-border rounded-lg overflow-hidden shadow-2xl glow-pink">
                 {/* Image */}
                 <div className="aspect-[4/5] relative bg-muted">
                    <img 
                      src={activeWine.image} 
                      alt={activeWine.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => e.currentTarget.src = "https://placehold.co/400x600?text=No+Image"} 
                    />
                 </div>
                 
                 {/* Details */}
                 <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                       <h4 className="font-display text-2xl text-foreground leading-tight">{activeWine.title}</h4>
                       <span className="font-body text-lg font-bold text-primary">{activeWine.priceRange}</span>
                    </div>
                    
                    {/* The Note */}
                    <div className="relative pl-4 border-l-2 border-primary min-h-[60px]">
                       <p className="font-body text-sm text-muted-foreground italic">
                         {isShuffling && currentNote === "Asking the Sommelier..." ? (
                           <span className="animate-pulse">Thinking...</span>
                         ) : (
                           `"${currentNote}"`
                         )}
                       </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <a 
                          href={`https://neighborhoodwines.com/products/${activeWine.handle}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-3 bg-primary text-primary-foreground text-center font-body text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
                        >
                          Buy Now
                        </a>
                        <button 
                          onClick={handleShuffle}
                          disabled={isShuffling}
                          className="px-4 py-3 border border-border text-foreground hover:bg-muted transition-colors font-body text-xs uppercase tracking-widest"
                        >
                          {isShuffling ? "..." : "Shuffle"}
                        </button>
                    </div>
                 </div>
              </div>
          </div>
        )}

      </div>
    </section>
  );
}