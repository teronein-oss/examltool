import { useState, useEffect, useCallback, useRef } from 'react'
import { BookOpen, ChevronDown, Loader2 } from 'lucide-react'
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import TableHeader from './components/TableHeader.jsx'
import TableRow from './components/TableRow.jsx'

// ─── Tag definitions ────────────────────────────────────────────────────────

export const OBJECTIVE_TAGS = [
  '주제', '제목', '요지', '감정', '어휘', '어법',
  '순서', '삽입', '요약', '무관한문장', '내용일치', '함의추론',
]
export const SUBJECTIVE_TAGS = [
  '서술형 어법', '서술형 조건영작', '서술형 요약문 빈칸',
  '서술형 내용정리', '서술형 주제문',
]

export function getTagStyle(tag, customTags) {
  if (SUBJECTIVE_TAGS.includes(tag)) return 'bg-violet-100 text-violet-700 border-violet-200'
  if (customTags.includes(tag))      return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  return 'bg-blue-100 text-blue-700 border-blue-200'
}

// ─── Schools ────────────────────────────────────────────────────────────────

const SCHOOLS = [
  { group: '동백고', grades: ['1학년', '2학년', '3학년'] },
  { group: '백현고', grades: ['1학년', '2학년', '3학년'] },
  { group: '초당고', grades: ['1학년', '2학년', '3학년'] },
  { group: '청덕고', grades: ['1학년', '2학년', '3학년'] },
]

function toPageId(group, grade) {
  return `${group}-${grade}`
}

function parsePageId(id) {
  const dash = id.lastIndexOf('-')
  return { group: id.slice(0, dash), grade: id.slice(dash + 1) }
}

// ─── Defaults ───────────────────────────────────────────────────────────────

const DEFAULT_COLUMNS = ['1차', '2차', '3차']
const DEFAULT_ROW_COUNT = 25

function makeRows(n) {
  return Array.from({ length: n }, () => ({
    id: crypto.randomUUID(),
    passage: '',
    cells: {},
  }))
}

function padRowsTo25(rows) {
  if (rows.length >= DEFAULT_ROW_COUNT) return rows
  return [...rows, ...makeRows(DEFAULT_ROW_COUNT - rows.length)]
}

