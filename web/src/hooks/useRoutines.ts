import { useCallback, useMemo } from 'react'
import type { Completion, Routine } from '../types'
import { useLocalStorage } from './useLocalStorage'
import { useToday } from './useToday'

const ROUTINES_KEY = 'routine-app:routines'
const COMPLETIONS_KEY = 'routine-app:completions'

// 루틴 목록과 날짜별 완료 기록을 함께 관리하는 훅
export function useRoutines() {
  const [routines, setRoutines] = useLocalStorage<Routine[]>(ROUTINES_KEY, [])
  const [completions, setCompletions] = useLocalStorage<Completion[]>(
    COMPLETIONS_KEY,
    [],
  )
  const today = useToday()

  const addRoutine = useCallback(
    (title: string, category?: string) => {
      const newRoutine: Routine = {
        id: crypto.randomUUID(),
        title: title.trim(),
        category: category?.trim() || undefined,
        createdAt: new Date().toISOString(),
      }
      setRoutines((prev) => [...prev, newRoutine])
    },
    [setRoutines],
  )

  const updateRoutineTitle = useCallback(
    (id: string, title: string) => {
      setRoutines((prev) =>
        prev.map((r) => (r.id === id ? { ...r, title: title.trim() } : r)),
      )
    },
    [setRoutines],
  )

  const deleteRoutine = useCallback(
    (id: string) => {
      setRoutines((prev) => prev.filter((r) => r.id !== id))
      // 삭제된 루틴에 딸린 완료 기록도 함께 정리한다
      setCompletions((prev) => prev.filter((c) => c.routineId !== id))
    },
    [setRoutines, setCompletions],
  )

  const isCompletedToday = useCallback(
    (routineId: string) =>
      completions.some((c) => c.routineId === routineId && c.date === today),
    [completions, today],
  )

  const toggleToday = useCallback(
    (routineId: string) => {
      setCompletions((prev) => {
        const exists = prev.some(
          (c) => c.routineId === routineId && c.date === today,
        )
        if (exists) {
          // 과거 기록은 남기고, 오늘 기록만 취소한다
          return prev.filter(
            (c) => !(c.routineId === routineId && c.date === today),
          )
        }
        return [...prev, { routineId, date: today }]
      })
    },
    [setCompletions, today],
  )

  const todayCompletedCount = useMemo(
    () => routines.filter((r) => isCompletedToday(r.id)).length,
    [routines, isCompletedToday],
  )

  return {
    routines,
    addRoutine,
    updateRoutineTitle,
    deleteRoutine,
    isCompletedToday,
    toggleToday,
    todayCompletedCount,
    totalCount: routines.length,
  }
}
