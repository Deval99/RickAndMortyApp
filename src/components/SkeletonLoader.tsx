import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

// ─── Primitive shimmer block ──────────────────────────────────────────────────

interface ShimmerProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: object;
}

function Shimmer({ width, height, borderRadius = 6, style }: ShimmerProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#e0e0e0',
          opacity,
        },
        style,
      ]}
    />
  );
}

// ─── Character card skeleton ──────────────────────────────────────────────────

export function CharacterCardSkeleton() {
  return (
    <View style={styles.card}>
      {/* Avatar placeholder */}
      <Shimmer width={100} height={100} borderRadius={0} />
      {/* Text lines */}
      <View style={styles.info}>
        <Shimmer width="70%" height={16} />
        <Shimmer width={80} height={22} borderRadius={12} />
        <Shimmer width="50%" height={13} />
        <Shimmer width="80%" height={12} />
      </View>
    </View>
  );
}

/** Renders N character card skeletons */
export function CharacterListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CharacterCardSkeleton key={i} />
      ))}
    </>
  );
}

// ─── Episode row skeleton ─────────────────────────────────────────────────────

export function EpisodeRowSkeleton() {
  return (
    <View style={styles.episodeRow}>
      <Shimmer width={60} height={32} borderRadius={8} />
      <View style={styles.episodeInfo}>
        <Shimmer width="60%" height={15} />
        <Shimmer width="40%" height={12} />
      </View>
    </View>
  );
}

export function EpisodeListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <EpisodeRowSkeleton key={i} />
      ))}
    </>
  );
}

// ─── Location card skeleton ───────────────────────────────────────────────────

export function LocationCardSkeleton({ containerStyle }: {
  containerStyle?: ViewStyle
}) {
  return (
    <View style={[styles.locationCard, containerStyle]}>
      <View style={styles.locationTop}>
        <Shimmer width={44} height={44} borderRadius={22} />
        <View style={styles.locationInfo}>
          <Shimmer width="65%" height={16} />
          <Shimmer width="45%" height={13} />
          <Shimmer width="55%" height={12} />
        </View>
      </View>
      <View style={styles.locationBottom}>
        <Shimmer width={90} height={22} borderRadius={11} />
      </View>
    </View>
  );
}

export function LocationListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <LocationCardSkeleton key={i} />
      ))}
    </>
  );
}

// ─── Avatar grid skeleton (used in detail screens) ───────────────────────────

export function AvatarGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.avatarCard}>
          <Shimmer width="100%" height={80} borderRadius={8} />
          <Shimmer width="80%" height={11} style={{ marginTop: 4 }} />
        </View>
      ))}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Character card
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  info: {
    flex: 1,
    padding: 10,
    gap: 6,
    justifyContent: 'center',
  },

  // Episode row
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  episodeInfo: {
    flex: 1,
    gap: 6,
  },

  // Location card
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    gap: 10,
  },
  locationTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationInfo: {
    flex: 1,
    gap: 6,
  },
  locationBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  // Avatar grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    justifyContent: 'center'
  },
  avatarCard: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
});
