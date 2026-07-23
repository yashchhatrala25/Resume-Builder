/* ============================================
   AI Resume & Portfolio Builder — PDF Module
   ============================================ */

export async function generatePDF(resumeData) {
  const element = document.getElementById('resumePreview');
  if (!element) {
    throw new Error('Resume preview not found');
  }

  // Show loading state
  const downloadBtn = document.getElementById('downloadPdfBtn');
  let originalText = '';
  if (downloadBtn) {
    originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span class="spinner"></span> Generating...';
    downloadBtn.disabled = true;
  }

  try {
    // Wait for html2pdf to be available
    if (typeof html2pdf === 'undefined') {
      throw new Error('html2pdf library not loaded. Please check your internet connection.');
    }

    const name = resumeData.personal.name || 'Resume';
    const fileName = name.replace(/\s+/g, '_') + '_Resume.pdf';

    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    await html2pdf().set(opt).from(element).save();

    showPDFToast('PDF downloaded successfully!', 'success');
  } catch (error) {
    console.error('PDF generation failed:', error);
    showPDFToast('Failed to generate PDF. ' + error.message, 'error');
  } finally {
    // Restore button state
    if (downloadBtn) {
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }
  }
}

function showPDFToast(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '✕'}</span>
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
