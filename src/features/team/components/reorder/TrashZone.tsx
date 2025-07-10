import { useDroppable } from "@dnd-kit/core";

export function TrashZone() {
  const { setNodeRef, isOver } = useDroppable({ id: "trash-zone" });

  return (
    <div
      ref={setNodeRef}
      className={`fixed bottom-6 right-6 h-16 w-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl transition-all ${
        isOver ? "scale-110 bg-red-700" : ""
      }`}
    >
      🗑️
    </div>
  );
}