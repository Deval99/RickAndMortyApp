import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Shimmer } from './Shimmer';
import styles from './skeletonStyles';

/** Single skeleton placeholder that mirrors the layout of {@link CharacterCard}. */
export function CharacterCardSkeleton() {
  return (
    <View style={styles.card}>
      <Shimmer width={100} height={102} borderRadius={0} />
      <View style={styles.info}>
        <Shimmer width="70%" height={16} />
        <Shimmer width={80} height={22} borderRadius={12} />
        <Shimmer width="50%" height={13} />
        <Shimmer width="80%" height={12} />
      </View>
    </View>
  );
}

/**
 * Renders `count` {@link CharacterCardSkeleton} placeholders stacked vertically.
 * @param count - Defaults to `6`.
 */
export function CharacterListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CharacterCardSkeleton key={i} />
      ))}
    </>
  );
}

/** Single skeleton placeholder that mirrors the layout of an episode list row. */
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

/**
 * Renders `count` {@link EpisodeRowSkeleton} placeholders stacked vertically.
 * @param count - Defaults to `8`.
 */
export function EpisodeListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <EpisodeRowSkeleton key={i} />
      ))}
    </>
  );
}

interface LocationCardSkeletonProps {
  /** Optional style overrides for the outer card container. */
  containerStyle?: ViewStyle;
}

/** Single skeleton placeholder that mirrors the layout of a location list card. */
export function LocationCardSkeleton({ containerStyle }: LocationCardSkeletonProps) {
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

/**
 * Renders `count` {@link LocationCardSkeleton} placeholders stacked vertically.
 * @param count - Defaults to `6`.
 */
export function LocationListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <LocationCardSkeleton key={i} />
      ))}
    </>
  );
}

/**
 * Grid of avatar-card skeleton placeholders used on episode and location
 * detail screens while the resident / cast list is loading.
 * @param count - Defaults to `9`.
 */
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
