import { collections, prompts, type Collection, type InsertCollection, type Prompt, type InsertPrompt } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private collections: Map<number, Collection>;
  private prompts: Map<number, Prompt>;
  private collectionIdCounter: number;
  private promptIdCounter: number;

  constructor() {
    this.collections = new Map();
    this.prompts = new Map();
    this.collectionIdCounter = 1;
    this.promptIdCounter = 1;
  }

  // Collections
  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async getCollection(id: number): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = this.collectionIdCounter++;
    const collection: Collection = { ...insertCollection, id };
    this.collections.set(id, collection);
    return collection;
  }

  async updateCollection(id: number, updates: Partial<InsertCollection>): Promise<Collection | undefined> {
    const existing = this.collections.get(id);
    if (!existing) return undefined;
    
    const updated: Collection = { ...existing, ...updates };
    this.collections.set(id, updated);
    return updated;
  }

  async deleteCollection(id: number): Promise<boolean> {
    // Also delete all prompts in this collection
    const promptsToDelete = Array.from(this.prompts.values())
      .filter(prompt => prompt.collectionId === id);
    
    promptsToDelete.forEach(prompt => this.prompts.delete(prompt.id));
    return this.collections.delete(id);
  }

  // Prompts
  async getPromptsByCollection(collectionId: number): Promise<Prompt[]> {
    return Array.from(this.prompts.values())
      .filter(prompt => prompt.collectionId === collectionId)
      .sort((a, b) => a.order - b.order);
  }

  async getPrompt(id: number): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = this.promptIdCounter++;
    // If no order specified, put at the end
    if (insertPrompt.order === 0) {
      const existingPrompts = await this.getPromptsByCollection(insertPrompt.collectionId);
      insertPrompt.order = existingPrompts.length;
    }
    
    const prompt: Prompt = { ...insertPrompt, id };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async updatePrompt(id: number, updates: Partial<InsertPrompt>): Promise<Prompt | undefined> {
    const existing = this.prompts.get(id);
    if (!existing) return undefined;
    
    const updated: Prompt = { ...existing, ...updates };
    this.prompts.set(id, updated);
    return updated;
  }

  async deletePrompt(id: number): Promise<boolean> {
    return this.prompts.delete(id);
  }

  async reorderPrompts(collectionId: number, promptIds: number[]): Promise<boolean> {
    const prompts = await this.getPromptsByCollection(collectionId);
    const promptMap = new Map(prompts.map(p => [p.id, p]));
    
    promptIds.forEach((promptId, index) => {
      const prompt = promptMap.get(promptId);
      if (prompt) {
        prompt.order = index;
        this.prompts.set(promptId, prompt);
      }
    });
    
    return true;
  }
}

export const storage = new MemStorage();
