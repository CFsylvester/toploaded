import { eq } from 'drizzle-orm';
import { syncPokemonSets } from './sets';
import { syncPokemonCards } from './cards';
import { db } from '@/db';
import { sets } from '@/db/schema';

const findSetById = async (setId: string) =>
  await db.query.sets.findFirst({
    where: eq(sets.externalId, setId),
  });

const ensureSetExists = async (setId: string) => {
  let databaseSet = await findSetById(setId);

  if (!databaseSet) {
    await syncPokemonSets();
    databaseSet = await findSetById(setId);

    if (!databaseSet) {
      throw new Error(`Set ${setId} not found`);
    }
  }

  return databaseSet;
};

const main = async () => {
  const setId = process.argv[2];
  if (!setId) {
    console.error('❌ No set ID provided. Usage: yarn pokemon <set-id>');
    process.exit(1);
  }

  try {
    console.log(`⏳ Processing steps for Pokemon Set ${setId}...`);
    const databaseSet = await ensureSetExists(setId);
    console.log(`✓ Set ${setId} found in database`);
    await syncPokemonCards(databaseSet);
    console.log(`🎉 All steps completed successfully for Pokemon Set ${setId}!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Failed to process Pokemon Set ${setId}:`, error);
    process.exit(1);
  }
};

main();
