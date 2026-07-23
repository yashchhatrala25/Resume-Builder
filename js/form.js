/* ============================================
   AI Resume & Portfolio Builder — Form Module
   ============================================ */

import { autoSave } from './storage.js';
import { getAISuggestions, generateSummary, polishText } from './ai.js';

let currentStep = 0;
const totalSteps = 7;
let formData = null;
let onDataChange = null;

const stepLabels = ['Personal', 'Education', 'Skills', 'Experience', 'Projects', 'Certifications', 'Achievements'];

export function initForm(data, changeCallback) {
  formData = data;
  onDataChange = changeCallback;
  renderProgressBar();
  renderAllSteps();
  showStep(0);
  initAIPanel();
}

export function updateFormData(data) {
  formData = data;
}

// ── Progress Bar ──
function renderProgressBar() {
  const container = document.getElementById('progressBar');
  if (!container) return;

  container.innerHTML = `
    <div class="progress-bar__track">
      <div class="progress-bar__line">
        <div class="progress-bar__fill" id="progressFill"></div>
      </div>
      ${stepLabels.map((label, i) => `
        <div class="progress-step ${i === 0 ? 'active' : ''}" data-step="${i}" id="progressStep${i}">
          <div class="progress-step__circle">${i + 1}</div>
          <span class="progress-step__label">${label}</span>
        </div>
      `).join('')}
    </div>
  `;

  // Click handlers for progress steps
  container.querySelectorAll('.progress-step').forEach(step => {
    step.addEventListener('click', () => {
      const idx = parseInt(step.dataset.step);
      if (idx <= getMaxAccessibleStep()) {
        showStep(idx);
      }
    });
  });

  updateProgressBar();
}

function getMaxAccessibleStep() {
  // Allow access to any step that has been visited or is next
  return Math.min(totalSteps - 1, currentStep + 1);
}

function updateProgressBar() {
  const fill = document.getElementById('progressFill');
  if (fill) {
    const progress = (currentStep / (totalSteps - 1)) * 100;
    fill.style.width = `${progress}%`;
  }

  for (let i = 0; i < totalSteps; i++) {
    const step = document.getElementById(`progressStep${i}`);
    if (!step) continue;
    step.classList.remove('active', 'completed');
    if (i === currentStep) {
      step.classList.add('active');
    } else if (i < currentStep) {
      step.classList.add('completed');
      step.querySelector('.progress-step__circle').innerHTML = '✓';
    } else {
      step.querySelector('.progress-step__circle').innerHTML = i + 1;
    }
  }
}

// ── Step Rendering ──
function renderAllSteps() {
  const container = document.getElementById('formSteps');
  if (!container) return;

  container.innerHTML = `
    ${renderPersonalStep()}
    ${renderEducationStep()}
    ${renderSkillsStep()}
    ${renderExperienceStep()}
    ${renderProjectsStep()}
    ${renderCertificationsStep()}
    ${renderAchievementsStep()}
  `;

  bindFormEvents();
  populateFormFields();
}

