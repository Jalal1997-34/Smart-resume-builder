import React from 'react';
import { User, Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { PersonalInfo } from '../../types';

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  onChange: (personalInfo: PersonalInfo) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ personalInfo, onChange }) => {
  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...personalInfo,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <User className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={personalInfo.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="John Doe"
          required
        />
        
        <Input
          label="Email"
          type="email"
          value={personalInfo.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="john@example.com"
          required
        />
        
        <Input
          label="Phone"
          type="tel"
          value={personalInfo.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
        
        <Input
          label="Location"
          value={personalInfo.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="New York, NY"
        />
        
        <Input
          label="Website"
          type="url"
          value={personalInfo.website || ''}
          onChange={(e) => handleInputChange('website', e.target.value)}
          placeholder="https://johndoe.com"
        />
        
        <Input
          label="LinkedIn"
          type="url"
          value={personalInfo.linkedin || ''}
          onChange={(e) => handleInputChange('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/johndoe"
        />
        
        <Input
          label="GitHub"
          type="url"
          value={personalInfo.github || ''}
          onChange={(e) => handleInputChange('github', e.target.value)}
          placeholder="https://github.com/johndoe"
          className="md:col-span-2"
        />
      </div>

      <Textarea
        label="Professional Summary"
        value={personalInfo.summary}
        onChange={(e) => handleInputChange('summary', e.target.value)}
        placeholder="A brief overview of your professional background, skills, and career objectives..."
        rows={4}
        helperText="Write a compelling summary that highlights your key strengths and career goals."
      />
    </div>
  );
};