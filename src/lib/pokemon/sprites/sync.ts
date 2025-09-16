import { scrapeSpriteList, SpriteData } from '@/core/scraping/pokemonSprites';
import { processPokemonSprites } from './processor';
import { R2_CONFIG } from '@/core/cloudflare/config';

const filterExistingSprites = async (sprites: SpriteData[]): Promise<SpriteData[]> => {
  // Check which sprites already exist by attempting to fetch their R2 URLs
  const existingChecks = await Promise.all(
    sprites.map(async sprite => {
      try {
        // Generate the expected R2 URL
        const expectedUrl = `https://${R2_CONFIG.bucket}.${R2_CONFIG.endpoint}/pokemon/sprites/${sprite.filename}`;

        // Quick HEAD request to check if it exists
        const response = await fetch(expectedUrl, { method: 'HEAD' });

        return {
          sprite,
          exists: response.ok,
        };
      } catch {
        return {
          sprite,
          exists: false,
        };
      }
    })
  );

  const newSprites = existingChecks.filter(check => !check.exists).map(check => check.sprite);

  console.log(
    `Found ${newSprites.length} new sprites to process (${sprites.length - newSprites.length} already exist)`
  );

  return newSprites;
};

export const syncPokemonSprites = async (forceAll = false): Promise<void> => {
  console.log('Fetching sprite data from PokemonDB...');

  const sprites = await scrapeSpriteList();
  const spritesToProcess = forceAll ? sprites : await filterExistingSprites(sprites);

  console.log(`Processing ${spritesToProcess.length} sprites...`);

  const results = await processPokemonSprites(spritesToProcess);

  console.log(`Successfully processed ${results.length} sprites`);
};
