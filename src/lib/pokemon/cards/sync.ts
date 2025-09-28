import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { db } from '@/db';
import { cards, pokemonCards, sets } from '@/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { processImage } from '@/core/cloudflare/operations/processImage';
import { randomUUID } from 'crypto';
import { getCardVariant, getPokedexInfo } from '@/lib/pokemon/cards/index';
import { normalizeSlug, toSearchableFormat } from '@/core/utils';

type Set = InferSelectModel<typeof sets>;

export const syncPokemonCards = async (databaseSet: Set): Promise<void> => {
  console.log(`Fetching cards for set ${databaseSet.name} from Pokemon API...`);

  // Fetch cards for specific set
  const externalCards = await PokemonTCG.findCardsByQueries({
    q: `set.id:${databaseSet.externalId}`,
  });

  if (externalCards.length === 0) {
    throw new Error(`No cards found for set id ${databaseSet.externalId}`);
  }

  console.log(`Processing ${externalCards.length} cards...`);

  for (const card of externalCards) {
    try {
      // Generate unique ID for this card
      const cardId = randomUUID();

      // Process and upload card art
      const cardArtUrl = card.images?.large
        ? await processImage({
            imageUrl: card.images.large,
            r2Path: `pokemon/cards/${databaseSet.externalId}/cardArt`,
            tempFilename: `${card.number.toString().padStart(3, '0')}`,
            quality: 80,
            maxWidth: 745,
            maxHeight: 1040,
          })
        : null;

      // Insert into base cards table
      const [baseCard] = await db
        .insert(cards)
        .values({
          id: cardId,
          gameId: 'pokemon',
          setId: databaseSet.id,
          slug: normalizeSlug(card.name),
          name: card.name,
          searchableName: toSearchableFormat(card.name),
          number: card.number,
          externalId: card.id,
          images: {
            cardArt: cardArtUrl || '',
          },
        })
        .onConflictDoNothing()
        .returning();

      if (baseCard) {
        // Get pokedex info if available
        const pokedexNumber = card.nationalPokedexNumbers?.[0];
        const pokedexInfo = pokedexNumber ? await getPokedexInfo(pokedexNumber) : null;

        // Insert into Pokemon-specific cards table
        await db
          .insert(pokemonCards)
          .values({
            id: baseCard.id,
            details: {
              type: card.types?.[0] || '',
              supertype: card.supertype || '',
              subtype: card.subtypes?.[0] || '',
              rarity: card.rarity || '',
              variant: getCardVariant(card),
            },
            ...(pokedexNumber && {
              pokedex: {
                number: pokedexNumber,
                name: pokedexInfo?.name || '',
                sprite: pokedexInfo?.spriteUrl || '',
              },
            }),
          })
          .onConflictDoNothing();

        console.log(`✓ Processed card: ${card.name} (${card.number})`);
      }
    } catch (error) {
      // Fails the entire process and exits with an error
      throw new Error(`Failed to process card ${card.name}: ${error}`);
    }
  }

  console.log(`✓ Synced ${externalCards.length} cards for set ${databaseSet.name}`);
};
