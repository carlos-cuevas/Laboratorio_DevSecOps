'use client';

import { StorageKeys } from '@/common/enums/storage-keys.enum';
import { handlePaste } from '@/common/utils';
import {
  Card,
  CardActionButton,
  CardActions,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/card';
import CodeEditor from '@/components/forms/code-editor';
import { useEffect, useState, useRef } from 'react';

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 400px;
      text-align: center;
    }
    h1 {
      color: #1f2937;
      margin: 0 0 1rem;
      font-size: 1.875rem;
    }
    p {
      color: #6b7280;
      line-height: 1.6;
      margin: 0;
    }
    .emoji {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">🚀</div>
    <h1>Hey there!</h1>
    <p>Start editing the HTML on the left to see your changes appear here in real-time.</p>
  </div>
</body>
</html>`;

interface HtmlPreviewConfigs {
  input: string;
}

const DEFAULT_CONFIGS: HtmlPreviewConfigs = {
  input: DEFAULT_HTML,
};

export default function HtmlPreviewTool() {
  const [configs, setConfigs] = useState<HtmlPreviewConfigs>(DEFAULT_CONFIGS);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const lastConfigs = localStorage.getItem(StorageKeys.HtmlPreviewConfigs);
    if (lastConfigs) {
      try {
        const parsedConfigs = JSON.parse(lastConfigs);
        setConfigs(parsedConfigs);
      } catch {
        // If parsing fails, use default configs
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      StorageKeys.HtmlPreviewConfigs,
      JSON.stringify(configs)
    );
  }, [configs]);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(configs.input);
        doc.close();
      }
    }
  }, [configs.input]);

  const handleInputChange = (value: string) => {
    setConfigs((prev) => ({ ...prev, input: value }));
  };

  const handleClear = () => {
    setConfigs((prev) => ({ ...prev, input: '' }));
  };

  const handleReset = () => {
    setConfigs(DEFAULT_CONFIGS);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle>HTML Code</CardTitle>
          <CardActions>
            <CardActionButton
              icon="far fa-fw fa-paste"
              text="Paste"
              onClick={() => handlePaste(handleInputChange)}
            />
            <CardActionButton
              icon="far fa-fw fa-trash-alt"
              text="Clear"
              onClick={handleClear}
            />
            <CardActionButton
              icon="far fa-fw fa-undo"
              text="Reset"
              onClick={handleReset}
            />
          </CardActions>
        </CardHeader>
        <CardContent>
          <CodeEditor
            id="html-preview-editor"
            value={configs.input}
            onChange={handleInputChange}
            mode="html"
            minLines={25}
            maxLines={35}
          />
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <div className="p-5 flex-1 flex flex-col">
          <div className="w-full flex-1 rounded-md overflow-hidden border border-gray-300 dark:border-zinc-700 bg-white">
            <iframe
              ref={iframeRef}
              title="HTML Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

