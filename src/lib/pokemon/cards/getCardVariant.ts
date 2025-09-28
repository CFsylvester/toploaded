import type { PokemonApiCard } from '../types/card';

export const getCardVariant = (apiCard: PokemonApiCard): string[] => {
  if (!apiCard.tcgplayer?.prices) return ['normal'];

  const variants = Object.keys(apiCard.tcgplayer.prices);
  return variants;
};
