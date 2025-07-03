import React from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { Education } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ education, onChange }) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: uuidv4(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    };
    onChange([...education, newEducation]);
  };

  const removeEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Education</h2>
        </div>
        <Button onClick={addEducation} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No education entries yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={edu.id} className="bg-gray-50 rounded-lg p-4 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-900">
                  Education #{index + 1}
                </h3>
                <Button
                  onClick={() => removeEducation(edu.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="Harvard University"
                />
                
                <Input
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                />
                
                <Input
                  label="Field of Study"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Computer Science"
                />
                
                <Input
                  label="GPA (Optional)"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.8"
                />
                
                <Input
                  label="Start Date"
                  type="date"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                />
                
                <Input
                  label="End Date"
                  type="date"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Textarea
                  label="Description (Optional)"
                  value={edu.description || ''}
                  onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                  placeholder="Relevant coursework, achievements, honors..."
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};