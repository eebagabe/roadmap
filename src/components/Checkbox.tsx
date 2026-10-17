type Props = { checked: boolean; onChange: () => void; label: string; size?: 'sm' | 'md' }

export function Checkbox({ checked, onChange, label, size = 'sm' }: Props) {
  const box = size === 'md' ? 'h-5 w-5 rounded-md' : 'h-4 w-4 rounded'
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      className={`grid shrink-0 place-items-center border transition ${box} ${
        checked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-white hover:border-gray-500'
      }`}
    >
      {checked && (
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 8.5l3.2 3L13 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}
