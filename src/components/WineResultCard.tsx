import { ExternalLink, Quote, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { SearchResult } from '@/data/wines';
import { useState } from 'react';

interface WineResultProps {
  data: SearchResult;
  onReset: () => void;
}

export function WineResult({ data, onReset }: WineResultProps) {
  const { wine, note } = data;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);
  
  const wineSearchUrl = `https://neighborhoodwines.com/products/${encodeURIComponent(wine.handle)}`;

  // Clean the grape string: "['Pinot Noir']" -> "Pinot Noir"
  const cleanGrape = wine.features.grape 
    ? wine.features.grape.replace(/[\[\]']/g, "") 
    : "Blend";

  return (
    <div className="w-full max-w-xl mx-auto animate-in fade-in zoom-in duration-500">
      
      {/* 1. AI NOTE */}
      <div className="mb-8 relative">
        <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl relative">
          <Quote className="w-8 h-8 text-primary/20 absolute -top-3 -left-2 transform -scale-x-100 bg-background rounded-full p-1" />
          <p className="font-display text-lg md:text-xl text-foreground italic leading-relaxed text-center">
            "{note}"
          </p>
        </div>
      </div>

      {/* 2. WINE CARD */}
      <div className="border border-border bg-card overflow-hidden rounded-2xl shadow-2xl glow-pink group mb-8">
        
        {/* IMAGE CONTAINER */}
        <div className="bg-white h-[400px] flex items-center justify-center p-8 relative">
            
            {/* Loading Spinner (Visible while image loads) */}
            {!isImageReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-100 border-t-primary rounded-full animate-spin" />
                </div>
            )}

            {wine.image_url ? (
                <img 
                    src={wine.image_url} 
                    alt={wine.title}
                    onLoad={() => setIsImageReady(true)} // Trigger reveal
                    className={`h-full w-auto object-contain mix-blend-multiply drop-shadow-xl transition-all duration-700 
                        ${isImageReady ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} 
                        group-hover:scale-105`}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-xs uppercase tracking-widest">
                    No Image
                </div>
            )}
        </div>

        {/* DETAILS */}
        <div className={`p-8 text-center space-y-4 transition-opacity duration-700 delay-100 ${isImageReady ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className="p-8 text-center space-y-4">
            
            <div>
              {/* FIXED: Removed country. Shows "Rosé · Pinot Noir" */}
              <p className="font-body text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                {wine.features.type} · {cleanGrape}
              </p>
              <h4 className="font-display text-3xl md:text-4xl text-foreground leading-none">
                {wine.title}
              </h4>
            </div>

            {/* DESCRIPTION (Expandable) */}
            <div className="relative">
              <div 
                  className={`font-body text-sm text-muted-foreground leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'}`}
                  dangerouslySetInnerHTML={{ __html: wine.description.replace(/<[^>]*>?/gm, '') }} 
              />
              
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
              >
                {isExpanded ? (
                  <>Read Less <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Read More <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            </div>

            {/* PAIRINGS */}
            {wine.features.pairings && wine.features.pairings.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {wine.features.pairings.slice(0, 3).map((note) => (
                  <span
                      key={note}
                      className="px-2 py-1 font-body text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-sm"
                  >
                      {note}
                  </span>
                  ))}
              </div>
            )}

            {/* BUY LINK */}
            <div className="pt-6">
              <a
                href={wineSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-4 bg-primary text-primary-foreground font-body text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 gap-2"
              >
                Find a bottle
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        {/* 3. RESET BUTTON */}
        <div className="text-center">
          <button 
            onClick={onReset}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Find another bottle
          </button>
        </div>

      </div>
    </div>
  );
}