import { PreferenceSection } from "@/components/PreferenceSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="font-display text-3xl md:text-4xl italic text-foreground">
            Neighborhood Somm
          </h1>
          <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">
            Find your wine
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <PreferenceSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-xs text-muted-foreground">
            © 2026 Neighborhood Somm. Drink responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
