import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Wine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { wines, findWinesByFood } from '@/data/wines';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const initialMessage: Message = {
  id: '0',
  role: 'assistant',
  content: "Hey there! I'm your friendly neighborhood sommelier. Ask me anything about wine – what to pair with dinner, what to try if you love a particular style, or just chat about what you're in the mood for tonight. No judgement, just good recommendations. 🍷"
};

export function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    
    // Food pairing questions
    if (lower.includes('pair') || lower.includes('eating') || lower.includes('dinner') || lower.includes('with')) {
      const matchingWines = findWinesByFood(userMessage);
      if (matchingWines.length > 0) {
        const wine = matchingWines[0];
        return `Great choice! For that, I'd reach for a **${wine.name}** from ${wine.region}. ${wine.description}\n\nLooking for something different? A ${matchingWines[1]?.name || 'Côtes du Rhône'} would also work beautifully.`;
      }
    }

    // Red wine questions
    if (lower.includes('red') && (lower.includes('suggest') || lower.includes('recommend') || lower.includes('looking for'))) {
      const reds = wines.filter(w => w.type === 'red');
      const wine = reds[Math.floor(Math.random() * reds.length)];
      return `For red, I'm loving **${wine.name}** right now. ${wine.description}\n\nIt's ${wine.priceRange} and pairs perfectly with ${wine.pairings.slice(0, 2).join(' or ')}.`;
    }

    // White wine questions
    if (lower.includes('white') && (lower.includes('suggest') || lower.includes('recommend') || lower.includes('looking for'))) {
      const whites = wines.filter(w => w.type === 'white');
      const wine = whites[Math.floor(Math.random() * whites.length)];
      return `For white, you can't go wrong with **${wine.name}**. ${wine.description}\n\nPerfect with ${wine.pairings[0]}.`;
    }

    // Bold/full-bodied requests
    if (lower.includes('bold') || lower.includes('full') || lower.includes('heavy') || lower.includes('big')) {
      return `Oh, you want something that makes a statement? Go for a **Barolo** or **Châteauneuf-du-Pape**. Both are absolute powerhouses – Barolo's got that tar and roses thing going on, while the Châteauneuf is all sun-baked fruit and garrigue herbs. Either will pin you to your chair (in the best way).`;
    }

    // Light/crisp requests
    if (lower.includes('light') || lower.includes('crisp') || lower.includes('refreshing')) {
      return `Light and refreshing? **Sancerre** is your friend – laser-sharp, mineral-driven, perfect for a warm day. Or try a **Grüner Veltliner** if you want something with a bit more personality (hello, white pepper!).`;
    }

    // Budget questions
    if (lower.includes('cheap') || lower.includes('budget') || lower.includes('affordable') || lower.includes('under')) {
      return `Real talk: **Côtes du Rhône** is the best value in wine, full stop. Usually under $15 and drinks like something twice the price. For whites, look for **Albariño** or **Grüner Veltliner** – both punch way above their weight.`;
    }

    // Celebration/special occasion
    if (lower.includes('celebrate') || lower.includes('special') || lower.includes('occasion') || lower.includes('champagne')) {
      return `Nothing says celebration like bubbles! **Champagne** is the obvious choice – that toasty, yeasty complexity with tiny bubbles is hard to beat. But if you want to save some cash, look for **Crémant** (French sparkler that's not from Champagne) or **Franciacorta** from Italy.`;
    }

    // Beginner/introduction
    if (lower.includes('new to wine') || lower.includes('beginner') || lower.includes('start') || lower.includes('introduction')) {
      return `Welcome to the rabbit hole! 🐰 Start with the classics: **Argentinian Malbec** (crowd-pleaser, fruity, affordable), **New Zealand Sauvignon Blanc** (love-it-or-hate-it citrus bomb), and **Côtes du Rhône** (smooth, food-friendly, versatile). Once those click, branch out to the weirder stuff!`;
    }

    // Default response
    const randomWine = wines[Math.floor(Math.random() * wines.length)];
    return `Hmm, let me think about that... Have you tried **${randomWine.name}**? It's a ${randomWine.type} from ${randomWine.region} with notes of ${randomWine.flavorNotes.slice(0, 3).join(', ')}. ${randomWine.description.split('.')[0]}.\n\nTell me more about what you're looking for – red or white? Something bold or easy-drinking? I got you.`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = generateResponse(input);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  return (
    <section id="chat" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-wine-gold/20 rounded-sm mb-4">
            <MessageCircle className="w-4 h-4 text-wine-gold" />
            <span className="font-body text-sm uppercase tracking-wider text-wine-gold font-semibold">
              Ask the Sommelier
            </span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Need advice?
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-xl mx-auto">
            Chat with our (virtual) sommelier. No question too basic, no preference too weird.
          </p>
        </div>

        <div className="bg-card border-2 border-border rounded-sm overflow-hidden shadow-elevated">
          {/* Chat messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-foreground text-background' 
                    : 'bg-wine-gradient text-primary-foreground'
                }`}>
                  {message.role === 'user' ? 'U' : <Wine className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-sm ${
                  message.role === 'user'
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-foreground'
                }`}>
                  <p className="font-body text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content.split('**').map((part, i) => 
                      i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                    )}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-wine-gradient text-primary-foreground flex items-center justify-center">
                  <Wine className="w-4 h-4" />
                </div>
                <div className="bg-secondary text-foreground p-4 rounded-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-border p-4">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="What kind of wine are you in the mood for?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 h-12 font-body bg-background border-border rounded-sm"
              />
              <Button 
                onClick={handleSend}
                className="h-12 px-6 bg-wine-gradient hover:opacity-90 text-primary-foreground rounded-sm"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
