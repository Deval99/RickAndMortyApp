import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import images from '../../../assets/images';
import styles from './styles';

// ─── Header ──────────────────────────────────────────────────────────────────

interface HeaderProps {
  title: string;
  onBack: () => void;
}

export function Header({ title, onBack }: HeaderProps) {
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
      <View style={styles.backBtn} />
    </View>
  );
}

// ─── InfoRow ─────────────────────────────────────────────────────────────────

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

// ─── LoadingSkeleton ─────────────────────────────────────────────────────────

export function LoadingSkeleton() {
  return (
    <View style={[styles.metaCard, { gap: 10 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#e0e0e0' }} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={{ width: '60%', height: 18, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
        </View>
      </View>
      <View style={{ width: '100%', height: 1, backgroundColor: '#f0f0f0' }} />
      {[1, 2].map(i => (
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '30%', height: 14, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
          <View style={{ width: '45%', height: 14, borderRadius: 4, backgroundColor: '#e0e0e0' }} />
        </View>
      ))}
    </View>
  );
}
