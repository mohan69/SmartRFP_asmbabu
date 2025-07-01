import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Header, Footer, PageNumber, NumberFormat, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun } from 'docx';
import { saveAs } from 'file-saver';

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt';
  includeMetadata?: boolean;
  template?: 'standard' | 'minimal' | 'detailed';
  companyProfile?: any;
}

export const exportProposal = async (
  title: string,
  content: string,
  client: string,
  options: ExportOptions = { format: 'txt' }
): Promise<void> => {
  try {
    switch (options.format) {
      case 'txt':
        await exportAsText(title, content, client, options);
        break;
      case 'pdf':
        await exportAsPDF(title, content, client, options);
        break;
      case 'docx':
        await exportAsDocx(title, content, client, options);
        break;
      default:
        throw new Error('Unsupported export format');
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Failed to export proposal. Please try again.');
  }
};

const exportAsText = async (
  title: string,
  content: string,
  client: string,
  options: ExportOptions
): Promise<void> => {
  let textContent = '';
  
  if (options.includeMetadata && options.companyProfile) {
    textContent += generateTextHeader(options.companyProfile, title, client);
    textContent += `\n${'='.repeat(80)}\n\n`;
  }
  
  textContent += content;
  
  if (options.includeMetadata && options.companyProfile) {
    textContent += '\n\n' + generateTextFooter(options.companyProfile);
  }
  
  const blob = new Blob([textContent], { type: 'text/plain' });
  downloadFile(blob, `${sanitizeFilename(title)}.txt`);
};

const exportAsPDF = async (
  title: string,
  content: string,
  client: string,
  options: ExportOptions
): Promise<void> => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  const lineHeight = 6;
  let currentY = margin;
  let pageNumber = 1;

  // Helper function to add new page
  const addNewPage = () => {
    addPageFooter(pdf, pageNumber, options.companyProfile);
    pdf.addPage();
    pageNumber++;
    currentY = margin;
    
    // Add header to new page
    if (options.includeMetadata && options.companyProfile) {
      addPageHeader(pdf, options.companyProfile, false);
      currentY = 40;
    }
  };

  // Add company logo and header on first page
  if (options.includeMetadata && options.companyProfile) {
    currentY = addPageHeader(pdf, options.companyProfile, true);
    currentY += 10;
  }

  // Add proposal title section
  currentY = addProposalTitle(pdf, title, client, currentY, pageWidth, margin);
  currentY += 15;

  // Process content
  const lines = content.split('\n');
  let inList = false;
  let listIndent = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we need a new page
    if (currentY > pageHeight - 50) {
      addNewPage();
    }

    if (line.trim() === '') {
      currentY += lineHeight / 2;
      inList = false;
      continue;
    }

    // Handle different content types
    if (line.startsWith('# ')) {
      inList = false;
      currentY = addHeading(pdf, line.substring(2), currentY, 1, pageWidth, margin);
    } else if (line.startsWith('## ')) {
      inList = false;
      currentY = addHeading(pdf, line.substring(3), currentY, 2, pageWidth, margin);
    } else if (line.startsWith('### ')) {
      inList = false;
      currentY = addHeading(pdf, line.substring(4), currentY, 3, pageWidth, margin);
    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      if (!inList) {
        currentY += 2;
        inList = true;
      }
      currentY = addBulletPoint(pdf, line.substring(2), currentY, margin, contentWidth);
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        currentY += 2;
        inList = true;
      }
      currentY = addNumberedPoint(pdf, line, currentY, margin, contentWidth);
    } else if (line.includes('**')) {
      inList = false;
      currentY = addFormattedText(pdf, line, currentY, margin, contentWidth);
    } else {
      inList = false;
      currentY = addParagraph(pdf, line, currentY, margin, contentWidth);
    }
    
    // Check if we need a new page after adding content
    if (currentY > pageHeight - 50) {
      addNewPage();
    }
  }

  // Add footer to last page
  addPageFooter(pdf, pageNumber, options.companyProfile);

  // Save the PDF
  pdf.save(`${sanitizeFilename(title)}.pdf`);
};

