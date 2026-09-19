import { useEffect, useState } from 'react'

// 로컬 기준 오늘 날짜를 "YYYY-MM-DD" 형태로 반환
function getTodayString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 앱을 계속 켜둔 상태로 자정이 지나도 오늘 날짜가 자동으로 갱신되도록
// 주기적으로 날짜를 확인하는 훅
export function useToday(): string {
  const [today, setToday] = useState(getTodayString)

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getTodayString()
      setToday((prev) => (prev === current ? prev : current))
    }, 30_000)

    return () => clearInterval(interval)
  }, [])

  return today
}
