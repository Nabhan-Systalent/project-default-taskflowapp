export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'on-hold';
  memberCount: number;
  updatedAt: string;
}

export interface ProjectListProps {
  projects: Project[];
  isLoading?: boolean;
  error?: string;
  onCreateProject?: () => void;
}
