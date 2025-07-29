// src\features\team\useSubtakSugesstion.ts
import { useState } from "react";
import type { SubTask } from "./subtask";

export type SuggestedSubtask = {
  id: string;
  title: string;
  isSelected: boolean;
};

export const useSubtaskSuggestion = (
  existingSubtasks: SubTask[],
  handleUpdate: (newList: SubTask[]) => void,
) => {
  const [suggestedSubtasks, setSuggestedSubtasks] = useState<SuggestedSubtask[]>([]);
  const [isSuggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);

  const toggleSuggestion = (id: string) => {
    setSuggestedSubtasks((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isSelected: !s.isSelected } : s
      )
    );
  };

  const handleAddSuggestions = () => {
    const selected = suggestedSubtasks.filter((s) => s.isSelected);

    const newSubTasks: SubTask[] = [
      ...existingSubtasks,
      ...selected.map((s, index) => ({
            id: crypto.randomUUID(),
            title: s.title,
            isComplete: false,
            subtaskPosition: existingSubtasks.length + index, 
            })),
    ];

    handleUpdate(newSubTasks);
    setSuggestedSubtasks([]);
    setSuggestionModalOpen(false);
  };

  return {
    suggestedSubtasks,
    isSuggestionModalOpen,
    isLoadingSuggestion,
    setSuggestedSubtasks,
    setSuggestionModalOpen,
    setIsLoadingSuggestion,
    toggleSuggestion,
    handleAddSuggestions,
  };
};