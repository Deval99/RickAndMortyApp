import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface OfflineBannerProps {
  /** When `true` the banner slides in; when `false` it collapses away. */
  visible: boolean;
}

/**
 * A slim banner that animates open when the device goes offline and collapses
 * to zero height when connectivity is restored.
 *
 * Uses an animated height wrapper with `overflow: hidden` so the banner never
 * bleeds outside its container or takes up layout space when hidden.
 */
export function OfflineBanner({ visible }: OfflineBannerProps) {
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: visible ? BANNER_HEIGHT : 0,
      duration: 250,
      useNativeDriver: false, // height animation requires JS driver
    }).start();
  }, [visible, animatedHeight]);

  return (
    <Animated.View style={[styles.wrapper, { height: animatedHeight }]}>
      <Text
        style={styles.text}
        accessibilityLiveRegion="polite"
        accessibilityLabel="You are offline."
      >
        You're offline
      </Text>
    </Animated.View>
  );
}

const BANNER_HEIGHT = 36;

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
