import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { RecommendRequest, FoodItem } from '@/lib/types'
import { NUT_FREE_PROMPT_RULE } from '@/lib/nuts'

const client = new Anthropic()

function buildSystem(fairyName: string): string {
  return `You are ${fairyName}, a magical snack fairy who lives in Krysha's Snack Kingdom! You help a 5-year-old girl named Krysha and her daddy plan healthy, yummy snacks. Use simple words, 1–3 emojis per sentence, celebrate every food choice. Always respond with ONLY valid JSON matching the exact schema requested. No markdown, no code fences, just raw JSON.
${NUT_FREE_PROMPT_RULE}`
}

function foodList(foods: FoodItem[]): string {
  return foods
    .map(f => `- ${f.emoji} ${f.name} (${f.category}, rated ${f.rating === 0 ? 'not rated yet' : `${f.rating}/5 stars`})`)
    .join('\n')
}

function snackPackPrompt(foods: FoodItem[], fairyName: string): string {
  return `Krysha has these favourite foods:
${foodList(foods)}

🚫 NUT-FREE: Krysha's school bans ALL nuts. Never include peanuts, peanut butter, almonds, cashews, walnuts, or any nut product in combos or gap suggestions.

A perfect school snack box for Krysha MUST include all 4 of these components:
1. 🍎 FRUIT — at least one fresh fruit (e.g. apple, grapes, mango, banana)
2. 💪 PROTEIN — something with protein (e.g. cheese, boiled egg, chicken strips, edamame, yogurt, hummus, seeds)
3. 🥑 HEALTHY FAT — a source of healthy fat (e.g. avocado, sunflower seeds, pumpkin seeds, cheese, olive-oil crackers)
4. 🫙 DIP — a dip or sauce (e.g. hummus, yogurt dip, guacamole, tzatziki, cream cheese) — NO peanut butter

Note: one food can cover multiple components (e.g. hummus = protein + healthy fat + dip; cheese = protein + healthy fat).

STEP 1 — GAP ANALYSIS: Check Krysha's foods and identify which of the 4 components are NOT covered by any food in her list. Be generous — if a food could reasonably cover a component, count it.

STEP 2 — COMBOS: Create 3 snack box combos using her foods. Each combo must satisfy all 4 components. If a component is missing from her list, substitute with a common Singapore-friendly item (note this in the items list).

Respond with ONLY this JSON (no markdown):
{
  "greeting": "A magical 1-2 sentence greeting from ${fairyName}",
  "gaps": [
    {
      "component": "dip",
      "message": "Short friendly message explaining Krysha has no dips yet (1 sentence)",
      "suggestions": [
        { "name": "Hummus", "emoji": "🫙", "category": "snack" },
        { "name": "Greek Yogurt Dip", "emoji": "🥛", "category": "dairy" }
      ]
    }
  ],
  "combos": [
    {
      "name": "Fun pack name",
      "items": ["🍎 Apple (fruit)", "🧀 Cheese (protein + healthy fat)", "🫙 Hummus (dip)"],
      "whyItsYummy": "Short fun sentence"
    }
  ],
  "closingNote": "A magical 1-sentence encouragement"
}

If there are NO gaps, "gaps" must be an empty array: [].
Each gap's "suggestions" must have 2–3 items, Singapore-friendly and kid-approved.`
}

function cookTogetherPrompt(foods: FoodItem[], fairyName: string): string {
  return `Krysha has these favourite foods:
${foodList(foods)}

Create 2–3 simple recipes a 5-year-old and daddy can make together using these foods.

Respond with ONLY this JSON (no markdown):
{
  "greeting": "A magical 1-2 sentence greeting from ${fairyName}",
  "recipes": [
    {
      "name": "Recipe name",
      "emoji": "single emoji",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "steps": ["Step 1 text", "Step 2 text"],
      "funFact": "A short magical fun fact about one ingredient"
    }
  ],
  "closingNote": "A magical 1-sentence encouragement for Krysha and daddy"
}`
}

