import { ALL_FEATURES } from '@/cached-data/all-features';

export function getFeatureName(id: string) {
  return ALL_FEATURES.find((f) => f.id === id)?.name || 'UNKNOWN';
}
