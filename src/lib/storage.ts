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
    type Stored = Omit<FoodItem, 'inPantry'> & { inPantry?: boolean }
    const items = JSON.parse(raw) as Stored[]
    // Migrate: existing items without inPantry default to true
    return items.map(f => ({ ...f, inPantry: f.inPantry ?? true }))
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

const FAIRY_KEY = 'krysha_fairy_name_v1'
const DEFAULT_FAIRY_NAME = 'Pixie'

export function getFairyName(): string {
  if (!isClient()) return DEFAULT_FAIRY_NAME
  return localStorage.getItem(FAIRY_KEY) || DEFAULT_FAIRY_NAME
}

export function saveFairyName(name: string): void {
  if (!isClient()) return
  localStorage.setItem(FAIRY_KEY, name.trim() || DEFAULT_FAIRY_NAME)
}
