import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdatePrompt } from "@/hooks/use-prompts";
import { useToast } from "@/hooks/use-toast";
import type { Prompt } from "@shared/schema";

interface EditPromptModalProps {
  prompt: Prompt;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPromptModal({ prompt, open, onOpenChange }: EditPromptModalProps) {
  const [content, setContent] = useState("");
  
  const updatePrompt = useUpdatePrompt();
  const { toast } = useToast();

  useEffect(() => {
    if (prompt) {
      setContent(prompt.content);
    }
  }, [prompt]);

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
      await updatePrompt.mutateAsync({
        id: prompt.id,
        data: {
          content: content.trim(),
        },
      });
      
      toast({
        title: "Prompt updated",
        description: "Your prompt has been updated successfully.",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Prompt</DialogTitle>
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
              disabled={updatePrompt.isPending}
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
