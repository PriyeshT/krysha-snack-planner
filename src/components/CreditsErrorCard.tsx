'use client'

export default function CreditsErrorCard({ fairyName }: { fairyName: string }) {
  return (
    <div className="card-magic bg-amber-50 border-amber-300 p-6 text-center space-y-3 animate-fadeInUp">
      <p className="text-5xl animate-float">🔋</p>
      <p className="font-magic text-2xl text-amber-700">
        {fairyName}&apos;s wand needs charging!
      </p>
      <p className="font-body text-amber-700">
        The magic ran out because the Anthropic API account has no credits left.
      </p>
      <a
        href="https://console.anthropic.com/settings/billing"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-2 bg-amber-500 hover:bg-amber-600 text-white font-body font-bold px-5 py-3 rounded-2xl transition-all hover:scale-105 min-h-[44px]"
      >
        💳 Add Credits for Daddy
      </a>
      <p className="font-body text-xs text-amber-600/70">
        Claude Haiku is very cheap — $5 will last a long time!
      </p>
    </div>
  )
}
