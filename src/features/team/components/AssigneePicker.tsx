export const AssigneePicker = () => {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-semibold text-gray-600 uppercase">
        Assign a person
      </label>

      <input
        type="text"
        placeholder="Type an asignee..."
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
      />
    </div>
  );
};
