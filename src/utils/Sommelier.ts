import { Wine, UserPreferences } from '@/data/wines'; 

export const mapBackendToFrontend = (w: any, aiNote: string): Wine => {
  return {
    id: w.id || Math.random(),
    title: w.title,
    description: w.description || "",
    
    // FIX 1: Map 'product_type' to 'type'
    type: w.product_type ? w.product_type.toLowerCase() : 'red',
    
    region: "Global", // Your clean data doesn't have region yet, defaulting
    country: "International",
    grape: "Blend",
    priceRange: `$${w.price}`,
    note: aiNote, // The AI note
    
    // FIX 2: Map 'image_url' to 'image'
    // This is the specific key from your clean_wine_data function
    image: w.image_url || "https://placehold.co/400x600?text=No+Image",
    
    handle: w.handle || "#",
    
    // FIX 3: Use 'tags' for flavor notes
    flavorNotes: w.tags && w.tags.length > 0 ? w.tags.slice(0, 4) : ["Sommelier Selection"],
    
    // We stick with random profile stats for now since inferred_features is a raw dict
    profile: {
      body: Math.floor(Math.random() * 5) + 1,
      acidic: Math.floor(Math.random() * 5) + 1,
      tannic: Math.floor(Math.random() * 5) + 1,
    }
  };
};

export const findMockWine = async (prefs: UserPreferences): Promise<{wines : Wine[], firstNote : string } | null> => {
  try {
    console.log("🍷 Calling Python Backend...", prefs);
    const response = await fetch('http://127.0.0.1:8000/find-wine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data = await response.json();
    console.log("✅ Python Data Received:", data);

    const wines = data.results.map((w: any, index: number) =>
        mapBackendToFrontend(w, index == 0 ? data.note : "")
    );

    return {wines, firstNote: data.note}

  } catch (error) {
    console.error("❌ Backend connection failed:", error);
    return null;
  }
};

export const getSommelierNote = async (vibe: string, wine: Wine): Promise<string> => {
    try {
        const response = await fetch('http://127.0.0.1:8000/get-note', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                vibe: vibe, 
                wine: {
                    title: wine.title,
                    description: wine.description
                }
            }),
        });
        
        if (!response.ok) return "A delicious choice that fits your vibe";

        const data = await response.json()
        return data.note;
    
    } catch (error) {
        return 'Another excellent option: ${wine.title}.';
    }
};