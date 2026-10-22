import { toast } from 'sonner';

export const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard');
};

export const handlePaste = (callback: (text: string) => void) => {
  navigator.clipboard.readText().then(callback);
  toast.success('Pasted from clipboard');
};

export const handleDownload = (text: string, filename: string) => {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  toast.success('File downloaded successfully');
};
