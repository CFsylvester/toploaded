export { createReadlineInterface, askQuestion } from './cli';

export const normalizeSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens

export const toSearchableFormat = (name: string) =>
  name
    .replace(/'s\b/g, 's') // Replace 's with just 's' (removes apostrophe, keeps 's')
    .replace(/'/g, '-') // Replace remaining apostrophes with single dash
    .replace(/\./g, '_') // Replace dots with underscores
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/-/g, '-') // Keep single dashes as single dashes
    .toLowerCase();

export const fromSearchableFormat = (searchableFormat: string) =>
  searchableFormat
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/-/g, "'") // Replace dashes with apostrophes (best guess)
    .split(' ')
    .map(
      word =>
        // Capitalize first letter of each word
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');
