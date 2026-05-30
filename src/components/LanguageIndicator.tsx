import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../utils/languageDetector';

interface LanguageIndicatorProps {
  language: Language;
  className?: string;
}

export function LanguageIndicator({ language, className = '' }: LanguageIndicatorProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm ${className}`}>
      <Globe className="w-4 h-4 text-blue-600" />
      <span className="text-blue-700 font-medium">
        {language.nativeName}
      </span>
      <span className="text-blue-600 text-xs">
        ({language.code.toUpperCase()})
      </span>
    </div>
  );
}