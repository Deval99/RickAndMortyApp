import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface UsePressAnimationConfig {
  scaleValue?: number;
  shadowOpacityActive?: number;
  shadowOpacityInactive?: number;
}

export function usePressAnimation(config: UsePressAnimationConfig = {}) {
  const {
    scaleValue = 1.025,
    shadowOpacityActive = 0.22,
    shadowOpacityInactive = 0.1,
  } = config;

  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(shadowOpacityInactive);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
    elevation: shadowOpacity.value > shadowOpacityInactive ? 6 : 2,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(scaleValue, { damping: 15, stiffness: 100 });
    shadowOpacity.value = withTiming(shadowOpacityActive, { duration: 120 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    shadowOpacity.value = withTiming(shadowOpacityInactive, { duration: 200 });
  };

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
  };
}
