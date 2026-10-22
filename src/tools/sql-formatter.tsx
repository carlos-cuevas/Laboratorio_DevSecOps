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
import Textarea from '@/components/forms/textarea';
import { useEffect, useState, useCallback } from 'react';
import { format, FormatOptionsWithLanguage } from 'sql-formatter';

interface SqlFormatterConfigs {
  indentStyle: string;
  language: string;
  keywordCase: string;
}

const DEFAULT_CONFIGS: SqlFormatterConfigs = {
  indentStyle: 'standard',
  language: 'sql',
  keywordCase: 'upper',
};

const DEFAULT_SQL = `SELECT id, name, email FROM users WHERE status = 'active' AND created_at >= '2024-01-01' ORDER BY created_at DESC LIMIT 10;`;

const INDENTATIONS = [
  { text: 'Standard', value: 'standard' },
  { text: 'Tabular Left', value: 'tabularLeft' },
  { text: 'Tabular Right', value: 'tabularRight' },
];

const LANGUAGES = [
  { text: 'GCP BigQuery', value: 'bigquery' },
  { text: 'IBM DB2', value: 'db2' },
  { text: 'Apache Hive', value: 'hive' },
  { text: 'MariaDB', value: 'mariadb' },
  { text: 'MySQL', value: 'mysql' },
  { text: 'Couchbase N1QL', value: 'n1ql' },
  { text: 'Oracle PL/SQL', value: 'plsql' },
  { text: 'PostgreSQL', value: 'postgresql' },
  { text: 'Amazon Redshift', value: 'redshift' },
  { text: 'Spark', value: 'spark' },
  { text: 'Standard SQL', value: 'sql' },
  { text: 'sqlite', value: 'sqlite' },
  { text: 'SQL Server Transact-SQL', value: 'tsql' },
];

const KEYWORD_CASES = [
  { text: 'Upper Case', value: 'upper' },
  { text: 'Lower Case', value: 'lower' },
  { text: 'Preserve', value: 'preserve' },
];

export default function SqlFormatterTool() {
  const [configs, setConfigs] = useState<SqlFormatterConfigs>(DEFAULT_CONFIGS);
  const [input, setInput] = useState<string>(DEFAULT_SQL);
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    const lastConfigs = localStorage.getItem(StorageKeys.SqlFormatterConfigs);
    if (lastConfigs) {
      const parsedConfigs = JSON.parse(lastConfigs);
      setConfigs(parsedConfigs);
    }
  }, []);

  const formatSql = useCallback((sql: string, configs: SqlFormatterConfigs) => {
    if (!sql) {
      setOutput('');
      return;
    }

    try {
      const formatted = format(sql, {
        language: configs.language,
        indentStyle: configs.indentStyle,
        linesBetweenQueries: 1,
        keywordCase: configs.keywordCase,
      } as FormatOptionsWithLanguage);

      setOutput(formatted);
    } catch (error: unknown) {
      setOutput((error as Error).message);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      StorageKeys.SqlFormatterConfigs,
      JSON.stringify(configs)
    );
    formatSql(input, configs);
  }, [configs, input, formatSql]);

  return (
    <div>
      {/* Configuration */}
      <Card collapsible>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigurationItem
            icon='fa-database'
            label='Language'
            description='Select the SQL language.'
          >
            <div className='w-40'>
              <SelectBox
                options={LANGUAGES}
                value={configs.language}
                onChange={(value) =>
                  setConfigs((prev) => ({
                    ...prev,
                    language: value,
                  }))
                }
              />
            </div>
          </ConfigurationItem>
          <ConfigurationItem
            icon='fa-indent'
            label='Indentation'
            description='Select the indentation style.'
          >
            <div className='w-40'>
              <SelectBox
                options={INDENTATIONS}
                value={configs.indentStyle}
                onChange={(value) =>
                  setConfigs((prev) => ({
                    ...prev,
                    indentStyle: value,
                  }))
                }
              />
            </div>
          </ConfigurationItem>
          <ConfigurationItem
            icon='fa-font-case'
            label='Keyword Case'
            description='Select the keyword case.'
          >
            <div className='w-40'>
              <SelectBox
                options={KEYWORD_CASES}
                value={configs.keywordCase}
                onChange={(value) =>
                  setConfigs((prev) => ({
                    ...prev,
                    keywordCase: value,
                  }))
                }
              />
            </div>
          </ConfigurationItem>
        </CardContent>
        <CardFooter>
          <div className='flex gap-3'>
            <SecondaryButton
              text='Reset'
              onClick={() => {
                setConfigs(DEFAULT_CONFIGS);
                setInput(DEFAULT_SQL);
              }}
            />
          </div>
        </CardFooter>
      </Card>

      <div className='mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle>SQL Input</CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-times-circle'
                text='Clear'
                onClick={() => setInput('')}
              />
              <CardActionButton
                icon='far fa-fw fa-paste'
                text='Paste'
                onClick={() => handlePaste(setInput)}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <Textarea value={input} onChange={setInput} rows={30} />
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle>Formatted SQL</CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-copy'
                text='Copy'
                onClick={() => handleCopy(output)}
              />
              <CardActionButton
                icon='far fa-fw fa-save'
                text='Save'
                onClick={() => handleDownload(output, 'formatted.sql')}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <CodeEditor value={output} mode='sql' id='sql-output' readOnly />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
