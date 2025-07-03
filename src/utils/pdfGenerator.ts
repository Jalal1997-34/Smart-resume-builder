import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Resume } from '../types';

export const generatePDF = async (resume: Resume): Promise<void> => {
  try {
    // Get the resume preview element
    const element = document.getElementById('resume-preview');
    if (!element) {
      throw new Error('Resume preview element not found');
    }

    // Configure html2canvas options
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > 297 ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    
    if (imgHeight <= 297) {
      // Single page
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // Multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      const pageHeight = 297;

      while (heightLeft >= 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        
        if (heightLeft > 0) {
          pdf.addPage();
        }
      }
    }

    // Generate filename
    const filename = `${resume.personalInfo.fullName || 'Resume'}_${resume.title}.pdf`
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};