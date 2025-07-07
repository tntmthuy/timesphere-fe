import {
  useState,
  useImperativeHandle,
  forwardRef,
  type ForwardedRef,
} from "react";

export type SubTaskListHandle = {
  addAtTop: () => void;
};

type SubTaskListProps = {
  subTasks: string[];
  onChange?: (updated: string[]) => void;
  onFirstItemCreated?: () => void;
};

export const SubTaskList = forwardRef(
  (
    { subTasks, onChange, onFirstItemCreated }: SubTaskListProps,
    ref: ForwardedRef<SubTaskListHandle>,
  ) => {
    const [items, setItems] = useState(subTasks);
    const [completed, setCompleted] = useState<boolean[]>(Array(subTasks.length).fill(false));
    const [newInputIndex, setNewInputIndex] = useState<number | null>(null);

    useImperativeHandle(ref, () => ({
      addAtTop() {
        setNewInputIndex(-1);
      },
    }));

    const handleAdd = (text: string, index: number) => {
      if (items.length === 0) {
        onFirstItemCreated?.();
      }

      const updatedItems = [...items];
      const position = index < 0 ? 0 : index + 1;
      updatedItems.splice(position, 0, text);

      const updatedCompleted = [...completed];
      updatedCompleted.splice(position, 0, false);

      setItems(updatedItems);
      setCompleted(updatedCompleted);
      setNewInputIndex(null);
      onChange?.(updatedItems);
    };

    const toggleComplete = (i: number) => {
      const updated = [...completed];
      updated[i] = !updated[i];
      setCompleted(updated);
    };

    return (
      <div className="mt-2 space-y-2">
        {/* Input ở đầu */}
        {newInputIndex === -1 && (
          <div className="flex items-start gap-2">
            <div className="mt-2 h-4 w-4 rounded-full border-2 border-gray-300" />
            <input
              autoFocus
              className="w-full border-b border-gray-300 py-0.5 text-sm focus:outline-none"
              placeholder="Enter sub-task..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) handleAdd(val, -1);
                }
              }}
              onBlur={() => setNewInputIndex(null)}
            />
          </div>
        )}

        {/* Danh sách sub-task */}
        <div className="max-h-[5rem] space-y-2 overflow-y-auto">
          {items.map((text, i) => (
            <div key={i} className="flex items-start gap-2">
              <button
                onClick={() => toggleComplete(i)}
                className="mt-1 h-4 w-4 flex items-center justify-center"
              >
                {completed[i] ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-green-500">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.25 12c0-5.385 
                      4.365-9.75 9.75-9.75s9.75 
                      4.365 9.75 9.75-4.365 
                      9.75-9.75 9.75S2.25 
                      17.385 2.25 12Zm13.36-1.814a.75.75 
                      0 1 0-1.22-.872l-3.236 
                      4.53L9.53 12.22a.75.75 
                      0 0 0-1.06 1.06l2.25 
                      2.25a.75.75 0 0 0 
                      1.14-.094l3.75-5.25Z" />
                  </svg>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
                )}
              </button>
              <span
                className={`text-[12px] text-gray-800 ${
                  completed[i] ? "line-through text-gray-400" : ""
                }`}
              >
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Nút Add sub-task dưới cùng */}
        {items.length > 0 && newInputIndex === null && (
          <button
            onClick={() => setNewInputIndex(items.length - 1)}
            className="mt-1 ml-6 flex items-center gap-1 px-1 py-0.5 text-xs text-gray-500 transition hover:rounded hover:bg-yellow-50 hover:text-yellow-600"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2.25c-5.385 
                  0-9.75 4.365-9.75 
                  9.75s4.365 9.75 
                  9.75 9.75 9.75-4.365 
                  9.75-9.75S17.385 
                  2.25 12 2.25ZM12.75 9a.75.75 
                  0 0 0-1.5 0v2.25H9a.75.75 
                  0 0 0 0 1.5h2.25V15a.75.75 
                  0 0 0 1.5 0v-2.25H15a.75.75 
                  0 0 0 0-1.5h-2.25V9Z"
              />
            </svg>
            Add sub-task
          </button>
        )}

        {/* Input dưới cùng */}
        {newInputIndex !== null && newInputIndex !== -1 && (
          <div className="flex items-start gap-2">
            <div className="mt-2 h-4 w-4 rounded-full border-2 border-gray-300" />
            <input
              autoFocus
              className="w-full border-b border-gray-300 py-0.5 text-sm focus:outline-none"
              placeholder="Enter sub-task..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) handleAdd(val, newInputIndex);
                }
              }}
              onBlur={() => setNewInputIndex(null)}
            />
          </div>
        )}
      </div>
    );
  },
);
