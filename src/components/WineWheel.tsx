import { useState, useRef } from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { wines, Wine } from '@/data/wines';
import { WineCard } from './WineCard';

const WHEEL_COLORS = [
  '#5C1A1B', // burgundy
  '#8B3A3B', // merlot
  '#C9A227', // gold
  '#2D2D2D', // charcoal
  '#6B3A3B', // wine
  '#A67C52', // amber
  '#4A1A1B', // dark wine
  '#9B4A4B', // lighter wine
];

export function WineWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  const displayWines = wines.slice(0, 8);
  const segmentAngle = 360 / displayWines.length;

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedWine(null);

    // Random number of full rotations (3-5) plus random segment
    const fullRotations = (3 + Math.floor(Math.random() * 3)) * 360;
    const randomSegment = Math.floor(Math.random() * displayWines.length);
    const segmentOffset = randomSegment * segmentAngle + segmentAngle / 2;
    const newRotation = rotation + fullRotations + segmentOffset;

    setRotation(newRotation);

    // After spin completes
    setTimeout(() => {
      setIsSpinning(false);
      // Calculate which wine was selected based on where the pointer is (top)
      const normalizedRotation = newRotation % 360;
      const selectedIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % displayWines.length;
      setSelectedWine(displayWines[selectedIndex]);
    }, 4000);
  };

  const createWheelPath = (index: number) => {
    const startAngle = index * segmentAngle - 90;
    const endAngle = startAngle + segmentAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = 150 + 140 * Math.cos(startRad);
    const y1 = 150 + 140 * Math.sin(startRad);
    const x2 = 150 + 140 * Math.cos(endRad);
    const y2 = 150 + 140 * Math.sin(endRad);
    
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;
    
    return `M 150 150 L ${x1} ${y1} A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number) => {
    const angle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
    const radius = 90;
    return {
      x: 150 + radius * Math.cos(angle),
      y: 150 + radius * Math.sin(angle),
      rotation: index * segmentAngle + segmentAngle / 2
    };
  };

  return (
    <section id="wheel" className="py-20 px-4 bg-background texture-paper">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-wine-burgundy/10 rounded-sm mb-4">
            <RotateCw className="w-4 h-4 text-wine-burgundy" />
            <span className="font-body text-sm uppercase tracking-wider text-wine-burgundy font-semibold">
              Feeling Lucky?
            </span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Spin the Wheel
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            Can't decide? Let fate choose your next bottle. Give it a spin!
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Wheel container */}
          <div className="relative">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-wine-charcoal" />
            </div>
            
            {/* Wheel */}
            <svg
              ref={wheelRef}
              viewBox="0 0 300 300"
              className="w-72 h-72 md:w-96 md:h-96 drop-shadow-2xl"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
              }}
            >
              {/* Outer ring */}
              <circle cx="150" cy="150" r="148" fill="none" stroke="#2D2D2D" strokeWidth="4" />
              
              {/* Segments */}
              {displayWines.map((wine, index) => {
                const textPos = getTextPosition(index);
                return (
                  <g key={wine.id}>
                    <path
                      d={createWheelPath(index)}
                      fill={WHEEL_COLORS[index % WHEEL_COLORS.length]}
                      stroke="#1a1a1a"
                      strokeWidth="2"
                    />
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      fill="white"
                      fontSize="10"
                      fontFamily="Space Grotesk, sans-serif"
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                    >
                      {wine.name.length > 12 ? wine.name.slice(0, 12) + '...' : wine.name}
                    </text>
                  </g>
                );
              })}
              
              {/* Center circle */}
              <circle cx="150" cy="150" r="30" fill="#2D2D2D" stroke="#C9A227" strokeWidth="3" />
              <text
                x="150"
                y="150"
                fill="#C9A227"
                fontSize="10"
                fontFamily="Playfair Display, serif"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                SPIN
              </text>
            </svg>
          </div>

          <Button
            onClick={spinWheel}
            disabled={isSpinning}
            className="px-10 py-6 bg-wine-gradient hover:opacity-90 text-primary-foreground font-body font-semibold uppercase tracking-wider rounded-sm text-lg shadow-wine disabled:opacity-50"
          >
            <RotateCw className={`w-5 h-5 mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
          </Button>

          {/* Result */}
          {selectedWine && (
            <div className="w-full max-w-lg animate-fade-in-up">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4 text-center">
                🎉 Tonight's pick:
              </h3>
              <WineCard wine={selectedWine} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
