/* ============================================
   AI Resume & Portfolio Builder — App Controller
   ============================================ */

import { loadData, saveData, clearData } from './storage.js';
import { initForm, updateFormData, showToast } from './form.js';
import { initResume, updateResumeData, renderResume, renderTemplateCards, setTemplate, getTemplate } from './resume.js';
import { initPortfolio, updatePortfolioData, renderPortfolio } from './portfolio.js';
import { generatePDF } from './pdf.js';

let appData = null;
let currentPage = 'landing';

// ── Initialize App ──
function init() {
  appData = loadData();

  // Setup header
  setupHeader();

  // Handle hash routing
  handleRoute();
  window.addEventListener('hashchange', handleRoute);

  // Scroll animations for landing page
  initScrollObserver();

  // Header scroll effect
  initHeaderScroll();

  console.log('✨ AI Resume & Portfolio Builder initialized');
}

// ── Routing ──
function handleRoute() {
  const hash = window.location.hash.slice(1) || 'landing';
  navigateTo(hash);
}

function navigateTo(page) {
  currentPage = page;

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });

  // Show target page
  const targetPage = document.getElementById(`page-${page}`);
  if (targetPage) {
    targetPage.classList.add('active');

    // Trigger fade in animation
    requestAnimationFrame(() => {
      targetPage.style.opacity = '1';
    });
  }

  // Page-specific initialization
  switch (page) {
    case 'landing':
      initScrollObserver();
      break;
    case 'form':
      initFormPage();
      break;
    case 'resume':
      initResumePage();
      break;
    case 'portfolio':
      initPortfolioPage();
      break;
  }

  // Update nav buttons
  updateNavButtons();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavButtons() {
  document.querySelectorAll('.header__nav .btn').forEach(btn => {
    btn.classList.remove('btn--primary');
    btn.classList.add('btn--ghost');
  });
}

// ── Header Setup ──
function setupHeader() {
  // Logo click -> landing
  const logo = document.getElementById('headerLogo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.hash = '#landing';
    });
  }

  // Nav buttons
  const navBtns = {
    'navFormBtn': 'form',
    'navResumeBtn': 'resume',
    'navPortfolioBtn': 'portfolio'
  };

  Object.entries(navBtns).forEach(([id, page]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        window.location.hash = `#${page}`;
      });
    }
  });

  // Landing page CTA buttons
  document.querySelectorAll('[data-navigate]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.hash = `#${btn.dataset.navigate}`;
    });
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  });
}

// ── Form Page ──
function initFormPage() {
  appData = loadData();
  initForm(appData, onFormDataChange);
}

function onFormDataChange(data, action) {
  appData = data;

  if (action === 'generate') {
    // Save and navigate to resume
    saveData(appData);
    window.location.hash = '#resume';
  }
}

// ── Resume Page ──
function initResumePage() {
  appData = loadData();
  initResume(appData);
  renderTemplateCards();
  renderResume();

  // Download PDF button
  const downloadBtn = document.getElementById('downloadPdfBtn');
  if (downloadBtn) {
    // Remove old listener by cloning
    const newBtn = downloadBtn.cloneNode(true);
    downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);
    newBtn.addEventListener('click', () => {
      generatePDF(appData);
    });
  }

  // Edit Resume button
  const editBtn = document.getElementById('editResumeBtn');
  if (editBtn) {
    const newBtn = editBtn.cloneNode(true);
    editBtn.parentNode.replaceChild(newBtn, editBtn);
    newBtn.addEventListener('click', () => {
      window.location.hash = '#form';
    });
  }

  // View Portfolio button
  const portfolioBtn = document.getElementById('viewPortfolioBtn');
  if (portfolioBtn) {
    const newBtn = portfolioBtn.cloneNode(true);
    portfolioBtn.parentNode.replaceChild(newBtn, portfolioBtn);
    newBtn.addEventListener('click', () => {
      window.location.hash = '#portfolio';
    });
  }

  // Print button
  const printBtn = document.getElementById('printResumeBtn');
  if (printBtn) {
    const newBtn = printBtn.cloneNode(true);
    printBtn.parentNode.replaceChild(newBtn, printBtn);
    newBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

// ── Portfolio Page ──
function initPortfolioPage() {
  appData = loadData();
  initPortfolio(appData);
  renderPortfolio();
}

// ── Scroll Observer for Landing ──
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ── Start App ──
document.addEventListener('DOMContentLoaded', init);
