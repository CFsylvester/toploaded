import { s3Client } from '@/core/cloudflare/client';
import { R2_CONFIG } from '@/core/cloudflare/config';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

interface SpriteResult {
  spriteUrl: string | null;
  name: string | null;
}

const SPRITE_PREFIX = 'pokemon/sprites/';

export const getPokedexInfo = async (nationalPokedexNumber: number): Promise<SpriteResult> => {
  const paddedNationalPokedexNumber = nationalPokedexNumber.toString().padStart(4, '0');

  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_CONFIG.bucket,
      Prefix: `${SPRITE_PREFIX}${paddedNationalPokedexNumber}-`,
    });

    const response = await s3Client.send(command);
    const spriteKey = response.Contents?.[0]?.Key;

    if (!spriteKey) {
      throw new Error();
    } else {
      const spriteFileName = spriteKey.replace(SPRITE_PREFIX, '');
      const pokedexName = spriteFileName
        .replace(`${paddedNationalPokedexNumber}-`, '')
        .replace('.webp', '');

      // returns "0001-pokemonName.webp" always a 4 digit number

      console.log(`✓ Found sprite ${spriteFileName}`);

      return {
        spriteUrl: spriteFileName,
        name: pokedexName,
      };
    }
  } catch (error) {
    console.error('Pokedex Info not found for dex number -', paddedNationalPokedexNumber);
    return { spriteUrl: null, name: null };
  }
};
