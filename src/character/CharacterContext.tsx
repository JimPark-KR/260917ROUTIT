import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

// 레벨업에 필요한 경험치량
const XP_PER_LEVEL = 100;

export type CharacterSpecies = 'capybara' | 'quokka';

interface CharacterState {
  level: number;
  xp: number; // 현재 레벨 내에서의 경험치 (0 ~ XP_PER_LEVEL)
  bounceTrigger: number; // 값이 바뀔 때마다 캐릭터가 반응 애니메이션을 재생
}

interface CharacterContextValue extends CharacterState {
  species: CharacterSpecies;
  xpPerLevel: number;
  addXp: (amount: number) => void;
}

const CharacterContext = createContext<CharacterContextValue | null>(null);

// 레벨 3부터는 카피바라에서 쿼카로 "진화"
function speciesForLevel(level: number): CharacterSpecies {
  return level < 3 ? 'capybara' : 'quokka';
}

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CharacterState>({ level: 1, xp: 0, bounceTrigger: 0 });

  const addXp = useCallback((amount: number) => {
    setState((prev) => {
      let nextXp = prev.xp + amount;
      let nextLevel = prev.level;
      // 경험치가 기준치를 넘으면 레벨업 (한 번에 여러 레벨 상승도 지원)
      while (nextXp >= XP_PER_LEVEL) {
        nextXp -= XP_PER_LEVEL;
        nextLevel += 1;
      }
      return { level: nextLevel, xp: nextXp, bounceTrigger: prev.bounceTrigger + 1 };
    });
  }, []);

  const value = useMemo<CharacterContextValue>(
    () => ({
      ...state,
      species: speciesForLevel(state.level),
      xpPerLevel: XP_PER_LEVEL,
      addXp,
    }),
    [state, addXp]
  );

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) {
    throw new Error('useCharacter는 CharacterProvider 내부에서만 사용할 수 있습니다.');
  }
  return ctx;
}
