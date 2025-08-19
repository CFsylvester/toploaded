import { relations } from 'drizzle-orm';
import { tenants } from './tenants';
import { users } from './users';
import { sets } from './sets';
import { cards } from './cards';
import { cardPrints } from './cardPrints';
import { gradedCards } from './gradedCards';
import { priceSnapshots } from './priceSnapshots';
import { inventoryItems } from './inventoryItems';
import { listings } from './listings';
import { orders } from './orders';
import { orderItems } from './orderItems';
import { cardVariants } from './cardVariants';
import { cardPrices } from './cardPrices';

export const tenantRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  sets: many(sets),
}));

export const setRelations = relations(sets, ({ many }) => ({
  cards: many(cards),
}));

export const cardRelations = relations(cards, ({ many }) => ({
  prints: many(cardPrints),
  variants: many(cardVariants),
}));

export const printRelations = relations(cardPrints, ({ many }) => ({
  graded: many(gradedCards),
  prices: many(priceSnapshots),
}));

export const inventoryRelations = relations(inventoryItems, ({ many }) => ({
  listings: many(listings),
}));

export const orderRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const variantRelations = relations(cardVariants, ({ many }) => ({
  prices: many(cardPrices),
  graded: many(gradedCards),
}));

export const gradedRelations = relations(gradedCards, ({ many }) => ({
  prices: many(cardPrices),
}));