function showStep(index) {
  currentStep = index;
  const steps = document.querySelectorAll('.form-step');
  steps.forEach((step, i) => {
    step.classList.remove('active');
    if (i === index) {
      step.classList.add('active');
    }
  });

  updateProgressBar();
  updateFormHeader();
  updateNavigationButtons();

  // Scroll form into view
  const formCard = document.querySelector('.form-card');
  if (formCard) {
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateFormHeader() {
  const label = document.getElementById('formStepLabel');
  const title = document.getElementById('formStepTitle');
  const subtitle = document.getElementById('formStepSubtitle');

  const headers = [
    { label: `Step ${currentStep + 1} of ${totalSteps}`, title: 'Personal Information', subtitle: 'Let\'s start with your basic details' },
    { label: `Step ${currentStep + 1} of ${totalSteps}`, title: 'Education', subtitle: 'Add your educational background' },
    { label: `Step ${currentStep + 1} of ${totalSteps}`, title: 'Skills', subtitle: 'What technologies and tools do you know?' },
    { label: `Step ${currentStep + 1} of ${totalSteps}`, title: 'Work Experience', subtitle: 'Share your professional journey' },
    { label: `Step ${currentStep + 1} of ${totalSteps}`, title: 'Projects', subtitle: 'Showcase your best work' },
    { label: `Step ${currentStep + 1} of ${totalSteps}`, title: 'Certifications', subtitle: 'Any certifications or licenses?' },
    { label: `Step ${currentStep + 1} of ${totalSteps}`, title: 'Achievements', subtitle: 'Awards, publications, and accomplishments' },
  ];

  if (label) label.textContent = headers[currentStep].label;
  if (title) title.textContent = headers[currentStep].title;
  if (subtitle) subtitle.textContent = headers[currentStep].subtitle;
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const generateBtn = document.getElementById('generateBtn');

  if (prevBtn) {
    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-flex';
  }
  if (nextBtn) {
    nextBtn.style.display = currentStep === totalSteps - 1 ? 'none' : 'inline-flex';
  }
  if (generateBtn) {
    generateBtn.style.display = currentStep === totalSteps - 1 ? 'inline-flex' : 'none';
  }
}

// ── Step Templates ──
function renderPersonalStep() {
  return `
    <div class="form-step" data-step="0">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="personalName">Full Name *</label>
          <input type="text" id="personalName" class="form-input" placeholder="John Doe" data-field="personal.name" required>
          <p class="form-error">Please enter your name</p>
        </div>
        <div class="form-group">
          <label class="form-label" for="personalEmail">Email *</label>
          <input type="email" id="personalEmail" class="form-input" placeholder="john@example.com" data-field="personal.email" required>
          <p class="form-error">Please enter a valid email</p>
        </div>
        <div class="form-group">
          <label class="form-label" for="personalPhone">Phone</label>
          <input type="tel" id="personalPhone" class="form-input" placeholder="+1 (555) 123-4567" data-field="personal.phone">
        </div>
        <div class="form-group">
          <label class="form-label" for="personalLocation">Location</label>
          <input type="text" id="personalLocation" class="form-input" placeholder="New York, NY" data-field="personal.location">
        </div>
        <div class="form-group">
          <label class="form-label" for="personalLinkedin">LinkedIn</label>
          <input type="url" id="personalLinkedin" class="form-input" placeholder="linkedin.com/in/johndoe" data-field="personal.linkedin">
        </div>
        <div class="form-group">
          <label class="form-label" for="personalGithub">GitHub</label>
          <input type="url" id="personalGithub" class="form-input" placeholder="github.com/johndoe" data-field="personal.github">
        </div>
        <div class="form-group">
          <label class="form-label" for="personalWebsite">Website</label>
          <input type="url" id="personalWebsite" class="form-input" placeholder="johndoe.dev" data-field="personal.website">
        </div>
        <div class="form-group form-group--full">
          <label class="form-label" for="personalSummary">Professional Summary</label>
          <textarea id="personalSummary" class="form-textarea" placeholder="Write a brief professional summary about yourself..." data-field="personal.summary" rows="4"></textarea>
          <p class="form-hint">Tip: Click "AI Suggestions" to auto-generate a professional summary</p>
        </div>
      </div>
    </div>
  `;
}

function renderEducationStep() {
  return `
    <div class="form-step" data-step="1">
      <div class="repeatable-section" id="educationSection">
        ${formData.education.length === 0 ? renderEducationItem(0) : formData.education.map((_, i) => renderEducationItem(i)).join('')}
      </div>
      <button type="button" class="add-item-btn" id="addEducation">
        <span>+</span> Add Another Education
      </button>
    </div>
  `;
}

function renderEducationItem(index) {
  return `
    <div class="repeatable-item" data-index="${index}" data-section="education">
      <div class="repeatable-item__header">
        <span class="repeatable-item__title">Education #${index + 1}</span>
        ${index > 0 ? '<button type="button" class="repeatable-item__remove" data-remove="education" data-index="' + index + '">✕</button>' : ''}
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Degree / Program *</label>
          <input type="text" class="form-input" placeholder="B.S. Computer Science" data-array="education" data-index="${index}" data-key="degree">
        </div>
        <div class="form-group">
          <label class="form-label">Institution *</label>
          <input type="text" class="form-input" placeholder="MIT" data-array="education" data-index="${index}" data-key="institution">
        </div>
        <div class="form-group">
          <label class="form-label">Year</label>
          <input type="text" class="form-input" placeholder="2020 - 2024" data-array="education" data-index="${index}" data-key="year">
        </div>
        <div class="form-group">
          <label class="form-label">GPA (optional)</label>
          <input type="text" class="form-input" placeholder="3.8 / 4.0" data-array="education" data-index="${index}" data-key="gpa">
        </div>
      </div>
    </div>
  `;
}

function renderSkillsStep() {
  return `
    <div class="form-step" data-step="2">
      <div class="form-group">
        <label class="form-label">Your Skills</label>
        <div class="tag-input-wrapper" id="skillsTagInput">
          <div id="skillsTags"></div>
          <input type="text" class="tag-input" id="skillInput" placeholder="Type a skill and press Enter..." data-section="skills">
        </div>
        <p class="form-hint">Press Enter or comma to add each skill. Click ✕ to remove.</p>
      </div>
      <div id="suggestedSkills" style="margin-top: var(--space-4);"></div>
    </div>
  `;
}

function renderExperienceStep() {
  return `
    <div class="form-step" data-step="3">
      <div class="repeatable-section" id="experienceSection">
        ${formData.experience.length === 0 ? renderExperienceItem(0) : formData.experience.map((_, i) => renderExperienceItem(i)).join('')}
      </div>
      <button type="button" class="add-item-btn" id="addExperience">
        <span>+</span> Add Another Experience
      </button>
    </div>
  `;
}

function renderExperienceItem(index) {
  return `
    <div class="repeatable-item" data-index="${index}" data-section="experience">
      <div class="repeatable-item__header">
        <span class="repeatable-item__title">Experience #${index + 1}</span>
        ${index > 0 ? '<button type="button" class="repeatable-item__remove" data-remove="experience" data-index="' + index + '">✕</button>' : ''}
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Company *</label>
          <input type="text" class="form-input" placeholder="Google" data-array="experience" data-index="${index}" data-key="company">
        </div>
        <div class="form-group">
          <label class="form-label">Role / Title *</label>
          <input type="text" class="form-input" placeholder="Software Engineer" data-array="experience" data-index="${index}" data-key="role">
        </div>
        <div class="form-group">
          <label class="form-label">Duration</label>
          <input type="text" class="form-input" placeholder="Jan 2022 - Present" data-array="experience" data-index="${index}" data-key="duration">
        </div>
        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" class="form-input" placeholder="Mountain View, CA" data-array="experience" data-index="${index}" data-key="location">
        </div>
        <div class="form-group form-group--full">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" placeholder="• Built scalable microservices handling 10K+ requests/sec&#10;• Led a team of 5 engineers to deliver a critical feature&#10;• Reduced deployment time by 40% through CI/CD optimization" data-array="experience" data-index="${index}" data-key="description" rows="5"></textarea>
          <p class="form-hint">Use bullet points (one per line) for best results</p>
        </div>
      </div>
    </div>
  `;
}

function renderProjectsStep() {
  return `
    <div class="form-step" data-step="4">
      <div class="repeatable-section" id="projectsSection">
        ${formData.projects.length === 0 ? renderProjectItem(0) : formData.projects.map((_, i) => renderProjectItem(i)).join('')}
      </div>
      <button type="button" class="add-item-btn" id="addProject">
        <span>+</span> Add Another Project
      </button>
    </div>
  `;
}

function renderProjectItem(index) {
  return `
    <div class="repeatable-item" data-index="${index}" data-section="projects">
      <div class="repeatable-item__header">
        <span class="repeatable-item__title">Project #${index + 1}</span>
        ${index > 0 ? '<button type="button" class="repeatable-item__remove" data-remove="projects" data-index="' + index + '">✕</button>' : ''}
      </div>
      <div class="form-grid">
        <div class="form-group form-group--full">
          <label class="form-label">Project Title *</label>
          <input type="text" class="form-input" placeholder="AI Resume Builder" data-array="projects" data-index="${index}" data-key="title">
        </div>
        <div class="form-group form-group--full">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" placeholder="A web app that generates professional resumes using AI..." data-array="projects" data-index="${index}" data-key="description" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Tech Stack</label>
          <input type="text" class="form-input" placeholder="React, Node.js, MongoDB" data-array="projects" data-index="${index}" data-key="tech">
        </div>
        <div class="form-group">
          <label class="form-label">Link</label>
          <input type="url" class="form-input" placeholder="https://github.com/..." data-array="projects" data-index="${index}" data-key="link">
        </div>
      </div>
    </div>
  `;
}

function renderCertificationsStep() {
  return `
    <div class="form-step" data-step="5">
      <div class="repeatable-section" id="certificationsSection">
        ${formData.certifications.length === 0 ? renderCertificationItem(0) : formData.certifications.map((_, i) => renderCertificationItem(i)).join('')}
      </div>
      <button type="button" class="add-item-btn" id="addCertification">
        <span>+</span> Add Another Certification
      </button>
    </div>
  `;
}

function renderCertificationItem(index) {
  return `
    <div class="repeatable-item" data-index="${index}" data-section="certifications">
      <div class="repeatable-item__header">
        <span class="repeatable-item__title">Certification #${index + 1}</span>
        ${index > 0 ? '<button type="button" class="repeatable-item__remove" data-remove="certifications" data-index="' + index + '">✕</button>' : ''}
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Certification Name *</label>
          <input type="text" class="form-input" placeholder="AWS Solutions Architect" data-array="certifications" data-index="${index}" data-key="name">
        </div>
        <div class="form-group">
          <label class="form-label">Issuing Organization</label>
          <input type="text" class="form-input" placeholder="Amazon Web Services" data-array="certifications" data-index="${index}" data-key="issuer">
        </div>
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="text" class="form-input" placeholder="March 2024" data-array="certifications" data-index="${index}" data-key="date">
        </div>
        <div class="form-group">
          <label class="form-label">Credential Link</label>
          <input type="url" class="form-input" placeholder="https://credential.net/..." data-array="certifications" data-index="${index}" data-key="link">
        </div>
      </div>
    </div>
  `;
}

function renderAchievementsStep() {
  return `
    <div class="form-step" data-step="6">
      <div class="repeatable-section" id="achievementsSection">
        ${formData.achievements.length === 0 ? renderAchievementItem(0) : formData.achievements.map((_, i) => renderAchievementItem(i)).join('')}
      </div>
      <button type="button" class="add-item-btn" id="addAchievement">
        <span>+</span> Add Another Achievement
      </button>
    </div>
  `;
}

function renderAchievementItem(index) {
  return `
    <div class="repeatable-item" data-index="${index}" data-section="achievements">
      <div class="repeatable-item__header">
        <span class="repeatable-item__title">Achievement #${index + 1}</span>
        ${index > 0 ? '<button type="button" class="repeatable-item__remove" data-remove="achievements" data-index="' + index + '">✕</button>' : ''}
      </div>
      <div class="form-grid">
        <div class="form-group form-group--full">
          <label class="form-label">Achievement Title *</label>
          <input type="text" class="form-input" placeholder="Best Paper Award at ACM Conference" data-array="achievements" data-index="${index}" data-key="title">
        </div>
        <div class="form-group form-group--full">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" placeholder="Received the best paper award for research on..." data-array="achievements" data-index="${index}" data-key="description" rows="2"></textarea>
        </div>
      </div>
    </div>
  `;
}

// ── Event Binding ──
function bindFormEvents() {
  // Simple field inputs
  document.querySelectorAll('[data-field]').forEach(input => {
    input.addEventListener('input', (e) => {
      const path = e.target.dataset.field.split('.');
      if (path.length === 2) {
        formData[path[0]][path[1]] = e.target.value;
      }
      notifyChange();
    });
  });

  // Array field inputs
  document.querySelectorAll('[data-array]').forEach(input => {
    input.addEventListener('input', (e) => {
      const section = e.target.dataset.array;
      const index = parseInt(e.target.dataset.index);
      const key = e.target.dataset.key;
      
      if (!formData[section][index]) {
        formData[section][index] = {};
      }
      formData[section][index][key] = e.target.value;
      notifyChange();
    });
  });

  // Add item buttons
  bindAddButton('addEducation', 'education', 'educationSection', renderEducationItem);
  bindAddButton('addExperience', 'experience', 'experienceSection', renderExperienceItem);
  bindAddButton('addProject', 'projects', 'projectsSection', renderProjectItem);
  bindAddButton('addCertification', 'certifications', 'certificationsSection', renderCertificationItem);
  bindAddButton('addAchievement', 'achievements', 'achievementsSection', renderAchievementItem);

  // Remove buttons
  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const section = e.currentTarget.dataset.remove;
      const index = parseInt(e.currentTarget.dataset.index);
      removeItem(section, index);
    });
  });

  // Navigation
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const generateBtn = document.getElementById('generateBtn');

  if (prevBtn) prevBtn.addEventListener('click', () => navigatePrev());
  if (nextBtn) nextBtn.addEventListener('click', () => navigateNext());
  if (generateBtn) generateBtn.addEventListener('click', () => {
    collectAllData();
    if (onDataChange) onDataChange(formData, 'generate');
  });

  // Skills tag input
  initSkillsInput();

  // AI button
  const aiBtn = document.getElementById('aiSuggestBtn');
  if (aiBtn) aiBtn.addEventListener('click', toggleAIPanel);
}

