/* ============================================
   AI Resume & Portfolio Builder — Resume Module
   ============================================ */

let currentTemplate = 'modern';
let resumeData = null;

export function initResume(data) {
  resumeData = data;
  currentTemplate = data.selectedTemplate || 'modern';
}

export function setTemplate(template) {
  currentTemplate = template;
  if (resumeData) {
    resumeData.selectedTemplate = template;
  }
  renderResume();
  updateTemplateCards();
}

export function getTemplate() {
  return currentTemplate;
}

export function updateResumeData(data) {
  resumeData = data;
}

export function renderResume() {
  const container = document.getElementById('resumePreview');
  if (!container || !resumeData) return;

  container.className = 'resume-preview';
  
  switch (currentTemplate) {
    case 'classic':
      container.classList.add('resume--classic');
      container.innerHTML = renderClassic();
      break;
    case 'modern':
      container.classList.add('resume--modern');
      container.innerHTML = renderModern();
      break;
    case 'minimal':
      container.classList.add('resume--minimal');
      container.innerHTML = renderMinimal();
      break;
    default:
      container.classList.add('resume--modern');
      container.innerHTML = renderModern();
  }
}

function updateTemplateCards() {
  document.querySelectorAll('.template-card').forEach(card => {
    card.classList.remove('active');
    if (card.dataset.template === currentTemplate) {
      card.classList.add('active');
    }
  });
}

// ── Helpers ──
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDescription(desc) {
  if (!desc) return '';
  return desc.split('\n')
    .filter(line => line.trim())
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(line => line)
    .map(line => `<li>${escapeHtml(line)}</li>`)
    .join('');
}

function hasData(section) {
  if (!resumeData[section]) return false;
  if (Array.isArray(resumeData[section])) {
    return resumeData[section].some(item => {
      if (!item) return false;
      return Object.values(item).some(v => v && v.toString().trim());
    });
  }
  return false;
}

