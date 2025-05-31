import React, { useState, useEffect } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Modal from "./components/Modal";

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString();

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [modal, setModal] = useState({
    show: false,
    existingTaskId: null,
    newText: "",
    message: "",
    isSubtask: false,
    existingSubtaskId: null,
    type: "confirm",
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      showModal("Task cannot be empty", "info");
      return;
    }

    const existingTask = tasks.find(
      (task) => task.text.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (existingTask) {
      showModal(
        "This task already exists. Do you want to replace it?",
        "confirm",
        existingTask.id,
        null,
        trimmed
      );
    } else {
      const newTask = {
        id: generateId(),
        text: trimmed,
        completed: false,
        subtasks: [],
      };
      setTasks([newTask, ...tasks]);
    }
  };

  const addSubtask = (taskId, text) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return false;
    }

    const task = tasks.find((t) => t.id === taskId);

    if (!task) {
      return false;
    }

    const existingSubtask = task.subtasks.find(
      (st) => st.text.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (existingSubtask) {
      showModal(
        "This subtask already exists. Do you want to replace it?",
        "confirm",
        taskId,
        existingSubtask.id,
        trimmed
      );
      return false;
    }

    const newSubtask = {
      id: generateId(),
      text: trimmed,
      completed: false,
    };

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      )
    );

    return true;
  };

  const handleUpdateText = (taskId, newText, subtaskId = null) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) return task;
        if (subtaskId) {
          const updatedSubtasks = task.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, text: newText } : subtask
          );
          return { ...task, subtasks: updatedSubtasks };
        } else {
          return { ...task, text: newText };
        }
      })
    );
  };

  const replaceTask = () => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.id === modal.existingTaskId) {
          if (modal.isSubtask) {
            // replace subtask text
            const updatedSubtasks = task.subtasks.map((sub) => {
              if (sub.id === modal.existingSubtaskId) {
                return { ...sub, text: modal.newText.trim() };
              }
              return sub;
            });
            return { ...task, subtasks: updatedSubtasks };
          } else {
            // replace task text
            return { ...task, text: modal.newText.trim() };
          }
        }
        return task;
      });
      return updatedTasks;
    });

    closeModal();
  };

  const closeModal = () => {
    setModal({
      show: false,
      existingTaskId: null,
      newText: "",
      message: "",
      isSubtask: false,
      existingSubtaskId: null,
      type: "confirm",
    });
  };

  const showModal = (
    message,
    type = "info",
    taskId = null,
    subtaskId = null,
    newText = ""
  ) => {
    setModal({
      show: true,
      message,
      type,
      existingTaskId: taskId,
      existingSubtaskId: subtaskId,
      isSubtask: subtaskId !== null,
      newText,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 space-y-6 max-h-[90vh] flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          To-Do List
        </h1>

        <div className="shrink-0">
          <TaskInput onAddTask={addTask} onShowModal={showModal} />
        </div>

        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-md p-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100">
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            setModal={setModal}
            onShowModal={showModal}
            onUpdateText={handleUpdateText}
            onAddSubtask={addSubtask}
          />
        </div>
        {modal.show && (
          <Modal
            message={modal.message}
            onConfirm={handleReplace} // renamed from onConfirm
            onCancel={closeModal}
            type={modal.type}
          />
        )}
      </div>
    </div>
  );
};

export default App;
