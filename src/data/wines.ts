export interface Wine {
  id: string;
  name: string;
  region: string;
  country: string;
  grape: string;
  type: 'red' | 'white' | 'rosé' | 'sparkling' | 'dessert';
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  profile: {
    fruity: number;
    earthy: number;
    tannic: number;
    acidic: number;
    body: number;
    sweet: number;
  };
  description: string;
  pairings: string[];
  flavorNotes: string[];
}

export const wines: Wine[] = [
  {
    id: '1',
    name: 'Barolo',
    region: 'Piedmont',
    country: 'Italy',
    grape: 'Nebbiolo',
    type: 'red',
    priceRange: '$$$',
    profile: { fruity: 3, earthy: 5, tannic: 5, acidic: 4, body: 5, sweet: 1 },
    description: 'The "King of Wines" from the misty hills of Piedmont. Tar, roses, and dried cherries dance with firm tannins that demand patience or a rich, fatty cut of beef.',
    pairings: ['Braised short ribs', 'Truffle risotto', 'Aged hard cheeses', 'Wild boar ragu'],
    flavorNotes: ['Tar', 'Roses', 'Cherry', 'Leather', 'Tobacco']
  },
  {
    id: '2',
    name: 'Sancerre',
    region: 'Loire Valley',
    country: 'France',
    grape: 'Sauvignon Blanc',
    type: 'white',
    priceRange: '$$',
    profile: { fruity: 3, earthy: 3, tannic: 0, acidic: 5, body: 2, sweet: 1 },
    description: 'Razor-sharp minerality from flinty soils along the Loire. Gooseberry, citrus, and that unmistakable gunflint edge that makes it the sommelier\'s go-to.',
    pairings: ['Goat cheese salad', 'Oysters', 'Grilled fish', 'Asparagus'],
    flavorNotes: ['Grapefruit', 'Gooseberry', 'Flint', 'Herbs', 'Lime']
  },
  {
    id: '3',
    name: 'Argentinian Malbec',
    region: 'Mendoza',
    country: 'Argentina',
    grape: 'Malbec',
    type: 'red',
    priceRange: '$$',
    profile: { fruity: 5, earthy: 2, tannic: 3, acidic: 3, body: 4, sweet: 2 },
    description: 'High-altitude vines in the shadow of the Andes produce inky, plush wines bursting with dark fruit. Your new best friend for steak night.',
    pairings: ['Grilled steak', 'Empanadas', 'BBQ ribs', 'Blue cheese'],
    flavorNotes: ['Plum', 'Blackberry', 'Vanilla', 'Cocoa', 'Violet']
  },
  {
    id: '4',
    name: 'Grüner Veltliner',
    region: 'Wachau',
    country: 'Austria',
    grape: 'Grüner Veltliner',
    type: 'white',
    priceRange: '$$',
    profile: { fruity: 3, earthy: 3, tannic: 0, acidic: 4, body: 3, sweet: 1 },
    description: 'Austria\'s signature white—peppery, herbal, with white pepper snap and stone fruit depth. The ultimate schnitzel companion.',
    pairings: ['Wiener schnitzel', 'Sushi', 'Thai food', 'Vegetable dishes'],
    flavorNotes: ['White pepper', 'Green apple', 'Citrus', 'Herbs', 'Stone fruit']
  },
  {
    id: '5',
    name: 'Côtes du Rhône',
    region: 'Rhône Valley',
    country: 'France',
    grape: 'GSM Blend',
    type: 'red',
    priceRange: '$',
    profile: { fruity: 4, earthy: 3, tannic: 2, acidic: 3, body: 3, sweet: 1 },
    description: 'The everyday Rhône red that punches above its weight. Grenache-led warmth with garrigue herbs and sun-baked fruit.',
    pairings: ['Roasted lamb', 'Ratatouille', 'Grilled sausages', 'Pizza'],
    flavorNotes: ['Raspberry', 'Lavender', 'Herbs de Provence', 'Pepper', 'Cherry']
  },
  {
    id: '6',
    name: 'Riesling Spätlese',
    region: 'Mosel',
    country: 'Germany',
    grape: 'Riesling',
    type: 'white',
    priceRange: '$$',
    profile: { fruity: 5, earthy: 2, tannic: 0, acidic: 5, body: 2, sweet: 4 },
    description: 'Off-dry perfection from steep slate slopes. Electric acidity meets tropical sweetness in a wine that ages like a dream.',
    pairings: ['Spicy Thai', 'Roast pork', 'Blue cheese', 'Apple desserts'],
    flavorNotes: ['Peach', 'Petrol', 'Honey', 'Slate', 'Lime']
  },
  {
    id: '7',
    name: 'Oregon Pinot Noir',
    region: 'Willamette Valley',
    country: 'USA',
    grape: 'Pinot Noir',
    type: 'red',
    priceRange: '$$$',
    profile: { fruity: 4, earthy: 4, tannic: 2, acidic: 4, body: 3, sweet: 1 },
    description: 'New World Pinot with Old World soul. Forest floor meets bright cherry in wines that rival Burgundy without the attitude.',
    pairings: ['Duck', 'Salmon', 'Mushroom dishes', 'Gruyère'],
    flavorNotes: ['Cherry', 'Forest floor', 'Cranberry', 'Baking spice', 'Earth']
  },
  {
    id: '8',
    name: 'Albariño',
    region: 'Rías Baixas',
    country: 'Spain',
    grape: 'Albariño',
    type: 'white',
    priceRange: '$$',
    profile: { fruity: 4, earthy: 2, tannic: 0, acidic: 4, body: 2, sweet: 1 },
    description: 'Galicia\'s ocean-kissed white. Briny minerality meets apricot and citrus—liquid sunshine for your seafood feast.',
    pairings: ['Ceviche', 'Mussels', 'Paella', 'Grilled octopus'],
    flavorNotes: ['Apricot', 'Lemon', 'Saline', 'Peach', 'Almond']
  },
  {
    id: '9',
    name: 'Amarone della Valpolicella',
    region: 'Veneto',
    country: 'Italy',
    grape: 'Corvina Blend',
    type: 'red',
    priceRange: '$$$$',
    profile: { fruity: 4, earthy: 4, tannic: 4, acidic: 3, body: 5, sweet: 2 },
    description: 'Dried grape intensity creates this powerful, velvety beast. Raisined fruit, chocolate, and coffee in a warming embrace.',
    pairings: ['Osso buco', 'Aged cheddar', 'Dark chocolate', 'Game meats'],
    flavorNotes: ['Raisin', 'Fig', 'Chocolate', 'Coffee', 'Cherry']
  },
  {
    id: '10',
    name: 'Provence Rosé',
    region: 'Provence',
    country: 'France',
    grape: 'Grenache/Cinsault',
    type: 'rosé',
    priceRange: '$$',
    profile: { fruity: 4, earthy: 1, tannic: 1, acidic: 3, body: 2, sweet: 1 },
    description: 'Pale pink perfection for lazy afternoons. Bone-dry with whispers of strawberry, peach, and Mediterranean herbs.',
    pairings: ['Niçoise salad', 'Grilled fish', 'Charcuterie', 'Light pasta'],
    flavorNotes: ['Strawberry', 'Peach', 'Herbs', 'Citrus', 'Melon']
  },
  {
    id: '11',
    name: 'Champagne Brut',
    region: 'Champagne',
    country: 'France',
    grape: 'Chardonnay/Pinot Noir',
    type: 'sparkling',
    priceRange: '$$$',
    profile: { fruity: 3, earthy: 2, tannic: 0, acidic: 5, body: 2, sweet: 1 },
    description: 'The OG sparkling wine. Toasty brioche, green apple, and endless tiny bubbles that make everything feel like a celebration.',
    pairings: ['Oysters', 'Fried chicken', 'Caviar', 'Potato chips'],
    flavorNotes: ['Brioche', 'Apple', 'Citrus', 'Toast', 'Almond']
  },
  {
    id: '12',
    name: 'Rioja Reserva',
    region: 'Rioja',
    country: 'Spain',
    grape: 'Tempranillo',
    type: 'red',
    priceRange: '$$',
    profile: { fruity: 3, earthy: 4, tannic: 3, acidic: 3, body: 4, sweet: 1 },
    description: 'American oak-aged Spanish classic. Vanilla, leather, and red fruit in perfect harmony. The thinking person\'s Tuesday wine.',
    pairings: ['Lamb chops', 'Manchego', 'Roasted vegetables', 'Paella'],
    flavorNotes: ['Vanilla', 'Leather', 'Cherry', 'Tobacco', 'Dill']
  },
  {
    id: '13',
    name: 'Chablis',
    region: 'Burgundy',
    country: 'France',
    grape: 'Chardonnay',
    type: 'white',
    priceRange: '$$$',
    profile: { fruity: 2, earthy: 4, tannic: 0, acidic: 5, body: 2, sweet: 0 },
    description: 'Unoaked Chardonnay at its purest. Steely, mineral-driven, with oyster shell salinity and laser precision.',
    pairings: ['Raw oysters', 'Sashimi', 'Roast chicken', 'Lobster'],
    flavorNotes: ['Lemon', 'Oyster shell', 'Chalk', 'Green apple', 'Flint']
  },
  {
    id: '14',
    name: 'Châteauneuf-du-Pape',
    region: 'Rhône Valley',
    country: 'France',
    grape: 'Grenache Blend',
    type: 'red',
    priceRange: '$$$',
    profile: { fruity: 4, earthy: 5, tannic: 3, acidic: 3, body: 5, sweet: 1 },
    description: 'Big, sun-drenched Southern Rhône royalty. Garrigue, black fruit, and a warmth that wraps around you like a Mediterranean sunset.',
    pairings: ['Lamb stew', 'Beef bourguignon', 'Wild mushrooms', 'Hard aged cheese'],
    flavorNotes: ['Blackberry', 'Garrigue', 'Leather', 'Licorice', 'Pepper']
  },
  {
    id: '15',
    name: 'New Zealand Sauvignon Blanc',
    region: 'Marlborough',
    country: 'New Zealand',
    grape: 'Sauvignon Blanc',
    type: 'white',
    priceRange: '$',
    profile: { fruity: 5, earthy: 1, tannic: 0, acidic: 5, body: 2, sweet: 1 },
    description: 'Explosively aromatic with passion fruit, grass, and jalapeño zip. Love it or hate it, you can\'t ignore it.',
    pairings: ['Goat cheese', 'Green salads', 'Shellfish', 'Sushi rolls'],
    flavorNotes: ['Passion fruit', 'Grass', 'Grapefruit', 'Jalapeño', 'Lime']
  },
  {
    id: '16',
    name: 'Sauternes',
    region: 'Bordeaux',
    country: 'France',
    grape: 'Sémillon/Sauvignon Blanc',
    type: 'dessert',
    priceRange: '$$$$',
    profile: { fruity: 5, earthy: 2, tannic: 0, acidic: 4, body: 4, sweet: 5 },
    description: 'Noble rot magic creates liquid gold. Honeyed apricots, marmalade, and a backbone of acidity that keeps it elegant.',
    pairings: ['Foie gras', 'Blue cheese', 'Crème brûlée', 'Fresh peaches'],
    flavorNotes: ['Apricot', 'Honey', 'Orange peel', 'Saffron', 'Vanilla']
  }
];

