// import { useState } from 'react';
// import { findMockWine } from '../utils/Sommelier';
// import { Wine } from '../data/wines';
// import { ChatInput, ParsedPreferences } from './ChatInput';
// import { WineStatsDisplay } from './WineStats';
// import { useToast } from '@/hooks/use-toast';

// // --- TYPE DEFINITIONS ---
// interface ToggleButtonProps {
//   active: boolean;
//   onClick: () => void;
//   children: React.ReactNode;
// }

// interface CompactSliderProps {
//   label: string;
//   value: number;
//   onChange: (value: number) => void;
// }

// // --- SMALL COMPONENTS ---
// const ToggleButton: React.FC<ToggleButtonProps> = ({ active, onClick, children }) => (
//   <button
//     onClick={onClick}
//     className={`px-3 py-1 text-[10px] uppercase tracking-wider transition-all border rounded-full ${
//       active
//         ? 'bg-primary text-primary-foreground border-primary glow-pink'
//         : 'bg-transparent text-foreground border-border hover:border-primary/50'
//     }`}
//   >
//     {children}
//   </button>
// );

// const CompactSlider: React.FC<CompactSliderProps> = ({ label, value, onChange }) => (
//   <div className="space-y-1">
//     <div className="flex justify-between text-xs font-body uppercase text-muted-foreground">
//       <span>{label}</span>
//       <span className="text-primary">{value}/5</span>
//     </div>
//     <div className="flex gap-1 h-2">
//       {[1, 2, 3, 4, 5].map((n) => (
//         <button
//           key={n}
//           onClick={() => onChange(n)}
//           className={`flex-1 rounded-sm transition-all ${
//             n <= value ? 'bg-primary shadow-[0_0_8px_rgba(235,94,40,0.5)]' : 'bg-muted/30 hover:bg-muted'
//           }`}
//         />
//       ))}
//     </div>
//   </div>
// );

// // --- MAIN COMPONENT ---
// export function PreferenceSection() {
//   const { toast } = useToast();
  
//   // 1. USER INPUT STATE
//   const [body, setBody] = useState(3);
//   const [acidity, setAcidity] = useState(3);
//   const [tannin, setTannin] = useState(3);
//   const [wineStyle, setWineStyle] = useState<'red' | 'white' | 'sparkling' | 'any'>('any');
//   const [maxPrice, setMaxPrice] = useState(50);
  
//   // 2. DATA STATE
//   const [wines, setWines] = useState<Wine[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [isShuffling, setIsShuffling] = useState(false);
//   const [error, setError] = useState('');
//   const [hasSearched, setHasSearched] = useState(false);

//   const activeWine = wines[currentIndex];

//   // --- HANDLERS ---
//   const handleChatParsed = async (prefs: ParsedPreferences) => {
//     setBody(prefs.body);
//     setAcidity(prefs.acidity);
//     setTannin(prefs.tannin);
//     setWineStyle(prefs.wineStyle);
//     setMaxPrice(prefs.maxPrice);
//     await performSearch(prefs);
//   };

//   const performSearch = async (prefs: ParsedPreferences) => {
//     setIsLoading(true);
//     setWines([]);
//     setHasSearched(true);
    
//     // In the real app, this 'findMockWine' should now be calling your backend
//     // which returns the Wine[] with 'aiStats' already populated.
//     const vibe = `Body ${prefs.body}. Acidity ${prefs.acidity}. Tannin ${prefs.tannin}.`;
    
//     const data = await findMockWine({
//       vibe: vibe,
//       wineStyle: prefs.wineStyle,
//       maxPrice: prefs.maxPrice
//     });

//     if (data && data.wines.length > 0) {
//       setWines(data.wines);
//       setCurrentIndex(0);
//     } else {
//       setError("No matches found. Try describing it differently.");
//     }
//     setIsLoading(false);
//   };

//   const handleShuffle = () => {
//     if (wines.length === 0) return;
//     setIsShuffling(true);
//     // Simple shuffle for now, assuming wines are already loaded
//     setTimeout(() => {
//         const nextIndex = (currentIndex + 1) % wines.length;
//         setCurrentIndex(nextIndex);
//         setIsShuffling(false);
//     }, 300);
//   };

//   const handleUpdateSearch = () => {
//     toast({
//       title: "Updating search...",
//       description: "Refining your wine recommendations based on current preferences.",
//     });
//     // Here you could trigger a new search with current slider values
//     const currentPrefs: ParsedPreferences = {
//       body,
//       acidity,
//       tannin,
//       wineStyle,
//       worldStyle: 'any', // Default since we don't have this slider
//       maxPrice,
//       flavorNotes: ''
//     };
//     performSearch(currentPrefs);
//   };

//   return (
//     <section className="py-12 px-6 min-h-screen flex flex-col justify-center">
//       <div className="container mx-auto max-w-5xl">
        
