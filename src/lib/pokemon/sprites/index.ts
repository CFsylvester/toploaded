import { syncPokemonSprites } from './sync';

const main = async () => {
  const forceAll = process.argv.includes('--all');

  try {
    await syncPokemonSprites(forceAll);
    console.log('Sprite sync completed successfully');
  } catch (error) {
    console.error('Sprite sync failed:', error);
    process.exit(1);
  }
};

main();
