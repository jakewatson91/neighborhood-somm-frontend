import { ExternalLink, RefreshCw } from 'lucide-react';
import { SearchResult } from '@/data/wines';
import { useState } from 'react';
interface WineResultProps {
  data: SearchResult;
  onReset: () => void;
}

export function WineResult({ data, onReset }: WineResultProps) {
  const { wine, note } = data;
  const [isImageReady, setIsImageReady] = useState(false);
  
  const wineSearchUrl = `https://neighborhoodwines.com/products/${encodeURIComponent(wine.handle)}`;

  // Clean the grape string: "['Pinot Noir']" -> "Pinot Noir"
  const cleanGrape = wine.features.grape 
    ? wine.features.grape.replace(/[\[\]']/g, "") 
    : "Blend";

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
      
      {/* OVERLAPPING CARD CONTAINER */}
      <div className="relative">
        
        {/* MAIN CARD */}
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden ml-0 md:ml-24 lg:ml-32">
          
          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* LEFT: Spacer for overlapping image on mobile hidden */}
            <div className="hidden md:block md:col-span-4 lg:col-span-3" />

            {/* RIGHT: Stats & Buy */}
            <div className="md:col-span-8 lg:col-span-9 p-6 md:p-8 space-y-6">
              
              {/* MOBILE IMAGE (visible only on small screens) */}
              <div className="md:hidden bg-white rounded-xl p-4 flex items-center justify-center h-[250px]">
                {wine.image_url ? (
                  <img 
                    src={wine.image_url} 
                    alt={wine.title}
                    className="h-full w-auto object-contain mix-blend-multiply"
                  />
                ) : (
                  <div className="text-muted-foreground text-xs uppercase tracking-widest">
                    No Image
                  </div>
                )}
              </div>

              {/* WINE INFO + SOMMELIER NOTE */}
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                  {wine.features.type} · {cleanGrape}
                </p>
                <h4 className="font-display text-3xl md:text-4xl text-foreground leading-tight mb-4">
                  {wine.title}
                </h4>
                <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed italic">
                  "{note}"
                </p>
              </div>

              {/* PAIRINGS */}
              {wine.features.pairings && wine.features.pairings.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {wine.features.pairings.slice(0, 4).map((pairing) => (
                    <span
                      key={pairing}
                      className="px-3 py-1.5 font-body text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/50 border border-border rounded-full"
                    >
                      {pairing}
                    </span>
                  ))}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href={wineSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative flex-1 inline-flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-body text-xs uppercase tracking-widest rounded-xl overflow-hidden transition-all shadow-lg hover:shadow-primary/25"
                >
                  {/* Rainbow shimmer overlay */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out" />
                  <span className="relative z-10 flex items-center gap-2">
                    Find a bottle
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
                <button 
                  onClick={onReset}
                  className="inline-flex items-center justify-center gap-2 py-4 px-6 border border-border text-muted-foreground font-body text-xs uppercase tracking-widest rounded-xl hover:bg-muted/50 hover:text-foreground transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  Another
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* OVERLAPPING WINE IMAGE (Desktop only) */}
        <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-48 lg:w-56 h-[400px] lg:h-[450px] items-center justify-center z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-6 h-full w-full flex items-center justify-center group">
            {!isImageReady && wine.image_url && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin" />
              </div>
            )}
            {wine.image_url ? (
              <img 
                src={wine.image_url} 
                alt={wine.title}
                onLoad={() => setIsImageReady(true)}
                className={`h-full w-auto object-contain mix-blend-multiply drop-shadow-xl transition-all duration-700 
                  ${isImageReady ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} 
                  group-hover:scale-105`}
              />
            ) : (
              <div className="text-muted-foreground text-xs uppercase tracking-widest">
                No Image
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}