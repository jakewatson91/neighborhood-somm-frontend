import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FoodPairingSection } from '@/components/FoodPairingSection';
import { ChatSection } from '@/components/ChatSection';
import { PreferenceSection } from '@/components/PreferenceSection';
import { WineWheel } from '@/components/WineWheel';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FoodPairingSection />
        <ChatSection />
        <PreferenceSection />
        <WineWheel />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
