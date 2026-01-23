import { Wine } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-wine-gradient rounded-sm flex items-center justify-center">
            <Wine className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground tracking-tight">
              UNCORKED
            </h1>
            <p className="text-xs text-muted-foreground font-body uppercase tracking-widest">
              Find Your Pour
            </p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 font-body text-sm">
          <a href="#pair" className="text-foreground hover:text-primary transition-colors">
            Food Pairing
          </a>
          <a href="#chat" className="text-foreground hover:text-primary transition-colors">
            Ask Sommelier
          </a>
          <a href="#discover" className="text-foreground hover:text-primary transition-colors">
            Discover
          </a>
          <a href="#wheel" className="text-foreground hover:text-primary transition-colors">
            Spin the Wheel
          </a>
        </nav>
      </div>
    </header>
  );
}
