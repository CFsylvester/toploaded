import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { db } from '@/db';
import { games, pokemonSets } from '@/db/schema';
import { processImage } from '@/core/cloudflare/operations/processImage';

export const syncSets = async () => {
  console.log('Fetching Pokemon sets from API...');

  // Fetch all sets from Pokemon TCG API
  const apiSets = await PokemonTCG.findSetsByQueries({});

  // Ensure Pokemon game exists
  await db.insert(games).values({ id: 'pokemon', name: 'Pokemon' }).onConflictDoNothing();

  // Insert/update sets
  for (const apiSet of apiSets) {
    // Process set images and upload to Cloudflare
    const logoUrl = apiSet.images?.logo
      ? await processImage({
          imageUrl: apiSet.images.logo,
          r2Path: `pokemon/${apiSet.id}`,
          tempFilename: `logo`,
          quality: 85,
        })
      : null;

    const symbolUrl = apiSet.images?.symbol
      ? await processImage({
          imageUrl: apiSet.images.symbol,
          r2Path: `pokemon/${apiSet.id}`,
          tempFilename: `symbol`,
          quality: 85,
        })
      : null;

    await db
      .insert(pokemonSets)
      .values({
        id: apiSet.id,
        gameId: 'pokemon',
        name: apiSet.name,
        series: apiSet.series,
        releaseDate: apiSet.releaseDate ? new Date(apiSet.releaseDate) : null,
        totalCards: apiSet.total,
        logoUrl,
        symbolUrl,
      })
      .onConflictDoNothing();
  }

  console.log(`Synced ${apiSets.length} Pokemon sets`);
};
