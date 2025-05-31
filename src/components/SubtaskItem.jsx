import React from "react";

const SubtaskItem = ({
  subtask,
  taskId,
  onToggleComplete,
  onUpdateText,
  onDelete,
}) => {
  const handleEdit = () => {
    const newText = prompt("Edit your subtask", subtask.text);
    if (newText !== null && newText.trim() !== "") {
      onUpdateText(taskId, newText.trim(), subtask.id);
    }
  };

  return (
    <div
      className="flex items-center gap-2"
      role="listitem"
      aria-label={`Subtask: ${subtask.text}`}
    >
      <input
        type="checkbox"
        checked={subtask.completed}
        onChange={() => onToggleComplete(taskId, subtask.id)}
        aria-label={`Mark subtask "${subtask.text}" as ${
          subtask.completed ? "incomplete" : "complete"
        }`}
      />
      <span
        className={`select-none ${
          subtask.completed ? "line-through text-gray-400" : "text-gray-700"
        }`}
        onDoubleClick={handleEdit}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleEdit();
          }
        }}
        aria-label={`Subtask text: ${subtask.text}. Double click or press enter to edit.`}
        role="textbox"
      >
        {subtask.text}
      </span>
      <button
        onClick={() => onDelete(taskId, subtask.id)}
        aria-label={`Delete subtask: ${subtask.text}`}
        className="text-red-500 hover:text-red-700 focus:outline-none text-3xl"
      >
        &times;
      </button>
    </div>
  );
};

export default SubtaskItem;
