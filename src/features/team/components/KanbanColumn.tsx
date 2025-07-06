import { useState } from "react";
import { AddTaskInlineInput } from "./AddTaskInlineInput";
import { TaskCard } from "./TaskCard";
import type { TaskDto } from "../task";

type KanbanColumnProps = {
  column: {
    id: string;
    title: string;
    position: number;
    tasks: TaskDto[];
  };
};

export const KanbanColumn = ({ column }: KanbanColumnProps) => {
  const [tasks, setTasks] = useState(column.tasks); // 👈 giữ state riêng

  const handleAddTask = (newTask: TaskDto) => {
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div className="w-[230px] flex-shrink-0 rounded-xl bg-white p-4 shadow-lg border border-gray-200">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-black">{column.title}</h2>
        <p className="text-xs font-semibold text-gray-700">{tasks.length}</p>
      </div>

      <div className="pt-2 pb-2 mb-2">
        <AddTaskInlineInput columnId={column.id} onAddTask={handleAddTask} />
      </div>

      <div className="space-y-3 text-sm text-gray-800">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

// import { TaskCard } from "./TaskCard";
// import { BtnAddTask } from "./BtnAddTask";

// type KanbanColumnProps = {
//   column: {
//     id: string;
//     title: string;
//     position: number;
//     tasks: {
//       id: string;
//       taskTitle: string;
//       priority: string;
//       progressDisplay: string;
//       progress: number;
//       dateDue: string;
//       assignees: { fullName: string }[];
//     }[];
//   };
// };

// export const KanbanColumn = ({ column }: KanbanColumnProps) => {
//   return (
//     <div className="w-[230px] rounded-xl bg-white p-4 shadow-lg border border-gray-200">
//       <div className="mb-2 flex items-center justify-between">
//         <h2 className="text-sm font-bold text-black">{column.title}</h2>
//         <p className="text-xs font-semibold text-gray-700">
//           {column.tasks.length}
//         </p>
//       </div>

//       <div className="pt-2 pb-2 mb-2 flex justify-center">
//         <BtnAddTask />
//       </div>

//       <div className="space-y-3 text-sm text-gray-800">
//         {column.tasks.map((task) => (
//           <TaskCard key={task.id} task={task} />
//         ))}
//       </div>
//     </div>
//   );
// };
