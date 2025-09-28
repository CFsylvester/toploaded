import { eq } from 'drizzle-orm';
import { syncPokemonSets } from './sets';
import { syncPokemonCards } from './cards';
import { db } from '@/db';
import { sets } from '@/db/schema';
import { data } from 'node_modules/cheerio/dist/esm/api/attributes';

// type Step = {
//   name: string;
//   execute: (setId: string, stepNumber: number, totalSteps: number) => Promise<void>;
// };

// const STEPS: Step[] = [
//   { name: 'Sync Sets', execute: syncPokemonSets },
//   { name: 'Validate Set ID', execute: validateSetId },
//   { name: 'Sync Cards', execute: syncPokemonCards },
// ];

// export const processSteps = async (setId: string): Promise<void> => {
//   const totalSteps = STEPS.length;

//   for (let i = 0; i < totalSteps; i++) {
//     const step = STEPS[i];
//     const stepNumber = i + 1;

//     try {
//       await step.execute(setId, stepNumber, totalSteps);
//       console.log(`✅ Step ${stepNumber}/${totalSteps} - ${step.name} success!`);
//     } catch (error) {
//       console.error(`❌ Step ${stepNumber}/${totalSteps} - ${step.name} failed:`, error);
//       throw error;
//     }
//   }
// };

const main = async () => {
  const setId = process.argv[2];
  if (!setId) {
    console.error('❌ No set ID provided. Usage: yarn pokemon <set-id>');
    process.exit(1);
  }

  try {
    console.log(`⏳ Processing steps for Pokemon Set ${setId}...`);
    // Make sure sets are synced from the API
    await syncPokemonSets();
    // Validate the set ID exists in the database
    const databaseSet = await db.query.sets.findFirst({
      where: eq(sets.externalId, setId),
    });
    // Throw an error if the set is not found
    if (!databaseSet) {
      throw new Error(`Set ${setId} not found`);
    }
    // Sync the cards for the found set
    await syncPokemonCards(databaseSet);
    console.log(`🎉 All steps completed successfully for Pokemon Set ${setId}!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Failed to process Pokemon Set ${setId}:`, error);
    process.exit(1);
  }
};

main();
