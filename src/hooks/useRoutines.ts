import { useCallback, useState } from 'react';
import { Routine } from '../../components/routine/types';

// TODO: Firestore에서 사용자의 루틴 목록을 불러오도록 교체 (현재는 로컬 초기값 사용)
const INITIAL_ROUTINES: Routine[] = [
  { id: 'morning-stretch', title: '아침 스트레칭', description: '가볍게 5분만 몸을 풀어요', mode: 'simple', completed: false },
  { id: 'water-glass', title: '물 한 잔 마시기', description: '인증샷으로 남겨보세요', mode: 'photo', completed: false },
  { id: 'read-10min', title: '10분 독서', mode: 'simple', completed: false },
  { id: 'desk-cleanup', title: '책상 정리', description: '깨끗해진 책상을 사진으로 인증해요', mode: 'photo', completed: false },
];

// 홈 화면에서 사용하는 루틴 데이터 소스 훅.
// RoutineListScreen.tsx의 데모용 SAMPLE_ROUTINES를 대체하는 실제 데이터 소스 역할을 함
export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>(INITIAL_ROUTINES);

  // 사진 인증 모드에서 촬영 직후 썸네일만 먼저 반영 (아직 완료 처리는 아님)
  const setPhoto = useCallback((routineId: string, photoUri: string) => {
    setRoutines((prev) => prev.map((r) => (r.id === routineId ? { ...r, photoUri } : r)));
    // TODO: expo-file-system/Firebase Storage로 사진 업로드
  }, []);

  const completeRoutine = useCallback((routineId: string, photoUri?: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, completed: true, photoUri: photoUri ?? r.photoUri } : r))
    );
    // TODO: Firestore에 완료 기록 저장 (완료 시각, 사진 URL 등)
  }, []);

  return { routines, completeRoutine, setPhoto };
}
