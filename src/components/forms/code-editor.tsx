'use client';

import AceEditor from 'react-ace';
import { useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipRefProps } from 'react-tooltip';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-yaml';

import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';

// Fields that are commonly epoch timestamps
const EPOCH_FIELDS = [
  'exp',
  'iat',
  'nbf',
  'createdAt',
  'updatedAt',
  'timestamp',
];

export default function CodeEditor({
  value,
  mode = 'json',
  id,
  onChange,
  readOnly = false,
  minLines = 31,
  maxLines = 40,
}: {
  value: string;
  mode?: string;
  id?: string;
  readOnly?: boolean;
  minLines?: number;
  maxLines?: number;
  onChange?: (value: string) => void;
}) {
  const aceRef = useRef<React.ComponentRef<typeof AceEditor>>(null);
  const tooltipRef = useRef<TooltipRefProps | null>(null);
  const [show, setShow] = useState(false);

  // build one regex that only looks for *your* fields:
  const fieldNames = EPOCH_FIELDS.join('|');
  // e.g. "exp|iat|nbf|createdAt|…"
  const re = new RegExp(`"(${fieldNames})"\\s*:\\s*(\\d+)`);

  useEffect(() => {
    if (!aceRef.current) {
      console.log('aceRef.current is null');
      return;
    }
    const editor = aceRef.current.editor;
    const session = editor.getSession();
    const scroller = editor.renderer.scroller;

    const onMouseMove = (e: MouseEvent) => {
      const { row, column } = editor.renderer.screenToTextCoordinates(
        e.clientX,
        e.clientY
      );
      const token = session.getTokenAt(row, column);
      if (token?.type === 'constant.numeric') {
        // grab the raw line up to the number
        const line = session.getLine(row).slice(0, column + token.value.length);

        const sub = line; // you already have the slice up to end of the number
        const m = sub.match(re);

        // look for a JSON key immediately preceding:  "key": 12345
        // const m = line.match(/"(\w+)"\s*:\s*[\d]+$/);
        if (m && EPOCH_FIELDS.includes(m[1])) {
          const num = parseInt(token.value, 10);

          if (isNaN(num)) {
            return;
          }

          const coords = editor.renderer.textToScreenCoordinates(row, 0);
          const coordsEnd = editor.renderer.textToScreenCoordinates(
            row,
            line.length
          );
          const lineHeight = editor.renderer.layerConfig.lineHeight; // e.g. 16, 18, 20px, etc.

          const centerPageY = coords.pageY + lineHeight / 2;

          // heuristics: 10 digits → seconds, 13 digits → ms
          const ts = num.toString().length > 10 ? num : num * 1000;

          setShow(true);
          showTooltip({ ts, x: coordsEnd.pageX, y: centerPageY });
          return;
        }
      }
      setShow(false);
    };

    const onMouseOut = () => setShow(false);

    scroller.addEventListener('mousemove', onMouseMove);
    scroller.addEventListener('mouseout', onMouseOut);
    return () => {
      scroller.removeEventListener('mousemove', onMouseMove);
      scroller.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  const showTooltip = ({ ts, x, y }: { ts: number; x: number; y: number }) => {
    if (!tooltipRef.current) return;

    tooltipRef.current.open({
      anchorSelect: '#epochTip', // Selector for the element to attach the tooltip to
      content: new Date(ts).toString(),
      place: 'top',
      position: {
        x,
        y,
      },
    });
  };

  useEffect(() => {
    if (show) return;

    if (tooltipRef.current && tooltipRef.current.isOpen) {
      tooltipRef.current.close();
    }
  }, [show]);

  return (
    <>
      <AceEditor
        ref={aceRef}
        value={value}
        mode={mode}
        width='100%'
        setOptions={{
          useWorker: false,
          fontSize: '1rem',
          showPrintMargin: false,
          readOnly,
          minLines,
          maxLines,
          wrap: true,
        }}
        className='ace-devease-theme'
        onChange={onChange}
        name={id}
        editorProps={{ $blockScrolling: true }}
      />
      {/* SSR fallback for search engines - hidden when JS loads */}
      <noscript>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontFamily: 'monospace',
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '0.375rem',
            overflow: 'auto',
          }}
        >
          {value}
        </pre>
      </noscript>
      <Tooltip
        id='epochTip'
        delayShow={0}
        style={{ zIndex: 100000 }}
        ref={tooltipRef}
        imperativeModeOnly
        opacity={1}
      />
    </>
  );
}
