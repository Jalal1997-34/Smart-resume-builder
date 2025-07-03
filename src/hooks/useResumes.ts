import { useState, useEffect } from 'react';
import { Resume, PersonalInfo, Education, Experience, Skill } from '../types';
import { v4 as uuidv4 } from 'uuid';

const RESUMES_STORAGE_KEY = 'smart-resume-resumes';

export const useResumes = (userId?: string) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadResumes();
    } else {
      setResumes([]);
      setLoading(false);
    }
  }, [userId]);

  const loadResumes = () => {
    try {
      const storedResumes = localStorage.getItem(RESUMES_STORAGE_KEY);
      if (storedResumes) {
        const allResumes = JSON.parse(storedResumes);
        const userResumes = allResumes.filter((resume: Resume) => resume.userId === userId);
        setResumes(userResumes);
      }
    } catch (error) {
      console.error('Failed to load resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveResume = (resume: Resume) => {
    try {
      const storedResumes = localStorage.getItem(RESUMES_STORAGE_KEY);
      const allResumes = storedResumes ? JSON.parse(storedResumes) : [];
      
      const existingIndex = allResumes.findIndex((r: Resume) => r.id === resume.id);
      
      if (existingIndex >= 0) {
        allResumes[existingIndex] = { ...resume, updatedAt: new Date().toISOString() };
      } else {
        allResumes.push(resume);
      }
      
      localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(allResumes));
      loadResumes();
    } catch (error) {
      console.error('Failed to save resume:', error);
    }
  };

  const deleteResume = (resumeId: string) => {
    try {
      const storedResumes = localStorage.getItem(RESUMES_STORAGE_KEY);
      if (storedResumes) {
        const allResumes = JSON.parse(storedResumes);
        const filteredResumes = allResumes.filter((r: Resume) => r.id !== resumeId);
        localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(filteredResumes));
        loadResumes();
      }
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  const createNewResume = (title: string): Resume => {
    const newResume: Resume = {
      id: uuidv4(),
      userId: userId!,
      title,
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
        summary: ''
      },
      education: [],
      experience: [],
      skills: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveResume(newResume);
    return newResume;
  };

  return {
    resumes,
    loading,
    saveResume,
    deleteResume,
    createNewResume,
    refreshResumes: loadResumes
  };
};