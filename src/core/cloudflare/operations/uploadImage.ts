import fs from 'fs/promises';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../client';
import { R2_CONFIG } from '../config';
import { generateR2Url } from '../utils';

export interface UploadFileOptions {
  filePath: string;
  r2Key: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  url: string;
  key: string;
  size: number;
}

const createUploadCommand = (
  r2Key: string,
  fileBuffer: Buffer,
  contentType: string,
  metadata: Record<string, string>
) =>
  new PutObjectCommand({
    Bucket: R2_CONFIG.bucket,
    Key: r2Key,
    Body: fileBuffer,
    ContentType: contentType,
    Metadata: metadata,
    ACL: 'private',
  });

export const uploadFile = async ({
  filePath,
  r2Key,
  contentType = 'image/webp',
  metadata = {},
}: UploadFileOptions): Promise<UploadResult> => {
  try {
    const [fileBuffer, stats] = await Promise.all([fs.readFile(filePath), fs.stat(filePath)]);

    await s3Client.send(createUploadCommand(r2Key, fileBuffer, contentType, metadata));

    return {
      url: generateR2Url(r2Key),
      key: r2Key,
      size: stats.size,
    };
  } catch (error) {
    throw new Error(`Failed to upload file ${filePath}: ${(error as Error).message}`);
  }
};
