'use client';

import { StorageKeys } from '@/common/enums/storage-keys.enum';
import { handleCopy, handleDownload, handlePaste } from '@/common/utils';
import { getNestedValue, keyify } from '@/common/utils/json';
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
import SelectBox from '@/components/forms/select-box';
import Textarea from '@/components/forms/textarea';
import Toggle from '@/components/forms/toggle';
import { useEffect, useState, useCallback } from 'react';
import CodeEditor from '@/components/forms/code-editor';

interface JsonToCsvConfigs {
  delimiter: string;
  includeHeaders: boolean;
}

const DEFAULT_CONFIGS: JsonToCsvConfigs = {
  delimiter: ',',
  includeHeaders: true,
};

const DEFAULT_INPUT_JSON = [
  {
    name: 'John',
    age: 30,
    city: 'New York',
    meta: {
      dob: '01-01-2025',
      height: 180,
    },
  },
  {
    name: 'Jane',
    age: 25,
    city: 'Los Angeles',
    meta: {
      dob: '01-01-2025',
      height: '180cm',
    },
  },
];

const DELIMITERS = [
  { text: 'Comma (,)', value: ',' },
  { text: 'Semicolon (;)', value: ';' },
  { text: 'Tab (\\t)', value: '\t' },
];

export default function JsonToCsvTool() {
  const [configs, setConfigs] = useState<JsonToCsvConfigs>(DEFAULT_CONFIGS);
  const [inputJson, setInputJson] = useState<string>(
    JSON.stringify(DEFAULT_INPUT_JSON, null, 2)
  );
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    const lastConfigs = localStorage.getItem(StorageKeys.JsonToCsvConfigs);
    if (lastConfigs) {
      const parsedConfigs = JSON.parse(lastConfigs);
      setConfigs(parsedConfigs);
    }
  }, []);

  const jsonToCsv = useCallback(
    (jsonStr: string, delimiter: string, includeHeaders: boolean) => {
      try {
        const json = JSON.parse(jsonStr);
        if (!Array.isArray(json) || !json.length) {
          throw new Error('Input must be a non-empty JSON array');
        }

        // Collect headers from all items to ensure nothing is missed
        const headersSet = new Set<string>();
        json.forEach((obj) => {
          keyify(obj).forEach((key) => headersSet.add(key));
        });
        const headers = Array.from(headersSet);

        const rows = json.map((obj) =>
          headers.map((header) => {
            const value = getNestedValue(obj, header);

            // Handle values that contain delimiters or newlines
            if (
              typeof value === 'string' &&
              (value.includes(delimiter) || value.includes('\n'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            if (Array.isArray(value)) {
              return `"${value.join(',')}"`;
            }
            return value;
          })
        );

        const csvRows = [];
        if (includeHeaders) {
          csvRows.push(
            headers.map((header) => header.replace(/[.]/g, '_')).join(delimiter)
          );
        }
        csvRows.push(...rows.map((row) => row.join(delimiter)));

        return csvRows.join('\n');
      } catch (error: unknown) {
        return (error as Error).message;
      }
    },
    []
  );

  const convert = useCallback(
    (configs: JsonToCsvConfigs) => {
      if (!inputJson) {
        setOutput('');
        return;
      }

      setOutput(
        jsonToCsv(inputJson, configs.delimiter, configs.includeHeaders)
      );
    },
    [jsonToCsv, inputJson]
  );

  useEffect(() => {
    localStorage.setItem(StorageKeys.JsonToCsvConfigs, JSON.stringify(configs));
    convert(configs);
  }, [configs, convert]);

  const handleReset = () => {
    setConfigs(DEFAULT_CONFIGS);
    setInputJson(JSON.stringify(DEFAULT_INPUT_JSON, null, 2));
  };

  return (
    <div>
      {/* Configuration */}
      <Card collapsible>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigurationItem
            icon='fa-grip-lines-vertical'
            label='Delimiter'
            description='Select the CSV delimiter.'
          >
            <div className='w-40'>
              <SelectBox
                options={DELIMITERS}
                value={configs.delimiter}
                onChange={(value) => {
                  setConfigs((prev) => ({ ...prev, delimiter: value }));
                }}
              />
            </div>
          </ConfigurationItem>
          <ConfigurationItem
            icon='fa-heading'
            label='Include Headers'
            description='Include column headers in CSV output.'
          >
            <Toggle
              checked={configs.includeHeaders}
              onChange={(value) => {
                setConfigs((prev) => ({ ...prev, includeHeaders: value }));
              }}
            />
          </ConfigurationItem>
        </CardContent>
        <CardFooter>
          <div className='flex gap-3'>
            <SecondaryButton text='Reset' onClick={handleReset} />
          </div>
        </CardFooter>
      </Card>

      <div className='mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle>JSON Input</CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-times-circle'
                text='Clear'
                onClick={() => setInputJson('')}
              />
              <CardActionButton
                icon='far fa-fw fa-paste'
                text='Paste'
                onClick={() => handlePaste(setInputJson)}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <CodeEditor
              id='input-json'
              value={inputJson}
              onChange={setInputJson}
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle>CSV Output</CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-copy'
                text='Copy'
                onClick={() => handleCopy(output)}
              />
              <CardActionButton
                icon='far fa-fw fa-save'
                text='Save'
                onClick={() => handleDownload(output, 'data.csv')}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <Textarea value={output} rows={30} readOnly />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
