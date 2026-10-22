'use client';

import { StorageKeys } from '@/common/enums/storage-keys.enum';
import { handleCopy, handleDownload, handlePaste } from '@/common/utils';
import {
  Card,
  CardActionButton,
  CardActions,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/card';
import Textarea from '@/components/forms/textarea';
import { useEffect, useState, useCallback, useRef } from 'react';

const DEFAULT_MARKDOWN = `# Welcome to Markdown Preview! 🚀

This is a **live preview** of your markdown content. Start typing on the left to see your changes appear here in real-time.

## Features

- **Bold text** and *italic text*
- ~~Strikethrough~~ text
- \`inline code\` formatting

### Code Blocks

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('DevEase');
\`\`\`

### Lists

#### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

#### Ordered List
1. First step
2. Second step
3. Third step

### Links and Images

Check out [DevEase](https://devease.app) for more developer tools!

![Sample Image](https://picsum.photos/400/200)

### Blockquotes

> "The best way to predict the future is to invent it."
> — Alan Kay

### Tables

| Feature | Status |
|---------|--------|
| Headers | ✅ |
| Lists | ✅ |
| Code | ✅ |
| Tables | ✅ |

### Horizontal Rule

---

Happy writing! ✨`;

interface MarkdownPreviewConfigs {
  input: string;
}

const DEFAULT_CONFIGS: MarkdownPreviewConfigs = {
  input: DEFAULT_MARKDOWN,
};

export default function MarkdownPreviewTool() {
  const [configs, setConfigs] = useState<MarkdownPreviewConfigs>(DEFAULT_CONFIGS);
  const [html, setHtml] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastConfigs = localStorage.getItem(StorageKeys.MarkdownPreviewConfigs);
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
      StorageKeys.MarkdownPreviewConfigs,
      JSON.stringify(configs)
    );
  }, [configs]);

  const escapeHtml = useCallback((text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }, []);

  const parseMarkdown = useCallback(
    (markdown: string): string => {
      if (!markdown) return '';

      let html = markdown;

      // Escape HTML first (we'll unescape specific parts as needed)
      // But we need to handle code blocks specially
      const codeBlocks: string[] = [];
      const inlineCode: string[] = [];

      // Extract and protect code blocks
      html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        const index = codeBlocks.length;
        codeBlocks.push(
          `<pre class="bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto my-2 leading-snug"><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`
        );
        return `%%CODEBLOCK_${index}%%`;
      });

      // Extract and protect inline code
      html = html.replace(/`([^`]+)`/g, (_, code) => {
        const index = inlineCode.length;
        inlineCode.push(
          `<code class="bg-gray-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400">${escapeHtml(code)}</code>`
        );
        return `%%INLINECODE_${index}%%`;
      });

      // Now escape remaining HTML
      html = escapeHtml(html);

      // Headers (must come before other replacements)
      html = html.replace(/^###### (.+)$/gm, '<h6 class="text-sm font-semibold mt-4 mb-2">$1</h6>');
      html = html.replace(/^##### (.+)$/gm, '<h5 class="text-base font-semibold mt-4 mb-2">$1</h5>');
      html = html.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-semibold mt-5 mb-2">$1</h4>');
      html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
      html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-neutral-700">$1</h2>');
      html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');

      // Horizontal rules
      html = html.replace(/^(?:---|\*\*\*|___)$/gm, '<hr class="my-6 border-gray-300 dark:border-neutral-600" />');

      // Blockquotes
      html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-neutral-600 pl-4 my-4 italic text-gray-600 dark:text-neutral-400">$1</blockquote>');

      // Tables - parse manually to avoid Tailwind JIT issues with regex
      const lines = html.split('\n');
      const processedLines: string[] = [];
      let i = 0;
      
      while (i < lines.length) {
        const line = lines[i];
        // Check if this looks like a table header row
        if (line.startsWith('|') && line.endsWith('|') && i + 1 < lines.length) {
          const separatorLine = lines[i + 1];
          // Check if next line is a separator (contains |, -, and optionally :)
          if (separatorLine.startsWith('|') && separatorLine.includes('-') && separatorLine.endsWith('|')) {
            // This is a table, collect all rows
            const headerCells = line.slice(1, -1).split('|').map(c => c.trim());
            const tableRows: string[][] = [];
            
            // Skip header and separator
            let j = i + 2;
            while (j < lines.length && lines[j].startsWith('|') && lines[j].endsWith('|')) {
              tableRows.push(lines[j].slice(1, -1).split('|').map(c => c.trim()));
              j++;
            }
            
            // Build table HTML
            let table = '<table class="w-full my-4 border-collapse"><thead><tr class="border-b-2 border-gray-300 dark:border-neutral-600">';
            headerCells.forEach(h => {
              table += '<th class="px-4 py-2 text-left font-semibold">' + h + '</th>';
            });
            table += '</tr></thead><tbody>';
            tableRows.forEach(row => {
              table += '<tr class="border-b border-gray-200 dark:border-neutral-700">';
              row.forEach(cell => {
                table += '<td class="px-4 py-2">' + cell + '</td>';
              });
              table += '</tr>';
            });
            table += '</tbody></table>';
            
            processedLines.push(table);
            i = j;
            continue;
          }
        }
        processedLines.push(line);
        i++;
      }
      html = processedLines.join('\n');

      // Bold and italic (order matters!)
      html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
      html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
      html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
      html = html.replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>');
      html = html.replace(/_(.+?)_/g, '<em class="italic">$1</em>');

      // Strikethrough
      html = html.replace(/~~(.+?)~~/g, '<del class="line-through">$1</del>');

      // Images (must come before links)
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-4" />');

      // Links
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-600 dark:text-emerald-400 hover:underline">$1</a>');

      // Unordered lists
      html = html.replace(/^(\s*)[-*+] (.+)$/gm, (_, spaces, content) => {
        const indent = spaces.length >= 2 ? 'ml-6' : '';
        return `<li class="list-disc ${indent} ml-5">${content}</li>`;
      });

      // Ordered lists
      html = html.replace(/^(\s*)\d+\. (.+)$/gm, (_, spaces, content) => {
        const indent = spaces.length >= 2 ? 'ml-6' : '';
        return `<li class="list-decimal ${indent} ml-5">${content}</li>`;
      });

      // Wrap consecutive list items
      html = html.replace(/((?:<li class="list-disc[^"]*">[^<]+<\/li>\s*)+)/g, '<ul class="my-4 space-y-1">$1</ul>');
      html = html.replace(/((?:<li class="list-decimal[^"]*">[^<]+<\/li>\s*)+)/g, '<ol class="my-4 space-y-1">$1</ol>');

      // Paragraphs (wrap remaining text that's not already wrapped)
      html = html.replace(/^(?!<[a-z]|%%|\s*$)(.+)$/gm, '<p class="my-1.5 leading-relaxed">$1</p>');

      // Clean up extra newlines
      html = html.replace(/\n{3,}/g, '\n\n');

      // Restore code blocks and inline code at the very end
      codeBlocks.forEach((block, index) => {
        html = html.replace(`%%CODEBLOCK_${index}%%`, block);
      });
      inlineCode.forEach((code, index) => {
        html = html.replace(`%%INLINECODE_${index}%%`, code);
      });

      return html;
    },
    [escapeHtml]
  );

  useEffect(() => {
    const parsedHtml = parseMarkdown(configs.input);
    setHtml(parsedHtml);
  }, [configs.input, parseMarkdown]);

  const handleInputChange = (value: string) => {
    setConfigs((prev) => ({ ...prev, input: value }));
  };

  const handleClear = () => {
    setConfigs((prev) => ({ ...prev, input: '' }));
  };

  const handleReset = () => {
    setConfigs(DEFAULT_CONFIGS);
  };

  const handleCopyHtml = () => {
    handleCopy(html);
  };

  const handleDownloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Export</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 p-8 max-w-4xl mx-auto">
${html}
</body>
</html>`;
    handleDownload(fullHtml, 'markdown-export.html');
  };

  const handleDownloadMarkdown = () => {
    handleDownload(configs.input, 'document.md');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle>Markdown</CardTitle>
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
            <CardActionButton
              icon="far fa-fw fa-save"
              text="Save MD"
              onClick={handleDownloadMarkdown}
            />
          </CardActions>
        </CardHeader>
        <CardContent>
          <Textarea
            value={configs.input}
            onChange={handleInputChange}
            rows={30}
            placeholder="Enter your markdown here..."
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardActions>
            <CardActionButton
              icon="far fa-fw fa-copy"
              text="Copy HTML"
              onClick={handleCopyHtml}
            />
            <CardActionButton
              icon="far fa-fw fa-file-code"
              text="Save HTML"
              onClick={handleDownloadHtml}
            />
          </CardActions>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div
            ref={previewRef}
            className="prose prose-sm dark:prose-invert max-w-none h-[720px] overflow-y-auto p-4 bg-white dark:bg-neutral-900 rounded-md border border-gray-200 dark:border-neutral-700"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

