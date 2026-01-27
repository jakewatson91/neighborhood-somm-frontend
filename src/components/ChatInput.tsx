import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ParsedPreferences {
  body: number;
  acidity: number;
  tannin: number;
  wineStyle: 'red' | 'white' | 'sparkling' | 'any';
  worldStyle: 'old' | 'new' | 'any';
  maxPrice: number;
  flavorNotes: string;
}

interface ChatInputProps {
  onPreferencesParsed: (preferences: ParsedPreferences) => void;
  isLoading: boolean;
}

export function ChatInput({ onPreferencesParsed, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isParsing || isLoading) return;

    setIsParsing(true);

    try {
      const { data, error } = await supabase.functions.invoke('parse-preferences', {
        body: { message: message.trim() }
      });

      if (error) {
        throw error;
      }

      if (data?.preferences) {
        onPreferencesParsed(data.preferences);
        setMessage('');
        toast({
          title: "Preferences updated!",
          description: "We've adjusted the sliders based on your description.",
        });
      }
    } catch (error) {
      console.error('Failed to parse preferences:', error);
      toast({
        title: "Couldn't parse that",
        description: "Try describing your wine preferences differently.",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-3 p-4 border border-border bg-card/50 backdrop-blur-sm">
        <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe what you're in the mood for... e.g. 'bold French red under $40'"
          disabled={isParsing || isLoading}
          className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!message.trim() || isParsing || isLoading}
          className="p-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isParsing ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="mt-2 font-body text-xs text-muted-foreground text-center">
        AI will adjust the sliders below based on your description
      </p>
    </form>
  );
}
