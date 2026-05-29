import React, { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/**
 * Props for the {@link Shimmer} primitive.
 */
export interface ShimmerProps {
  /** Width of the shimmer block. Accepts a pixel number or a percentage string. */
  width: number | `${number}%`;
  /** Height of the shimmer block in pixels. */
  height: number;
  /** Border radius of the shimmer block. Defaults to `6`. */
  borderRadius?: number;
  /** Additional style overrides applied to the animated view. */
  style?: object;
}

/**
 * Animated grey rectangle that pulses between 40 % and 100 % opacity to
 * simulate a content-loading shimmer effect.
 *
 * This is an internal primitive — use the exported skeleton components instead.
 */
export function Shimmer({ width, height, borderRadius = 6, style }: ShimmerProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0.4, { duration: 700 }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(opacity);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#e0e0e0',
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
