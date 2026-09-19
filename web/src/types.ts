// 루틴 하나를 나타내는 타입
export interface Routine {
  id: string
  title: string
  category?: string
  createdAt: string
}

// 특정 루틴이 특정 날짜에 완료되었음을 나타내는 기록
// (routineId, date) 쌍이 존재하면 "완료"로 간주한다
export interface Completion {
  routineId: string
  date: string // YYYY-MM-DD
}
