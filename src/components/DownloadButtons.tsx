import React from 'react';
import { Download, FileText, File } from 'lucide-react';
import { downloadAsText, downloadAsDocx, generateFilename } from '../utils/fileDownloader';

interface DownloadButtonsProps {
  content: string;
  originalPrompt: string;
  className?: string;
}

export function DownloadButtons({ content, originalPrompt, className = '' }: DownloadButtonsProps) {
  const filename = generateFilename(originalPrompt);

  const handleDownloadTxt = () => {
    downloadAsText(content, filename);
  };

  const handleDownloadDocx = () => {
    downloadAsDocx(content, filename);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleDownloadTxt}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
        title="Download as TXT file"
      >
        <FileText className="w-4 h-4" />
        TXT
      </button>
      <button
        onClick={handleDownloadDocx}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        title="Download as DOCX file"
      >
        <File className="w-4 h-4" />
        DOCX
      </button>
    </div>
  );
}