import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Edit, Trash2, GripVertical } from "lucide-react";
import { useDeletePrompt } from "@/hooks/use-prompts";
import { useToast } from "@/hooks/use-toast";
import { EditPromptModal } from "./edit-prompt-modal";
import type { Prompt } from "@shared/schema";

interface PromptCardProps {
  prompt: Prompt;
  index: number;
  onDragStart: (e: React.DragEvent, promptId: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetPromptId: number) => void;
}

export function PromptCard({ 
  prompt, 
  index, 
  onDragStart, 
  onDragEnd, 
  onDragOver, 
  onDrop 
}: PromptCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const deletePrompt = useDeletePrompt();
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deletePrompt.mutateAsync({ id: prompt.id, collectionId: prompt.collectionId });
      toast({
        title: "Prompt deleted",
        description: "The prompt has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card
        className="p-6 hover:shadow-md transition-shadow bg-white border border-gray-200"
        draggable
        onDragStart={(e) => onDragStart(e, prompt.id)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, prompt.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-gray-400 hover:text-green-600 p-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditModal(true)}
              className="text-gray-400 hover:text-blue-500 p-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deletePrompt.isPending}
              className="text-gray-400 hover:text-red-500 p-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="text-gray-300 hover:text-gray-500 cursor-move p-2">
              <GripVertical className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {prompt.content}
          </p>
        </div>
      </Card>

      <EditPromptModal
        prompt={prompt}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />
    </>
  );
}
