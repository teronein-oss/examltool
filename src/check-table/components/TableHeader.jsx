import { useState, useRef, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'

export default function TableHeader({ columns, onAddColumn, onDeleteColumn }) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (adding) inputRef.current?.focus()
  }, [adding])

  function commit() {
    if (newName.trim()) onAddColumn(newName.trim())
    setNewName('')
    setAdding(false)
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') { setNewName(''); setAdding(false) }
  }

  return (
    <thead>
      <tr className="bg-slate-100 border-b border-gray-200">
        {/* Passage column */}
        <th className="text-left px-3 py-2.5 font-semibold text-slate-600 text-xs uppercase tracking-wide border-r border-gray-200 w-32 sticky left-0 bg-slate-100 z-10 whitespace-nowrap">
          지문 번호
        </th>

        {/* Round columns */}
        {columns.map((col) => (
          <th
            key={col}
            className="text-left px-3 py-2.5 font-semibold text-slate-600 text-xs uppercase tracking-wide border-r border-gray-200 min-w-[180px] group"
          >
            <div className="flex items-center justify-between gap-1">
              <span>{col}</span>
              <button
                onClick={() => onDeleteColumn(col)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 rounded p-0.5"
                title={`"${col}" 열 삭제`}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </th>
        ))}

        {/* Add column */}
        <th className="px-2 py-2.5 w-10">
          {adding ? (
            <input
              ref={inputRef}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={commit}
              placeholder="회차명..."
              className="w-24 text-xs border border-blue-400 rounded px-1.5 py-0.5 outline-none bg-white text-slate-700"
            />
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1 text-slate-400 hover:text-blue-600 text-xs font-normal transition-colors whitespace-nowrap"
              title="열 추가"
            >
              <Plus size={13} />
              열 추가
            </button>
          )}
        </th>
      </tr>
    </thead>
  )
}
