import type { Routine } from '../types'
import { RoutineItem } from './RoutineItem'

interface RoutineListProps {
  routines: Routine[]
  isCompletedToday: (id: string) => boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
}

// 등록된 루틴 전체 목록
export function RoutineList({
  routines,
  isCompletedToday,
  onToggle,
  onDelete,
  onRename,
}: RoutineListProps) {
  if (routines.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        아직 등록된 루틴이 없습니다. 위에서 루틴을 추가해보세요.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {routines.map((routine) => (
        <RoutineItem
          key={routine.id}
          routine={routine}
          completed={isCompletedToday(routine.id)}
          onToggle={() => onToggle(routine.id)}
          onDelete={() => onDelete(routine.id)}
          onRename={(title) => onRename(routine.id, title)}
        />
      ))}
    </ul>
  )
}
