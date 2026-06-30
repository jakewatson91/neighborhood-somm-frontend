import { SearchResult } from '../data/wines';
import { supabase } from '@/integrations/supabase/client';

export interface UserPreferences {
  vibe: string;
  maxPrice: number;
  shuffle?: boolean;
  excludeIds?: number[];
}

// Calls the `find-wine` Supabase Edge Function. It embeds the vibe with gte-small
// inside the Supabase runtime (no external embedding key, no per-call cost), runs
// the pgvector search, and writes the sommelier note. Replaces the old Render
// FastAPI backend, which depended on the paid HuggingFace inference API.
export const findWine = async (prefs: UserPreferences): Promise<SearchResult | null> => {
  try {
    console.log("🍷 Asking the Sommelier...", prefs);

    const { data, error } = await supabase.functions.invoke('find-wine', {
      body: {
        vibe: prefs.vibe,
        maxPrice: prefs.maxPrice,
        shuffle: prefs.shuffle || false,
        excludeIds: prefs.excludeIds || [],
      },
    });

    if (error) throw error;
    if (!data || !data.wine) return null;

    console.log("✅ Sommelier Responded:", data);
    return data as SearchResult;

  } catch (error) {
    console.error("❌ Sommelier connection failed:", error);
    return null;
  }
};
