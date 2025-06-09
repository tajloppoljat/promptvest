import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateCollection } from "@/hooks/use-collections";
import { useToast } from "@/hooks/use-toast";
import type { Collection } from "@shared/schema";

interface EditCollectionModalProps {
  collection: Collection;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCollectionModal({ collection, open, onOpenChange }: EditCollectionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const updateCollection = useUpdateCollection();
  const { toast } = useToast();

  useEffect(() => {
    if (collection) {
      setTitle(collection.title);
      setDescription(collection.description || "");
    }
  }, [collection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Collection name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateCollection.mutateAsync({
        id: collection.id,
        data: {
          title: title.trim(),
          description: description.trim() || null,
        },
      });
      
      toast({
        title: "Collection updated",
        description: "Your collection has been updated successfully.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update collection. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Collection Name</Label>
            <Input
              id="title"
              placeholder="e.g., Marketing Prompts"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this collection..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateCollection.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
