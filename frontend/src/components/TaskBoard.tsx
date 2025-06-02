import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from '@hello-pangea/dnd';

interface Task {
  _id: string;
  text: string;
  status: 'todo' | 'inProgress' | 'done';
  color: string;
  deadline: string;
  avatar?: string;
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    text: '',
    status: 'todo',
    color: 'bg-blue-500',
    deadline: '',
    avatar: '',
  });

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch(`${API_BASE}/tasks`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const fetched: Task[] = await res.json();
        console.log("✅ Loaded tasks:", fetched);

        const grouped = {
          todo: fetched.filter(task => task.status === 'todo'),
          inProgress: fetched.filter(task => task.status === 'inProgress'),
          done: fetched.filter(task => task.status === 'done'),
        };
        setTasks(grouped);
      } catch (err) {
        console.error("❌ Error loading tasks:", err);
      }
    };

    loadTasks();
  }, [API_BASE]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId as keyof typeof tasks;
    const destCol = destination.droppableId as keyof typeof tasks;

    const sourceItems = Array.from(tasks[sourceCol]);
    const [movedItem] = sourceItems.splice(source.index, 1);
    movedItem.status = destCol as Task['status'];

    const destItems = Array.from(tasks[destCol]);
    destItems.splice(destination.index, 0, movedItem);

    setTasks({
      ...tasks,
      [sourceCol]: sourceItems,
      [destCol]: destItems,
    });

    try {
      const res = await fetch(`${API_BASE}/tasks/${movedItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movedItem),
      });
      if (!res.ok) throw new Error(`Update failed with status ${res.status}`);
      console.log("🔄 Updated task:", movedItem);
    } catch (err) {
      console.error("❌ Failed to update task status:", err);
    }
  };

  const createTask = async () => {
    try {
      console.log("📤 Creating task:", newTask);
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) throw new Error(`Create failed with status ${res.status}`);

      const created = await res.json();
      console.log("✅ Task created:", created);

      setTasks((prev) => ({
        ...prev,
        [created.status]: [...prev[created.status], created],
      }));

      setShowModal(false);
      setNewTask({ text: '', status: 'todo', color: 'bg-blue-500', deadline: '', avatar: '' });
    } catch (err) {
      console.error("❌ Failed to create task:", err);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">📝 Task Board</h2>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowModal(true)}
        >
          + New Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided: DroppableProvided) => (
                <div
                  className="bg-gray-800 p-4 rounded-lg min-h-[200px]"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h3 className="text-lg font-semibold mb-3 capitalize text-blue-300">
                    {columnId.replace(/([A-Z])/g, ' $1')}
                  </h3>

                  {columnTasks.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No tasks</p>
                  )}

                  {columnTasks.map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(provided: DraggableProvided) => (
                        <div
                          className={`p-3 mb-3 rounded text-white ${task.color}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="flex justify-between items-center">
                            <span>{task.text}</span>
                            {task.avatar && (
                              <img
                                src={task.avatar}
                                alt="avatar"
                                className="w-6 h-6 rounded-full ml-2 border"
                              />
                            )}
                          </div>
                          <div className="text-sm text-gray-100 mt-1">{task.deadline}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md space-y-4 border border-blue-500/20 text-white">
            <h3 className="text-xl font-bold">Create Task</h3>
            <input
              type="text"
              placeholder="Task text"
              className="w-full p-2 rounded bg-gray-700"
              value={newTask.text}
              onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
            />
            <input
              type="text"
              placeholder="Deadline (e.g. Today, Tomorrow)"
              className="w-full p-2 rounded bg-gray-700"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />
            <select
              className="w-full p-2 rounded bg-gray-700"
              value={newTask.color}
              onChange={(e) => setNewTask({ ...newTask, color: e.target.value })}
            >
              <option value="bg-blue-500">Blue</option>
              <option value="bg-purple-500">Purple</option>
              <option value="bg-green-500">Green</option>
              <option value="bg-pink-500">Pink</option>
              <option value="bg-yellow-500">Yellow</option>
            </select>
            <input
              type="text"
              placeholder="Avatar URL (optional)"
              className="w-full p-2 rounded bg-gray-700"
              value={newTask.avatar}
              onChange={(e) => setNewTask({ ...newTask, avatar: e.target.value })}
            />
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createTask}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
