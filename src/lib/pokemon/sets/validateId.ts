import { db } from '@/db';
import { pokemonSets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { syncSets } from './sync';

export const validateSetId = async (setId: string): Promise<void> => {
  // Check if set exists in database
  const existingSet = await db.query.pokemonSets.findFirst({
    where: eq(pokemonSets.id, setId),
  });

  if (!existingSet) {
    console.log(`Set ${setId} not found, running sync...`);

    // Run the sync to fetch all sets from Pokemon API
    await syncSets();

    // Check again after sync
    const syncedSet = await db.query.pokemonSets.findFirst({
      where: eq(pokemonSets.id, setId),
    });

    if (!syncedSet) {
      throw new Error(`Set ID: ${setId} - NOT FOUND in Pokemon Sets Data`);
    }

    console.log(`Set ${setId} found after sync`);
  } else {
    console.log(`Set ${setId} found in database`);
  }
};
