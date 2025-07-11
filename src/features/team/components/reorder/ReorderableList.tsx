// // src/features/team/components/reorder/ReorderableList.tsx

import { useMemo } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type Props<T> = {
  items: T[];
  getId: (item: T) => string;
  strategy?: "vertical" | "horizontal";
  renderItem: (item: T) => React.ReactNode;
  columnId: string;
  className?: string;
  isDragging?: boolean;
};

export function ReorderableList<T>({
  items,
  getId,
  strategy = "vertical",
  renderItem,
  columnId,
  className = "",
  isDragging = false,
}: Props<T>) {
  const ids = useMemo(() => items.map(getId), [items, getId]);

  // ✅ Thêm columnId vào data của droppable để tracing chính xác
  const { setNodeRef } = useDroppable({
    id: columnId,
    data: { columnId },
  });

  const sortingStrategy =
    strategy === "horizontal"
      ? horizontalListSortingStrategy
      : verticalListSortingStrategy;

  return (
    <SortableContext id={columnId} items={ids} strategy={sortingStrategy}>
      <div ref={setNodeRef} className={`relative ${className}`} id={columnId}>
        {/* Column rỗng, khi đang kéo: hiển thị chỗ drop */}
        {ids.length === 0 && isDragging ? (
          <div className="flex h-12 items-center justify-center rounded bg-gray-100 text-sm text-gray-400">
           Can drop here
          </div>
        ) : (
          ids.map((id) => {
            const item = items.find((i) => getId(i) === id);
            if (!item) return null;

            return (
              <ReorderableItem key={id} id={id} columnId={columnId}>
                {renderItem(item)}
              </ReorderableItem>
            );
          })
        )}
      </div>
    </SortableContext>
  );
}

function ReorderableItem({
  id,
  columnId,
  children,
}: {
  id: string;
  columnId: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      columnId,
      type: "Task", // 👈 Đây rất quan trọng để xác định type khi drag
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 1 : "auto",
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {children}
    </div>
  );
}


// import { useDroppable } from "@dnd-kit/core";
// import {
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
//   horizontalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { useMemo } from "react";

// type ReorderableListProps<T> = {
//   items: T[];
//   getId: (item: T) => string;
//   strategy: "vertical" | "horizontal";
//   renderItem: (item: T) => React.ReactNode;
//   className?: string;
//   columnId: string;
//   isDragging?: boolean;
// };

// export function ReorderableList<T>({
//   items,
//   getId,
//   strategy,
//   renderItem,
//   className = "",
//   columnId,
//   isDragging,
// }: ReorderableListProps<T>) {
//   const ids = useMemo(() => items.map(getId), [items, getId]);
//   const { setNodeRef } = useDroppable({ id: columnId });

//   const sortingStrategy =
//     strategy === "horizontal"
//       ? horizontalListSortingStrategy
//       : verticalListSortingStrategy;

//   return (
//     <SortableContext id={columnId} items={ids} strategy={sortingStrategy}>
//       <div ref={setNodeRef} className={`relative ${className}`}>
//         {ids.length === 0 && isDragging ? (
//           <div className="flex h-10 w-full items-center justify-center rounded bg-gray-100 text-center text-xs text-gray-400">
//             Drop here
//           </div>
//         ) : (
//           ids.map((id) => {
//             const item = items.find((i) => getId(i) === id);
//             if (!item) return null;
//             return (
//               <ReorderableItem key={id} id={id} columnId={columnId}>
//                 {renderItem(item)}
//               </ReorderableItem>
//             );
//           })
//         )}
//       </div>
//     </SortableContext>
//   );
// }

// function ReorderableItem({
//   id,
//   columnId,
//   children,
// }: {
//   id: string;
//   columnId: string;
//   children: React.ReactNode;
// }) {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({
//       id,
//       data: {
//         columnId,
//         type: "Task",
//       },
//     });

//   const style: React.CSSProperties = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     position: "relative",
//     zIndex: transform ? 1 : "auto",
//     touchAction: "none",
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// }


