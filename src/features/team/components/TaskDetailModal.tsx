//src\features\team\components\TaskDetailModal.tsx
import { useRef, useState } from "react";
import { SubTaskList, type SubTaskListHandle } from "./SubTaskList";
import { DueDatePicker } from "./DateDuePicker";
import { PriorityDropdown } from "./PriorityDropdownList";
import { AssigneePicker } from "./AssigneePicker";
import { CommentSection } from "./CommentSection";
import { EditableText } from "./EditableText";
import type { TaskDto, UpdateTaskRequest } from "../task";
import type { SubTask } from "../subtask";
import axios from "axios";
import toast from "react-hot-toast";

type TaskDetailModalProps = {
  task: TaskDto;
  token: string | null;
  onClose: () => void;
  onUpdated?: (updated: TaskDto) => void;
};

const formatDateLocal = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

export const TaskDetailModal = ({
  task,
  token,
  onClose,
  onUpdated,
}: TaskDetailModalProps) => {
  const subTaskRef = useRef<SubTaskListHandle>(null);
  const [hasSubTasks, setHasSubTasks] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [title, setTitle] = useState(task.taskTitle);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState(task.priority ?? null);
  const [subTasks, setSubTasks] = useState<SubTask[]>(task.subTasks ?? []);
  const [dueDate, setDueDate] = useState(
    task.dateDue ? new Date(task.dateDue) : null,
  );

  const performSave = async (updates: Partial<UpdateTaskRequest>) => {
    if (!token) {
      toast.error("Bạn chưa đăng nhập hoặc thiếu token.");
      return;
    }

    const payload: UpdateTaskRequest = {
      title: updates.title ?? title,
      description: updates.description ?? description,
      priority: updates.priority ?? priority,
      dateDue: updates.dateDue ?? (dueDate ? formatDateLocal(dueDate) : null),
      subTasks,
    };

    try {
      const res = await axios.patch(`/api/kanban/task/${task.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = res.data.data as TaskDto;
      toast.success("Task cập nhật thành công");
      onUpdated?.(updated);

      setTitle(updated.taskTitle);
      setDescription(updated.description ?? "");
      setDueDate(updated.dateDue ? new Date(updated.dateDue) : null);
      setPriority(updated.priority ?? null);
      setSubTasks(updated.subTasks ?? []);
    } catch {
      toast.error("Lỗi khi cập nhật task!");
    }
  };
const calculateProgress = (subs: SubTask[]): number => {
  if (subs.length === 0) return 0;
  const completed = subs.filter((s) => s.isComplete).length;
  return completed / subs.length;
};

const formatProgress = (subs: SubTask[]): string => {
  const percent = Math.round(calculateProgress(subs) * 100);
  return `${percent}%`;
};
  const handleSubTaskChange = (updatedSubTasks: SubTask[]) => {
    setSubTasks(updatedSubTasks); // ✅ cập nhật local state

    // nếu cần cập nhật task parent cũng được gọi ở đây
    const newProgress = calculateProgress(updatedSubTasks);
    const newProgressDisplay = formatProgress(updatedSubTasks);

    onUpdated?.({
      ...task,
      subTasks: updatedSubTasks,
      progress: newProgress,
      progressDisplay: newProgressDisplay,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        {/* Close button */}
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Layout */}
        <div className="relative grid grid-cols-3 gap-6">
          <div className="absolute top-4 bottom-4 left-2/3 w-px rounded bg-gray-200" />

          {/* Left column */}
          <div className="col-span-2 space-y-4">
            <EditableText
              text={title}
              placeholder="Tiêu đề task"
              onSubmit={(newText) => {
                setTitle(newText);
                performSave({ title: newText });
              }}
              as="h3"
              tagClassName="text-lg font-semibold text-gray-800"
              inputClassName="text-lg font-semibold text-gray-800"
            />

            <EditableText
              text={description}
              placeholder="Thêm mô tả cho task..."
              onSubmit={(newText) => {
                setDescription(newText);
                performSave({ description: newText });
              }}
              as="p"
              tagClassName="text-sm text-gray-700 whitespace-pre-wrap"
              inputClassName="text-sm text-gray-700 whitespace-pre-wrap"
            />

            {/* Sub-tasks */}
            <div className="flex items-center justify-between">
              <div
                className="flex flex-grow cursor-pointer items-center gap-2 select-none"
                onClick={() => setIsCollapsed((prev) => !prev)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-4 w-4 text-gray-500 transition-transform ${isCollapsed ? "rotate-180" : "rotate-0"}`}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                  />
                </svg>
                <span className="text-[10px] font-semibold text-gray-700 uppercase">
                  Sub-tasks
                </span>
                <span className="text-[10px] font-semibold text-gray-600">
                  {`${subTasks.filter((s) => s.isComplete).length}/${subTasks.length}`}
                </span>
              </div>

              {!hasSubTasks && (
                <button
                  onClick={() => subTaskRef.current?.addAtTop()}
                  className="mt-1 ml-6 flex items-center gap-1 px-1 py-0.5 text-xs text-gray-500 transition hover:rounded hover:bg-yellow-50 hover:text-yellow-600"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {!isCollapsed && (
              <SubTaskList
                ref={subTaskRef}
                subTasks={subTasks} // ✅ dùng đúng state
                onChange={handleSubTaskChange}
                onFirstItemCreated={() => setHasSubTasks(true)}
              />
            )}

            <CommentSection />
          </div>

          {/* Right column */}
          <div className="col-span-1 mt-12 space-y-6">
            <DueDatePicker
              value={dueDate}
              onChange={(date) => {
                setDueDate(date);
                performSave({ dateDue: date ? formatDateLocal(date) : null });
              }}
            />

            <PriorityDropdown
              selected={priority}
              onSelect={(newPriority) => {
                setPriority(newPriority);
                performSave({ priority: newPriority });
              }}
            />

            <AssigneePicker />
          </div>
        </div>
      </div>
    </div>
  );
};
