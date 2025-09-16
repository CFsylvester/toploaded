import { S3Client } from '@aws-sdk/client-s3';
import dns from 'dns';
import { R2_CONFIG } from './config';

dns.setDefaultResultOrder('ipv4first');

// --- S3 Client ---
export const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_CONFIG.endpoint,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
});
