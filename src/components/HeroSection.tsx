import { ArrowDown } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-paper-gradient texture-paper relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-wine-burgundy/20 rounded-full" />
      <div className="absolute bottom-20 right-10 w-48 h-48 border border-wine-gold/20 rounded-full" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-wine-burgundy/5 rounded-full" />
      
      <div className="relative z-10">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Your Personal Wine Guide
        </p>
        
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-[0.9]">
          DRINK
          <br />
          <span className="italic text-wine-burgundy">BETTER</span>
          <br />
          WINE
        </h1>
        
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Pair your dinner. Discover hidden gems. Spin the wheel.
          <br />
          No snobs. No BS. Just great wine.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#pair"
            className="px-8 py-4 bg-wine-gradient text-primary-foreground font-body font-semibold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity shadow-wine"
          >
            Find Your Pairing
          </a>
          <a 
            href="#wheel"
            className="px-8 py-4 border-2 border-foreground text-foreground font-body font-semibold uppercase tracking-wider text-sm hover:bg-foreground hover:text-background transition-colors"
          >
            Spin the Wheel
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
}
