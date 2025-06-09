import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCollectionSchema, insertPromptSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Collections routes
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  app.get("/api/collections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const collection = await storage.getCollection(id);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collection" });
    }
  });

  app.post("/api/collections", async (req, res) => {
    try {
      const validatedData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(validatedData);
      res.status(201).json(collection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create collection" });
    }
  });

  app.patch("/api/collections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertCollectionSchema.partial().parse(req.body);
      const collection = await storage.updateCollection(id, updates);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.json(collection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update collection" });
    }
  });

  app.delete("/api/collections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCollection(id);
      if (!deleted) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete collection" });
    }
  });

  // Prompts routes
  app.get("/api/collections/:collectionId/prompts", async (req, res) => {
    try {
      const collectionId = parseInt(req.params.collectionId);
      const prompts = await storage.getPromptsByCollection(collectionId);
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  app.post("/api/collections/:collectionId/prompts", async (req, res) => {
    try {
      const collectionId = parseInt(req.params.collectionId);
      const validatedData = insertPromptSchema.parse({
        ...req.body,
        collectionId,
      });
      const prompt = await storage.createPrompt(validatedData);
      res.status(201).json(prompt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create prompt" });
    }
  });

  app.patch("/api/prompts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertPromptSchema.partial().parse(req.body);
      const prompt = await storage.updatePrompt(id, updates);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update prompt" });
    }
  });

  app.delete("/api/prompts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log(`Attempting to delete prompt with ID: ${id}`);
      const deleted = await storage.deletePrompt(id);
      console.log(`Delete result: ${deleted}`);
      if (!deleted) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting prompt:", error);
      res.status(500).json({ message: "Failed to delete prompt" });
    }
  });

  app.patch("/api/collections/:collectionId/prompts/reorder", async (req, res) => {
    try {
      const collectionId = parseInt(req.params.collectionId);
      const { promptIds } = req.body;
      
      if (!Array.isArray(promptIds)) {
        return res.status(400).json({ message: "promptIds must be an array" });
      }
      
      await storage.reorderPrompts(collectionId, promptIds);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to reorder prompts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
