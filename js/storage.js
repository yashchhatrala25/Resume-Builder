/* ============================================
   AI Resume & Portfolio Builder — Storage Module
   ============================================ */

const STORAGE_KEY = 'resumeBuilderData';

const defaultData = {
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: ''
  },
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
  selectedTemplate: 'modern'
};

export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle missing fields
      return { ...defaultData, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load data from localStorage:', e);
  }
  return JSON.parse(JSON.stringify(defaultData));
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save data to localStorage:', e);
  }
}

export function clearData() {
  localStorage.removeItem(STORAGE_KEY);
  return JSON.parse(JSON.stringify(defaultData));
}

export function exportDataAsJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume_data.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importDataFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const merged = { ...defaultData, ...data };
        saveData(merged);
        resolve(merged);
      } catch (err) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Debounced auto-save
let saveTimeout;
export function autoSave(data) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveData(data), 500);
}

export function getDefaultData() {
  return JSON.parse(JSON.stringify(defaultData));
}