function tryNewPrompt(foods: FoodItem[], fairyName: string): string {
  const existing = foods.map(f => f.name).join(', ') || 'none yet'
  return `Krysha already loves: ${existing}.

Suggest 3 new healthy foods Krysha might enjoy based on what she likes. They should be kid-friendly and available in most grocery stores.

Respond with ONLY this JSON (no markdown):
{
  "greeting": "A magical 1-2 sentence greeting from ${fairyName}",
  "newFoods": [
    {
      "name": "Food name",
      "emoji": "single emoji",
      "category": "fruit|veggie|protein|grain|dairy|snack",
      "whyTryIt": "Fun reason why Krysha might love this (1 sentence)",
      "tastes": "How it tastes e.g. sweet and a little tangy",
      "challenge": "A fun mini-dare for Krysha to try this food"
    }
  ],
  "closingNote": "A magical 1-sentence encouragement for Krysha to be adventurous"
}`
}

function suggestFavoritesPrompt(foods: FoodItem[], fairyName: string): string {
  const existing = foods.length > 0
    ? `Krysha already loves these foods (do NOT suggest any of these):\n${foodList(foods)}`
    : 'Krysha has not added any favourite foods yet.'

  return `${existing}

Krysha is a 5-year-old girl living in Singapore. Suggest exactly 20 healthy, kid-friendly foods that would be easy to find in Singapore supermarkets (FairPrice, Cold Storage, Giant) or hawker centres. Include a good mix of:
- Local Singapore favourites (e.g. dragon fruit, rambutan, kai lan, tau kwa, edamame, cincau)
- Common international foods available in Singapore
- Healthy snacks popular with Singapore kids

🚫 NUT-FREE SCHOOL RULE: Do NOT suggest peanuts, peanut butter, almonds, cashews, walnuts, or any nut product.

Make sure NONE of the suggestions are already in Krysha's existing list above.

Respond with ONLY this JSON (no markdown):
{
  "greeting": "A magical 1-2 sentence greeting from ${fairyName} about discovering yummy Singapore foods",
  "suggestions": [
    {
      "name": "Food name",
      "emoji": "single emoji",
      "category": "fruit|veggie|protein|grain|dairy|snack|other",
      "whySuggested": "One short fun sentence about why Krysha might love this"
    }
  ],
  "closingNote": "A magical 1-sentence encouragement to try new foods"
}`
}

function stripFences(text: string): string {
  return text
    .replace(/^```(?:json)?\n?/m, '')
    .replace(/\n?```$/m, '')
    .trim()
}

export async function POST(req: NextRequest) {
  let fairyName = 'Pixie'
  try {
    const body: RecommendRequest = await req.json()
    fairyName = body.fairyName || 'Pixie'
    const { type, foods } = body

    if (!type || !Array.isArray(foods)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    let userPrompt: string
    switch (type) {
      case 'snack-pack':        userPrompt = snackPackPrompt(foods, fairyName);        break
      case 'cook-together':     userPrompt = cookTogetherPrompt(foods, fairyName);     break
      case 'try-new':           userPrompt = tryNewPrompt(foods, fairyName);           break
      case 'suggest-favorites': userPrompt = suggestFavoritesPrompt(foods, fairyName); break
      default:
        return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
    }

    const message = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system:     buildSystem(fairyName),
      messages:   [{ role: 'user', content: userPrompt }],
    })

    const raw   = (message.content[0] as { type: string; text: string }).text
    const clean = stripFences(raw)
    const data  = JSON.parse(clean)

    return NextResponse.json(data)
  } catch (err) {
    console.error('Fairy error:', err)
    return NextResponse.json(
      {
        greeting:    `✨ Oops! ${fairyName} got her wings tangled! 🧚`,
        error:       true,
        closingNote: `Please try again in a moment! ${fairyName} is fixing her wand! 🪄`,
      },
      { status: 500 },
    )
  }
}
