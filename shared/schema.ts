import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
});

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  collectionId: integer("collection_id").notNull(),
  order: integer("order").notNull().default(0),
});

export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
});

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collections.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;
