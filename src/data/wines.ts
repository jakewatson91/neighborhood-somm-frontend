export interface WineFeatures {
  type: string;
  grape: string;        // It comes in as a string like "['Pinot Noir']"
  acidity: string;      // e.g. "Medium"
  body: string;         // e.g. "Medium-bodied"
  pairings: string[];   // Array of strings
}

export interface Wine {
  id: number | string;
  title: string;
  handle: string;
  price: number | string;
  image_url: string;    // Matches backend key
  product_type: string;
  description: string;
  tags: string[];
  features: WineFeatures;
  match_score: number;
}

export interface SearchResult {
  wine: Wine;
  note: string;
}