export interface Wine {
  id: number;
  title: string;
  type: string;
  region: string;
  country: string;
  grape: string;
  priceRange: string;
  description: string;
  note: string;
  flavorNotes: string[];
  image: string;     
  handle: string;
  profile: {
    body: number;
    acidic: number;
    tannic: number;
  };
}

export interface UserPreferences {
  vibe: string;
  type: string;
  maxPrice: number;
}