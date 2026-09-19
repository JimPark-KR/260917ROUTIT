import { useState } from 'react'

interface RoutineFormProps {
  onAdd: (title: string, category?: string) => void
}

// 새 루틴을 입력받는 폼
export function RoutineForm({ onAdd }: RoutineFormProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title, category)
    setTitle('')
    setCategory('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="루틴 제목 (예: 아침 스트레칭)"
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="카테고리 (선택)"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none sm:w-40"
      />
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        추가
      </button>
    </form>
  )
}
