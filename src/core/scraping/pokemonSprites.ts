import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export interface SpriteData {
  name: string;
  originalUrl: string;
  optimizedUrl: string;
  dexNumber: string;
  filename: string;
}

const fetchDexNumber = async (pokemonName: string): Promise<string> => {
  try {
    const html = await fetch(`https://pokemondb.net/sprites/${pokemonName}`).then(r => r.text());
    const $ = cheerio.load(html);

    const dexNumberString = $('em').first().text();
    const dexNumber = dexNumberString.match(/#(\d+)/)?.[1];

    if (!dexNumber) {
      throw new Error(`Could not find dex number for ${pokemonName}`);
    }

    return dexNumber;
  } catch (error) {
    console.warn(`Failed to fetch dex number for ${pokemonName}:`, error);
    return '0000'; // Fallback for unknown Pokemon
  }
};

export const scrapeSpriteList = async (): Promise<SpriteData[]> => {
  const masterHtml = await fetch('https://pokemondb.net/sprites').then(r => r.text());
  const $$ = cheerio.load(masterHtml);

  const rawSprites = $$('div.infocard-list img.img-fixed')
    .map((_: any, el: any) => ({
      name: $$(el).attr('alt')?.toLowerCase() || '',
      url: $$(el).attr('src') || '',
    }))
    .get();

  return Promise.all(rawSprites.map(enrichSpriteData));
};

const enrichSpriteData = async (sprite: any): Promise<SpriteData> => {
  const optimizedUrl = sprite.url
    .replace('/scarlet-violet/icon/avif/', '/home/normal/')
    .replace('/scarlet-violet/icon/', '/home/normal/')
    .replace(/\.avif$/, '.png');

  const pokemonName =
    optimizedUrl
      .split('/')
      .pop()
      ?.replace(/\.png$/, '') || '';
  const dexNumber = await fetchDexNumber(pokemonName);

  return {
    name: sprite.name,
    originalUrl: sprite.url,
    optimizedUrl,
    dexNumber,
    filename: `${dexNumber.padStart(4, '0')}-${pokemonName}.webp`,
  };
};
