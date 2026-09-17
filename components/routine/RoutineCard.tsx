import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { RoutineCardProps } from './types';

// 위로 스와이프했다고 인정하는 최소 이동 거리(px, 음수 = 위쪽 방향)
// TODO(선택): 프로젝트 설정값으로 분리해 화면 크기별로 조정 가능하게 만들 수 있음
export const SWIPE_THRESHOLD = -100;

export function RoutineCard({ routine, onComplete, onOpenCamera }: RoutineCardProps) {
  const translateY = useSharedValue(0);
  const hasPhoto = !!routine.photoUri;

  // 사진 촬영 후 카드가 다시 원위치로 자연스럽게 돌아오도록 photoUri 변경 시 리셋
  useEffect(() => {
    translateY.value = withSpring(0);
  }, [routine.photoUri, translateY]);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const handleSwipeUp = () => {
    if (routine.mode === 'photo' && !hasPhoto) {
      // 사진 인증 모드의 첫 스와이프: 카메라 오픈
      onOpenCamera(routine.id);
    } else {
      // 간편 모드의 스와이프, 또는 사진 인증 모드의 두 번째 스와이프: 완료 처리
      onComplete(routine.id, routine.photoUri);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // 위 방향 이동만 자연스럽게 반영하고, 아래 방향은 살짝만 허용
      translateY.value = Math.min(event.translationY, 20);
    })
    .onEnd((event) => {
      if (event.translationY < SWIPE_THRESHOLD) {
        runOnJS(triggerHaptic)();
        runOnJS(handleSwipeUp)();
      }
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>{routine.title}</Text>
          <Text style={styles.badge}>{routine.mode === 'photo' ? '📷 사진 인증' : '✅ 간편 인증'}</Text>
        </View>

        {!!routine.description && <Text style={styles.description}>{routine.description}</Text>}

        {routine.mode === 'photo' && hasPhoto && (
          <Image source={{ uri: routine.photoUri }} style={styles.thumbnail} />
        )}

        <Text style={styles.hint}>
          {routine.mode === 'photo'
            ? hasPhoto
              ? '위로 스와이프하면 완료돼요'
              : '위로 스와이프해서 사진을 찍어보세요'
            : '위로 스와이프하면 완료돼요'}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  badge: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  description: {
    fontSize: 13,
    color: '#6A6A6A',
    marginTop: 4,
  },
  thumbnail: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginTop: 12,
  },
  hint: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 12,
    textAlign: 'center',
  },
});
