import React, { useState } from "react";

type Task = {
  id: string;
  title: string;
};

type KanbanColumnProps = {
  title: string;
  initialTasks?: Task[];
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, initialTasks = [] }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), title: newTask }]);
    setNewTask("");
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg w-64">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>

      <div className="flex gap-2 mb-3">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 p-1 rounded border"
          placeholder="Thêm công việc..."
        />
        <button onClick={addTask} className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600">
          +
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-2 rounded shadow text-sm">
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
};