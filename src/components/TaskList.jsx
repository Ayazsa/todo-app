import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, setTasks, setModal, onShowModal }) => {
  // Toggle complete for task or subtask
  const onToggleComplete = (taskId, subtaskId = null) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) return task;

        if (subtaskId) {
          const updatedSubtasks = task.subtasks.map((sub) =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          );
          return { ...task, subtasks: updatedSubtasks };
        } else {
          return { ...task, completed: !task.completed };
        }
      })
    );
  };

  const onUpdateText = (taskId, newText, subtaskId = null) => {
    const trimmedText = newText.trim();
    if (trimmedText === "") {
      setModal({
        show: true,
        message: "Text cannot be empty.",
        newText: "", // no need to replace anything
        existingTaskId: null,
        isSubtask: false,
        existingSubtaskId: null,
      });
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) return task;

        if (subtaskId) {
          const updatedSubtasks = task.subtasks.map((sub) =>
            sub.id === subtaskId ? { ...sub, text: trimmedText } : sub
          );
          return { ...task, subtasks: updatedSubtasks };
        } else {
          return { ...task, text: trimmedText };
        }
      })
    );
  };

  const onDelete = (taskId, subtaskId = null) => {
    if (subtaskId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id !== taskId) return task;
          const filteredSubtasks = task.subtasks.filter(
            (sub) => sub.id !== subtaskId
          );
          return { ...task, subtasks: filteredSubtasks };
        })
      );
    } else {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    }
  };

  // ✅ Updated: Add subtask with modal support for duplicates
  const onAddSubtask = (taskId, subtaskText) => {
    const trimmed = subtaskText.trim().toLowerCase();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    const existingSubtask = task.subtasks.find(
      (sub) => sub.text.trim().toLowerCase() === trimmed
    );

    if (existingSubtask) {
      setModal({
        show: true,
        existingTaskId: taskId,
        existingSubtaskId: existingSubtask.id,
        newText: subtaskText,
        isSubtask: true,
        message: "This subtask already exists. Do you want to replace it?",
      });
      return false;
    } else {
      const newSubtask = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(),
        text: subtaskText.trim(),
        completed: false,
      };

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSubtask] } : t
        )
      );

      return true; // IMPORTANT: return true here
    }
  };

  return (
    <div role="list" aria-label="Task list">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">No tasks added yet.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onUpdateText={onUpdateText}
            onDelete={onDelete}
            onAddSubtask={onAddSubtask}
            onShowModal={onShowModal}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;
