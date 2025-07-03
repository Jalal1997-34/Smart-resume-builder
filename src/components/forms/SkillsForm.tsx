import React from 'react';
import { Star, Plus, Trash2 } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Skill } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ skills, onChange }) => {
  const addSkill = () => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: '',
      level: 'Intermediate',
      category: 'Technical'
    };
    onChange([...skills, newSkill]);
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter(skill => skill.id !== id));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    onChange(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
        </div>
        <Button onClick={addSkill} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No skills added yet. Add your first skill!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                {category} Skills
              </h3>
              <div className="space-y-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Input
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                        placeholder="Skill name (e.g., JavaScript, Project Management)"
                      />
                    </div>
                    
                    <div className="w-32">
                      <select
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    
                    <div className="w-32">
                      <select
                        value={skill.category}
                        onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Soft">Soft</option>
                        <option value="Language">Language</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <Button
                      onClick={() => removeSkill(skill.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};