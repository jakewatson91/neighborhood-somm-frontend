import { Wine } from '@/data/wines';
import { ExternalLink } from 'lucide-react';

interface WineResultCardProps {
  wine: Wine;
}

export function WineResultCard({ wine }: WineResultCardProps) {
  const typeColors: Record<string, string> = {
    red: 'bg-red-900/30 text-red-400 border-red-900/50',
    white: 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50',
    rosé: 'bg-pink-900/30 text-pink-400 border-pink-900/50',
    sparkling: 'bg-blue-900/30 text-blue-400 border-blue-900/50',
    dessert: 'bg-amber-900/30 text-amber-400 border-amber-900/50',
  };

  const wineSearchUrl = `https://neighborhoodwines.com/products/${encodeURIComponent(wine.handle)}`;

  return (
    <div className="border border-border bg-card p-6 hover:border-primary/50 transition-colors group">
      
      {/* --- NEW: IMAGE SECTION --- */}
      {/* We add this right at the top of the card */}
      <div className="mb-6 overflow-hidden rounded-md bg-white border border-border/50 flex justify-center p-4 h-64 relative">
         {wine.image ? (
            <img 
                src={wine.image} 
                alt={wine.title} 
                className="h-full w-auto object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
            />
         ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
         )}
      </div>

      {/* Name & Region */}
      <h4 className="font-display text-2xl md:text-3xl text-foreground mb-1 italic group-hover:text-primary transition-colors">
        {wine.title}
      </h4>
      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-4">
        {wine.region}, {wine.country} · {wine.grape}
      </p>

      {/* Description */}
      <p className="font-body text-sm text-foreground/80 leading-relaxed mb-6">
        {wine.note}
      </p>

      {/* Flavor Notes */}
      <div className="flex flex-wrap gap-2 mb-6">
        {wine.flavorNotes.slice(0, 4).map((note) => (
          <span
            key={note}
            className="px-2 py-1 font-body text-xs text-muted-foreground border border-border"
          >
            {note}
          </span>
        ))}
      </div>

      {/* Profile Bars */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <span className="font-body text-xs text-muted-foreground block mb-1">Body</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`flex-1 h-1 ${n <= wine.profile.body ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>
        <div>
          <span className="font-body text-xs text-muted-foreground block mb-1">Acidity</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`flex-1 h-1 ${n <= wine.profile.acidic ? 'bg-accent' : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>
        <div>
          <span className="font-body text-xs text-muted-foreground block mb-1">Tannin</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`flex-1 h-1 ${n <= wine.profile.tannic ? 'bg-neon-orange' : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Buy Link */}
      <a
        href={wineSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-wider text-primary hover:text-accent transition-colors"
      >
        Find a bottle
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
