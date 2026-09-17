import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { RoutineCard } from './RoutineCard';
import { RoutineCameraScreen } from './RoutineCameraScreen';
import { RoutineListScreenProps } from './types';

// 실제 앱에서는 이 컴포넌트가 routines 데이터를 직접 들고 있지 않고,
// 상위(HomeScreen)에서 useRoutines() 훅 등 실제 데이터 소스로부터 받은 값을 prop으로 전달받아 사용함
export function RoutineListScreen({ routines, onComplete, onPhotoTaken }: RoutineListScreenProps) {
  const [cameraRoutineId, setCameraRoutineId] = useState<string | null>(null);

  const handleOpenCamera = (routineId: string) => {
    setCameraRoutineId(routineId);
  };

  const handleCapture = (photoUri: string) => {
    if (cameraRoutineId) {
      onPhotoTaken?.(cameraRoutineId, photoUri);
    }
    setCameraRoutineId(null);
  };

  const pendingRoutines = routines.filter((routine) => !routine.completed);

  if (pendingRoutines.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>오늘의 루틴을 모두 완료했어요! 🎉</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pendingRoutines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoutineCard routine={item} onComplete={onComplete} onOpenCamera={handleOpenCamera} />
        )}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />
      <RoutineCameraScreen
        visible={!!cameraRoutineId}
        onCapture={handleCapture}
        onClose={() => setCameraRoutineId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 15,
    color: '#8A8A8A',
  },
});
