import { Wine } from '@/data/wines';
import { Badge } from '@/components/ui/badge';
import { Wine as WineIcon, MapPin, Grape, DollarSign } from 'lucide-react';

interface WineCardProps {
  wine: Wine;
  className?: string;
}

const typeColors: Record<string, string> = {
  red: 'bg-wine-burgundy text-primary-foreground',
  white: 'bg-wine-champagne text-foreground',
  rosé: 'bg-wine-rose text-foreground',
  sparkling: 'bg-wine-gold text-foreground',
  dessert: 'bg-amber-600 text-primary-foreground',
};

export function WineCard({ wine, className = '' }: WineCardProps) {
  return (
    <div className={`bg-card border border-border rounded-sm p-6 shadow-card hover:shadow-elevated transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-1">
            {wine.name}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4" />
            <span>{wine.region}, {wine.country}</span>
          </div>
        </div>
        <Badge className={`${typeColors[wine.type]} font-body uppercase tracking-wider text-xs`}>
          {wine.type}
        </Badge>
      </div>

      <p className="text-foreground/80 font-body text-sm leading-relaxed mb-4">
        {wine.description}
      </p>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Grape className="w-4 h-4" />
          <span>{wine.grape}</span>
        </div>
        <div className="flex items-center gap-1 text-wine-gold font-semibold">
          <DollarSign className="w-4 h-4" />
          <span>{wine.priceRange}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-display text-sm font-semibold mb-2 text-foreground">Flavor Notes</h4>
        <div className="flex flex-wrap gap-2">
          {wine.flavorNotes.map((note) => (
            <span 
              key={note} 
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-xs font-body"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="font-display text-sm font-semibold mb-2 text-foreground">Pairs Well With</h4>
        <p className="text-muted-foreground text-sm font-body">
          {wine.pairings.join(' • ')}
        </p>
      </div>

      {/* Profile bars */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        {[
          { label: 'Body', value: wine.profile.body },
          { label: 'Tannin', value: wine.profile.tannic },
          { label: 'Fruit', value: wine.profile.fruity },
        ].map(({ label, value }) => (
          <div key={label}>
            <span className="text-muted-foreground">{label}</span>
            <div className="h-1.5 bg-secondary rounded-full mt-1">
              <div 
                className="h-full bg-wine-burgundy rounded-full transition-all"
                style={{ width: `${(value / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
