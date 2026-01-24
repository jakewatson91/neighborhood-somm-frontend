// src/utils/mockSommelier.ts

// Define the shape of the data we expect back from Python
export interface BackendWine {
  id: number;
  title: string;
  price: number;
  image: string;
  handle: string;
  note: string;
}

export interface UserPreferences {
  vibe: string;
  type: string;
  maxPrice: number;
}

export const findMockWine = async (prefs: UserPreferences): Promise<BackendWine | null> => {
  try {
    // 1. Log what we are sending (Great for debugging)
    console.log("🍷 Calling Python Backend with:", prefs);

    // 2. Call your local Python server
    // Make sure you ran 'uvicorn main:app --reload' in your terminal!
    const response = await fetch('http://127.0.0.1:8000/find-wine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prefs),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Python responded:", data);

    // 3. Map the Python response to our Frontend shape
    // The backend returns { wine: {...}, note: "..." }
    // We flatten it for easier use in the UI
    return {
      id: data.wine.id,
      title: data.wine.title,
      price: data.wine.price,
      image: data.wine.image || "/placeholder.jpg", // Fallback image
      handle: data.wine.handle,
      note: data.note
    };

  } catch (error) {
    console.error("❌ Backend connection failed:", error);
    alert("Is your Python backend running? Check your terminal!");
    return null;
  }
};