'use client'

interface Props {
  active: boolean
  buddyEmoji: string
  phrase?: string
}

export default function BuddyMatchReaction({ active, buddyEmoji, phrase }: Props) {
  if (!active) return null

  return (
    <div className="flex items-end gap-1.5 animate-buddy-pop">
      <span className="text-2xl leading-none">{buddyEmoji}</span>
      {phrase && (
        <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-1.5 shadow-md text-xs font-black text-violet-700 max-w-[130px] border border-violet-100">
          {phrase}
        </div>
      )}
    </div>
  )
}
