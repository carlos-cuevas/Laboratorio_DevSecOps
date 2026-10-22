'use client';

import { StorageKeys } from '@/common/enums/storage-keys.enum';
import { handleCopy, handleDownload, handlePaste } from '@/common/utils';
import SecondaryButton from '@/components/buttons/secondary';
import {
  Card,
  CardActionButton,
  CardActions,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { ConfigurationItem } from '@/components/configuration-item';
import CodeEditor from '@/components/forms/code-editor';
import SelectBox from '@/components/forms/select-box';
import { useEffect, useState, useCallback } from 'react';
import yaml from 'js-yaml';

type ConversionMode = 'yaml-to-json' | 'json-to-yaml';

interface YamlJsonConverterConfigs {
  mode: ConversionMode;
  indentSize: number;
}

const DEFAULT_CONFIGS: YamlJsonConverterConfigs = {
  mode: 'yaml-to-json',
  indentSize: 2,
};

const DEFAULT_YAML_INPUT = `# Sample YAML configuration
server:
  host: localhost
  port: 8080

database:
  name: myapp
  user: admin
  password: secret123

features:
  - authentication
  - logging
  - caching

settings:
  debug: true
  timeout: 30
  maxConnections: 100`;

const DEFAULT_JSON_INPUT = `{
  "server": {
    "host": "localhost",
    "port": 8080
  },
  "database": {
    "name": "myapp",
    "user": "admin",
    "password": "secret123"
  },
  "features": [
    "authentication",
    "logging",
    "caching"
  ],
  "settings": {
    "debug": true,
    "timeout": 30,
    "maxConnections": 100
  }
}`;

const MODE_OPTIONS = [
  { text: 'YAML → JSON', value: 'yaml-to-json' },
  { text: 'JSON → YAML', value: 'json-to-yaml' },
];

const INDENT_OPTIONS = [
  { text: '2 spaces', value: '2' },
  { text: '4 spaces', value: '4' },
];

export default function YamlJsonConverterTool() {
  const [configs, setConfigs] = useState<YamlJsonConverterConfigs>(DEFAULT_CONFIGS);
  const [input, setInput] = useState<string>(DEFAULT_YAML_INPUT);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const lastConfigs = localStorage.getItem(StorageKeys.YamlJsonConverterConfigs);
    if (lastConfigs) {
      try {
        const parsedConfigs = JSON.parse(lastConfigs);
        setConfigs(parsedConfigs);
        // Set appropriate default input based on saved mode
        if (parsedConfigs.mode === 'json-to-yaml') {
          setInput(DEFAULT_JSON_INPUT);
        }
      } catch {
        // If parsing fails, use default configs
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      StorageKeys.YamlJsonConverterConfigs,
      JSON.stringify(configs)
    );
  }, [configs]);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      if (configs.mode === 'yaml-to-json') {
        // Parse YAML and convert to JSON
        const parsed = yaml.load(input);
        const jsonOutput = JSON.stringify(parsed, null, configs.indentSize);
        setOutput(jsonOutput);
        setError('');
      } else {
        // Parse JSON and convert to YAML
        const parsed = JSON.parse(input);
        const yamlOutput = yaml.dump(parsed, {
          indent: configs.indentSize,
          lineWidth: -1, // Disable line wrapping
          noRefs: true, // Don't use anchors/aliases
          sortKeys: false, // Preserve key order
        });
        setOutput(yamlOutput);
        setError('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
      setOutput('');
    }
  }, [input, configs.mode, configs.indentSize]);

  useEffect(() => {
    convert();
  }, [convert]);

  const handleModeChange = (mode: string) => {
    const newMode = mode as ConversionMode;
    // When switching modes, swap input and output if output is valid
    if (output && !error) {
      setInput(output);
    } else {
      // Set appropriate default input for the new mode
      setInput(newMode === 'yaml-to-json' ? DEFAULT_YAML_INPUT : DEFAULT_JSON_INPUT);
    }
    setConfigs((prev) => ({ ...prev, mode: newMode }));
  };

  const handleReset = () => {
    setConfigs(DEFAULT_CONFIGS);
    setInput(DEFAULT_YAML_INPUT);
  };

  const handleSwap = () => {
    if (output && !error) {
      const newMode = configs.mode === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json';
      setInput(output);
      setConfigs((prev) => ({ ...prev, mode: newMode }));
    }
  };

  const inputLabel = configs.mode === 'yaml-to-json' ? 'YAML Input' : 'JSON Input';
  const outputLabel = configs.mode === 'yaml-to-json' ? 'JSON Output' : 'YAML Output';
  const inputMode = configs.mode === 'yaml-to-json' ? 'yaml' : 'json';
  const outputMode = configs.mode === 'yaml-to-json' ? 'json' : 'yaml';
  const outputFileName = configs.mode === 'yaml-to-json' ? 'converted.json' : 'converted.yaml';

  return (
    <div>
      {/* Configuration */}
      <Card collapsible>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigurationItem
            icon="fa-exchange-alt"
            label="Conversion Mode"
            description="Select the conversion direction."
          >
            <div className="w-40">
              <SelectBox
                options={MODE_OPTIONS}
                value={configs.mode}
                onChange={handleModeChange}
              />
            </div>
          </ConfigurationItem>
          <ConfigurationItem
            icon="fa-indent"
            label="Indent Size"
            description="Number of spaces for indentation."
          >
            <div className="w-32">
              <SelectBox
                options={INDENT_OPTIONS}
                value={configs.indentSize.toString()}
                onChange={(value) =>
                  setConfigs((prev) => ({ ...prev, indentSize: parseInt(value) }))
                }
              />
            </div>
          </ConfigurationItem>
        </CardContent>
        <CardFooter>
          <div className="flex gap-3">
            <SecondaryButton text="Reset" onClick={handleReset} />
          </div>
        </CardFooter>
      </Card>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle>{inputLabel}</CardTitle>
            <CardActions>
              <CardActionButton
                icon="far fa-fw fa-times-circle"
                text="Clear"
                onClick={() => setInput('')}
              />
              <CardActionButton
                icon="far fa-fw fa-paste"
                text="Paste"
                onClick={() => handlePaste(setInput)}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <CodeEditor
              id="yaml-json-input"
              mode={inputMode}
              value={input}
              onChange={setInput}
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <span>{outputLabel}</span>
                {output && !error && (
                  <button
                    onClick={handleSwap}
                    className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
                    title="Swap input/output and reverse conversion"
                  >
                    <i className="fa-solid fa-arrows-rotate mr-1"></i>
                    Swap
                  </button>
                )}
              </div>
            </CardTitle>
            <CardActions>
              <CardActionButton
                icon="far fa-fw fa-copy"
                text="Copy"
                onClick={() => handleCopy(output)}
              />
              <CardActionButton
                icon="far fa-fw fa-save"
                text="Save"
                onClick={() => handleDownload(output, outputFileName)}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <i className="fa-solid fa-triangle-exclamation text-red-500 text-2xl mb-2"></i>
                  <p className="text-red-600 dark:text-red-400 font-medium">Conversion Error</p>
                  <p className="text-red-500 dark:text-red-300 text-sm mt-1 max-w-md">
                    {error}
                  </p>
                </div>
              </div>
            ) : (
              <CodeEditor
                id="yaml-json-output"
                mode={outputMode}
                value={output}
                readOnly
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
