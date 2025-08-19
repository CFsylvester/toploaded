# Toploaded Schema Guide

This document explains how all the Supabase tables interconnect in the **Toploaded** trading card marketplace.

---

## 🗂️ High-Level Domains

- **Multi-tenancy**
  - `tenants`, `tenant_domains`, `users`, `roles`, `user_roles`
- **Cards & Variants**
  - `cards`, `card_variants`, `card_prints`, `graded_cards`
- **Pricing**
  - `card_prices`, `price_snapshots`
- **Inventory**
  - `inventory_items`, `barcodes`, `storage_locations`
- **Orders & Sales**
  - `orders`, `order_items`, `listings`, `payments`, `shipments`, `addresses`
- **System**
  - `audits`, `games`, `sets`

---

## 🔗 Relationships Overview

- A **tenant** owns cards, sets, users, inventory, and orders.
- A **set** belongs to a `game` and a `tenant`.
- A **card** belongs to a `set` and `tenant`.
- A **card_variant** and **card_print** extend a card (different printings, holofoil, languages).
- A **graded_card** ties to a specific `card_print` (graded slab).
- **Inventory items** may reference a `card_print` OR a `graded_card`.
- **Listings** sell inventory.
- **Orders** contain many `order_items`.
- **Payments** and **shipments** link back to orders.
- **Card prices** and **price snapshots** record market data per variant/graded print.

---

## 📊 Diagram

{ADD DIAGRAM OR MIRO BOARD HERE}

---

## ⚡ Workflow Example

1. **Tenant signs up** → gets `tenant` + `users` + optional `roles`.
2. **Tenant adds a set** (`sets`) for a `game`.
3. **Cards** are created under the set.
4. **Card Variants** (normal, holo, reverse) + **Card Prints** (different runs) expand the card.
5. If graded, a **graded_card** is created for a `card_print`.
6. **Inventory Items** track tenant stock → each item can be listed in `listings`.
7. A customer places an **order** → generates `order_items`.
8. **Payment** and **shipment** records are attached to the order.
9. Pricing feeds into `card_prices` (live market data) and `price_snapshots` (history).

---

## 🛠️ Notes for Devs

- **Multi-tenancy**: Everything ties back to `tenant_id`. Always scope queries by tenant.
- **Pricing**: Use `card_prices` for latest value, `price_snapshots` for history/graphs.
- **Inventory**: `inventory_items` unify raw prints + graded cards into one stock table.
- **Audits**: Track actions per tenant (who did what, when).