export const foodPairings: Record<string, string[]> = {
  'steak': ['Argentinian Malbec', 'Barolo', 'Châteauneuf-du-Pape', 'Rioja Reserva'],
  'beef': ['Argentinian Malbec', 'Barolo', 'Châteauneuf-du-Pape', 'Rioja Reserva', 'Amarone della Valpolicella'],
  'lamb': ['Rioja Reserva', 'Côtes du Rhône', 'Châteauneuf-du-Pape', 'Barolo'],
  'pork': ['Riesling Spätlese', 'Oregon Pinot Noir', 'Grüner Veltliner', 'Côtes du Rhône'],
  'chicken': ['Chablis', 'Grüner Veltliner', 'Oregon Pinot Noir', 'Provence Rosé'],
  'duck': ['Oregon Pinot Noir', 'Rioja Reserva', 'Châteauneuf-du-Pape'],
  'fish': ['Sancerre', 'Chablis', 'Albariño', 'Provence Rosé', 'Grüner Veltliner'],
  'salmon': ['Oregon Pinot Noir', 'Chablis', 'Provence Rosé'],
  'shellfish': ['Champagne Brut', 'Sancerre', 'Chablis', 'Albariño', 'New Zealand Sauvignon Blanc'],
  'oysters': ['Champagne Brut', 'Sancerre', 'Chablis'],
  'pasta': ['Côtes du Rhône', 'Rioja Reserva', 'Provence Rosé'],
  'pizza': ['Côtes du Rhône', 'Argentinian Malbec'],
  'cheese': ['Barolo', 'Rioja Reserva', 'Sauternes', 'Champagne Brut', 'Oregon Pinot Noir'],
  'sushi': ['Grüner Veltliner', 'Chablis', 'Champagne Brut', 'New Zealand Sauvignon Blanc'],
  'thai': ['Riesling Spätlese', 'Grüner Veltliner', 'New Zealand Sauvignon Blanc'],
  'spicy': ['Riesling Spätlese', 'Grüner Veltliner', 'Provence Rosé'],
  'bbq': ['Argentinian Malbec', 'Côtes du Rhône', 'Rioja Reserva'],
  'vegetarian': ['Grüner Veltliner', 'Sancerre', 'Provence Rosé', 'Oregon Pinot Noir'],
  'dessert': ['Sauternes', 'Riesling Spätlese'],
  'chocolate': ['Amarone della Valpolicella', 'Sauternes']
};

