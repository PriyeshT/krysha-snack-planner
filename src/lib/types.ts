export type FoodCategory =
  | 'fruit'
  | 'veggie'
  | 'protein'
  | 'grain'
  | 'dairy'
  | 'snack'
  | 'other'

export interface FoodItem {
  id:        string
  name:      string
  emoji:     string       // user-picked from grid
  rating:    number       // 0 = unrated, 1–5
  dateAdded: string       // ISO string
  category:  FoodCategory
}

export type RecommendationType = 'snack-pack' | 'cook-together' | 'try-new' | 'suggest-favorites'

export interface RecommendRequest {
  type:       RecommendationType
  foods:      FoodItem[]
  fairyName?: string
}

// ── Snack Pack ────────────────────────────────────────────────────────────────
export interface SnackCombo {
  name:        string
  items:       string[]
  whyItsYummy: string
}

export interface GapSuggestion {
  component:   string   // "fruit" | "protein" | "healthy fat" | "dip"
  message:     string   // friendly explanation of the gap
  suggestions: { name: string; emoji: string; category: FoodCategory }[]
}

export interface SnackPackResponse {
  greeting:    string
  gaps:        GapSuggestion[]  // empty array if no gaps
  combos:      SnackCombo[]
  closingNote: string
}

// ── Cook Together ─────────────────────────────────────────────────────────────
export interface Recipe {
  name:        string
  emoji:       string
  ingredients: string[]
  steps:       string[]
  funFact:     string
}

export interface CookTogetherResponse {
  greeting:    string
  recipes:     Recipe[]
  closingNote: string
}

// ── Suggest Favorites ─────────────────────────────────────────────────────────
export interface SuggestedFood {
  name:         string
  emoji:        string
  category:     FoodCategory
  whySuggested: string  // short kid-friendly reason
}

export interface SuggestFavoritesResponse {
  greeting:    string
  suggestions: SuggestedFood[]
  closingNote: string
}

// ── Try New ───────────────────────────────────────────────────────────────────
export interface NewFood {
  name:      string
  emoji:     string
  category:  string
  whyTryIt:  string
  tastes:    string   // e.g. "sweet and a little tangy"
  challenge: string   // mini dare/challenge for Krysha
}

export interface TryNewResponse {
  greeting:    string
  newFoods:    NewFood[]
  closingNote: string
}
