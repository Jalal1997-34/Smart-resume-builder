import React, { useState } from 'react';
import { Plus, FileText, Edit, Trash2, Download, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useResumes } from '../../hooks/useResumes';
import { Resume } from '../../types';

interface DashboardProps {
  onCreateResume: () => void;
  onEditResume: (resume: Resume) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateResume, onEditResume }) => {
  const { user } = useAuth();
  const { resumes, loading, deleteResume } = useResumes(user?.id);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteResume = async (resumeId: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      setDeletingId(resumeId);
      try {
        deleteResume(resumeId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600 mt-2">
            Create and manage your professional resumes
          </p>
        </div>
        <Button onClick={onCreateResume} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create New Resume
        </Button>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No resumes yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first resume to get started
          </p>
          <Button onClick={onCreateResume}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Resume
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {resume.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {resume.personalInfo.fullName || 'Untitled Resume'}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Updated {formatDate(resume.updatedAt)}
                  </div>
                </div>
                <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditResume(resume)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteResume(resume.id)}
                  loading={deletingId === resume.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};