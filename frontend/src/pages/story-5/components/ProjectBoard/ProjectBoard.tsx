'use client';

import React, { useState } from 'react';
import { KanbanBoardProps, Task } from './ProjectBoard.types';

export const ProjectBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskUpdate }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const columns: { id: Task['status']; label: string }[] = [
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Done' },
  ];

  if (!tasks) {
    return <div className="p-4 text-center">Loading board...</div>;
  }

  return (
    <div className="flex gap-4 p-6 h-full overflow-x-auto bg-gray-50">
      {columns.map((column) => (
        <div key={column.id} className="w-80 flex flex-col gap-4">
          <h2 className="font-bold text-lg text-gray-700">{column.label}</h2>
          <div className="flex flex-col gap-2">
            {tasks
              .filter((t) => t.status === column.id)
              .map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="p-4 bg-white rounded shadow-sm border border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <h3 className="font-medium">{task.title}</h3>
                </div>
              ))}
          </div>
        </div>
      ))}

      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <input
              className="w-full p-2 border rounded mb-4"
              value={selectedTask.title}
              onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
            />
            <textarea
              className="w-full p-2 border rounded mb-4"
              value={selectedTask.description}
              onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedTask(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button 
                onClick={() => { onTaskUpdate(selectedTask); setSelectedTask(null); }}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
