import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { db } from '@/db';
import { randomUUID } from 'crypto';
import { games, sets, pokemonSets } from '@/db/schema';
import { processImage } from '@/core/cloudflare/operations/processImage';
import { normalizeSlug, toSearchableFormat } from '@/core/utils';

export const syncPokemonSets = async () => {
  console.log('Fetching Pokemon sets from API...');

  // Fetch all sets from Pokemon TCG API
  const externalSets = await PokemonTCG.findSetsByQueries({});

  // Ensure Pokemon game exists
  await db.insert(games).values({ id: 'pokemon', name: 'Pokemon' }).onConflictDoNothing();

  // compare apiSets with sets in database
  const databaseSets = await db.query.sets.findMany();

  // Create a set of existing external IDs to filter out
  const existingExternalIds = new Set(databaseSets.map(set => set.externalId));
  const setsToSync = externalSets.filter(externalSet => !existingExternalIds.has(externalSet.id));

  // Insert/update sets
  for (const set of setsToSync) {
    try {
      // Generate unique ID for this set
      const r2Path = `pokemon/cards/${set.id}`;

      // Process set images and upload to Cloudflare
      const logoUrl = set.images?.logo
        ? await processImage({
            imageUrl: set.images.logo,
            r2Path: `${r2Path}`,
            tempFilename: `logo`,
            quality: 85,
          })
        : null;

      const symbolUrl = set.images?.symbol
        ? await processImage({
            imageUrl: set.images.symbol,
            r2Path: `${r2Path}`,
            tempFilename: `symbol`,
            quality: 85,
          })
        : null;

      const setId = randomUUID();

      // Insert into base sets table first
      const [baseSet] = await db
        .insert(sets)
        .values({
          id: setId,
          gameId: 'pokemon',
          externalId: set.id,
          name: set.name,
          searchableName: toSearchableFormat(set.name),
          slug: normalizeSlug(set.name),
          totalCards: set.total,
          releaseDate: set.releaseDate ? new Date(set.releaseDate) : null,
        })
        .onConflictDoNothing()
        .returning();

      if (baseSet) {
        // Insert into Pokemon-specific sets table
        await db
          .insert(pokemonSets)
          .values({
            id: setId,
            searchableSeries: toSearchableFormat(set.series),
            series: set.series,
            images: {
              logo: logoUrl,
              symbol: symbolUrl,
            },
          })
          .onConflictDoNothing();

        console.log(`✓ Inserted new set: ${set.name} (${set.id})`);
      }
    } catch (error) {
      // Fails the entire process and exits with an error
      throw new Error(`Failed to process set ${set.name} (${set.id}): ${error}`);
    }
  }
};
