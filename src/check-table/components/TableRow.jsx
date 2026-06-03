import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import Cell from './Cell.jsx'

export default function TableRow({
  row, columns, customTags, openCell,
  onOpenCell, onCloseCell, onToggleTag, onRemoveTag,
  onUpdatePassage, onDeleteRow, onAddCustomTag,
}) {
  const [hovered, setHovered] = useState(false)
  // 로컬 draft: IME 조합 중 리렌더로 한글 입력이 깨지는 것을 방지
  const [draft, setDraft] = useState(row.passage)

  // 외부 row.passage가 바뀔 때(다른 탭·Firestore 동기화)만 동기화
  useEffect(() => { setDraft(row.passage) }, [row.passage])

  function commitPassage() {
    if (draft !== row.passage) onUpdatePassage(row.id, draft)
  }

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
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitPassage}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commitPassage(); e.target.blur() } }}
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
