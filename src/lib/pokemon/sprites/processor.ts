import { processImage } from '@/core/cloudflare/operations/processImage';
import { SpriteData } from '@/core/scraping/pokemonSprites';
import pLimit from 'p-limit';

export const processPokemonSprites = async (
  sprites: SpriteData[],
  concurrency = 8
): Promise<string[]> => {
  const limit = pLimit(concurrency);

  return Promise.all(
    sprites.map(sprite =>
      limit(async () => {
        try {
          return await processImage({
            imageUrl: sprite.optimizedUrl,
            r2Path: `pokemon/sprites`,
            tempFilename: sprite.filename,
            quality: 85,
          });
        } catch (error) {
          console.error(`Failed to process sprite ${sprite.name}:`, error);
          return null;
        }
      })
    )
  ).then(results => results.filter(Boolean) as string[]);
};
