import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import images from '../../../assets/images';
import type { Episode } from '../../../types/episode';
import styles from './styles';

/**
 * Static header that displays the "Episodes" screen title.
 */
export function ScreenHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Episodes</Text>
    </View>
  );
}

interface EpisodeRowProps {
  /** The episode data to display. */
  episode: Episode;
  /** Called when the row is tapped. */
  onPress: () => void;
}

/**
 * A single tappable row in the episode section list.
 *
 * Shows the episode code badge (e.g. `S01E03`), the episode name, and its
 * air date, with a chevron on the right.
 */
export function EpisodeRow({ episode, onPress }: EpisodeRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${episode.episode} – ${episode.name}`}
    >
      <View style={styles.episodeBadge}>
        <Text style={styles.episodeCode}>{episode.episode}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>
          {episode.name}
        </Text>
        <Text style={styles.rowMeta}>{episode.air_date}</Text>
      </View>
      <Image source={images.icLeftArrow} style={styles.rowChevron} resizeMode="contain" />
    </TouchableOpacity>
  );
}
