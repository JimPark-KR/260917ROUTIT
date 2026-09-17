# 스와이프 + 사진촬영 루틴 카드

루팃(Routit) 홈 화면의 루틴 완료 UI 컴포넌트 모음입니다.

## 동작 방식

- **사진 인증 모드(`mode: 'photo'`)**: 카드를 위로 스와이프 → 카메라 오픈 → 촬영 → 카드에 썸네일 표시 → 다시 위로 스와이프하면 완료 처리
- **간편 모드(`mode: 'simple'`)**: 카드를 위로 한 번 스와이프하면 바로 완료 처리

## 파일 구성

| 파일 | 역할 |
| --- | --- |
| `types.ts` | `Routine`, 각 컴포넌트 Props 타입 정의 |
| `RoutineCard.tsx` | 스와이프 제스처 + 완료/카메라 오픈 트리거를 가진 개별 카드. 스와이프 인정 거리는 `src/config/routineConfig.ts`의 `ROUTINE_SWIPE_THRESHOLD` 값으로 조절 (하위 호환을 위해 `SWIPE_THRESHOLD`로도 재노출) |
| `RoutineCameraScreen.tsx` | `expo-camera` 기반 전체화면 카메라 모달 (권한 요청 포함) |
| `RoutineListScreen.tsx` | 카드 목록 렌더링 + 카메라 모달 상태 관리. `routines`/`onComplete`/`onPhotoTaken`을 prop으로 받는 순수 프레젠테이션 컴포넌트 |

## 설치 (이미 이 프로젝트에는 적용되어 있음)

```bash
npx expo install react-native-gesture-handler react-native-reanimated expo-camera expo-haptics
```

`babel.config.js`의 `plugins` 배열에 `'react-native-reanimated/plugin'`이 **마지막 항목**으로 있어야 합니다.

앱 최상단(`App.tsx`)은 `GestureHandlerRootView`로 감싸야 합니다.

## 홈 화면 통합 방법

이 컴포넌트들은 자체 데이터를 갖지 않는 프레젠테이션 컴포넌트입니다. 실제 앱에서는 상위 화면에서
실데이터 소스(`src/hooks/useRoutines.ts`)로부터 받은 `routines`를 넘겨주고, 완료 콜백에서
캐릭터 XP 로직 등을 연결합니다.

```tsx
// src/screens/HomeScreen.tsx (요약)
const { routines, completeRoutine, setPhoto } = useRoutines();
const { addXp } = useCharacter();

const handleComplete = (routineId: string, photoUri?: string) => {
  completeRoutine(routineId, photoUri);
  addXp(XP_PER_ROUTINE); // 캐릭터 XP/레벨업 연결
};

<RoutineListScreen routines={routines} onComplete={handleComplete} onPhotoTaken={setPhoto} />
```

> 원래 데모용으로 쓰이던 `SAMPLE_ROUTINES` 하드코딩 배열은 제거되었고, 실제 데이터는
> `useRoutines()` 훅에서 관리합니다. Firestore/Storage 연동은 아직 TODO로 남겨두었습니다
> (해당 훅과 `RoutineCameraScreen.tsx` 내부의 `TODO` 주석 참고).

## 남은 작업 (TODO)

- [ ] 사진을 Firebase Storage에 업로드하고 다운로드 URL을 저장 (`RoutineCameraScreen.tsx`)
- [ ] 루틴 완료 기록을 Firestore에 저장 (`src/hooks/useRoutines.ts`)
- [ ] 루틴 CRUD(추가/수정/삭제) 화면 연동

## 설정값

`src/config/routineConfig.ts`에서 프로젝트 전역 설정값을 관리합니다.

| 값 | 설명 |
| --- | --- |
| `ROUTINE_SWIPE_THRESHOLD` | 위로 스와이프했다고 인정하는 최소 이동 거리(px, 음수 = 위쪽 방향) |
