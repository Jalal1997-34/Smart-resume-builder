import React from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { Experience } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface ExperienceFormProps {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onChange }) => {
  const addExperience = () => {
    const newExperience: Experience = {
      id: uuidv4(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: ''
    };
    onChange([...experience, newExperience]);
  };

  const removeExperience = (id: string) => {
    onChange(experience.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    onChange(experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
        </div>
        <Button onClick={addExperience} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
        </Button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience entries yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <div key={exp.id} className="bg-gray-50 rounded-lg p-4 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-900">
                  Experience #{index + 1}
                </h3>
                <Button
                  onClick={() => removeExperience(exp.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Google Inc."
                />
                
                <Input
                  label="Position"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Software Engineer"
                />
                
                <Input
                  label="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder="Mountain View, CA"
                />
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700">
                    Currently working here
                  </label>
                </div>
                
                <Input
                  label="Start Date"
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                />
                
                <Input
                  label="End Date"
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
              </div>

              <div className="mt-4">
                <Textarea
                  label="Job Description"
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="Describe your responsibilities, achievements, and key contributions..."
                  rows={4}
                  helperText="Use bullet points and quantify your achievements where possible."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};