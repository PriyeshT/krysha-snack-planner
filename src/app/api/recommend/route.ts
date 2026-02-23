import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { RecommendRequest, FoodItem } from '@/lib/types'

const client = new Anthropic()

function buildSystem(fairyName: string): string {
  return `You are ${fairyName}, a magical snack fairy who lives in Krysha's Snack Kingdom! You help a 5-year-old girl named Krysha and her daddy plan healthy, yummy snacks. Use simple words, 1–3 emojis per sentence, celebrate every food choice. Always respond with ONLY valid JSON matching the exact schema requested. No markdown, no code fences, just raw JSON.`
}

function foodList(foods: FoodItem[]): string {
  return foods
    .map(f => `- ${f.emoji} ${f.name} (${f.category}, rated ${f.rating === 0 ? 'not rated yet' : `${f.rating}/5 stars`})`)
    .join('\n')
}

function snackPackPrompt(foods: FoodItem[], fairyName: string): string {
  return `Krysha has these favourite foods:
${foodList(foods)}

Create 3–5 fun school snack packs using combinations of these foods (or healthy additions). Each pack should be balanced and exciting.

Respond with ONLY this JSON (no markdown):
{
  "greeting": "A magical 1-2 sentence greeting from ${fairyName} celebrating Krysha's food choices",
  "combos": [
    {
      "name": "Fun pack name e.g. Rainbow Power Pack",
      "items": ["emoji + food name", "emoji + food name"],
      "whyItsYummy": "Short fun sentence about why this pack is amazing"
    }
  ],
  "closingNote": "A magical 1-sentence encouragement for Krysha"
}`
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
      case 'snack-pack':    userPrompt = snackPackPrompt(foods, fairyName);    break
      case 'cook-together': userPrompt = cookTogetherPrompt(foods, fairyName); break
      case 'try-new':       userPrompt = tryNewPrompt(foods, fairyName);       break
      default:
        return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
    }

    const message = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1024,
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
