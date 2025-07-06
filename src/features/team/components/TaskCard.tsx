type TaskProps = {
  task: {
    id: string;
    taskTitle: string;
    priority: string;
    progressDisplay: string;
    progress: number;
    dateDue: string;
    assignees: {
      fullName: string;
    }[];
  };
};

export const TaskCard = ({ task }: TaskProps) => {
  const getPriorityColorClass = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-600";
      case "MEDIUM":
        return "bg-blue-100 text-blue-600";
      case "LOW":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  const getColorClass = (priority: string): string => {
    switch (priority) {
      case "HIGH":
        return "bg-red-400";
      case "MEDIUM":
        return "bg-blue-400";
      case "LOW":
        return "bg-green-400";
      default:
        return "bg-gray-400";
    }
  };
  return (
    <div className="relative w-full rounded-lg border border-gray-100 bg-white p-4 text-sm shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <div
        className={`absolute top-0 left-0 h-full w-1 rounded-s ${getColorClass(task.priority)}`}
      />
      <div className="mb-1">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getPriorityColorClass(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">{task.taskTitle}</h3>
      </div>

      <div className="flex items-center gap-2 text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-gray-600"
        >
          <path
            fill-rule="evenodd"
            d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z"
            clip-rule="evenodd"
          />
        </svg>

        <span>Progress</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative h-2 w-full rounded bg-gray-200">
          <div
            className={`absolute top-0 left-0 h-2 rounded ${getColorClass(task.priority)}`}
            style={{ width: `${task.progress * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-600">{task.progressDisplay}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-gray-600"
        >
          <path
            fill-rule="evenodd"
            d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
            clip-rule="evenodd"
          />
        </svg>

        <span>{new Date(task.dateDue).toLocaleDateString()}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-4 h-4 text-gray-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>

        <span>{task.assignees?.[0]?.fullName || "Unassigned"}</span>
      </div>
    </div>
  );
};