//         {/* HERO HEADER */}
//         <div className={`transition-all duration-700 ${hasSearched ? 'mb-8' : 'mb-16 text-center'}`}>
//           <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 italic">
//             What are you <span className="text-neon-gradient">into?</span>
//           </h2>
//           <div className="max-w-2xl mx-auto">
//              <ChatInput onPreferencesParsed={handleChatParsed} isLoading={isLoading} />
//           </div>
//         </div>

//         {/* --- RESULT CARD --- */}
//         {hasSearched && activeWine && (
//           <div className="animate-fade-in-up">
//             <div className="bg-card/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-2xl glow-pink">
//               <div className="grid md:grid-cols-12 gap-0">
                
//                 {/* COLUMN 1: IMAGE (5/12) */}
//                 <div className="md:col-span-5 relative bg-white h-[400px] md:h-auto group overflow-hidden flex items-center justify-center p-8">
//                    {activeWine.image ? (
//                      <img 
//                        src={activeWine.image} 
//                        alt={activeWine.title} 
//                        className="max-h-full w-auto object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
//                      />
//                    ) : (
//                      <span className="text-muted-foreground">No Image</span>
//                    )}
//                 </div>

//                 {/* COLUMN 2: CONTENT (7/12) */}
//                 <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
                  
//                   {/* Header */}
//                   <div>
//                     <div className="flex justify-between items-start mb-2">
//                        <h3 className="hidden md:block font-display text-3xl md:text-4xl text-foreground leading-none">
//                          {activeWine.title}
//                        </h3>
//                        <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20 shrink-0 ml-2">
//                          <span className="font-body font-bold text-primary">{activeWine.price}</span>
//                        </div>
//                     </div>
                    
//                     {/* Tags / Pairings */}
//                     <div className="flex flex-wrap gap-2 mb-6">
//                        <span className="text-[10px] uppercase tracking-widest text-primary border border-primary/30 px-2 py-1 rounded-sm">
//                            {activeWine.features.country}
//                        </span>
//                        {activeWine.features.pairings.slice(0, 3).map((tag, i) => (
//                          <span key={i} className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-1 rounded-sm">
//                            {tag}
//                          </span>
//                        ))}
//                     </div>
//                   </div>

//                   {/* AI Note */}
//                   <div className="bg-background/50 p-4 rounded-lg border-l-2 border-primary">
//                     <p className="font-body text-sm md:text-base text-muted-foreground italic leading-relaxed">
//                        "{activeWine.aiStats?.explanation || "A fantastic choice based on your preferences."}"
//                     </p>
//                   </div>

//                   {/* --- STATS COMPARISON --- */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/50">
                    
//                     {/* Left: ACTUAL Wine Stats (AI Generated) */}
//                     <div>
//                         <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
//                             The Bottle's Vibe
//                         </p>
//                         {activeWine.aiStats ? (
//                             <WineStatsDisplay stats={activeWine.aiStats.sliders} />
//                         ) : (
//                             <span className="text-xs text-muted-foreground">Analysis pending...</span>
//                         )}
//                     </div>

//                     {/* Right: USER Preferences (Editable) */}
//                     <div>
//                          <div className="flex justify-between items-center mb-2">
//                             <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
//                                 Your Search
//                             </p>
//                             <button onClick={() => alert("Re-searching...")} className="text-[10px] text-primary underline">
//                                 Update
//                             </button>
//                          </div>
//                          <div className="space-y-3">
//                             <CompactSlider label="Body" value={body} onChange={setBody} />
//                             <CompactSlider label="Acidity" value={acidity} onChange={setAcidity} />
//                          </div>
//                     </div>
//                   </div>

//                   {/* Footer Actions */}
//                   <div className="grid grid-cols-2 gap-4 pt-4">
//                     <button 
//                        onClick={handleShuffle}
//                        disabled={isShuffling}
//                        className="py-3 border border-border text-foreground hover:bg-muted transition-colors font-body text-xs uppercase tracking-widest rounded-lg"
//                     >
//                        {isShuffling ? "Loading..." : "Shuffle Results"}
//                     </button>
//                     <a 
//                        href={`https://neighborhoodwines.com/products/${activeWine.handle}`}
//                        target="_blank"
//                        rel="noreferrer"
//                        className="py-3 bg-primary text-primary-foreground text-center font-body text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors rounded-lg shadow-lg glow-pink flex items-center justify-center gap-2"
//                     >
//                        Buy Now
//                     </a>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error */}
//         {hasSearched && error && (
//            <div className="text-center mt-12 p-8 border border-red-500/30 bg-red-500/10 rounded-xl">
//              <p className="text-red-400 font-body">{error}</p>
//            </div>
//         )}
//       </div>
//     </section>
//   );
// }