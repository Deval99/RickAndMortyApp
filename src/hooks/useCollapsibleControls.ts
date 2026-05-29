import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
} from 'react-native';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewProps,
} from 'react-native';

export function useCollapsibleControls() {
  const [controlsHeight, setControlsHeight] = useState(0);
  const [areControlsTouchable, setAreControlsTouchable] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = Math.max(event.nativeEvent.contentOffset.y, 0);
      const shouldEnableControls = controlsHeight === 0 || offsetY < controlsHeight;

      scrollY.setValue(offsetY);
      setAreControlsTouchable(current =>
        current === shouldEnableControls ? current : shouldEnableControls,
      );
    },
    [controlsHeight, scrollY],
  );

  const handleControlsLayout = useCallback((event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;

    setControlsHeight(current =>
      nextHeight !== current ? nextHeight : current,
    );
  }, []);

  const controlsAnimatedStyle = useMemo(
    () =>
      controlsHeight > 0
        ? {
            opacity: scrollY.interpolate({
              inputRange: [0, controlsHeight * 0.85, controlsHeight],
              outputRange: [1, 0.2, 0],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, controlsHeight],
                  outputRange: [0, -controlsHeight],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }
        : undefined,
    [controlsHeight, scrollY],
  );

  const controlsPointerEvents: ViewProps['pointerEvents'] = areControlsTouchable
    ? 'auto'
    : 'none';

  return {
    controlsAnimatedStyle,
    controlsHeight,
    controlsPointerEvents,
    handleControlsLayout,
    handleScroll,
  };
}
