import { StyleSheet } from 'react-native';

export const ACCENT = '#00b5cc';

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
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
    textAlign: 'center',
    marginHorizontal: 8,
  },

  // Meta card
  metaCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    gap: 10,
  },
  metaIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ACCENT + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaIcon: {
    width: 28,
    height: 28,
    tintColor: ACCENT,
  },
  metaTextBlock: {
    flex: 1,
  },
  metaName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#f0f0f0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 4,
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
    flex: 2,
    textAlign: 'right',
  },
  residentCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  residentCountLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },

  // Section header
  sectionHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ACCENT,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // No residents
  noResidents: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noResidentsText: {
    fontSize: 15,
    color: '#888',
  },

  // Grid
  gridContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 8,
    marginBottom: 8,
  },

  // Error / retry
  emptyText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 15,
    color: '#D63D2E',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryText: {
    fontSize: 14,
    color: ACCENT,
    fontWeight: '600',
  },
});

export default styles;
