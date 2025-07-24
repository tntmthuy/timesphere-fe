import { useAppSelector } from "../../../state/hooks";
import { Link } from "react-router-dom";

export const AssignedTaskList = () => {
  const tasks = useAppSelector((state) => state.kanban.assignedTasks);

  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">
        📋 Your Assigned Tasks
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.taskId}
            className="flex flex-col justify-between rounded border bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-2">
              <p className="font-medium text-slate-800">{task.title}</p>
              <p className="text-sm text-slate-500">Team: {task.teamName}</p>
            </div>
            <Link
              to={`/${task.teamUrl}`}
              className="mt-auto text-sm text-yellow-700 hover:underline"
            >
              View Team →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
