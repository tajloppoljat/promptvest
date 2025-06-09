import { db } from "./db";
import { collections, prompts } from "@shared/schema";

export async function migrateInitialData() {
  try {
    // Check if data already exists
    const existingCollections = await db.select().from(collections);
    if (existingCollections.length > 0) {
      console.log("Data already exists, skipping migration");
      return;
    }

    // Create sample collections and prompts that would have been in memory
    const [researchCollection] = await db
      .insert(collections)
      .values({
        title: "Deep Research 2.0",
        description: "Advanced research prompts for comprehensive analysis"
      })
      .returning();

    const [writingCollection] = await db
      .insert(collections)
      .values({
        title: "Creative Writing",
        description: "Prompts for creative content generation"
      })
      .returning();

    // Add prompts to research collection
    await db.insert(prompts).values([
      {
        content: "If you had a hundred million dollars to invest in solving one global problem, what would it be and how would you approach it? Please provide a detailed analysis including potential challenges, measurable outcomes, and timeline.",
        collectionId: researchCollection.id,
        order: 0
      },
      {
        content: "It's all you your trying to find out about this topic. Research thoroughly and provide comprehensive insights with multiple perspectives, citing reliable sources and potential counterarguments.",
        collectionId: researchCollection.id,
        order: 1
      },
      {
        content: "Analyze this from three different expert perspectives: technical, business, and social impact. For each perspective, provide specific recommendations and potential risks.",
        collectionId: researchCollection.id,
        order: 2
      }
    ]);

    // Add prompts to writing collection
    await db.insert(prompts).values([
      {
        content: "Write a compelling story that begins with: 'The last thing I expected to find in my grandmother's attic was...' Make it engaging and emotionally resonant.",
        collectionId: writingCollection.id,
        order: 0
      },
      {
        content: "Create a detailed character profile for a protagonist who has an unusual hobby that becomes crucial to solving a major problem. Include backstory, motivations, and character arc.",
        collectionId: writingCollection.id,
        order: 1
      }
    ]);

    console.log("Initial data migration completed successfully");
  } catch (error) {
    console.error("Error during data migration:", error);
  }
}