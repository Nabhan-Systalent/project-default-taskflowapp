'use client';

import React from 'react';
import { ProjectListProps } from './ProjectList.types';

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading = false,
  error,
  onCreateProject,
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 border border-red-200 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Projects</h1>
        <button
          onClick={onCreateProject}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed rounded-xl text-[var(--color-text-secondary)]">
          No projects found. Create one to get started!
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border border-[var(--color-border)] rounded-lg hover:shadow-sm transition-shadow flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {project.name}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {project.description}
                </p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="capitalize px-2 py-1 bg-gray-100 rounded text-[var(--color-text-secondary)]">
                  {project.status}
                </span>
                <span className="text-[var(--color-text-secondary)]">
                  {project.memberCount} members
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