export function findWinesByFood(food: string): Wine[] {
  const lowercaseFood = food.toLowerCase();
  const matchingWineNames: Set<string> = new Set();
  
  Object.entries(foodPairings).forEach(([keyword, wineNames]) => {
    if (lowercaseFood.includes(keyword)) {
      wineNames.forEach(name => matchingWineNames.add(name));
    }
  });
  
  if (matchingWineNames.size === 0) {
    // Default suggestions if no match
    return wines.slice(0, 3);
  }
  
  return wines.filter(wine => matchingWineNames.has(wine.name));
}

export function findWinesByPreference(preferences: {
  fruity?: number;
  earthy?: number;
  tannic?: number;
  body?: number;
  type?: string;
}): Wine[] {
  return wines.filter(wine => {
    if (preferences.type && wine.type !== preferences.type) return false;
    
    let score = 0;
    if (preferences.fruity !== undefined) {
      score += Math.abs(wine.profile.fruity - preferences.fruity);
    }
    if (preferences.earthy !== undefined) {
      score += Math.abs(wine.profile.earthy - preferences.earthy);
    }
    if (preferences.tannic !== undefined) {
      score += Math.abs(wine.profile.tannic - preferences.tannic);
    }
    if (preferences.body !== undefined) {
      score += Math.abs(wine.profile.body - preferences.body);
    }
    
    return score <= 6;
  }).slice(0, 4);
}

export function getRandomWine(): Wine {
  return wines[Math.floor(Math.random() * wines.length)];
}