function bindAddButton(buttonId, section, containerId, renderFn) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener('click', () => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const newIndex = formData[section].length || container.children.length;
    formData[section][newIndex] = {};
    
    const div = document.createElement('div');
    div.innerHTML = renderFn(newIndex);
    const newItem = div.firstElementChild;
    container.appendChild(newItem);

    // Bind events for new item
    newItem.querySelectorAll('[data-array]').forEach(input => {
      input.addEventListener('input', (e) => {
        const sec = e.target.dataset.array;
        const idx = parseInt(e.target.dataset.index);
        const key = e.target.dataset.key;
        if (!formData[sec][idx]) formData[sec][idx] = {};
        formData[sec][idx][key] = e.target.value;
        notifyChange();
      });
    });

    const removeBtn = newItem.querySelector('[data-remove]');
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        const sec = e.currentTarget.dataset.remove;
        const idx = parseInt(e.currentTarget.dataset.index);
        removeItem(sec, idx);
      });
    }

    // Focus first input of new item
    const firstInput = newItem.querySelector('input');
    if (firstInput) firstInput.focus();

    notifyChange();
  });
}

function removeItem(section, index) {
  formData[section].splice(index, 1);
  notifyChange();
  // Re-render the step
  renderAllSteps();
  showStep(currentStep);
}

