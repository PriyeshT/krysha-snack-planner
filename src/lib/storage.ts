import { FoodItem } from './types'

const KEY = 'krysha_snacks_v1'

function isClient(): boolean {
  return typeof window !== 'undefined'
}

export function getFoods(): FoodItem[] {
  if (!isClient()) return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as FoodItem[]
  } catch {
    return []
  }
}

export function saveFoods(foods: FoodItem[]): void {
  if (!isClient()) return
  localStorage.setItem(KEY, JSON.stringify(foods))
}

export function addFood(food: FoodItem): void {
  const foods = getFoods()
  saveFoods([food, ...foods])
}

export function updateFood(id: string, patch: Partial<FoodItem>): void {
  const foods = getFoods().map(f => (f.id === id ? { ...f, ...patch } : f))
  saveFoods(foods)
}

export function deleteFood(id: string): void {
  saveFoods(getFoods().filter(f => f.id !== id))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
