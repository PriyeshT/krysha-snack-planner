'use client'

import { useRef, useState } from 'react'
import { BackupFile, exportBackup, restoreBackup, validateBackup } from '@/lib/storage'

interface Props {
  onRestored: () => void
}

export default function BackupPanel({ onRestored }: Props) {
  const fileInputRef              = useRef<HTMLInputElement>(null)
  const [pending, setPending]     = useState<BackupFile | null>(null)
  const [error,   setError]       = useState<string | null>(null)
  const [success, setSuccess]     = useState<string | null>(null)

  function handleExport() {
    exportBackup()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    setSuccess(null)
    setPending(null)
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const raw    = JSON.parse(reader.result as string)
        const result = validateBackup(raw)
        if (!result.ok) { setError(result.error); return }
        setPending(result.data)
      } catch {
        setError("Couldn't read the file — make sure it's a Krysha backup JSON.")
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function confirmRestore() {
    if (!pending) return
    restoreBackup(pending)
    const count = pending.foods.length
    const name  = pending.fairyName
    setPending(null)
    setSuccess(`Restored ${count} food${count !== 1 ? 's' : ''} and fairy name "${name}" ✨`)
    onRestored()
  }

  return (
    <div className="card-magic bg-white border-castle-purple-light p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">💾</span>
        <h2 className="font-magic text-lg text-castle-purple">Backup & Restore</h2>
      </div>
      <p className="font-body text-sm text-castle-purple/70">
        Save your kingdom to a file, or restore it on a new device.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-bold text-sm
            bg-castle-purple-pale text-castle-purple border-2 border-castle-purple-light
            min-h-[44px] hover:bg-castle-purple hover:text-white transition-all duration-150"
        >
          ⬇️ Backup my foods
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-bold text-sm
            bg-white text-castle-purple border-2 border-castle-purple-light
            min-h-[44px] hover:bg-castle-purple-pale transition-all duration-150"
        >
          ⬆️ Restore from backup
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <p className="font-body text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
          ⚠️ {error}
        </p>
      )}

      {success && (
        <p className="font-body text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-xl">
          ✅ {success}
        </p>
      )}

      {pending && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 space-y-2">
          <p className="font-body text-sm font-bold text-amber-800">
            Replace your current kingdom with this backup?
          </p>
          <p className="font-body text-sm text-amber-700">
            {pending.foods.length} food{pending.foods.length !== 1 ? 's' : ''} · fairy name &ldquo;{pending.fairyName}&rdquo; · saved on{' '}
            {new Date(pending.exportedAt).toLocaleDateString()}
          </p>
          <p className="font-body text-xs text-amber-600">
            This will overwrite all your current foods and fairy name.
          </p>
          <div className="flex gap-2">
            <button
              onClick={confirmRestore}
              className="px-4 py-2 rounded-xl font-body font-bold text-sm bg-amber-500 text-white
                min-h-[44px] hover:bg-amber-600 transition-all duration-150"
            >
              Yes, restore
            </button>
            <button
              onClick={() => setPending(null)}
              className="px-4 py-2 rounded-xl font-body font-bold text-sm bg-white text-amber-700
                border-2 border-amber-200 min-h-[44px] hover:bg-amber-50 transition-all duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
