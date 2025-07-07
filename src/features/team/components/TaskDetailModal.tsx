import { useRef, useState } from "react";
import { SubTaskList, type SubTaskListHandle } from "./SubTaskList";
import { DueDatePicker } from "./DateDuePicker";
import { PriorityDropdown } from "./PriorityDropdownList";
import { AssigneePicker } from "./AssigneePicker";
import { CommentSection } from "./CommentSection";

export const TaskDetailModal = ({ onClose }: { onClose: () => void }) => {
  const subTaskRef = useRef<SubTaskListHandle>(null);
  const [hasSubTasks, setHasSubTasks] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [subTasks, setSubTasks] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        {/* ❌ Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded text-gray-400 transition hover:bg-gray-100 hover:text-black"
        >
          <svg
            className="pointer-events-none h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 🧩 Layout chia 2 cột */}
        <div className="relative grid grid-cols-3 gap-6">
          {/* Đường chia cột */}
          <div className="absolute top-4 bottom-4 left-2/3 w-px rounded bg-gray-200" />

          {/* Cột trái */}
          <div className="col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Task Title</h3>

            {/* ✏️ Description */}
            <div>
              <p className="text-sm text-gray-700">No description yet.</p>
            </div>

            {/* 📌 Header Sub-tasks */}
            <div className="flex items-center justify-between">
              <div
                className="flex flex-grow cursor-pointer items-center gap-2 select-none"
                onClick={() => setIsCollapsed((prev) => !prev)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    isCollapsed ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.53 16.28a.75.75 
                    0 0 1-1.06 0l-7.5-7.5a.75.75 
                    0 0 1 1.06-1.06L12 
                    14.69l6.97-6.97a.75.75 
                    0 1 1 1.06 1.06l-7.5 7.5Z"
                  />
                </svg>
                <span className="text-[10px] uppercase font-semibold text-gray-700">Sub-tasks</span>
              </div>

              {/* ➕ Add ở đầu khi chưa có sub-task */}
              {!hasSubTasks && (
                <button
                  onClick={() => subTaskRef.current?.addAtTop()}
                  className="mt-1 ml-6 flex items-center gap-1 px-1 py-0.5 text-xs text-gray-500 transition hover:rounded hover:bg-yellow-50 hover:text-yellow-600"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2.25c-5.385 
                      0-9.75 4.365-9.75 
                      9.75s4.365 9.75 9.75 
                      9.75 9.75-4.365 
                      9.75-9.75S17.385 
                      2.25 12 2.25ZM12.75 9a.75.75 
                      0 0 0-1.5 0v2.25H9a.75.75 
                      0 0 0 0 1.5h2.25V15a.75.75 
                      0 0 0 1.5 0v-2.25H15a.75.75 
                      0 0 0 0-1.5h-2.25V9Z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* 📋 Danh sách Sub-tasks */}
            {!isCollapsed && (
              <SubTaskList
                ref={subTaskRef}
                subTasks={subTasks}
                onChange={(updated) => setSubTasks(updated)}
                onFirstItemCreated={() => setHasSubTasks(true)}
              />
            )}

            {/* 💬 Gần với Sub-tasks hơn */}
            <CommentSection />
          </div>

          {/* Cột phải */}
          <div className="col-span-1 mt-12 space-y-6">
            <DueDatePicker value={dueDate} onChange={setDueDate} />

            <div className="space-y-1">
              <div className="flex flex-col gap-2 uppercase">
                <PriorityDropdown />
              </div>
            </div>

            <AssigneePicker />
          </div>
        </div>
      </div>
    </div>
  );
};
