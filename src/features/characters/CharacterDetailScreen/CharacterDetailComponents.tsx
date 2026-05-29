import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import images from '../../../assets/images';
import styles from './styles';

// ─── Header ──────────────────────────────────────────────────────────────────

interface HeaderProps {
  onBack: () => void;
  title: string;
  isFavourite: boolean;
  onToggle: () => void;
}

/**
 * Navigation header for the character detail screen.
 *
 * Contains a back button on the left, the character name in the centre, and a
 * heart icon toggle on the right that reflects and controls the favourite state.
 */
export function Header({ onBack, title, isFavourite, onToggle }: HeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Image source={images.icLeftArrow} style={styles.backIcon} resizeMode="contain" />
      </TouchableOpacity>

      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>

      <TouchableOpacity
        onPress={onToggle}
        style={styles.favBtn}
        accessibilityRole="button"
        accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        accessibilityState={{ checked: isFavourite }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Image
          source={isFavourite ? images.icFavouriteFilled : images.icFavourite}
          style={[styles.favIcon, isFavourite && styles.favIconActive]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────

/**
 * Uppercase section title label used inside info cards.
 */
export function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────

/**
 * A single label/value row inside an info card.
 */
export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// ─── LoadingView ──────────────────────────────────────────────────────────────

/**
 * Skeleton placeholder layout shown while character data is loading.
 */
export function LoadingView() {
  return (
    <>
      <View style={[styles.avatar, { backgroundColor: '#e0e0e0' }]} />
      <View style={[styles.nameRow, { gap: 8 }]}>
        <View style={{ width: '60%', height: 26, borderRadius: 6, backgroundColor: '#e0e0e0' }} />
        <View style={{ width: 80, height: 22, borderRadius: 12, backgroundColor: '#e0e0e0' }} />
      </View>
      {[1, 2, 3].map(i => (
        <View key={i} style={[styles.card, { gap: 10 }]}>
          <View style={{ width: '40%', height: 13, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
          {[1, 2, 3].map(j => (
            <View key={j} style={{ width: '100%', height: 14, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
          ))}
        </View>
      ))}
    </>
  );
}

// ─── ErrorView ────────────────────────────────────────────────────────────────

interface ErrorViewProps {
  error: unknown;
  onRetry: () => void;
}

/**
 * Error state shown when the character fetch fails.
 */
export function ErrorView({ error, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>
        {(error as { message?: string })?.message ?? 'Failed to load character'}
      </Text>
      <TouchableOpacity onPress={onRetry} accessibilityRole="button">
        <Text style={styles.retryText}>Tap to retry</Text>
      </TouchableOpacity>
    </View>
  );
}
