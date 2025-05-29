export type FileType = 'video' | 'pdf' | 'unknown';

export function getFileType(filePath: string): FileType {
  if (!filePath) return 'unknown';
  
  const extension = filePath.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'mp4':
    case 'webm':
    case 'ogg':
    case 'avi':
    case 'mov':
      return 'video';
    case 'pdf':
      return 'pdf';
    default:
      return 'unknown';
  }
}

export function isValidFileType(filePath: string): boolean {
  return getFileType(filePath) !== 'unknown';
}