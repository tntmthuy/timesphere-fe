import { useRef, useEffect, useState, type JSX } from "react";

type EditableTextProps = {
  text: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  tagClassName?: string;
  onSubmit: (newText: string) => void;
  as?: keyof JSX.IntrinsicElements;
};

export const EditableText = ({
  text,
  placeholder,
  className = "",
  inputClassName = "",
  tagClassName = "",
  onSubmit,
  as = "span",
}: EditableTextProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const Tag = as as keyof JSX.IntrinsicElements;

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (value && value !== text) await onSubmit(value);
    setEditing(false);
  };

  return (
    <div
      className={`group flex cursor-pointer items-center gap-2 select-none ${className}`}
      onClick={() => setEditing(true)}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleSubmit}
          onBlur={() => setEditing(false)}
          className={`w-full border-b border-gray-300 bg-transparent transition-colors outline-none focus:border-gray-500 ${inputClassName}`}
          placeholder={placeholder}
        />
      ) : (
        <>
          <Tag className={tagClassName}>{text || placeholder}</Tag>
          <span className="flex items-center justify-center text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
</span>
        </>
      )}
    </div>
  );
};
