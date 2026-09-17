import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useCharacter } from './CharacterContext';

// TODO: 실제 일러스트 에셋으로 교체 (현재는 이모지 플레이스홀더)
const SPECIES_EMOJI = {
  capybara: '🦫',
  quokka: '🐿️',
} as const;

const SPECIES_LABEL = {
  capybara: '카피바라',
  quokka: '쿼카',
} as const;

export function CharacterView() {
  const { level, xp, xpPerLevel, species, bounceTrigger } = useCharacter();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (bounceTrigger === 0) return;
    // 루틴 완료로 XP를 얻을 때마다 캐릭터가 살짝 튀어오르는 리액션 애니메이션
    scale.value = withSequence(
      withTiming(1.25, { duration: 150, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 200, easing: Easing.inOut(Easing.quad) })
    );
  }, [bounceTrigger, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.avatar, animatedStyle]}>
        <Text style={styles.emoji}>{SPECIES_EMOJI[species]}</Text>
      </Animated.View>
      <Text style={styles.name}>{SPECIES_LABEL[species]}</Text>
      <Text style={styles.level}>Lv.{level}</Text>
      <View style={styles.xpBarBackground}>
        <View style={[styles.xpBarFill, { width: `${(xp / xpPerLevel) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFF3D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 48,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3A3A',
  },
  level: {
    fontSize: 13,
    color: '#8A8A8A',
    marginBottom: 6,
  },
  xpBarBackground: {
    width: 140,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EEE',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#FFB84C',
    borderRadius: 4,
  },
});
