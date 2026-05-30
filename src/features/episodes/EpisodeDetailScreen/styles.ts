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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  episodeBadge: {
    backgroundColor: ACCENT + '18',
    borderWidth: 1.5,
    borderColor: ACCENT,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  episodeCode: {
    fontSize: 13,
    fontWeight: '700',
    color: ACCENT,
  },
  metaInfo: {
    flex: 1,
    gap: 2,
  },
  metaName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  metaDate: {
    fontSize: 13,
    color: '#888',
  },
  castLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
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