const DEFAULT_PAGE_DATA = () => ({
  columns: DEFAULT_COLUMNS,
  rows: makeRows(DEFAULT_ROW_COUNT),
  customTags: [],
})

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState(
    () => localStorage.getItem('ct_lastPage') ?? toPageId('동백고', '1학년')
  )
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [openCell, setOpenCell] = useState(null)
  const [writeError, setWriteError] = useState(null)
  const tableRef = useRef(null)

  // ── Firestore subscription ────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    setOpenCell(null)
    setWriteError(null)

    const ref = doc(db, 'pages', currentPage)
    const unsub = onSnapshot(ref, async (snap) => {
      try {
        if (snap.exists()) {
          const data = snap.data()
          // Always ensure at least 25 rows
          const paddedRows = padRowsTo25(data.rows ?? [])
          if (paddedRows.length > (data.rows ?? []).length) {
            await updateDoc(ref, { rows: paddedRows })
            // onSnapshot will fire again with the updated data
            return
          }
          setPageData(data)
        } else {
          const defaults = DEFAULT_PAGE_DATA()
          await setDoc(ref, defaults)
          setPageData(defaults)
        }
      } catch (err) {
        console.error('Firestore error:', err)
        setWriteError(err.code ?? err.message)
      }
      setLoading(false)
    }, (err) => {
      console.error('Firestore listener error:', err)
      setWriteError(err.code ?? err.message)
      setLoading(false)
    })

    return unsub
  }, [currentPage])

  // Remember last selected page
  useEffect(() => {
    localStorage.setItem('ct_lastPage', currentPage)
  }, [currentPage])

  // Close dropdown on outside click
  useEffect(() => {
    if (!openCell) return
    function handler(e) {
      if (tableRef.current && !tableRef.current.contains(e.target)) setOpenCell(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openCell])

  // ── Firestore write helper ────────────────────────────────────────────────
  const saveField = useCallback(async (field, value) => {
    setWriteError(null)
    try {
      await updateDoc(doc(db, 'pages', currentPage), { [field]: value })
    } catch (err) {
      console.error('Firestore write error:', err)
      setWriteError(err.code ?? err.message)
    }
  }, [currentPage])

  // ── Row handlers ──────────────────────────────────────────────────────────
  const addRow = useCallback(() => {
    const newRows = [...(pageData?.rows ?? []), { id: crypto.randomUUID(), passage: '', cells: {} }]
    saveField('rows', newRows)
  }, [pageData, saveField])

  const deleteRow = useCallback((rowId) => {
    const newRows = (pageData?.rows ?? []).filter(r => r.id !== rowId)
    saveField('rows', newRows)
  }, [pageData, saveField])

  const updatePassage = useCallback((rowId, value) => {
    const newRows = (pageData?.rows ?? []).map(r => r.id === rowId ? { ...r, passage: value } : r)
    saveField('rows', newRows)
  }, [pageData, saveField])

  // ── Column handlers ───────────────────────────────────────────────────────
  const addColumn = useCallback((name) => {
    const cols = pageData?.columns ?? []
    if (!name.trim() || cols.includes(name.trim())) return
    saveField('columns', [...cols, name.trim()])
  }, [pageData, saveField])

  const deleteColumn = useCallback((col) => {
    const newCols = (pageData?.columns ?? []).filter(c => c !== col)
    const newRows = (pageData?.rows ?? []).map(r => {
      const cells = { ...r.cells }
      delete cells[col]
      return { ...r, cells }
    })
    updateDoc(doc(db, 'pages', currentPage), { columns: newCols, rows: newRows })
      .catch(err => { console.error(err); setWriteError(err.code ?? err.message) })
  }, [pageData, currentPage])

  // ── Tag handlers ──────────────────────────────────────────────────────────
  const toggleTag = useCallback((rowId, col, tag) => {
    const newRows = (pageData?.rows ?? []).map(r => {
      if (r.id !== rowId) return r
      const current = r.cells[col] ?? []
      const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
      return { ...r, cells: { ...r.cells, [col]: next } }
    })
    saveField('rows', newRows)
  }, [pageData, saveField])

  const removeTag = useCallback((rowId, col, tag) => {
    const newRows = (pageData?.rows ?? []).map(r => {
      if (r.id !== rowId) return r
      return { ...r, cells: { ...r.cells, [col]: (r.cells[col] ?? []).filter(t => t !== tag) } }
    })
    saveField('rows', newRows)
  }, [pageData, saveField])

  const addCustomTag = useCallback((tag) => {
    const trimmed = tag.trim()
    const existing = pageData?.customTags ?? []
    if (!trimmed || OBJECTIVE_TAGS.includes(trimmed) || SUBJECTIVE_TAGS.includes(trimmed) || existing.includes(trimmed)) return
    saveField('customTags', [...existing, trimmed])
  }, [pageData, saveField])

  const handleOpenCell  = useCallback((rowId, col) => {
    setOpenCell(prev => (prev?.rowId === rowId && prev?.col === col) ? null : { rowId, col })
  }, [])
  const handleCloseCell = useCallback(() => setOpenCell(null), [])

  // ── Derived ───────────────────────────────────────────────────────────────
  const { group, grade } = parsePageId(currentPage)
  const columns    = pageData?.columns    ?? DEFAULT_COLUMNS
  const rows       = pageData?.rows       ?? []
  const customTags = pageData?.customTags ?? []

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 shadow-lg">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">시험 유형 트래커</h1>
              <p className="text-slate-400 text-xs">지문별 · 회차별 문제 유형 기록</p>
            </div>
          </div>

          {/* School / Grade selector */}
          <div className="relative">
            <select
              value={currentPage}
              onChange={e => setCurrentPage(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-600 text-white text-sm rounded-lg px-4 py-2 pr-9 cursor-pointer hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {SCHOOLS.map(({ group, grades }) => (
                <optgroup key={group} label={group}>
                  {grades.map(grade => {
                    const id = toPageId(group, grade)
                    return (
                      <option key={id} value={id}>{group} {grade}</option>
                    )
                  })}
                </optgroup>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
        </div>
      </header>

      {/* Table container */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Page label */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">현재 페이지</span>
          <span className="text-sm font-bold text-slate-700">{group} {grade}</span>
          {loading && <Loader2 size={14} className="animate-spin text-blue-500" />}
        </div>

        {/* Error banner */}
        {writeError && (
          <div className="mb-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
            <span className="font-semibold">저장 실패:</span>
            <span>{writeError}</span>
            <span className="ml-auto text-xs text-red-500">Firebase Console → Firestore → 규칙 탭에서 pages 컬렉션 쓰기 허용 필요</span>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">데이터 불러오는 중...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto" ref={tableRef}>
                <table className="w-full border-collapse text-sm">
                  <TableHeader
                    columns={columns}
                    onAddColumn={addColumn}
                    onDeleteColumn={deleteColumn}
                  />
                  <tbody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.id}
                        row={row}
                        columns={columns}
                        customTags={customTags}
                        openCell={openCell}
                        onOpenCell={handleOpenCell}
                        onCloseCell={handleCloseCell}
                        onToggleTag={toggleTag}
                        onRemoveTag={removeTag}
                        onUpdatePassage={updatePassage}
                        onDeleteRow={deleteRow}
                        onAddCustomTag={addCustomTag}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={addRow}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors text-sm border-t border-gray-200"
              >
                <span className="text-base leading-none">+</span>
                새로 만들기
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
