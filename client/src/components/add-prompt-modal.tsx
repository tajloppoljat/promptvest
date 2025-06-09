import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreatePrompt } from "@/hooks/use-prompts";
import { useToast } from "@/hooks/use-toast";

interface AddPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: number;
}

export function AddPromptModal({ open, onOpenChange, collectionId }: AddPromptModalProps) {
  const [content, setContent] = useState("");
  
  const createPrompt = useCreatePrompt();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Prompt content is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPrompt.mutateAsync({
        collectionId,
        data: {
          content: content.trim(),
          order: 0, // Will be set to end by backend
        },
      });
      
      toast({
        title: "Prompt added",
        description: "Your new prompt has been added successfully.",
      });
      
      setContent("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setContent("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Prompt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Prompt Content</Label>
            <Textarea
              id="content"
              placeholder="Enter your prompt here..."
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none"
              required
            />
            <p className="text-xs text-gray-500">
              This prompt will be added to the current collection
            </p>
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
              disabled={createPrompt.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Add Prompt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
