import React, { useState } from "react";

const TaskInput = ({ onAddTask, onShowModal }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      onAddTask(trimmed);
      setInput("");
    } else {
      onShowModal("Task cannot be empty", "info");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2"
      role="search"
      aria-label="Add new task"
    >
      <input
        type="text"
        placeholder="Add new task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-grow px-3 py-2 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-1 focus:ring-indigo-400"
        aria-label="Task input"
      />
      <button
        type="submit"
        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
        aria-label="Add task"
      >
        Add
      </button>
    </form>
  );
};

export default TaskInput;
