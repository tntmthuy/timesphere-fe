//src\features\team\components\TaskDetailModal.tsx
import { useRef, useState } from "react";
import { useAppDispatch } from "../../../state/hooks";
import { updateTaskLocal } from "../kanbanSlice";
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
import { SubTaskHeader } from "./SubTaskHeader";

type TaskDetailModalProps = {
  task: TaskDto;
  token: string | null;
  onClose: () => void;
};

const formatDateLocal = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
};

export const TaskDetailModal = ({
  task,
  token,
  onClose,
}: TaskDetailModalProps) => {
  const dispatch = useAppDispatch();
  const subTaskRef = useRef<SubTaskListHandle>(null);
  const [hasSubTasks, setHasSubTasks] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [hideCompleted, setHideCompleted] = useState(false);

  const [title, setTitle] = useState(task.taskTitle);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState(task.priority ?? null);
  const [subTasks, setSubTasks] = useState<SubTask[]>(task.subTasks ?? []);
  const [dueDate, setDueDate] = useState(
    task.dateDue ? new Date(task.dateDue) : null,
  );

  const calculateProgress = (subs: SubTask[]): number => {
    if (subs.length === 0) return 0;
    const completed = subs.filter((s) => s.isComplete).length;
    return completed / subs.length;
  };

  const formatProgress = (subs: SubTask[]): string => {
    const percent = Math.round(calculateProgress(subs) * 100);
    return `${percent}%`;
  };

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
      dispatch(updateTaskLocal(updated));
      toast.success("Task updated successfully");

      setTitle(updated.taskTitle);
      setDescription(updated.description ?? "");
      setDueDate(updated.dateDue ? new Date(updated.dateDue) : null);
      setPriority(updated.priority ?? null);
      setSubTasks(updated.subTasks ?? []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        toast.error("You don’t have permission to modify this task.");
      } else {
        toast.error("Something went wrong while saving...");
      }
    }
  };

  const handleSubTaskChange = (updatedSubTasks: SubTask[]) => {
    setSubTasks(updatedSubTasks);

    const newProgress = calculateProgress(updatedSubTasks);
    const newProgressDisplay = formatProgress(updatedSubTasks);

    dispatch(
      updateTaskLocal({
        ...task,
        subTasks: updatedSubTasks,
        progress: newProgress,
        progressDisplay: newProgressDisplay,
      }),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
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

        <div className="relative grid grid-cols-3 gap-6">
          <div className="absolute top-4 bottom-4 left-2/3 w-px rounded bg-gray-200" />

          {/* Left column */}
          <div className="col-span-2 space-y-4">
            <EditableText
              text={title}
              placeholder="This task needs a title..."
              allowEmpty={false}
              onSubmit={(newText) => {
                const cleaned = newText.trim();
                if (!cleaned) {
                  toast.error("Task title cannot be empty.");
                  return;
                }
                setTitle(cleaned);
                performSave({ title: cleaned });
              }}
              as="h3"
              tagClassName="text-lg font-semibold text-gray-800"
              inputClassName="text-lg font-semibold text-gray-800"
            />

            <EditableText
              text={description}
              placeholder="Write a short summary or notes here..."
              allowEmpty={true}
              onSubmit={(newText) => {
                setDescription(newText);
                performSave({ description: newText });
              }}
              as="p"
              tagClassName="text-sm text-gray-700 whitespace-pre-wrap"
              inputClassName="text-sm text-gray-700 whitespace-pre-wrap"
            />

            <SubTaskHeader
              isCollapsed={isCollapsed}
              subTasks={subTasks}
              hideCompleted={hideCompleted}
              showAddButton={!hasSubTasks}
              onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
              onToggleHideCompleted={() => setHideCompleted((prev) => !prev)}
              onAddSubtask={() => subTaskRef.current?.addAtTop()}
            />

            {!isCollapsed && (
              <SubTaskList
                ref={subTaskRef}
                subTasks={subTasks}
                taskId={task.id} // ✅ dùng đúng biến đã có
                hideCompleted={hideCompleted}
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
                const formatted = date ? formatDateLocal(date) : null;
                performSave({ dateDue: formatted }); // ✅ gọn, đúng, không bị nested
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
