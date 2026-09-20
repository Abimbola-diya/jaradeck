import React from 'react';
import {
  Pdf01Icon,
  Image01Icon,
  Zip01Icon,
  Video01Icon,
  Doc01Icon,
  FigmaIcon,
  File01Icon,
} from 'hugeicons-react';

export interface FileTypeConfig {
  extension: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; color?: string; className?: string }>;
  color: string;
  bgColor: string;
  category: 'pdf' | 'image' | 'figma' | 'archive' | 'video' | 'document' | 'other';
}

export const getFileTypeConfig = (filename: string = '', mimeType: string = ''): FileTypeConfig => {
  const cleanName = filename.trim().toLowerCase();
  const extMatch = cleanName.match(/\.([a-z0-9]+)$/i);
  const ext = extMatch ? extMatch[1] : '';

  // 1. PDF
  if (ext === 'pdf' || mimeType.includes('pdf')) {
    return {
      extension: 'pdf',
      label: 'PDF Document',
      icon: Pdf01Icon,
      color: '#E11D48', // Rose red
      bgColor: '#FFE4E6',
      category: 'pdf',
    };
  }

  // 2. Images: JPG, JPEG, PNG, WEBP, SVG, GIF
  if (['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'bmp', 'avif'].includes(ext) || mimeType.startsWith('image/')) {
    const label = ext ? `${ext.toUpperCase()} Image` : 'Image File';
    return {
      extension: ext || 'img',
      label,
      icon: Image01Icon,
      color: '#0284C7', // Sky blue
      bgColor: '#E0F2FE',
      category: 'image',
    };
  }

  // 3. Figma
  if (ext === 'fig' || cleanName.includes('.figma')) {
    return {
      extension: 'fig',
      label: 'Figma Design File',
      icon: FigmaIcon,
      color: '#9333EA', // Purple
      bgColor: '#F3E8FF',
      category: 'figma',
    };
  }

  // 4. Archives: ZIP, RAR, 7Z, TAR, GZ
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext) || mimeType.includes('zip') || mimeType.includes('compressed')) {
    return {
      extension: ext || 'zip',
      label: 'ZIP Archive',
      icon: Zip01Icon,
      color: '#D97706', // Amber
      bgColor: '#FEF3C7',
      category: 'archive',
    };
  }

  // 5. Videos: MP4, MOV, AVI, WEBM, MKV
  if (['mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v'].includes(ext) || mimeType.startsWith('video/')) {
    return {
      extension: ext || 'video',
      label: 'Video Deliverable',
      icon: Video01Icon,
      color: '#059669', // Emerald green
      bgColor: '#D1FAE5',
      category: 'video',
    };
  }

  // 6. Word / Docs: DOC, DOCX, TXT, RTF, MD
  if (['doc', 'docx', 'txt', 'rtf', 'md', 'pages', 'odt'].includes(ext) || mimeType.includes('word') || mimeType.includes('document')) {
    return {
      extension: ext || 'doc',
      label: 'Word Document',
      icon: Doc01Icon,
      color: '#2563EB', // Blue
      bgColor: '#DBEAFE',
      category: 'document',
    };
  }

  // 7. Generic Fallback
  return {
    extension: ext || 'file',
    label: ext ? `${ext.toUpperCase()} File` : 'Deliverable File',
    icon: File01Icon,
    color: '#4B5563', // Slate gray
    bgColor: '#F3F4F6',
    category: 'other',
  };
};

export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${val} ${sizes[i]}`;
};
