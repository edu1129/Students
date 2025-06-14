import React, { useState, useRef } from 'react';
import { Settings, FileJson, ImageDown, FileText } from 'lucide-react';
import ProfileSection from './ProfileSection';
import { StudentFullData, MessageType } from '../types';
import Message from './Message';
import { sanitizeText } from '../utils/formatter';
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../constants'; // Assuming these are Tailwind color names

interface ActionSectionProps {
  studentData: StudentFullData | null;
  profileViewRef: React.RefObject<HTMLDivElement>; // Ref to the main profile view for image/PDF capture
  setLoading: (loading: boolean, message?: string) => void;
}

const ActionSection: React.FC<ActionSectionProps> = ({ studentData, profileViewRef, setLoading }) => {
  const [actionMessage, setActionMessage] = useState<MessageType | null>(null);
  const [generatedCanvas, setGeneratedCanvas] = useState<HTMLCanvasElement | null>(null);

  const studentNameSanitized = studentData?.profile?.Name ? sanitizeText(studentData.profile.Name).replace(/ /g, '_') : 'student_report';

  const handleDownloadJson = () => {
    setActionMessage(null);
    if (!studentData) {
      setActionMessage({ text: 'No data to download.', type: 'error' });
      return;
    }
    try {
      const jsonData = JSON.stringify(studentData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${studentNameSanitized}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setActionMessage({ text: 'JSON data downloaded.', type: 'success' });
    } catch (error) {
      console.error("Error downloading JSON:", error);
      setActionMessage({ text: 'Failed to download JSON data.', type: 'error' });
    }
  };

  const handleDownloadImage = async () => {
    setActionMessage(null);
    setGeneratedCanvas(null);
    if (!profileViewRef.current) {
      setActionMessage({ text: 'Profile view element not found for capture.', type: 'error' });
      return;
    }
    setLoading(true, 'Generating Report Image...');
    try {
      // Temporarily adjust styles for capture if needed, e.g., remove shadows from buttons inside ActionSection
      const actionButtons = profileViewRef.current.querySelectorAll('#action-section button');
      actionButtons.forEach(btn => (btn as HTMLElement).style.boxShadow = 'none');

      const canvas = await html2canvas(profileViewRef.current, {
        scale: 2,
        useCORS: true, // For external images like profile photo
        logging: false,
        ignoreElements: (element) => element.id === 'action-section' // Ignore the action section itself for a cleaner report
      });

      actionButtons.forEach(btn => (btn as HTMLElement).style.boxShadow = ''); // Restore shadows


      setGeneratedCanvas(canvas); // Store for PDF
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png', 1.0);
      a.download = `${studentNameSanitized}.png`;
      a.click();
      setActionMessage({ text: 'Report image (PNG) downloaded!', type: 'success' });
    } catch (err) {
      console.error('Error generating image:', err);
      setActionMessage({ text: 'Could not generate report image. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    setActionMessage(null);
    if (!generatedCanvas) {
      setActionMessage({ text: 'Please generate the report image first (click Download Report (PNG)).', type: 'info' });
      return;
    }
    setLoading(true, 'Creating PDF...');
    try {
      const imgData = generatedCanvas.toDataURL('image/png', 1.0);
      const imgWidth = generatedCanvas.width;
      const imgHeight = generatedCanvas.height;

      // jsPDF is global
      const pdf = new jspdf.jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight], // Use image dimensions for PDF page
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${studentNameSanitized}.pdf`);
      setActionMessage({ text: 'PDF report downloaded successfully!', type: 'success' });
    } catch (err) {
      console.error('Error creating PDF:', err);
      setActionMessage({ text: 'Could not create PDF file.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileSection title="Actions" icon={<Settings size={24} />} id="action-section">
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-2">
        <button
          onClick={handleDownloadJson}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors duration-150 ease-in-out text-sm shadow-md hover:shadow-lg transform hover:scale-105`}
        >
          <FileJson size={18} /> Data (JSON)
        </button>
        <button
          onClick={handleDownloadImage}
          className={`bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors duration-150 ease-in-out text-sm shadow-md hover:shadow-lg transform hover:scale-105`}
        >
          <ImageDown size={18} /> Report (PNG)
        </button>
        <button
          onClick={handleDownloadPdf}
          disabled={!generatedCanvas}
          className={`bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors duration-150 ease-in-out text-sm shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <FileText size={18} /> Report (PDF)
        </button>
      </div>
      {actionMessage && <Message message={actionMessage} onDismiss={() => setActionMessage(null)} />}
    </ProfileSection>
  );
};

export default ActionSection;
