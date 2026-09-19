import { useState } from 'react'
import type { Routine } from '../types'

interface RoutineItemProps {
  routine: Routine
  completed: boolean
  onToggle: () => void
  onDelete: () => void
  onRename: (title: string) => void
}

// 루틴 한 줄: 체크박스 + 제목/카테고리 + 수정/삭제 버튼
export function RoutineItem({
  routine,
  completed,
  onToggle,
  onDelete,
  onRename,
}: RoutineItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(routine.title)

  const commitRename = () => {
    if (draft.trim()) onRename(draft)
    setEditing(false)
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
        className="h-5 w-5 shrink-0 accent-slate-900"
        aria-label={`${routine.title} 오늘 완료 체크`}
      />

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') {
                setDraft(routine.title)
                setEditing(false)
              }
            }}
            className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
          />
        ) : (
          <div>
            <p
              className={
                completed ? 'truncate text-sm line-through text-slate-400' : 'truncate text-sm text-slate-900'
              }
            >
              {routine.title}
            </p>
            {routine.category && (
              <span className="text-xs text-slate-400">{routine.category}</span>
            )}
          </div>
        )}
      </div>

      {!editing && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-slate-500 hover:text-slate-900"
        >
          수정
        </button>
      )}
      <button
        type="button"
        onClick={onDelete}
        className="text-xs text-red-500 hover:text-red-700"
      >
        삭제
      </button>
    </li>
  )
}