// ── Skills Tag Input ──
function initSkillsInput() {
  const input = document.getElementById('skillInput');
  if (!input) return;

  renderSkillTags();

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input.value.trim());
      input.value = '';
    }
    if (e.key === 'Backspace' && input.value === '' && formData.skills.length > 0) {
      formData.skills.pop();
      renderSkillTags();
      notifyChange();
    }
  });

  // Focus input when clicking wrapper
  const wrapper = document.getElementById('skillsTagInput');
  if (wrapper) {
    wrapper.addEventListener('click', () => input.focus());
  }
}

function addSkill(skill) {
  if (skill && !formData.skills.includes(skill)) {
    formData.skills.push(skill);
    renderSkillTags();
    notifyChange();
    updateSkillSuggestions();
  }
}

function removeSkill(index) {
  formData.skills.splice(index, 1);
  renderSkillTags();
  notifyChange();
  updateSkillSuggestions();
}

function renderSkillTags() {
  const container = document.getElementById('skillsTags');
  if (!container) return;

  container.innerHTML = formData.skills.map((skill, i) => `
    <span class="tag">
      ${skill}
      <span class="tag__remove" data-skill-index="${i}">✕</span>
    </span>
  `).join('');

  container.querySelectorAll('.tag__remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeSkill(parseInt(e.target.dataset.skillIndex));
    });
  });
}

