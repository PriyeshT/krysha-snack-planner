import { FoodItem } from './types'
import { containsNut } from './nuts'

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

// ── Backup / Restore ──────────────────────────────────────────────────────────

export interface BackupFile {
  version:    number
  exportedAt: string
  fairyName:  string
  foods:      FoodItem[]
}

export function exportBackup(): void {
  if (!isClient()) return
  const data: BackupFile = {
    version:    1,
    exportedAt: new Date().toISOString(),
    fairyName:  getFairyName(),
    foods:      getFoods(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `krysha-snacks-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function validateBackup(raw: unknown): { ok: true; data: BackupFile } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'File is not valid JSON.' }
  const d = raw as Record<string, unknown>
  if (d.version !== 1) return { ok: false, error: 'Unrecognised backup version.' }
  if (typeof d.fairyName !== 'string') return { ok: false, error: 'Missing fairy name in backup.' }
  if (!Array.isArray(d.foods)) return { ok: false, error: 'Missing foods list in backup.' }
  const invalid = (d.foods as unknown[]).find(
    f => !f || typeof f !== 'object' ||
      typeof (f as Record<string, unknown>).id !== 'string' ||
      typeof (f as Record<string, unknown>).name !== 'string' ||
      typeof (f as Record<string, unknown>).emoji !== 'string'
  )
  if (invalid) return { ok: false, error: 'Backup contains malformed food entries.' }
  const nutFood = (d.foods as FoodItem[]).find(f => containsNut(f.name))
  if (nutFood) return { ok: false, error: `Backup contains a nut product ("${nutFood.name}") and cannot be restored.` }
  return { ok: true, data: d as unknown as BackupFile }
}

export function restoreBackup(backup: BackupFile): void {
  saveFoods(backup.foods)
  saveFairyName(backup.fairyName)
}
