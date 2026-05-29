import { useCallback, useState } from 'react';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewProps,
} from 'react-native';
import { useAnimatedStyle, useSharedValue, interpolate, Extrapolation } from 'react-native-reanimated';

export function useCollapsibleControls() {
  const [areControlsTouchable, setAreControlsTouchable] = useState(true);
  const scrollY = useSharedValue(0);
  const controlsHeightSV = useSharedValue(0);
  const [controlsHeight, setControlsHeight] = useState(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = Math.max(event.nativeEvent.contentOffset.y, 0);
      const height = controlsHeightSV.value;
      const shouldEnableControls = height === 0 || offsetY < height;

      scrollY.value = offsetY;
      setAreControlsTouchable(current =>
        current === shouldEnableControls ? current : shouldEnableControls,
      );
    },
    [scrollY, controlsHeightSV],
  );

  const handleControlsLayout = useCallback((event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    controlsHeightSV.value = nextHeight;
    setControlsHeight(current =>
      nextHeight !== current ? nextHeight : current,
    );
  }, [controlsHeightSV]);

  const controlsAnimatedStyle = useAnimatedStyle(() => {
    const height = controlsHeightSV.value;
    if (height === 0) {
      return {};
    }
    return {
      opacity: interpolate(
        scrollY.value,
        [0, height * 0.85, height],
        [1, 0.2, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, height],
            [0, -height],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

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
