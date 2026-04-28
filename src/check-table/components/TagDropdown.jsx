import { useState, useRef, useEffect } from 'react'
import { Check, Plus } from 'lucide-react'
import { OBJECTIVE_TAGS, SUBJECTIVE_TAGS, getTagStyle } from '../App.jsx'

function TagOption({ tag, selected, customTags, onToggle }) {
  const active = selected.includes(tag)
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(tag) }}
      className={`flex items-center gap-2 w-full px-3 py-1.5 text-left text-sm rounded-md transition-colors ${
        active ? 'bg-slate-100' : 'hover:bg-slate-50'
      }`}
    >
      <span className={`w-4 h-4 rounded flex items-center justify-center border ${
        active ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
      }`}>
        {active && <Check size={10} strokeWidth={3} />}
      </span>
      <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full border ${getTagStyle(tag, customTags)}`}>
        {tag}
      </span>
    </button>
  )
}

function SectionLabel({ label }) {
  return (
    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
      {label}
    </div>
  )
}

export default function TagDropdown({ selected, customTags, onToggle, onAddCustomTag, onClose }) {
  const [input, setInput] = useState('')
  const ref = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  function commitCustom() {
    if (input.trim()) { onAddCustomTag(input.trim()); setInput('') }
  }

  function onKeyDown(e) {
    e.stopPropagation()
    if (e.key === 'Enter') commitCustom()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      ref={ref}
      onClick={e => e.stopPropagation()}
      className="absolute left-0 top-full mt-1 z-50 w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-2 flex flex-col"
      style={{ maxHeight: '420px', overflowY: 'auto' }}
    >
      <SectionLabel label="객관식 / 일반" />
      {OBJECTIVE_TAGS.map(tag => (
        <TagOption key={tag} tag={tag} selected={selected} customTags={customTags} onToggle={onToggle} />
      ))}

      <div className="border-t border-gray-100 my-1.5" />
      <SectionLabel label="서술형" />
      {SUBJECTIVE_TAGS.map(tag => (
        <TagOption key={tag} tag={tag} selected={selected} customTags={customTags} onToggle={onToggle} />
      ))}

      {customTags.length > 0 && (
        <>
          <div className="border-t border-gray-100 my-1.5" />
          <SectionLabel label="커스텀" />
          {customTags.map(tag => (
            <TagOption key={tag} tag={tag} selected={selected} customTags={customTags} onToggle={onToggle} />
          ))}
        </>
      )}

      <div className="border-t border-gray-100 mt-1.5 pt-1.5 px-2">
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onClick={e => e.stopPropagation()}
            placeholder="새 태그 추가..."
            className="flex-1 text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-blue-400 bg-white text-slate-700 placeholder-slate-400"
          />
          <button
            onClick={e => { e.stopPropagation(); commitCustom() }}
            disabled={!input.trim()}
            className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
