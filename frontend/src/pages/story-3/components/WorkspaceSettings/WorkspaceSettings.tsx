'use client';

import React from 'react';
import { WorkspaceSettingsProps } from './WorkspaceSettings.types';

export const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({
  members,
  onRemoveMember,
  onUpdateRole,
}) => {
  if (!members || members.length === 0) {
    return (
      <div className="p-8 text-center text-[var(--color-text-secondary)]">
        No members found in this workspace.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Workspace Members
        </h2>
      </div>

      <div className="overflow-hidden border border-[var(--color-border)] rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-background-subtle)] border-b border-[var(--color-border)]">
              <th className="p-4 text-sm font-medium text-[var(--color-text-secondary)]">Name</th>
              <th className="p-4 text-sm font-medium text-[var(--color-text-secondary)]">Role</th>
              <th className="p-4 text-sm font-medium text-[var(--color-text-secondary)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-background-subtle)] transition-colors">
                <td className="p-4">
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{member.name}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">{member.email}</div>
                </td>
                <td className="p-4">
                  <select
                    value={member.role}
                    onChange={(e) => onUpdateRole(member.id, e.target.value as any)}
                    className="p-1 border border-[var(--color-border)] rounded bg-transparent text-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="text-sm text-[var(--color-danger)] hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
