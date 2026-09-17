import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { CharacterView } from '../character/CharacterView';
import { useCharacter } from '../character/CharacterContext';
import { useRoutines } from '../hooks/useRoutines';
import { RoutineListScreen } from '../../components/routine/RoutineListScreen';

// 루틴 1개 완료 시 지급되는 경험치
const XP_PER_ROUTINE = 20;

export function HomeScreen() {
  const { routines, completeRoutine, setPhoto } = useRoutines();
  const { addXp } = useCharacter();

  const handleComplete = (routineId: string, photoUri?: string) => {
    completeRoutine(routineId, photoUri);
    // 루틴 완료를 캐릭터 XP/레벨업 로직과 연결
    addXp(XP_PER_ROUTINE);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greeting}>오늘도 루틴 화이팅! 🔥</Text>
      <CharacterView />
      <RoutineListScreen routines={routines} onComplete={handleComplete} onPhotoTaken={setPhoto} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A2A2A',
    textAlign: 'center',
    marginTop: 12,
  },
});
