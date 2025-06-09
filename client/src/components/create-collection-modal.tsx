import { useState } from "react";
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
import { useCreateCollection } from "@/hooks/use-collections";
import { useToast } from "@/hooks/use-toast";

interface CreateCollectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCollectionModal({ open, onOpenChange }: CreateCollectionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const createCollection = useCreateCollection();
  const { toast } = useToast();

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
      await createCollection.mutateAsync({
        title: title.trim(),
        description: description.trim() || null,
      });
      
      toast({
        title: "Collection created",
        description: "Your new collection has been created successfully.",
      });
      
      setTitle("");
      setDescription("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
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
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCollection.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
