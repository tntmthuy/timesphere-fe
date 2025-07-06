import { useState, useRef, useEffect } from "react";
import { createTask, type TaskDto } from "../task"; 
import { useAppSelector } from "../../../state/hooks";
import toast from "react-hot-toast";

type Props = {
  columnId: string;
  onAddTask: (newTask: TaskDto) => void;
};

export const AddTaskInlineInput = ({ columnId, onAddTask }: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed || !token) return;

    try {
      const task = await createTask(columnId, trimmed, token);
      onAddTask(task);
      setValue("");
      setEditing(false);
    } catch (err) {
      console.error("❌ Tạo task lỗi:", err);
      toast.error("Không thể tạo task");
    }
  };

  return editing ? (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSubmit();
        if (e.key === "Escape") {
          setValue("");
          setEditing(false);
        }
      }}
      placeholder="Nhập tên task..."
      className="w-full rounded-md border px-3 py-2 text-sm"
    />
  ) : (
    <button
      onClick={() => setEditing(true)}
      className="w-full rounded-md bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300"
    >
      + Add Task
    </button>
  );
};