const addPageHeader = (pdf: jsPDF, companyProfile: any, isFirstPage: boolean): number => {
  let currentY = 15;
  
  if (isFirstPage) {
    // Company logo placeholder (in real implementation, load actual logo)
    pdf.setFillColor(59, 130, 246);
    pdf.rect(20, currentY, 25, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LOGO', 32.5, currentY + 9, { align: 'center' });
    
    // Company name
    pdf.setTextColor(59, 130, 246);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(companyProfile.name, 50, currentY + 10);
    currentY += 20;
    
    // Company details
    pdf.setTextColor(107, 114, 128);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    if (companyProfile.address?.street) {
      pdf.text(companyProfile.address.street, 20, currentY);
      currentY += 4;
    }
    
    if (companyProfile.address?.city) {
      pdf.text(`${companyProfile.address.city}, ${companyProfile.address.state} ${companyProfile.address.zipCode}`, 20, currentY);
      currentY += 4;
    }
    
    if (companyProfile.contact?.phone) {
      pdf.text(`Phone: ${companyProfile.contact.phone}`, 20, currentY);
      currentY += 4;
    }
    
    if (companyProfile.contact?.email) {
      pdf.text(`Email: ${companyProfile.contact.email}`, 20, currentY);
      currentY += 4;
    }
    
    currentY += 5;
  } else {
    // Simplified header for subsequent pages
    pdf.setTextColor(59, 130, 246);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(companyProfile.name, 20, currentY + 5);
    currentY += 15;
  }
  
  // Header line
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(0.5);
  pdf.line(20, currentY, 190, currentY);
  
  return currentY + 5;
};

const addProposalTitle = (pdf: jsPDF, title: string, client: string, currentY: number, pageWidth: number, margin: number): number => {
  // Title background
  pdf.setFillColor(248, 250, 252);
  pdf.rect(margin, currentY, pageWidth - (margin * 2), 25, 'F');
  
  // Title
  pdf.setTextColor(30, 64, 175);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(title, pageWidth - (margin * 2) - 10);
  pdf.text(titleLines, margin + 5, currentY + 8);
  
  // Client info
  pdf.setTextColor(55, 65, 81);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Prepared for: ${client}`, margin + 5, currentY + 16);
  
  // Date
  pdf.setFontSize(10);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, margin + 5, currentY + 21);
  
  return currentY + 25;
};

const addHeading = (pdf: jsPDF, text: string, currentY: number, level: number, pageWidth: number, margin: number): number => {
  const fontSize = level === 1 ? 16 : level === 2 ? 14 : 12;
  const spacing = level === 1 ? 8 : level === 2 ? 6 : 4;
  
  currentY += spacing;
  
  pdf.setTextColor(30, 64, 175);
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'bold');
  
  const lines = pdf.splitTextToSize(text, pageWidth - (margin * 2));
  pdf.text(lines, margin, currentY);
  
  currentY += lines.length * (fontSize * 0.35) + spacing;
  
  // Add underline for level 1 headings
  if (level === 1) {
    pdf.setDrawColor(30, 64, 175);
    pdf.setLineWidth(0.3);
    pdf.line(margin, currentY - 2, margin + 60, currentY - 2);
  }
  
  return currentY;
};

const addParagraph = (pdf: jsPDF, text: string, currentY: number, margin: number, contentWidth: number): number => {
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const lines = pdf.splitTextToSize(text, contentWidth);
  pdf.text(lines, margin, currentY);
  
  return currentY + (lines.length * 5) + 3;
};

const addBulletPoint = (pdf: jsPDF, text: string, currentY: number, margin: number, contentWidth: number): number => {
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  // Add bullet
  pdf.text('•', margin + 5, currentY);
  
  // Add text
  const lines = pdf.splitTextToSize(text, contentWidth - 15);
  pdf.text(lines, margin + 10, currentY);
  
  return currentY + (lines.length * 5) + 2;
};

const addNumberedPoint = (pdf: jsPDF, text: string, currentY: number, margin: number, contentWidth: number): number => {
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const lines = pdf.splitTextToSize(text, contentWidth - 10);
  pdf.text(lines, margin + 5, currentY);
  
  return currentY + (lines.length * 5) + 2;
};

const addFormattedText = (pdf: jsPDF, text: string, currentY: number, margin: number, contentWidth: number): number => {
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  
  // Simple bold text handling
  const parts = text.split('**');
  let xOffset = margin;
  
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      pdf.setFont('helvetica', 'normal');
    } else {
      pdf.setFont('helvetica', 'bold');
    }
    
    if (parts[i]) {
      const textWidth = pdf.getTextWidth(parts[i]);
      if (xOffset + textWidth > margin + contentWidth) {
        currentY += 5;
        xOffset = margin;
      }
      pdf.text(parts[i], xOffset, currentY);
      xOffset += textWidth;
    }
  }
  
  return currentY + 8;
};

const addPageFooter = (pdf: jsPDF, pageNumber: number, companyProfile?: any) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  
  // Footer line
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.3);
  pdf.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
  
  // Company info in footer
  if (companyProfile) {
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    
    let footerText = companyProfile.name;
    if (companyProfile.contact?.phone) {
      footerText += ` | Phone: ${companyProfile.contact.phone}`;
    }
    if (companyProfile.contact?.email) {
      footerText += ` | Email: ${companyProfile.contact.email}`;
    }
    if (companyProfile.contact?.website) {
      footerText += ` | Web: ${companyProfile.contact.website}`;
    }
    
    pdf.text(footerText, pageWidth / 2, pageHeight - 15, { align: 'center' });
  }
  
  // Page number
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
};

const exportAsDocx = async (
  title: string,
  content: string,
  client: string,
  options: ExportOptions
): Promise<void> => {
  const companyProfile = options.companyProfile;
  
  // Create header
  const headerParagraphs = [];
  if (companyProfile && options.includeMetadata) {
    headerParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: companyProfile.name,
            bold: true,
            size: 28,
            color: "3B82F6"
          })
        ],
        alignment: AlignmentType.LEFT,
        spacing: { after: 100 }
      })
    );
  }

  // Create footer
  const footerParagraphs = [];
  if (companyProfile && options.includeMetadata) {
    let footerText = companyProfile.name;
    if (companyProfile.contact?.phone) {
      footerText += ` | Phone: ${companyProfile.contact.phone}`;
    }
    if (companyProfile.contact?.email) {
      footerText += ` | Email: ${companyProfile.contact.email}`;
    }
    if (companyProfile.contact?.website) {
      footerText += ` | Web: ${companyProfile.contact.website}`;
    }
    
    footerParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: footerText,
            size: 16,
            color: "6B7280"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Page ",
            size: 16,
            color: "6B7280"
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 16,
            color: "6B7280"
          })
        ],
        alignment: AlignmentType.CENTER
      })
    );
  } else {
    footerParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Page ",
            size: 16,
            color: "6B7280"
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 16,
            color: "6B7280"
          })
        ],
        alignment: AlignmentType.CENTER
      })
    );
  }

  // Process content into paragraphs
  const paragraphs = [];
  
  // Add company header section
  if (companyProfile && options.includeMetadata) {
    // Company logo placeholder
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "[COMPANY LOGO]",
            size: 20,
            color: "3B82F6",
            bold: true
          })
        ],
        alignment: AlignmentType.LEFT,
        spacing: { after: 200 }
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: companyProfile.name,
            bold: true,
            size: 32,
            color: "1E40AF"
          })
        ],
        alignment: AlignmentType.LEFT,
        spacing: { after: 100 }
      })
    );

    if (companyProfile.address?.street) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: companyProfile.address.street,
              size: 20,
              color: "6B7280"
            })
          ],
          alignment: AlignmentType.LEFT
        })
      );
    }

    if (companyProfile.address?.city) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${companyProfile.address.city}, ${companyProfile.address.state} ${companyProfile.address.zipCode}`,
              size: 20,
              color: "6B7280"
            })
          ],
          alignment: AlignmentType.LEFT
        })
      );
    }

    if (companyProfile.contact?.phone) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Phone: ${companyProfile.contact.phone}`,
              size: 20,
              color: "6B7280"
            })
          ],
          alignment: AlignmentType.LEFT
        })
      );
    }

    if (companyProfile.contact?.email) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Email: ${companyProfile.contact.email}`,
              size: 20,
              color: "6B7280"
            })
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 400 }
        })
      );
    }

    // Horizontal line
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "________________________________________________________________________________________________",
            size: 16,
            color: "3B82F6"
          })
        ],
        spacing: { after: 300 }
      })
    );
  }

  // Add proposal title section
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 36,
          color: "1E40AF"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 }
    })
  );

  // Add client info
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Prepared for: ${client}`,
          size: 24,
          color: "374151",
          bold: true
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Date: ${new Date().toLocaleDateString()}`,
          size: 20,
          color: "6B7280"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 }
    })
  );

  // Process content
  const lines = content.split('\n');
  let inList = false;
  
  for (const line of lines) {
    if (line.trim() === '') {
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
      inList = false;
      continue;
    }

    if (line.startsWith('# ')) {
      inList = false;
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.substring(2),
              bold: true,
              size: 32,
              color: "1E40AF"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );
    } else if (line.startsWith('## ')) {
      inList = false;
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.substring(3),
              bold: true,
              size: 28,
              color: "1E40AF"
            })
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 }
        })
      );
    } else if (line.startsWith('### ')) {
      inList = false;
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.substring(4),
              bold: true,
              size: 24,
              color: "1E40AF"
            })
          ],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 }
        })
      );
    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      if (!inList) {
        inList = true;
      }
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${line.substring(2)}`,
              size: 22
            })
          ],
          indent: { left: 720 },
          spacing: { after: 100 }
        })
      );
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        inList = true;
      }
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 22
            })
          ],
          indent: { left: 720 },
          spacing: { after: 100 }
        })
      );
    } else if (line.includes('**')) {
      inList = false;
      // Handle bold text
      const parts = line.split('**');
      const children = [];
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          if (parts[i]) {
            children.push(new TextRun({ text: parts[i], size: 22 }));
          }
        } else {
          if (parts[i]) {
            children.push(new TextRun({ text: parts[i], bold: true, size: 22 }));
          }
        }
      }
      paragraphs.push(
        new Paragraph({
          children,
          spacing: { after: 100 }
        })
      );
    } else {
      inList = false;
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 22
            })
          ],
          spacing: { after: 100 }
        })
      );
    }
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: headerParagraphs
          })
        },
        footers: {
          default: new Footer({
            children: footerParagraphs
          })
        },
        children: paragraphs
      }
    ],
    numbering: {
      config: [
        {
          reference: "my-numbering",
          levels: [
            {
              level: 0,
              format: NumberFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.START
            }
          ]
        }
      ]
    }
  });

  // Generate and save
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
  saveAs(blob, `${sanitizeFilename(title)}.docx`);
};

const generateTextHeader = (companyProfile: any, title: string, client: string): string => {
  let header = '';
  header += `${companyProfile.name}\n`;
  if (companyProfile.address?.street) {
    header += `${companyProfile.address.street}\n`;
  }
  if (companyProfile.address?.city) {
    header += `${companyProfile.address.city}, ${companyProfile.address.state} ${companyProfile.address.zipCode}\n`;
  }
  if (companyProfile.contact?.phone) {
    header += `Phone: ${companyProfile.contact.phone}\n`;
  }
  if (companyProfile.contact?.email) {
    header += `Email: ${companyProfile.contact.email}\n`;
  }
  header += '\n';
  header += `PROPOSAL: ${title}\n`;
  header += `CLIENT: ${client}\n`;
  header += `DATE: ${new Date().toLocaleDateString()}\n`;
  return header;
};

const generateTextFooter = (companyProfile: any): string => {
  let footer = '\n\n' + '='.repeat(80) + '\n';
  footer += 'CONTACT INFORMATION\n';
  footer += '-'.repeat(20) + '\n';
  
  if (companyProfile.address?.street) {
    footer += `Address: ${companyProfile.address.street}\n`;
    footer += `         ${companyProfile.address.city}, ${companyProfile.address.state} ${companyProfile.address.zipCode}\n`;
    footer += `         ${companyProfile.address.country}\n`;
  }
  if (companyProfile.contact?.phone) {
    footer += `Phone: ${companyProfile.contact.phone}\n`;
  }
  if (companyProfile.contact?.email) {
    footer += `Email: ${companyProfile.contact.email}\n`;
  }
  if (companyProfile.contact?.website) {
    footer += `Website: ${companyProfile.contact.website}\n`;
  }
  if (companyProfile.business?.registration) {
    footer += `Registration: ${companyProfile.business.registration}\n`;
  }
  if (companyProfile.business?.taxId) {
    footer += `Tax ID: ${companyProfile.business.taxId}\n`;
  }
  
  return footer;
};

const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
};

// Share functionality
export interface ShareOptions {
  method: 'email' | 'link' | 'copy';
  includeContent?: boolean;
}

export const shareProposal = async (
  title: string,
  content: string,
  client: string,
  options: ShareOptions
): Promise<void> => {
  try {
    switch (options.method) {
      case 'email':
        await shareViaEmail(title, content, client, options);
        break;
      case 'link':
        await shareViaLink(title, content, client, options);
        break;
      case 'copy':
        await copyToClipboard(title, content, client, options);
        break;
      default:
        throw new Error('Unsupported share method');
    }
  } catch (error) {
    console.error('Share failed:', error);
    throw new Error('Failed to share proposal. Please try again.');
  }
};

const shareViaEmail = async (
  title: string,
  content: string,
  client: string,
  options: ShareOptions
): Promise<void> => {
  const subject = encodeURIComponent(`Proposal: ${title}`);
  const body = encodeURIComponent(
    options.includeContent
      ? `Dear ${client},\n\nPlease find our proposal below:\n\n${content}\n\nBest regards,\nSmartRFP AI Team`
      : `Dear ${client},\n\nWe have prepared a proposal for your review: "${title}"\n\nPlease let us know if you would like us to send the full details.\n\nBest regards,\nSmartRFP AI Team`
  );
  
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
  window.open(mailtoLink);
};

const shareViaLink = async (
  title: string,
  content: string,
  client: string,
  options: ShareOptions
): Promise<void> => {
  const shareData = {
    title: `Proposal: ${title}`,
    text: `Check out this proposal for ${client}`,
    url: window.location.href
  };
  
  if (navigator.share && navigator.canShare(shareData)) {
    await navigator.share(shareData);
  } else {
    await navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
};

const copyToClipboard = async (
  title: string,
  content: string,
  client: string,
  options: ShareOptions
): Promise<void> => {
  const textToCopy = options.includeContent
    ? `PROPOSAL: ${title}\nCLIENT: ${client}\n\n${content}`
    : `Proposal: ${title} for ${client}`;
  
  await navigator.clipboard.writeText(textToCopy);
};