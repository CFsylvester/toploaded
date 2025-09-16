import fs from 'fs/promises';
import sharp from 'sharp';

export interface DownloadImageOptions {
  imageUrl: string;
  tempFilename: string;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface DownloadResult {
  tempPath: string;
  originalFormat: string;
  fileSize: number;
  cleanup: () => Promise<void>;
}

const MAX_EFFORT = 6;

const createCleanup = (tempPath: string) => async () => {
  try {
    await fs.unlink(tempPath);
  } catch (error) {
    console.warn(`Failed to cleanup temp file ${tempPath}:`, error);
  }
};

const processImage = (buffer: ArrayBuffer, maxWidth?: number, maxHeight?: number, quality = 80) => {
  let sharpInstance = sharp(Buffer.from(buffer));

  if (maxWidth || maxHeight) {
    sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  return sharpInstance.webp({ quality, effort: MAX_EFFORT });
};

export const downloadImage = async ({
  imageUrl,
  tempFilename,
  quality = 85,
  maxWidth,
  maxHeight,
}: DownloadImageOptions): Promise<DownloadResult> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const filename = tempFilename || `download-${Date.now()}`;
    const tempPath = `/tmp/${filename}.webp`;

    // Get original format info
    const metadata = await sharp(Buffer.from(buffer)).metadata();
    const originalFormat = metadata.format || 'unknown';

    await processImage(buffer, maxWidth, maxHeight, quality).trim().toFile(tempPath);
    const stats = await fs.stat(tempPath);

    return {
      tempPath,
      originalFormat,
      fileSize: stats.size,
      cleanup: createCleanup(tempPath),
    };
  } catch (error) {
    throw new Error(
      `Failed to download and optimize image from ${imageUrl}: ${(error as Error).message}`
    );
  }
};
