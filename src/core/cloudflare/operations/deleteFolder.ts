// TO DO: Come up with a better name for this file
// Use with caution

import { ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../client';
import { R2_CONFIG } from '../config';
import { createReadlineInterface, askQuestion } from '@/core/utils';

// --- Delete Functions ---
const listAllObjects = async (bucket: string, prefix?: string): Promise<string[]> => {
  const objects: string[] = [];
  let continuationToken: string | undefined;

  try {
    do {
      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(command);

      if (response.Contents) {
        objects.push(...response.Contents.map(obj => obj.Key!).filter(Boolean));
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return objects;
  } catch (error) {
    throw new Error('Failed to list objects');
  }
};

const deleteObjects = async (bucket: string, keys: string[]): Promise<void> => {
  // R2 has a limit of 1000 objects per delete request
  const batchSize = 1000;
  let deletedCount = 0;

  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);

    const command = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: batch.map(key => ({ Key: key })),
        Quiet: false,
      },
    });

    const response = await s3Client.send(command);

    if (response.Deleted) {
      deletedCount += response.Deleted.length;
      console.log(
        `✅ Deleted batch ${Math.floor(i / batchSize) + 1}: ${response.Deleted.length} objects`
      );
    }

    if (response.Errors && response.Errors.length > 0) {
      throw new Error(`Errors during deletion: ${JSON.stringify(response.Errors)}`);
    }
  }

  console.log(`🎉 Successfully deleted ${deletedCount} objects total`);
};

const previewObjects = async (prefix?: string): Promise<string[]> => {
  console.log('🚀 Starting bucket cleanup...');
  console.log(`📦 Bucket: ${R2_CONFIG.bucket}`);
  console.log(`🔗 Endpoint: ${R2_CONFIG.endpoint}`);

  if (prefix) {
    console.log(`🎯 Target Path: ${prefix}`);
  }

  // List all objects
  console.log('📋 Listing objects in bucket...');
  const objects = await listAllObjects(R2_CONFIG.bucket, prefix);

  if (objects.length === 0) {
    throw new Error(prefix ? `No objects found in path: ${prefix}` : 'Bucket is already empty');
  }

  console.log(`📊 Found ${objects.length} objects to delete`);

  // Show a preview of what will be deleted
  console.log('\n📝 Preview of objects to delete:');
  objects.slice(0, 10).forEach(key => console.log(`  - ${key}`));
  if (objects.length > 10) {
    console.log(`  ... and ${objects.length - 10} more`);
  }

  // Confirm deletion
  const warningMessage = prefix
    ? `\n⚠️  WARNING: This will permanently delete ALL objects in the path "${prefix}"!`
    : '\n⚠️  WARNING: This will permanently delete ALL objects in the bucket!';
  console.log(warningMessage);

  return objects;
};

// --- CLI Support ---
const confirmDeletion = async (
  rl: ReturnType<typeof createReadlineInterface>,
  bucket: string,
  prefix?: string
): Promise<void> => {
  const target = prefix ? `path "${prefix}" in bucket ${bucket}` : `bucket ${bucket}`;

  const answer = await askQuestion(
    rl,
    `Are you sure you want to delete everything in the ${target}? (y/n) `
  );

  if (answer !== 'y') {
    throw new Error('Aborted script');
  }

  const deleteCommand = (await askQuestion(rl, `Type "DELETE ${prefix || bucket}" to confirm: `))
    .trim()
    .toLowerCase();

  const deleteString = `DELETE ${prefix || bucket}`.trim().toLowerCase();

  if (deleteCommand !== deleteString) {
    throw new Error('Aborted script');
  }
};

// --- Main Function ---
const main = async () => {
  // Run the deletion
  console.log('🗑️  Cloudflare R2 Bucket Cleanup Script');
  console.log('=====================================\n');

  const rl = createReadlineInterface();
  const bucket = R2_CONFIG.bucket;

  // Check for arguments
  const args = process.argv.slice(2);
  let prefix: string | undefined;

  if (args.includes('all')) {
    prefix = undefined; // Delete entire bucket
  } else if (args.length > 0) {
    prefix = args[0]; // Use first argument as path
  }

  try {
    // Confirm you want to delete the R2 bucket
    await confirmDeletion(rl, bucket, prefix);

    // Preview the objects that will be deleted
    const objects = await previewObjects(prefix);

    // Delete the objects
    await deleteObjects(bucket, objects);
  } catch (error) {
    console.error('\n❌ Deletion failed:', error instanceof Error ? error.message : error);
  } finally {
    // Close the readline interface
    rl.close();
    process.exit(1);
  }
};

main();