function updateSkillSuggestions() {
  const container = document.getElementById('suggestedSkills');
  if (!container || formData.skills.length === 0) {
    if (container) container.innerHTML = '';
    return;
  }

  const { suggestSkills } = await_import_workaround();
  const suggestions = suggestSkillsLocal(formData.skills);

  if (suggestions.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-2);">
      ✨ Suggested skills based on your selections:
    </p>
    <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
      ${suggestions.map(skill => `
        <button type="button" class="tag suggested-skill-tag" style="cursor: pointer; background: rgba(6, 182, 212, 0.1); border-color: rgba(6, 182, 212, 0.25); color: var(--color-accent-light);">
          + ${skill}
        </button>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.suggested-skill-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      const skill = btn.textContent.replace('+ ', '').trim();
      addSkill(skill);
    });
  });
}

// Inline skill suggestion (to avoid circular dependency issues)
function suggestSkillsLocal(currentSkills) {
  const skillRelations = {
    'javascript': ['TypeScript', 'React', 'Node.js', 'Vue.js'],
    'python': ['Django', 'Flask', 'FastAPI', 'NumPy'],
    'react': ['Redux', 'Next.js', 'TypeScript', 'React Native'],
    'node.js': ['Express.js', 'MongoDB', 'GraphQL', 'Redis'],
    'java': ['Spring Boot', 'Hibernate', 'Maven', 'JUnit'],
    'html': ['CSS', 'JavaScript', 'Sass', 'Bootstrap'],
    'css': ['Sass', 'Tailwind CSS', 'Bootstrap', 'CSS Grid'],
    'sql': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
    'docker': ['Kubernetes', 'CI/CD', 'AWS', 'Microservices'],
    'aws': ['EC2', 'S3', 'Lambda', 'CloudFormation'],
    'typescript': ['React', 'Angular', 'Node.js', 'Next.js'],
    'flutter': ['Dart', 'Firebase', 'REST APIs', 'State Management'],
    'machine learning': ['Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
    'c++': ['Data Structures', 'Algorithms', 'OOP', 'STL'],
    'go': ['Microservices', 'gRPC', 'Kubernetes', 'REST APIs'],
    'rust': ['WebAssembly', 'Systems Programming', 'Cargo'],
    'mongodb': ['Mongoose', 'NoSQL', 'Redis', 'Node.js'],
    'figma': ['UI/UX Design', 'Prototyping', 'Adobe XD'],
    'php': ['Laravel', 'WordPress', 'MySQL', 'Composer'],
    'git': ['GitHub', 'GitLab', 'CI/CD', 'Version Control'],
  };
  
  const suggestions = new Set();
  currentSkills.forEach(skill => {
    const key = skill.toLowerCase();
    if (skillRelations[key]) {
      skillRelations[key].forEach(related => {
        if (!currentSkills.some(s => s.toLowerCase() === related.toLowerCase())) {
          suggestions.add(related);
        }
      });
    }
  });
  return Array.from(suggestions).slice(0, 6);
}

function await_import_workaround() {
  return { suggestSkills: suggestSkillsLocal };
}

// ── Navigation ──
function navigateNext() {
  if (currentStep < totalSteps - 1) {
    collectStepData(currentStep);
    showStep(currentStep + 1);
  }
}

function navigatePrev() {
  if (currentStep > 0) {
    collectStepData(currentStep);
    showStep(currentStep - 1);
  }
}

// ── Data Collection ──
function collectStepData(step) {
  // Data is already being collected via event listeners
  // This is a hook for any additional processing needed
  notifyChange();
}

function collectAllData() {
  // Clean empty entries from arrays
  ['education', 'experience', 'projects', 'certifications', 'achievements'].forEach(section => {
    formData[section] = formData[section].filter(item => {
      if (!item) return false;
      return Object.values(item).some(v => v && v.toString().trim() !== '');
    });
  });
}

function populateFormFields() {
  // Populate simple fields
  document.querySelectorAll('[data-field]').forEach(input => {
    const path = input.dataset.field.split('.');
    if (path.length === 2 && formData[path[0]]) {
      input.value = formData[path[0]][path[1]] || '';
    }
  });

  // Populate array fields
  document.querySelectorAll('[data-array]').forEach(input => {
    const section = input.dataset.array;
    const index = parseInt(input.dataset.index);
    const key = input.dataset.key;
    
    if (formData[section] && formData[section][index]) {
      input.value = formData[section][index][key] || '';
    }
  });

  // Populate skill tags
  renderSkillTags();
}

// ── AI Panel ──
function initAIPanel() {
  const overlay = document.getElementById('aiOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeAIPanel);
  }

  const closeBtn = document.getElementById('aiPanelClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeAIPanel);
  }
}

function toggleAIPanel() {
  const panel = document.getElementById('aiPanel');
  const overlay = document.getElementById('aiOverlay');
  if (!panel) return;

  const isOpen = panel.classList.contains('open');
  if (isOpen) {
    closeAIPanel();
  } else {
    openAIPanel();
  }
}

function openAIPanel() {
  collectAllData();
  const panel = document.getElementById('aiPanel');
  const overlay = document.getElementById('aiOverlay');
  
  if (panel) panel.classList.add('open');
  if (overlay) overlay.classList.add('open');

  renderAISuggestions();
}

function closeAIPanel() {
  const panel = document.getElementById('aiPanel');
  const overlay = document.getElementById('aiOverlay');
  
  if (panel) panel.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function renderAISuggestions() {
  const container = document.getElementById('aiSuggestionsList');
  if (!container) return;

  const suggestions = getAISuggestions(formData);

  if (suggestions.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-8); color: var(--text-tertiary);">
        <p style="font-size: var(--text-2xl); margin-bottom: var(--space-3);">✨</p>
        <p>Fill in more details to get AI-powered suggestions!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = suggestions.map((suggestion, i) => `
    <div class="ai-suggestion" style="animation-delay: ${i * 0.1}s">
      <div class="ai-suggestion__category">${suggestion.category}</div>
      <div class="ai-suggestion__text">${suggestion.text.replace(/\n/g, '<br>')}</div>
      <div class="ai-suggestion__actions">
        <button type="button" class="btn btn--sm btn--primary ai-apply-btn" data-suggestion-index="${i}">
          ${suggestion.action}
        </button>
        <button type="button" class="btn btn--sm btn--ghost ai-dismiss-btn" data-suggestion-index="${i}">
          Dismiss
        </button>
      </div>
    </div>
  `).join('');

  // Bind apply buttons
  container.querySelectorAll('.ai-apply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.suggestionIndex);
      applyAISuggestion(suggestions[idx]);
    });
  });

  // Bind dismiss buttons
  container.querySelectorAll('.ai-dismiss-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.ai-suggestion').style.display = 'none';
    });
  });
}

function applyAISuggestion(suggestion) {
  switch (suggestion.type) {
    case 'summary':
      formData.personal.summary = suggestion.text;
      const summaryInput = document.getElementById('personalSummary');
      if (summaryInput) summaryInput.value = suggestion.text;
      showToast('Professional summary applied!', 'success');
      break;

    case 'skills':
      if (suggestion.skills) {
        suggestion.skills.forEach(skill => {
          if (!formData.skills.includes(skill)) {
            formData.skills.push(skill);
          }
        });
        renderSkillTags();
        showToast('Skills added!', 'success');
      }
      break;

    case 'bullet':
      if (suggestion.experienceIndex !== undefined) {
        const exp = formData.experience[suggestion.experienceIndex];
        if (exp && exp.description) {
          exp.description = exp.description.replace(suggestion.original, suggestion.enhanced);
          // Update textarea
          const textareas = document.querySelectorAll(`[data-array="experience"][data-index="${suggestion.experienceIndex}"][data-key="description"]`);
          textareas.forEach(ta => ta.value = exp.description);
        }
        showToast('Bullet point enhanced!', 'success');
      }
      break;

    case 'tip':
      if (suggestion.action.includes('Education')) showStep(1);
      else if (suggestion.action.includes('Experience')) showStep(3);
      closeAIPanel();
      break;

    default:
      showToast('Suggestion noted!', 'info');
  }

  notifyChange();
  renderAISuggestions(); // Refresh suggestions
}

// ── Notifications ──
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function notifyChange() {
  autoSave(formData);
  if (onDataChange) onDataChange(formData, 'update');
}

export { showToast };
