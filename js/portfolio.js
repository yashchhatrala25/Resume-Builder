/* ============================================
   AI Resume & Portfolio Builder — Portfolio Module
   ============================================ */

let portfolioData = null;

export function initPortfolio(data) {
  portfolioData = data;
}

export function updatePortfolioData(data) {
  portfolioData = data;
}

export function renderPortfolio() {
  const container = document.getElementById('portfolioContent');
  if (!container || !portfolioData) return;

  const d = portfolioData;
  const p = d.personal;

  container.innerHTML = `
    <!-- Portfolio Nav -->
    <nav class="portfolio-nav">
      <div class="portfolio-nav__list">
        <a href="#portfolio-about" class="portfolio-nav__link active" data-section="portfolio-about">About</a>
        ${d.skills.length > 0 ? '<a href="#portfolio-skills" class="portfolio-nav__link" data-section="portfolio-skills">Skills</a>' : ''}
        ${hasItems(d.projects) ? '<a href="#portfolio-projects" class="portfolio-nav__link" data-section="portfolio-projects">Projects</a>' : ''}
        ${hasItems(d.experience) ? '<a href="#portfolio-experience" class="portfolio-nav__link" data-section="portfolio-experience">Experience</a>' : ''}
        ${hasItems(d.certifications) || hasItems(d.achievements) ? '<a href="#portfolio-more" class="portfolio-nav__link" data-section="portfolio-more">More</a>' : ''}
        <a href="#portfolio-contact" class="portfolio-nav__link" data-section="portfolio-contact">Contact</a>
      </div>
    </nav>

    <!-- Hero / About Section -->
    <section class="portfolio-hero" id="portfolio-about">
      <div class="portfolio-hero__content">
        <div class="portfolio-hero__avatar">
          ${getInitials(p.name)}
        </div>
        <h1 class="portfolio-hero__name gradient-text">${escapeHtml(p.name) || 'Your Name'}</h1>
        <p class="portfolio-hero__tagline">${escapeHtml(p.summary) || 'Welcome to my portfolio'}</p>
        <div class="portfolio-hero__links">
          ${p.email ? `<a href="mailto:${escapeHtml(p.email)}" class="portfolio-hero__link">✉ Email</a>` : ''}
          ${p.linkedin ? `<a href="${escapeHtml(p.linkedin)}" class="portfolio-hero__link" target="_blank">in LinkedIn</a>` : ''}
          ${p.github ? `<a href="${escapeHtml(p.github)}" class="portfolio-hero__link" target="_blank">⟨⟩ GitHub</a>` : ''}
          ${p.website ? `<a href="${escapeHtml(p.website)}" class="portfolio-hero__link" target="_blank">⊕ Website</a>` : ''}
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    ${d.skills.length > 0 ? `
      <section class="portfolio-section" id="portfolio-skills">
        <div class="portfolio-section__header">
          <div class="portfolio-section__label">What I Know</div>
          <h2 class="portfolio-section__title">Skills & Technologies</h2>
        </div>
        <div class="skill-tags">
          ${d.skills.map((skill, i) => `
            <div class="skill-tag animate-on-scroll" style="animation-delay: ${i * 0.05}s">${escapeHtml(skill)}</div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Projects Section -->
    ${hasItems(d.projects) ? `
      <section class="portfolio-section" id="portfolio-projects">
        <div class="portfolio-section__header">
          <div class="portfolio-section__label">My Work</div>
          <h2 class="portfolio-section__title">Featured Projects</h2>
        </div>
        <div class="projects-grid">
          ${d.projects.filter(p => p && p.title).map((proj, i) => `
            <div class="project-card animate-on-scroll" style="animation-delay: ${i * 0.1}s">
              <div class="project-card__icon">📁</div>
              <h3 class="project-card__title">${escapeHtml(proj.title)}</h3>
              <p class="project-card__desc">${escapeHtml(proj.description || 'No description provided.')}</p>
              ${proj.tech ? `
                <div class="project-card__tech">
                  ${proj.tech.split(',').map(t => `<span class="project-card__tech-tag">${escapeHtml(t.trim())}</span>`).join('')}
                </div>
              ` : ''}
              ${proj.link ? `<a href="${escapeHtml(proj.link)}" class="project-card__link" target="_blank">View Project →</a>` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Experience Section -->
    ${hasItems(d.experience) ? `
      <section class="portfolio-section" id="portfolio-experience">
        <div class="portfolio-section__header">
          <div class="portfolio-section__label">My Journey</div>
          <h2 class="portfolio-section__title">Work Experience</h2>
        </div>
        <div class="timeline">
          ${d.experience.filter(e => e && (e.company || e.role)).map((exp, i) => `
            <div class="timeline-item animate-on-scroll" style="animation-delay: ${i * 0.15}s">
              <div class="timeline-item__dot"></div>
              <div class="timeline-item__date">${escapeHtml(exp.duration || '')}</div>
              <div class="timeline-item__card">
                <h3 class="timeline-item__title">${escapeHtml(exp.role || '')}</h3>
                <div class="timeline-item__company">${escapeHtml(exp.company || '')}${exp.location ? ` · ${escapeHtml(exp.location)}` : ''}</div>
                ${exp.description ? `<p class="timeline-item__desc">${escapeHtml(exp.description).replace(/\n/g, '<br>')}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Certifications & Achievements -->
    ${hasItems(d.certifications) || hasItems(d.achievements) ? `
      <section class="portfolio-section" id="portfolio-more">
        <div class="portfolio-section__header">
          <div class="portfolio-section__label">Recognition</div>
          <h2 class="portfolio-section__title">Certifications & Achievements</h2>
        </div>
        <div class="achievements-grid">
          ${(d.certifications || []).filter(c => c && c.name).map((cert, i) => `
            <div class="achievement-card animate-on-scroll" style="animation-delay: ${i * 0.1}s">
              <div class="achievement-card__icon">🏅</div>
              <h4 class="achievement-card__title">${escapeHtml(cert.name)}</h4>
              ${cert.issuer ? `<p class="achievement-card__desc">${escapeHtml(cert.issuer)}</p>` : ''}
              ${cert.date ? `<div class="achievement-card__meta">${escapeHtml(cert.date)}</div>` : ''}
            </div>
          `).join('')}
          ${(d.achievements || []).filter(a => a && a.title).map((ach, i) => `
            <div class="achievement-card animate-on-scroll" style="animation-delay: ${(i + (d.certifications || []).length) * 0.1}s">
              <div class="achievement-card__icon">🏆</div>
              <h4 class="achievement-card__title">${escapeHtml(ach.title)}</h4>
              ${ach.description ? `<p class="achievement-card__desc">${escapeHtml(ach.description)}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Contact Section -->
    <section class="portfolio-section" id="portfolio-contact">
      <div class="portfolio-section__header">
        <div class="portfolio-section__label">Get In Touch</div>
        <h2 class="portfolio-section__title">Contact Me</h2>
      </div>
      <div class="contact-grid">
        ${p.email ? `
          <div class="contact-card animate-on-scroll">
            <div class="contact-card__icon">✉</div>
            <div class="contact-card__label">Email</div>
            <div class="contact-card__value"><a href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a></div>
          </div>
        ` : ''}
        ${p.phone ? `
          <div class="contact-card animate-on-scroll">
            <div class="contact-card__icon">☎</div>
            <div class="contact-card__label">Phone</div>
            <div class="contact-card__value">${escapeHtml(p.phone)}</div>
          </div>
        ` : ''}
        ${p.location ? `
          <div class="contact-card animate-on-scroll">
            <div class="contact-card__icon">◎</div>
            <div class="contact-card__label">Location</div>
            <div class="contact-card__value">${escapeHtml(p.location)}</div>
          </div>
        ` : ''}
        ${p.linkedin ? `
          <div class="contact-card animate-on-scroll">
            <div class="contact-card__icon">in</div>
            <div class="contact-card__label">LinkedIn</div>
            <div class="contact-card__value"><a href="${escapeHtml(p.linkedin)}" target="_blank">${escapeHtml(p.linkedin.replace(/https?:\/\/(www\.)?/, ''))}</a></div>
          </div>
        ` : ''}
        ${p.github ? `
          <div class="contact-card animate-on-scroll">
            <div class="contact-card__icon">⟨⟩</div>
            <div class="contact-card__label">GitHub</div>
            <div class="contact-card__value"><a href="${escapeHtml(p.github)}" target="_blank">${escapeHtml(p.github.replace(/https?:\/\/(www\.)?/, ''))}</a></div>
          </div>
        ` : ''}
      </div>
    </section>

    <!-- Portfolio Footer -->
    <footer class="portfolio-footer">
      <p class="portfolio-footer__text">Built with ❤️ using AI Resume & Portfolio Builder</p>
    </footer>
  `;

  // Init scroll animations
  initScrollAnimations();
  
  // Init portfolio nav
  initPortfolioNav();
}

function hasItems(arr) {
  if (!arr || !Array.isArray(arr)) return false;
  return arr.some(item => {
    if (!item) return false;
    return Object.values(item).some(v => v && v.toString().trim());
  });
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

function initPortfolioNav() {
  const links = document.querySelectorAll('.portfolio-nav__link');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        const offset = 120; // header + nav height
        const top = target.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Scroll spy
  const sections = document.querySelectorAll('.portfolio-section, .portfolio-hero');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.id;
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  });
}
