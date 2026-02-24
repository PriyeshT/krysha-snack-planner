// Nut-free school policy — these items must never appear in suggestions or be added.
// Coconut and water chestnuts are botanically NOT tree nuts and are NOT blocked.

const NUT_KEYWORDS = [
  'peanut', 'peanuts',
  'almond', 'almonds',
  'cashew', 'cashews',
  'walnut', 'walnuts',
  'pistachio', 'pistachios',
  'hazelnut', 'hazelnuts', 'hazel nut',
  'pecan', 'pecans',
  'macadamia',
  'brazil nut', 'brazil nuts',
  'pine nut', 'pine nuts',
  'chestnut', 'chestnuts',
  'mixed nuts',
  'nut butter',
  'nutella',
  'praline',
  'marzipan',
  'satay',         // peanut-based sauce common in Singapore
  'gado gado',     // peanut sauce dish
  'nasi lemak peanut',
]

export function containsNut(name: string): boolean {
  const lower = name.toLowerCase()
  // Check specific named-nut keywords
  if (NUT_KEYWORDS.some(k => lower.includes(k))) return true
  // Check standalone "nut" / "nuts" (word boundary) — avoids false hits on coconut, donut
  if (/\bnuts?\b/.test(lower)) return true
  return false
}

export const NUT_FREE_PROMPT_RULE = `
⚠️ STRICT NUT-FREE SCHOOL RULE: Krysha's school has a strict nut-free policy. NEVER suggest or include any nut-based foods, including: peanuts, peanut butter, almonds, cashews, walnuts, pistachios, hazelnuts, pecans, macadamia nuts, pine nuts, brazil nuts, mixed nuts, Nutella, satay sauce, praline, marzipan, or ANY other tree nut or peanut product. This rule is non-negotiable for Krysha's safety at school.`
