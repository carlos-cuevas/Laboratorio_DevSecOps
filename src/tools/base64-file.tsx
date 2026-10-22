'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Card,
  CardActionButton,
  CardActions,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { handleCopy, handlePaste } from '@/common/utils/actions.util';
import { toast } from 'sonner';
import Textarea from '@/components/forms/textarea';
import Image from 'next/image';
import FileSelector from '@/components/forms/file-selector';
import Input from '@/components/forms/input';

export default function Base64FileTool() {
  const [base64String, setBase64String] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFileName(file.name);
      setFileType(file.type);
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setBase64String(base64.split(',')[1]); // Remove data URL prefix
      };
      reader.readAsDataURL(file);
    },
    []
  );

  useEffect(() => {
    if (!base64String) return;
    if (fileRef.current) {
      fileRef.current.value = '';
    }
    const split = base64String.split(',');
    if (split.length > 1) {
      setBase64String(split[1]);
      const extractedFileType = split[0].split(';')[0].split(':')[1];
      setFileType(extractedFileType);
    }
  }, [base64String]);

  const handleBase64Change = (value: string) => {
    setBase64String(value);
  };

  const downloadFile = () => {
    try {
      if (!base64String) {
        toast.error('Please enter a Base64 string');
        return;
      }

      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: fileType || 'application/octet-stream',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'download';
      a.click();
      URL.revokeObjectURL(url);

      toast.success('File downloaded successfully');
    } catch {
      toast.error('Invalid Base64 string');
    }
  };

  return (
    <div className='mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4'>
      <div>
        <Card className='mb-4'>
          <CardHeader>
            <CardTitle>Base64 String</CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-copy'
                text='Copy'
                onClick={() => handleCopy(base64String)}
              />
              <CardActionButton
                icon='far fa-paste'
                text='Paste'
                onClick={() => handlePaste((text) => setBase64String(text))}
              />
              <CardActionButton
                icon='far fa-download'
                text='Download File'
                onClick={downloadFile}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <div className='mb-4 flex gap-4'>
              <Input
                placeholder='File Name'
                value={fileName}
                onChange={(value) => setFileName(value)}
              />
              <Input
                placeholder='File Type'
                value={fileType}
                onChange={(value) => setFileType(value)}
              />
            </div>
            <Textarea
              placeholder='Enter Base64 string here...'
              value={base64String}
              onChange={(value) => handleBase64Change(value)}
              rows={20}
            />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className='mb-4'>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
          </CardHeader>
          <CardContent>
            <FileSelector onChange={handleFileUpload} ref={fileRef} />
          </CardContent>
        </Card>

        {base64String && fileType?.startsWith('image/') && (
          <Card>
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={`data:${fileType};base64,${base64String}`}
                alt='Base64 Image Preview'
                className='max-w-full h-auto rounded-lg w-full'
                width='100'
                height='1'
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
