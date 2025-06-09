import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Prompt, InsertPrompt } from "@shared/schema";

export function usePrompts(collectionId: number | null) {
  return useQuery<Prompt[]>({
    queryKey: ["/api/collections", collectionId, "prompts"],
    enabled: collectionId !== null,
    queryFn: async () => {
      if (collectionId === null) return [];
      const response = await fetch(`/api/collections/${collectionId}/prompts`);
      if (!response.ok) throw new Error("Failed to fetch prompts");
      return response.json();
    },
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ collectionId, data }: { collectionId: number; data: Omit<InsertPrompt, "collectionId"> }) => {
      const response = await apiRequest("POST", `/api/collections/${collectionId}/prompts`, data);
      return response.json();
    },
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections", collectionId, "prompts"] });
    },
  });
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPrompt> }) => {
      const response = await apiRequest("PATCH", `/api/prompts/${id}`, data);
      return response.json();
    },
    onSuccess: (prompt) => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections", prompt.collectionId, "prompts"] });
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, collectionId }: { id: number; collectionId: number }) => {
      await apiRequest("DELETE", `/api/prompts/${id}`);
    },
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections", collectionId, "prompts"] });
    },
  });
}

export function useReorderPrompts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ collectionId, promptIds }: { collectionId: number; promptIds: number[] }) => {
      await apiRequest("PATCH", `/api/collections/${collectionId}/prompts/reorder`, { promptIds });
    },
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections", collectionId, "prompts"] });
    },
  });
}
