import { StyleSheet } from 'react-native';

const ACCENT = '#00b5cc';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  content: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#f7f8fa',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f7f8fa',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ACCENT + '18',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingBannerText: {
    fontSize: 13,
    color: ACCENT,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7f8fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  episodeBadge: {
    backgroundColor: ACCENT + '18',
    borderWidth: 1.5,
    borderColor: ACCENT,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  episodeCode: {
    fontSize: 12,
    fontWeight: '700',
    color: ACCENT,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  rowMeta: {
    fontSize: 12,
    color: '#888',
  },
  rowChevron: {
    width: 18,
    height: 18,
    tintColor: '#ccc',
    transform: [{ rotate: '180deg' }],
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
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
  retryBtn: {
    marginTop: 4,
  },
  retryText: {
    fontSize: 14,
    color: ACCENT,
    fontWeight: '600',
  },
});

export default styles;
