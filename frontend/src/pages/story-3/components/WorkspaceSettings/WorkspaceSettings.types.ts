export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface WorkspaceSettingsProps {
  members: Member[];
  onRemoveMember: (id: string) => void;
  onUpdateRole: (id: string, role: Member['role']) => void;
}
