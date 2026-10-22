'use client';

import { StorageKeys } from '@/common/enums/storage-keys.enum';
import { handleCopy, handlePaste } from '@/common/utils';
import PrimaryButton from '@/components/buttons/primary';
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
import Input from '@/components/forms/input';
import Textarea from '@/components/forms/textarea';
import Toggle from '@/components/forms/toggle';
import RenderConditional from '@/components/render-conditional';
import { useEffect, useState, useCallback, useMemo } from 'react';

interface RegexFlags {
  global: boolean;
  caseInsensitive: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  sticky: boolean;
}

interface RegexTesterConfigs {
  pattern: string;
  testString: string;
  flags: RegexFlags;
}

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
  namedGroups: Record<string, string>;
}

const DEFAULT_FLAGS: RegexFlags = {
  global: true,
  caseInsensitive: false,
  multiline: false,
  dotAll: false,
  unicode: false,
  sticky: false,
};

const DEFAULT_CONFIGS: RegexTesterConfigs = {
  pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
  testString: `Hello! Here are some email addresses:
- john.doe@example.com
- jane_smith@company.org
- support@devease.app
- invalid-email@
- another.valid@email.co.uk

Feel free to test your regex patterns here!`,
  flags: DEFAULT_FLAGS,
};

export default function RegexTesterTool() {
  const [configs, setConfigs] = useState<RegexTesterConfigs>(DEFAULT_CONFIGS);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [error, setError] = useState<string>('');
  const [highlightedText, setHighlightedText] = useState<string>('');

  useEffect(() => {
    const lastConfigs = localStorage.getItem(StorageKeys.RegexTesterConfigs);
    if (lastConfigs) {
      try {
        const parsedConfigs = JSON.parse(lastConfigs);
        setConfigs(parsedConfigs);
      } catch {
        // If parsing fails, use default configs
      }
    }
  }, []);

  const buildFlagsString = useCallback((flags: RegexFlags): string => {
    let flagStr = '';
    if (flags.global) flagStr += 'g';
    if (flags.caseInsensitive) flagStr += 'i';
    if (flags.multiline) flagStr += 'm';
    if (flags.dotAll) flagStr += 's';
    if (flags.unicode) flagStr += 'u';
    if (flags.sticky) flagStr += 'y';
    return flagStr;
  }, []);

  const escapeHtml = useCallback((text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }, []);

  const testRegex = useCallback(
    (configs: RegexTesterConfigs) => {
      setError('');
      setMatches([]);
      setHighlightedText('');

      if (!configs.pattern) {
        setHighlightedText(escapeHtml(configs.testString));
        return;
      }

      try {
        const flagStr = buildFlagsString(configs.flags);
        const regex = new RegExp(configs.pattern, flagStr);
        const results: MatchResult[] = [];

        if (configs.flags.global) {
          let match;
          while ((match = regex.exec(configs.testString)) !== null) {
            results.push({
              match: match[0],
              index: match.index,
              groups: match.slice(1),
              namedGroups: match.groups || {},
            });
            // Prevent infinite loops for zero-length matches
            if (match[0].length === 0) {
              regex.lastIndex++;
            }
          }
        } else {
          const match = regex.exec(configs.testString);
          if (match) {
            results.push({
              match: match[0],
              index: match.index,
              groups: match.slice(1),
              namedGroups: match.groups || {},
            });
          }
        }

        setMatches(results);

        // Create highlighted text
        if (results.length > 0) {
          let highlighted = '';
          let lastIndex = 0;

          // Sort matches by index to handle overlapping correctly
          const sortedMatches = [...results].sort((a, b) => a.index - b.index);

          for (const result of sortedMatches) {
            // Add text before the match
            highlighted += escapeHtml(
              configs.testString.slice(lastIndex, result.index)
            );
            // Add highlighted match
            highlighted += `<mark class="bg-emerald-400/40 dark:bg-emerald-500/40 text-inherit px-0.5 rounded">${escapeHtml(result.match)}</mark>`;
            lastIndex = result.index + result.match.length;
          }
          // Add remaining text
          highlighted += escapeHtml(configs.testString.slice(lastIndex));
          setHighlightedText(highlighted);
        } else {
          setHighlightedText(escapeHtml(configs.testString));
        }
      } catch (err: unknown) {
        setError((err as Error).message);
        setHighlightedText(escapeHtml(configs.testString));
      }
    },
    [buildFlagsString, escapeHtml]
  );

  useEffect(() => {
    localStorage.setItem(StorageKeys.RegexTesterConfigs, JSON.stringify(configs));
    testRegex(configs);
  }, [configs, testRegex]);

  const handlePatternChange = (value: string) => {
    setConfigs((prev) => ({ ...prev, pattern: value }));
  };

  const handleTestStringChange = (value: string) => {
    setConfigs((prev) => ({ ...prev, testString: value }));
  };

  const handleFlagChange = (flag: keyof RegexFlags, value: boolean) => {
    setConfigs((prev) => ({
      ...prev,
      flags: { ...prev.flags, [flag]: value },
    }));
  };

  const flagsString = useMemo(
    () => buildFlagsString(configs.flags),
    [configs.flags, buildFlagsString]
  );

  const getMatchSummary = () => {
    if (error) return null;
    if (matches.length === 0) return 'No matches found';
    if (matches.length === 1) return '1 match found';
    return `${matches.length} matches found`;
  };

  return (
    <div>
      {/* Pattern Input */}
      <Card>
        <CardHeader>
          <CardTitle>Regular Expression</CardTitle>
          <CardActions>
            <CardActionButton
              icon='far fa-fw fa-times-circle'
              text='Clear'
              onClick={() => handlePatternChange('')}
            />
            <CardActionButton
              icon='far fa-fw fa-paste'
              text='Paste'
              onClick={() => handlePaste(handlePatternChange)}
            />
          </CardActions>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2'>
            <span className='text-xl text-gray-400 dark:text-neutral-500'>/</span>
            <Input
              value={configs.pattern}
              onChange={handlePatternChange}
              placeholder='Enter regex pattern...'
              className='font-mono'
            />
            <span className='text-xl text-gray-400 dark:text-neutral-500'>
              /{flagsString}
            </span>
          </div>
          <RenderConditional condition={!!error}>
            <div className='mt-3 flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/20'>
              <i className='far fa-fw fa-times-circle text-red-500' />
              <p className='text-sm text-red-500 font-mono'>{error}</p>
            </div>
          </RenderConditional>
        </CardContent>
      </Card>

      {/* Flags Configuration */}
      <Card collapsible className='mt-4'>
        <CardHeader>
          <CardTitle>Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <ConfigurationItem
              icon='fa-globe'
              label='Global (g)'
              description='Find all matches'
            >
              <Toggle
                checked={configs.flags.global}
                onChange={(value) => handleFlagChange('global', value)}
              />
            </ConfigurationItem>
            <ConfigurationItem
              icon='fa-font'
              label='Case Insensitive (i)'
              description='Ignore case'
            >
              <Toggle
                checked={configs.flags.caseInsensitive}
                onChange={(value) => handleFlagChange('caseInsensitive', value)}
              />
            </ConfigurationItem>
            <ConfigurationItem
              icon='fa-align-left'
              label='Multiline (m)'
              description='^ and $ match line start/end'
            >
              <Toggle
                checked={configs.flags.multiline}
                onChange={(value) => handleFlagChange('multiline', value)}
              />
            </ConfigurationItem>
            <ConfigurationItem
              icon='fa-ellipsis-h'
              label='Dot All (s)'
              description='. matches newlines'
            >
              <Toggle
                checked={configs.flags.dotAll}
                onChange={(value) => handleFlagChange('dotAll', value)}
              />
            </ConfigurationItem>
            <ConfigurationItem
              icon='fa-language'
              label='Unicode (u)'
              description='Enable Unicode support'
            >
              <Toggle
                checked={configs.flags.unicode}
                onChange={(value) => handleFlagChange('unicode', value)}
              />
            </ConfigurationItem>
            <ConfigurationItem
              icon='fa-thumbtack'
              label='Sticky (y)'
              description='Match from lastIndex only'
            >
              <Toggle
                checked={configs.flags.sticky}
                onChange={(value) => handleFlagChange('sticky', value)}
              />
            </ConfigurationItem>
          </div>
        </CardContent>
        <CardFooter>
          <div className='flex gap-3'>
            <SecondaryButton
              text='Reset Flags'
              onClick={() =>
                setConfigs((prev) => ({ ...prev, flags: DEFAULT_FLAGS }))
              }
            />
            <PrimaryButton text='Test' onClick={() => testRegex(configs)} />
          </div>
        </CardFooter>
      </Card>

      <div className='mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* Test String Input */}
        <Card>
          <CardHeader>
            <CardTitle>Test String</CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-times-circle'
                text='Clear'
                onClick={() => handleTestStringChange('')}
              />
              <CardActionButton
                icon='far fa-fw fa-paste'
                text='Paste'
                onClick={() => handlePaste(handleTestStringChange)}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <Textarea
              value={configs.testString}
              onChange={handleTestStringChange}
              rows={15}
              placeholder='Enter text to test against...'
              className='font-mono text-sm'
            />
          </CardContent>
        </Card>

        {/* Highlighted Result */}
        <Card>
          <CardHeader>
            <CardTitle>Highlighted Matches</CardTitle>
            <CardActions>
              <RenderConditional condition={!error && matches.length > 0}>
                <span className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>
                  {getMatchSummary()}
                </span>
              </RenderConditional>
              <RenderConditional condition={!error && matches.length === 0 && !!configs.pattern}>
                <span className='text-sm text-gray-500 dark:text-neutral-400'>
                  No matches
                </span>
              </RenderConditional>
            </CardActions>
          </CardHeader>
          <CardContent>
            <div
              className='p-4 bg-gray-50 dark:bg-neutral-900 rounded-md font-mono text-sm whitespace-pre-wrap break-words min-h-[360px] max-h-[360px] overflow-auto border border-gray-200 dark:border-neutral-700'
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Match Details */}
      <RenderConditional condition={matches.length > 0}>
        <Card className='mt-4'>
          <CardHeader>
            <CardTitle>Match Details</CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-copy'
                text='Copy All Matches'
                onClick={() =>
                  handleCopy(matches.map((m) => m.match).join('\n'))
                }
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='border-b dark:border-neutral-700'>
                    <th className='px-4 py-3 text-sm font-semibold'>#</th>
                    <th className='px-4 py-3 text-sm font-semibold'>Match</th>
                    <th className='px-4 py-3 text-sm font-semibold'>Index</th>
                    <th className='px-4 py-3 text-sm font-semibold'>Length</th>
                    <th className='px-4 py-3 text-sm font-semibold'>Groups</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, index) => (
                    <tr
                      key={index}
                      className='border-b dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'
                    >
                      <td className='px-4 py-3 text-sm text-gray-500 dark:text-neutral-400'>
                        {index + 1}
                      </td>
                      <td className='px-4 py-3'>
                        <code className='px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded text-sm font-mono'>
                          {match.match}
                        </code>
                      </td>
                      <td className='px-4 py-3 text-sm font-mono'>
                        {match.index}
                      </td>
                      <td className='px-4 py-3 text-sm font-mono'>
                        {match.match.length}
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        <RenderConditional condition={match.groups.length > 0}>
                          <div className='flex flex-wrap gap-1'>
                            {match.groups.map((group, gIndex) => (
                              <code
                                key={gIndex}
                                className='px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-mono'
                              >
                                ${gIndex + 1}: {group || '(empty)'}
                              </code>
                            ))}
                          </div>
                        </RenderConditional>
                        <RenderConditional condition={match.groups.length === 0}>
                          <span className='text-gray-400 dark:text-neutral-500'>
                            No groups
                          </span>
                        </RenderConditional>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </RenderConditional>

      {/* Quick Reference */}
      <Card collapsible className='mt-4'>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm'>
            <div>
              <h4 className='font-semibold mb-2 text-gray-700 dark:text-neutral-300'>
                Character Classes
              </h4>
              <ul className='space-y-1 text-gray-600 dark:text-neutral-400'>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>.</code> - Any character
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>\d</code> - Digit [0-9]
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>\w</code> - Word [A-Za-z0-9_]
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>\s</code> - Whitespace
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>[abc]</code> - Any of a, b, c
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>[^abc]</code> - Not a, b, c
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-2 text-gray-700 dark:text-neutral-300'>
                Quantifiers
              </h4>
              <ul className='space-y-1 text-gray-600 dark:text-neutral-400'>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>*</code> - 0 or more
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>+</code> - 1 or more
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>?</code> - 0 or 1
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>{'{n}'}</code> - Exactly n
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>{'{n,}'}</code> - n or more
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>{'{n,m}'}</code> - Between n and m
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-2 text-gray-700 dark:text-neutral-300'>
                Anchors
              </h4>
              <ul className='space-y-1 text-gray-600 dark:text-neutral-400'>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>^</code> - Start of string
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>$</code> - End of string
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>\b</code> - Word boundary
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>\B</code> - Non-word boundary
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-2 text-gray-700 dark:text-neutral-300'>
                Groups & Lookaround
              </h4>
              <ul className='space-y-1 text-gray-600 dark:text-neutral-400'>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>(abc)</code> - Capture group
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>(?:abc)</code> - Non-capture
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>(?=abc)</code> - Lookahead
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>{'(?<name>)'}</code> - Named group
                </li>
                <li>
                  <code className='text-emerald-600 dark:text-emerald-400'>a|b</code> - Or
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

