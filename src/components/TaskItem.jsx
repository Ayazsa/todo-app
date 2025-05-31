import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SubtaskItem from "./SubtaskItem";

const TaskItem = ({
  task,
  onToggleComplete,
  onUpdateText,
  onDelete,
  onAddSubtask,
  onShowModal,
}) => {
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [subtaskInput, setSubtaskInput] = useState("");

  const handleAddSubtask = () => {
    const trimmedInput = subtaskInput.trim();
    if (trimmedInput === "") {
      onShowModal("Subtask cannot be empty", "info");
      return;
    }
    const added = onAddSubtask(task.id, trimmedInput);

    if (added) {
      setSubtaskInput("");
      setShowSubtaskInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      layout
      className="bg-gray-100 p-4 rounded-md shadow mb-3"
      role="listitem"
      aria-label={`Task: ${task.text}`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            aria-label={`Mark task "${task.text}" as ${
              task.completed ? "incomplete" : "complete"
            }`}
          />
          <span
            className={`cursor-pointer select-none ${
              task.completed ? "line-through text-gray-400" : "text-gray-800"
            }`}
            onDoubleClick={() => {
              const newText = prompt("Edit your task", task.text);
              if (newText !== null && newText.trim() !== "") {
                onUpdateText(task.id, newText);
              }
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const newText = prompt("Edit your task", task.text);
                if (newText !== null && newText.trim() !== "") {
                  onUpdateText(task.id, newText);
                }
              }
            }}
            aria-label={`Task text: ${task.text}. Double click or press enter to edit.`}
            role="textbox"
          >
            {task.text}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task: ${task.text}`}
            className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Delete
          </button>
          <button
            onClick={() => setShowSubtaskInput((prev) => !prev)}
            aria-label={`Add subtask to task: ${task.text}`}
            className="px-2 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            + Subtask
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSubtaskInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-2"
          >
            <input
              type="text"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              placeholder="Enter subtask..."
              className="w-full border border-gray-300 rounded px-2 py-1"
              aria-label="New subtask input"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddSubtask();
                }
              }}
              autoFocus
            />

            <div className="flex justify-end mt-1 gap-2">
              <button
                onClick={handleAddSubtask}
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowSubtaskInput(false);
                  setSubtaskInput("");
                }}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {task.subtasks.length > 0 && (
        <ul className="pl-6 mt-2 border-l border-gray-300">
          {task.subtasks.map((subtask) => (
            <SubtaskItem
              key={subtask.id}
              taskId={task.id}
              subtask={subtask}
              onToggleComplete={onToggleComplete}
              onUpdateText={onUpdateText}
              onDelete={onDelete}
              onShowModal={onShowModal}
              onAddSubtask={onAddSubtask}
            />
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default TaskItem;
