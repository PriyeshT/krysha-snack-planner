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

export type RecommendationType = 'snack-pack' | 'cook-together' | 'try-new'

export interface RecommendRequest {
  type:       RecommendationType
  foods:      FoodItem[]
  fairyName?: string
}

// ── Snack Pack ────────────────────────────────────────────────────────────────
export interface SnackCombo {
  name:        string   // e.g. "Rainbow Power Pack"
  items:       string[] // e.g. ["🍎 Apple", "🧀 Cheese cubes"]
  whyItsYummy: string
}

export interface SnackPackResponse {
  greeting:    string
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
