import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import Cell from './Cell.jsx'

export default function TableRow({
  row, columns, customTags, openCell,
  onOpenCell, onCloseCell, onToggleTag, onRemoveTag,
  onUpdatePassage, onDeleteRow, onAddCustomTag,
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      className="border-b border-gray-100 transition-colors duration-75 hover:bg-slate-50 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Passage input */}
      <td className="px-3 py-1.5 border-r border-gray-100 sticky left-0 bg-white group-hover:bg-slate-50 z-10 transition-colors w-32">
        <div className="flex items-center gap-1">
          <input
            value={row.passage}
            onChange={e => onUpdatePassage(row.id, e.target.value)}
            placeholder="예: 3-1"
            className="w-full text-sm text-slate-700 bg-transparent outline-none placeholder-slate-300 min-w-0"
          />
          {hovered && (
            <button
              onClick={() => onDeleteRow(row.id)}
              className="shrink-0 text-slate-300 hover:text-red-400 transition-colors rounded p-0.5"
              title="행 삭제"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </td>

      {/* Tag cells */}
      {columns.map((col) => {
        const isOpen = openCell?.rowId === row.id && openCell?.col === col
        return (
          <td key={col} className="border-r border-gray-100 relative">
            <Cell
              tags={row.cells[col] ?? []}
              customTags={customTags}
              isOpen={isOpen}
              onOpen={() => onOpenCell(row.id, col)}
              onToggleTag={(tag) => onToggleTag(row.id, col, tag)}
              onRemoveTag={(tag) => onRemoveTag(row.id, col, tag)}
              onAddCustomTag={onAddCustomTag}
              onClose={onCloseCell}
            />
          </td>
        )
      })}

      <td />
    </tr>
  )
}
