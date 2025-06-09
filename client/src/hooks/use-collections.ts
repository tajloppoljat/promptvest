import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Collection, InsertCollection } from "@shared/schema";

export function useCollections() {
  return useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertCollection) => {
      const response = await apiRequest("POST", "/api/collections", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCollection> }) => {
      const response = await apiRequest("PATCH", `/api/collections/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/collections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
    },
  });
}