// ── Classic Template ──
function renderClassic() {
  const d = resumeData;
  const p = d.personal;

  let html = `
    <div class="resume__header">
      <div class="resume__name">${escapeHtml(p.name) || 'Your Name'}</div>
      <div class="resume__contact">
        ${p.email ? `<span>${escapeHtml(p.email)}</span>` : ''}
        ${p.email && p.phone ? '<span class="resume__contact-sep">|</span>' : ''}
        ${p.phone ? `<span>${escapeHtml(p.phone)}</span>` : ''}
        ${p.phone && p.location ? '<span class="resume__contact-sep">|</span>' : ''}
        ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
        ${p.location && p.linkedin ? '<span class="resume__contact-sep">|</span>' : ''}
        ${p.linkedin ? `<a href="${escapeHtml(p.linkedin)}">${escapeHtml(p.linkedin)}</a>` : ''}
        ${p.linkedin && p.github ? '<span class="resume__contact-sep">|</span>' : ''}
        ${p.github ? `<a href="${escapeHtml(p.github)}">${escapeHtml(p.github)}</a>` : ''}
      </div>
    </div>
  `;

  if (p.summary) {
    html += `<div class="resume__summary">${escapeHtml(p.summary)}</div>`;
  }

  if (hasData('experience')) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Experience</div>
        ${d.experience.filter(e => e && (e.company || e.role)).map(exp => `
          <div class="resume__entry">
            <div class="resume__entry-header">
              <span class="resume__entry-title">${escapeHtml(exp.role || '')}</span>
              <span class="resume__entry-date">${escapeHtml(exp.duration || '')}</span>
            </div>
            <div class="resume__entry-subtitle">${escapeHtml(exp.company || '')}${exp.location ? ` — ${escapeHtml(exp.location)}` : ''}</div>
            ${exp.description ? `<ul class="resume__entry-desc">${formatDescription(exp.description)}</ul>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  if (hasData('education')) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Education</div>
        ${d.education.filter(e => e && (e.degree || e.institution)).map(edu => `
          <div class="resume__entry">
            <div class="resume__entry-header">
              <span class="resume__entry-title">${escapeHtml(edu.degree || '')}</span>
              <span class="resume__entry-date">${escapeHtml(edu.year || '')}</span>
            </div>
            <div class="resume__entry-subtitle">${escapeHtml(edu.institution || '')}${edu.gpa ? ` — GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (d.skills && d.skills.length > 0) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Skills</div>
        <div class="resume__skills-list">
          ${d.skills.map(skill => `<span class="resume__skill-tag">${escapeHtml(skill)}</span>`).join('')}
        </div>
      </div>
    `;
  }

  if (hasData('projects')) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Projects</div>
        ${d.projects.filter(p => p && p.title).map(proj => `
          <div class="resume__entry">
            <div class="resume__entry-header">
              <span class="resume__entry-title">${escapeHtml(proj.title)}</span>
              ${proj.link ? `<a class="resume__entry-link" href="${escapeHtml(proj.link)}" target="_blank">View →</a>` : ''}
            </div>
            ${proj.description ? `<div class="resume__entry-desc" style="list-style:none;"><li>${escapeHtml(proj.description)}</li></div>` : ''}
            ${proj.tech ? `<div class="resume__entry-tech">Tech: ${escapeHtml(proj.tech)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  if (hasData('certifications')) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Certifications</div>
        ${d.certifications.filter(c => c && c.name).map(cert => `
          <div class="resume__entry">
            <div class="resume__entry-header">
              <span class="resume__entry-title">${escapeHtml(cert.name)}</span>
              <span class="resume__entry-date">${escapeHtml(cert.date || '')}</span>
            </div>
            ${cert.issuer ? `<div class="resume__entry-subtitle">${escapeHtml(cert.issuer)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  if (hasData('achievements')) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Achievements</div>
        ${d.achievements.filter(a => a && a.title).map(ach => `
          <div class="resume__entry">
            <span class="resume__entry-title">${escapeHtml(ach.title)}</span>
            ${ach.description ? `<div class="resume__entry-desc" style="list-style:none; margin-top: 2px;"><li>${escapeHtml(ach.description)}</li></div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  return html;
}

// ── Modern Template ──
function renderModern() {
  const d = resumeData;
  const p = d.personal;

  // Sidebar
  let sidebar = `
    <div class="resume__name">${escapeHtml(p.name) || 'Your Name'}</div>
    <div class="resume__title-role">${detectRole(d.skills)}</div>

    <div class="resume__sidebar-section">
      <div class="resume__sidebar-title">Contact</div>
      <ul class="resume__contact-list">
        ${p.email ? `<li class="resume__contact-item"><span class="resume__contact-icon">✉</span> <a href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a></li>` : ''}
        ${p.phone ? `<li class="resume__contact-item"><span class="resume__contact-icon">☎</span> ${escapeHtml(p.phone)}</li>` : ''}
        ${p.location ? `<li class="resume__contact-item"><span class="resume__contact-icon">◎</span> ${escapeHtml(p.location)}</li>` : ''}
        ${p.linkedin ? `<li class="resume__contact-item"><span class="resume__contact-icon">in</span> <a href="${escapeHtml(p.linkedin)}">${escapeHtml(p.linkedin.replace(/https?:\/\/(www\.)?/, ''))}</a></li>` : ''}
        ${p.github ? `<li class="resume__contact-item"><span class="resume__contact-icon">⟨⟩</span> <a href="${escapeHtml(p.github)}">${escapeHtml(p.github.replace(/https?:\/\/(www\.)?/, ''))}</a></li>` : ''}
        ${p.website ? `<li class="resume__contact-item"><span class="resume__contact-icon">⊕</span> <a href="${escapeHtml(p.website)}">${escapeHtml(p.website.replace(/https?:\/\/(www\.)?/, ''))}</a></li>` : ''}
      </ul>
    </div>
  `;

  if (d.skills && d.skills.length > 0) {
    sidebar += `
      <div class="resume__sidebar-section">
        <div class="resume__sidebar-title">Skills</div>
        ${d.skills.slice(0, 10).map(skill => `
          <div class="resume__skill-bar-item">
            <div class="resume__skill-bar-name">${escapeHtml(skill)}</div>
            <div class="resume__skill-bar">
              <div class="resume__skill-bar-fill" style="width: ${70 + Math.random() * 25}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (hasData('certifications')) {
    sidebar += `
      <div class="resume__sidebar-section">
        <div class="resume__sidebar-title">Certifications</div>
        ${d.certifications.filter(c => c && c.name).map(cert => `
          <div class="resume__cert-item">${escapeHtml(cert.name)}${cert.date ? ` (${escapeHtml(cert.date)})` : ''}</div>
        `).join('')}
      </div>
    `;
  }

  if (hasData('education')) {
    sidebar += `
      <div class="resume__sidebar-section">
        <div class="resume__sidebar-title">Education</div>
        ${d.education.filter(e => e && (e.degree || e.institution)).map(edu => `
          <div style="margin-bottom: 10px;">
            <div style="font-size: 10px; font-weight: 600; color: #fff;">${escapeHtml(edu.degree || '')}</div>
            <div style="font-size: 9px; color: rgba(255,255,255,0.7);">${escapeHtml(edu.institution || '')}</div>
            <div style="font-size: 9px; color: rgba(255,255,255,0.5);">${escapeHtml(edu.year || '')}${edu.gpa ? ` | GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Main content
  let main = '';

  if (p.summary) {
    main += `
      <div class="resume__section">
        <div class="resume__section-title">About Me</div>
        <div class="resume__summary">${escapeHtml(p.summary)}</div>
      </div>
    `;
  }

  if (hasData('experience')) {
    main += `
      <div class="resume__section">
        <div class="resume__section-title">Experience</div>
        ${d.experience.filter(e => e && (e.company || e.role)).map(exp => `
          <div class="resume__entry">
            <div class="resume__entry-header">
              <span class="resume__entry-title">${escapeHtml(exp.role || '')}</span>
              <span class="resume__entry-date">${escapeHtml(exp.duration || '')}</span>
            </div>
            <div class="resume__entry-subtitle">${escapeHtml(exp.company || '')}${exp.location ? ` · ${escapeHtml(exp.location)}` : ''}</div>
            ${exp.description ? `<ul class="resume__entry-desc">${formatDescription(exp.description)}</ul>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  if (hasData('projects')) {
    main += `
      <div class="resume__section">
        <div class="resume__section-title">Projects</div>
        ${d.projects.filter(p => p && p.title).map(proj => `
          <div class="resume__entry">
            <div class="resume__entry-header">
              <span class="resume__entry-title">${escapeHtml(proj.title)}</span>
              ${proj.link ? `<a class="resume__entry-link" href="${escapeHtml(proj.link)}" target="_blank">View →</a>` : ''}
            </div>
            ${proj.description ? `<div class="resume__entry-subtitle">${escapeHtml(proj.description)}</div>` : ''}
            ${proj.tech ? `<div class="resume__entry-tech">Built with: ${escapeHtml(proj.tech)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  if (hasData('achievements')) {
    main += `
      <div class="resume__section">
        <div class="resume__section-title">Achievements</div>
        ${d.achievements.filter(a => a && a.title).map(ach => `
          <div class="resume__entry">
            <span class="resume__entry-title">${escapeHtml(ach.title)}</span>
            ${ach.description ? `<div class="resume__entry-subtitle">${escapeHtml(ach.description)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
    <div class="resume__sidebar">${sidebar}</div>
    <div class="resume__main">${main}</div>
  `;
}

// ── Minimal Template ──
function renderMinimal() {
  const d = resumeData;
  const p = d.personal;

  let html = `
    <div class="resume__header">
      <div class="resume__name">${escapeHtml(p.name) || 'Your Name'}</div>
      <div class="resume__contact">
        ${p.email ? `<span>${escapeHtml(p.email)}</span>` : ''}
        ${p.phone ? `<span>${escapeHtml(p.phone)}</span>` : ''}
        ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
        ${p.linkedin ? `<a href="${escapeHtml(p.linkedin)}">${escapeHtml(p.linkedin.replace(/https?:\/\/(www\.)?/, ''))}</a>` : ''}
        ${p.github ? `<a href="${escapeHtml(p.github)}">${escapeHtml(p.github.replace(/https?:\/\/(www\.)?/, ''))}</a>` : ''}
      </div>
    </div>
  `;

  if (p.summary) {
    html += `
      <div class="resume__divider"></div>
      <div class="resume__summary">${escapeHtml(p.summary)}</div>
    `;
  }

  html += '<div class="resume__divider"></div>';

  if (hasData('experience')) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Experience</div>
        ${d.experience.filter(e => e && (e.company || e.role)).map(exp => `
          <div class="resume__entry">
            <div class="resume__entry-header">
              <span class="resume__entry-title">${escapeHtml(exp.role || '')}</span>
              <span class="resume__entry-date">${escapeHtml(exp.duration || '')}</span>
            </div>
            <div class="resume__entry-subtitle">${escapeHtml(exp.company || '')}${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
            ${exp.description ? `<ul class="resume__entry-desc">${formatDescription(exp.description)}</ul>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  if (hasData('education')) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Education</div>
        ${d.education.filter(e => e && (e.degree || e.institution)).map(edu => `
          <div class="resume__entry">
            <div class="resume__entry-header">
              <span class="resume__entry-title">${escapeHtml(edu.degree || '')}</span>
              <span class="resume__entry-date">${escapeHtml(edu.year || '')}</span>
            </div>
            <div class="resume__entry-subtitle">${escapeHtml(edu.institution || '')}${edu.gpa ? ` · GPA: ${escapeHtml(edu.gpa)}` : ''}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (d.skills && d.skills.length > 0) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Skills</div>
        <div class="resume__skills-list">
          ${d.skills.map(skill => `<span class="resume__skill-tag">${escapeHtml(skill)}</span>`).join('')}
        </div>
      </div>
    `;
  }

  if (hasData('projects')) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Projects</div>
        ${d.projects.filter(p => p && p.title).map(proj => `
          <div class="resume__entry">
            <div class="resume__entry-header">
              <span class="resume__entry-title">${escapeHtml(proj.title)}</span>
              ${proj.link ? `<a class="resume__entry-link" href="${escapeHtml(proj.link)}" target="_blank">Link</a>` : ''}
            </div>
            ${proj.description ? `<div class="resume__entry-subtitle">${escapeHtml(proj.description)}</div>` : ''}
            ${proj.tech ? `<div class="resume__entry-tech">${escapeHtml(proj.tech)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  if (hasData('certifications')) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Certifications</div>
        ${d.certifications.filter(c => c && c.name).map(cert => `
          <div class="resume__entry">
            <div class="resume__entry-header">
              <span class="resume__entry-title">${escapeHtml(cert.name)}</span>
              <span class="resume__entry-date">${escapeHtml(cert.date || '')}</span>
            </div>
            ${cert.issuer ? `<div class="resume__entry-subtitle">${escapeHtml(cert.issuer)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  if (hasData('achievements')) {
    html += `
      <div class="resume__section">
        <div class="resume__section-title">Achievements</div>
        ${d.achievements.filter(a => a && a.title).map(ach => `
          <div class="resume__entry">
            <span class="resume__entry-title">${escapeHtml(ach.title)}</span>
            ${ach.description ? `<div class="resume__entry-subtitle">${escapeHtml(ach.description)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  return html;
}

// Detect role from skills
function detectRole(skills) {
  if (!skills || skills.length === 0) return 'Professional';
  const skillsLower = skills.map(s => s.toLowerCase());
  
  if (skillsLower.some(s => ['react', 'vue', 'angular', 'html', 'css', 'frontend'].includes(s))) return 'Frontend Developer';
  if (skillsLower.some(s => ['node.js', 'express', 'django', 'flask', 'backend'].includes(s))) return 'Backend Developer';
  if (skillsLower.some(s => ['machine learning', 'deep learning', 'tensorflow', 'pytorch'].includes(s))) return 'ML Engineer';
  if (skillsLower.some(s => ['figma', 'ui/ux', 'adobe xd', 'design'].includes(s))) return 'UI/UX Designer';
  if (skillsLower.some(s => ['flutter', 'react native', 'swift', 'kotlin'].includes(s))) return 'Mobile Developer';
  if (skillsLower.some(s => ['aws', 'docker', 'kubernetes', 'devops'].includes(s))) return 'DevOps Engineer';
  if (skillsLower.length > 3) return 'Full Stack Developer';
  return 'Software Developer';
}

export function renderTemplateCards() {
  const container = document.getElementById('templateCards');
  if (!container) return;

  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      desc: 'Traditional & professional',
      preview: `
        <div class="template-card__preview-inner preview-classic">
          <div class="preview-header">
            <div class="preview-name">John Doe</div>
            <div class="preview-line preview-line-short" style="margin: 3px auto;"></div>
          </div>
          <div class="preview-section-title">EXPERIENCE</div>
          <div class="preview-line"></div>
          <div class="preview-line preview-line-medium"></div>
          <div class="preview-line"></div>
          <div class="preview-section-title">EDUCATION</div>
          <div class="preview-line preview-line-medium"></div>
          <div class="preview-line preview-line-short"></div>
          <div class="preview-section-title">SKILLS</div>
          <div class="preview-line"></div>
        </div>
      `
    },
    {
      id: 'modern',
      name: 'Modern',
      desc: 'Two-column with sidebar',
      preview: `
        <div class="template-card__preview-inner preview-modern">
          <div class="preview-sidebar">
            <div class="preview-name">John</div>
            <div class="preview-line"></div>
            <div class="preview-line" style="width: 70%;"></div>
            <div style="margin-top: 6px;"></div>
            <div class="preview-bar"></div>
            <div class="preview-bar" style="--w: 80%;"></div>
            <div class="preview-bar" style="--w: 60%;"></div>
          </div>
          <div class="preview-main">
            <div class="preview-section-title">About</div>
            <div class="preview-line"></div>
            <div class="preview-line" style="width: 80%;"></div>
            <div class="preview-section-title">Experience</div>
            <div class="preview-line"></div>
            <div class="preview-line" style="width: 90%;"></div>
            <div class="preview-line" style="width: 70%;"></div>
          </div>
        </div>
      `
    },
    {
      id: 'minimal',
      name: 'Minimal',
      desc: 'Clean & spacious',
      preview: `
        <div class="template-card__preview-inner preview-minimal">
          <div class="preview-name">John Doe</div>
          <div class="preview-line" style="width: 50%; margin: 3px 0;"></div>
          <div class="preview-divider"></div>
          <div class="preview-section-title">EXPERIENCE</div>
          <div class="preview-line"></div>
          <div class="preview-line" style="width: 85%;"></div>
          <div class="preview-divider"></div>
          <div class="preview-section-title">EDUCATION</div>
          <div class="preview-line" style="width: 75%;"></div>
          <div class="preview-divider"></div>
          <div class="preview-section-title">SKILLS</div>
          <div class="preview-line" style="width: 65%;"></div>
        </div>
      `
    }
  ];

  container.innerHTML = templates.map(t => `
    <div class="template-card ${t.id === currentTemplate ? 'active' : ''}" data-template="${t.id}" id="templateCard_${t.id}">
      <div class="template-card__preview">${t.preview}</div>
      <div class="template-card__name">${t.name}</div>
      <div class="template-card__desc">${t.desc}</div>
    </div>
  `).join('');

  container.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      setTemplate(card.dataset.template);
    });
  });
}
