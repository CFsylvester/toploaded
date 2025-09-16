import { downloadImage, DownloadImageOptions } from './downloadImage';
import { uploadFile } from './uploadImage';
import { generateR2Key } from '../utils';

export interface ProcessImageOptions extends DownloadImageOptions {
  r2Path: string;
}

const createMetadata = (originalFormat: string, fileSize: number) => ({
  originalFormat,
  processedSize: fileSize.toString(),
});

export const processImage = async ({
  imageUrl,
  r2Path,
  tempFilename,
  quality,
  maxWidth,
  maxHeight,
}: ProcessImageOptions): Promise<string | null> => {
  let downloadResult;

  try {
    downloadResult = await downloadImage({
      imageUrl,
      tempFilename,
      quality,
      maxWidth,
      maxHeight,
    });

    const r2Key = generateR2Key(r2Path, tempFilename);
    const uploadResult = await uploadFile({
      filePath: downloadResult.tempPath,
      r2Key,
      metadata: createMetadata(downloadResult.originalFormat, downloadResult.fileSize),
    });

    console.log(`Uploaded image to ${uploadResult.url}`);
    return uploadResult.url;
  } catch (error) {
    console.error(`Failed to process image ${imageUrl}:`, error);
    return null;
  } finally {
    if (downloadResult) {
      await downloadResult.cleanup();
    }
  }
};
