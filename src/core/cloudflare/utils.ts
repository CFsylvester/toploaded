import { R2_CONFIG } from './config';

// --- Helpers ---
export const generateR2Key = (type: string, name: string): string => {
  // If name already has .webp extension, don't add it again
  if (name.endsWith('.webp')) {
    return `${type}/${name}`;
  }
  return `${type}/${name}.webp`;
};

export const generateR2Url = (r2Key: string): string =>
  `https://${R2_CONFIG.bucket}.${R2_CONFIG.endpoint.replace(/^https:\/\//, '')}/${r2Key}`;
