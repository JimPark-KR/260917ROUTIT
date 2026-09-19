import { RoutineForm } from './components/RoutineForm'
import { RoutineList } from './components/RoutineList'
import { useRoutines } from './hooks/useRoutines'

function App() {
  const {
    routines,
    addRoutine,
    updateRoutineTitle,
    deleteRoutine,
    isCompletedToday,
    toggleToday,
    todayCompletedCount,
    totalCount,
  } = useRoutines()

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">오늘의 루틴</h1>
        <p className="mt-1 text-sm text-slate-500">
          {totalCount > 0
            ? `오늘 ${todayCompletedCount}/${totalCount} 완료`
            : '매일 반복할 루틴을 등록해보세요'}
        </p>
      </header>

      <section className="mb-6">
        <RoutineForm onAdd={addRoutine} />
      </section>

      <section>
        <RoutineList
          routines={routines}
          isCompletedToday={isCompletedToday}
          onToggle={toggleToday}
          onDelete={deleteRoutine}
          onRename={updateRoutineTitle}
        />
      </section>
    </div>
  )
}

export default App
