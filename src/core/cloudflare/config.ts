// --- Config ---
export const R2_CONFIG = {
  bucket: process.env.R2_BUCKET!,
  endpoint: process.env.R2_ENDPOINT!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
} as const;
