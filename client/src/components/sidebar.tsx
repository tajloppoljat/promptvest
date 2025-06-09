import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, Edit, Trash2, Menu } from "lucide-react";
import { useCollections, useDeleteCollection } from "@/hooks/use-collections";
import { usePrompts } from "@/hooks/use-prompts";
import { CreateCollectionModal } from "./create-collection-modal";
import { EditCollectionModal } from "./edit-collection-modal";
import { ThemeToggle } from "./theme-toggle";
import { useToast } from "@/hooks/use-toast";
import type { Collection } from "@shared/schema";

interface SidebarProps {
  selectedCollectionId: number | null;
  onSelectCollection: (id: number | null) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ selectedCollectionId, onSelectCollection, isOpen, onToggle }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  
  const { data: collections = [], isLoading } = useCollections();
  const { data: prompts = [] } = usePrompts(selectedCollectionId);
  const deleteCollection = useDeleteCollection();
  const { toast } = useToast();

  const filteredCollections = collections.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteCollection = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await deleteCollection.mutateAsync(id);
      if (selectedCollectionId === id) {
        onSelectCollection(null);
      }
      toast({
        title: "Collection deleted",
        description: "The collection has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete collection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCollection = (collection: Collection, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCollection(collection);
  };

  return (
    <>
      <div className={`w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } fixed lg:relative z-40 h-full`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">PromptCraft</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Collections List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredCollections.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? "No collections found" : "No collections yet"}
            </div>
          ) : (
            filteredCollections.map((collection) => {
              const collectionPrompts = collection.id === selectedCollectionId ? prompts : [];
              const isSelected = selectedCollectionId === collection.id;
              
              return (
                <Card
                  key={collection.id}
                  className={`m-2 p-4 cursor-pointer transition-all border-l-4 ${
                    isSelected 
                      ? 'bg-blue-50 border-l-green-600 shadow-sm' 
                      : 'border-l-transparent hover:bg-gray-50'
                  }`}
                  onClick={() => onSelectCollection(collection.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {collection.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {collectionPrompts.length} prompts
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleEditCollection(collection, e)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteCollection(collection.id, e)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                        disabled={deleteCollection.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <CreateCollectionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {editingCollection && (
        <EditCollectionModal
          collection={editingCollection}
          open={!!editingCollection}
          onOpenChange={(open) => !open && setEditingCollection(null)}
        />
      )}
    </>
  );
}
