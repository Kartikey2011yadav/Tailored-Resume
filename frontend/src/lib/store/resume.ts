import { create } from 'zustand';
import { debounce } from '@/lib/utils';
import { updateResume as updateResumeApi } from '@/lib/api';
import { Resume, Basics } from '@/types/resume';

interface ResumeState {
  resume: Resume | null;
  isLoading: boolean;
  isSaving: boolean;
  
  // Actions
  setResume: (resume: Resume) => void;
  updateBasics: (basics: Partial<Basics>) => void;
  // Generic update for simplicity in MVP, distinct actions can be added later
  updateSection: <K extends keyof Resume>(section: K, data: Resume[K]) => void;
  
  // Sync
  save: () => void;
}

// Create debounced saver outside to persist across renders
const debouncedSave = debounce(async (id: string, data: Partial<Resume>) => {
  try {
    useResumeStore.setState({ isSaving: true });
    await updateResumeApi(id, data);
  } catch (err) {
    console.error("Auto-save failed", err);
  } finally {
    useResumeStore.setState({ isSaving: false });
  }
}, 1000);

export const useResumeStore = create<ResumeState>((set, get) => ({
  resume: null,
  isLoading: true,
  isSaving: false,

  setResume: (resume) => set({ resume, isLoading: false }),

  updateBasics: (basics) => {
    const current = get().resume;
    if (!current) return;
    
    // Optimistic Update
    const updatedBasics = { ...current.basics, ...basics };
    const updatedResume = { ...current, basics: updatedBasics };
    set({ resume: updatedResume });
    
    // Trigger Save
    debouncedSave(current.id!, { basics: updatedBasics });
  },

  updateSection: (section, data) => {
    const current = get().resume;
    if (!current) return;

    const updatedResume = { ...current, [section]: data };
    set({ resume: updatedResume });

    debouncedSave(current.id!, { [section]: data });
  },

  save: () => {
      // Manual trigger if needed
  }
}));
