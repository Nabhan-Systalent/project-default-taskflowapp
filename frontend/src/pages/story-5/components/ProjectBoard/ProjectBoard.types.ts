export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
}

export interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
}
