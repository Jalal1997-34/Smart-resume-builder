import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar } from 'lucide-react';
import { Resume } from '../../types';

interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  const { personalInfo, education, experience, skills } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const formatDateRange = (startDate: string, endDate: string, current: boolean = false) => {
    const start = formatDate(startDate);
    const end = current ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden" id="resume-preview">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {personalInfo.location}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
            {personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <a href={personalInfo.website} className="text-blue-600 hover:underline">
                  Website
                </a>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-4 w-4" />
                <a href={personalInfo.linkedin} className="text-blue-600 hover:underline">
                  LinkedIn
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-1">
                <Github className="h-4 w-4" />
                <a href={personalInfo.github} className="text-blue-600 hover:underline">
                  GitHub
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {exp.position}
                      </h3>
                      <p className="text-gray-700 font-medium">
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-600">
                        {exp.location}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </div>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 text-sm leading-relaxed">
                      {exp.description.split('\n').map((line, index) => (
                        <p key={index} className="mb-1">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-gray-700 font-medium">
                        {edu.institution}
                      </p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </div>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b-2 border-blue-600 pb-1">
              Skills
            </h2>
            <div className="space-y-3">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="text-md font-medium text-gray-800 mb-2">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};