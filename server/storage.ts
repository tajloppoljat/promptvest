import { collections, prompts, type Collection, type InsertCollection, type Prompt, type InsertPrompt } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Collections
  getCollections(): Promise<Collection[]>;
  getCollection(id: number): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: number, collection: Partial<InsertCollection>): Promise<Collection | undefined>;
  deleteCollection(id: number): Promise<boolean>;

  // Prompts
  getPromptsByCollection(collectionId: number): Promise<Prompt[]>;
  getPrompt(id: number): Promise<Prompt | undefined>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: number, prompt: Partial<InsertPrompt>): Promise<Prompt | undefined>;
  deletePrompt(id: number): Promise<boolean>;
  reorderPrompts(collectionId: number, promptIds: number[]): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getCollections(): Promise<Collection[]> {
    return await db.select().from(collections);
  }

  async getCollection(id: number): Promise<Collection | undefined> {
    const [collection] = await db.select().from(collections).where(eq(collections.id, id));
    return collection || undefined;
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const [collection] = await db
      .insert(collections)
      .values(insertCollection)
      .returning();
    return collection;
  }

  async updateCollection(id: number, updates: Partial<InsertCollection>): Promise<Collection | undefined> {
    const [collection] = await db
      .update(collections)
      .set(updates)
      .where(eq(collections.id, id))
      .returning();
    return collection || undefined;
  }

  async deleteCollection(id: number): Promise<boolean> {
    // Delete all prompts in this collection first
    await db.delete(prompts).where(eq(prompts.collectionId, id));
    
    const result = await db.delete(collections).where(eq(collections.id, id));
    return result.rowCount > 0;
  }

  async getPromptsByCollection(collectionId: number): Promise<Prompt[]> {
    return await db
      .select()
      .from(prompts)
      .where(eq(prompts.collectionId, collectionId))
      .orderBy(prompts.order);
  }

  async getPrompt(id: number): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id));
    return prompt || undefined;
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    // If no order specified, put at the end
    if (insertPrompt.order === 0) {
      const existingPrompts = await this.getPromptsByCollection(insertPrompt.collectionId);
      insertPrompt.order = existingPrompts.length;
    }
    
    const [prompt] = await db
      .insert(prompts)
      .values(insertPrompt)
      .returning();
    return prompt;
  }

  async updatePrompt(id: number, updates: Partial<InsertPrompt>): Promise<Prompt | undefined> {
    const [prompt] = await db
      .update(prompts)
      .set(updates)
      .where(eq(prompts.id, id))
      .returning();
    return prompt || undefined;
  }

  async deletePrompt(id: number): Promise<boolean> {
    console.log(`Storage: Deleting prompt with ID: ${id}`);
    const result = await db.delete(prompts).where(eq(prompts.id, id));
    console.log(`Storage: Delete result rowCount: ${result.rowCount}`);
    return result.rowCount > 0;
  }

  async reorderPrompts(collectionId: number, promptIds: number[]): Promise<boolean> {
    try {
      // Update each prompt's order
      for (let i = 0; i < promptIds.length; i++) {
        await db
          .update(prompts)
          .set({ order: i })
          .where(eq(prompts.id, promptIds[i]));
      }
      return true;
    } catch (error) {
      console.error("Error reordering prompts:", error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
