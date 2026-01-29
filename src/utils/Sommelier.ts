import { SearchResult } from '../data/wines';

export interface UserPreferences {
  vibe: string;
  maxPrice: number;
  shuffle?: boolean;
  excludeIds?: number[];
}

export const findWine = async (prefs: UserPreferences): Promise<SearchResult | null> => {
  try {
    console.log("🍷 Asking the Sommelier...", prefs);
    
    const response = await fetch('http://127.0.0.1:8000/find-wine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        vibe: prefs.vibe, 
        maxPrice: prefs.maxPrice,
        shuffle: prefs.shuffle || false,
        excludeIds: prefs.excludeIds || [] // Send array
      }),
    });

    if (!response.ok) {
      throw new Error(`Sommelier is busy (Status: ${response.status})`);
    }

    // THE FIX: The backend now returns exactly the structure our frontend expects.
    // No mapping needed. We just cast it to our Type.
    const data: SearchResult = await response.json();
    console.log("✅ Sommelier Responded:", data);

    return data;

  } catch (error) {
    console.error("❌ Sommelier connection failed:", error);
    return null;
  }
};