import React, { useState, useEffect } from 'react';
import { Save, Download, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PersonalInfoForm } from '../forms/PersonalInfoForm';
import { EducationForm } from '../forms/EducationForm';
import { ExperienceForm } from '../forms/ExperienceForm';
import { SkillsForm } from '../forms/SkillsForm';
import { ResumePreview } from '../preview/ResumePreview';
import { useAuth } from '../../hooks/useAuth';
import { useResumes } from '../../hooks/useResumes';
import { Resume } from '../../types';
import { generatePDF } from '../../utils/pdfGenerator';

interface ResumeBuilderProps {
  resume?: Resume;
  onBack: () => void;
}

const TABS = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
];

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ resume, onBack }) => {
  const { user } = useAuth();
  const { createNewResume, saveResume } = useResumes(user?.id);
  const [activeTab, setActiveTab] = useState('personal');
  const [currentResume, setCurrentResume] = useState<Resume | null>(resume || null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!currentResume && user) {
      // Create a new resume if none provided
      const newResume = createNewResume('Untitled Resume');
      setCurrentResume(newResume);
    }
  }, [currentResume, user, createNewResume]);

  const handleSave = async () => {
    if (!currentResume) return;
    
    setSaving(true);
    try {
      saveResume(currentResume);
      // Show success message or toast
    } catch (error) {
      console.error('Failed to save resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!currentResume) return;
    
    setDownloading(true);
    try {
      await generatePDF(currentResume);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const updateResume = (updates: Partial<Resume>) => {
    if (!currentResume) return;
    
    setCurrentResume({
      ...currentResume,
      ...updates,
      updatedAt: new Date().toISOString()
    });
  };

  if (!currentResume) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="w-64">
            <Input
              value={currentResume.title}
              onChange={(e) => updateResume({ title: e.target.value })}
              placeholder="Resume Title"
              className="font-medium"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleSave}
            loading={saving}
            variant="outline"
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            onClick={handleDownload}
            loading={downloading}
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
        {/* Editor Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto h-full">
            {activeTab === 'personal' && (
              <PersonalInfoForm
                personalInfo={currentResume.personalInfo}
                onChange={(personalInfo) => updateResume({ personalInfo })}
              />
            )}
            
            {activeTab === 'experience' && (
              <ExperienceForm
                experience={currentResume.experience}
                onChange={(experience) => updateResume({ experience })}
              />
            )}
            
            {activeTab === 'education' && (
              <EducationForm
                education={currentResume.education}
                onChange={(education) => updateResume({ education })}
              />
            )}
            
            {activeTab === 'skills' && (
              <SkillsForm
                skills={currentResume.skills}
                onChange={(skills) => updateResume({ skills })}
              />
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-50 rounded-lg p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Live Preview
            </h3>
          </div>
          
          <div className="transform scale-90 origin-top-left">
            <ResumePreview resume={currentResume} />
          </div>
        </div>
      </div>
    </div>
  );
};