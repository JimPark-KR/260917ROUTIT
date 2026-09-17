// 스와이프 + 사진촬영 루틴 카드 관련 공통 타입 정의

// 루틴 인증 방식
// - photo: 스와이프로 카메라를 열어 사진을 찍은 뒤, 다시 스와이프하면 완료
// - simple: 스와이프 한 번으로 바로 완료되는 간편 인증
export type RoutineMode = 'photo' | 'simple';

export interface Routine {
  id: string;
  title: string;
  description?: string;
  mode: RoutineMode;
  completed: boolean;
  /** 사진 인증 모드에서 촬영된 이미지의 로컬 URI (촬영 전에는 undefined) */
  photoUri?: string;
}

export interface RoutineCardProps {
  routine: Routine;
  /** 카드가 완료 상태로 확정될 때 호출됨 */
  onComplete: (routineId: string, photoUri?: string) => void;
  /** 사진 인증 모드 카드를 처음 스와이프했을 때 카메라 화면을 열기 위해 호출됨 */
  onOpenCamera: (routineId: string) => void;
}

export interface RoutineCameraScreenProps {
  visible: boolean;
  onCapture: (photoUri: string) => void;
  onClose: () => void;
}

export interface RoutineListScreenProps {
  routines: Routine[];
  /** 루틴이 완료 처리될 때 호출 (상위에서 캐릭터 XP 등과 연결) */
  onComplete: (routineId: string, photoUri?: string) => void;
  /** 사진 촬영 직후(완료 전) 썸네일을 카드에 반영하기 위해 호출 */
  onPhotoTaken?: (routineId: string, photoUri: string) => void;
}
