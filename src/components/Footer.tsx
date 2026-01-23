import { Wine, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-wine-charcoal text-wine-cream py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-wine-gradient rounded-sm flex items-center justify-center">
              <Wine className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">UNCORKED</h3>
              <p className="text-xs text-wine-cream/60 font-body uppercase tracking-widest">
                Find Your Pour
              </p>
            </div>
          </div>
          
          <p className="font-body text-sm text-wine-cream/60 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-wine-rose fill-wine-rose" /> for wine lovers everywhere
          </p>
          
          <p className="font-body text-xs text-wine-cream/40">
            Drink responsibly. 21+ only.
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-wine-cream/10 text-center">
          <p className="font-body text-xs text-wine-cream/40">
            V1 • Local merchant integrations coming soon (Total Wine, Blanchards, and more)
          </p>
        </div>
      </div>
    </footer>
  );
}
