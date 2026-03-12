import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../../api/projectApi';
import { useState } from 'react';
import CreateProjectModal from './CreateProjectModal';
import type {Project} from '../../types/index'

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectApi.getProjects()
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Something went wrong</div>;

  const projects = data?.projects ?? [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={()=>setOpenModal(true)}>
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet.</p>
      ) : ( 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               
          {projects.map((project: Project) => (
            <div
              key={project.project_id}
              onClick={() => navigate(`/projects/${project.project_id}`)}
              className="border rounded-lg p-4 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 text-white w-8 h-8 rounded flex items-center justify-center font-bold text-sm">
                  {project.project_key.charAt(0)}
                </div>
                <h2 className="font-semibold">{project.project_name}</h2>
              </div>
              <p className="text-sm text-gray-500">{project.project_key}</p>
              {project.project_description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {project.project_description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      <CreateProjectModal 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
      />
    </div>
    
  );
}