import { StyleSheet } from 'react-native';

const ACCENT = '#00b5cc';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 15,
    color: '#D63D2E',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  offlineText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryText: {
    fontSize: 14,
    color: ACCENT,
    fontWeight: '600',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f7f8fa',
  },
  backBtn: {
    width: 36,
    alignItems: 'flex-start',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#1a1a2e',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  favBtn: {
    width: 36,
    alignItems: 'flex-end',
  },
  favIcon: {
    width: 26,
    height: 26,
    tintColor: '#ccc',
  },
  favIconActive: {
    tintColor: '#E53935',
  },

  // Scroll content
  scrollContent: {
    paddingBottom: 32,
  },

  // Avatar
  avatar: {
    width: '100%',
    height: 320,
    backgroundColor: '#e0e0e0',
  },

  // Name row
  nameRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ACCENT,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  // Episodes
  episodeList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  episodeChip: {
    backgroundColor: ACCENT + '18',
    borderWidth: 1.5,
    borderColor: ACCENT,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  episodeText: {
    fontSize: 13,
    color: ACCENT,
    fontWeight: '700',
  },
});

export default styles;
