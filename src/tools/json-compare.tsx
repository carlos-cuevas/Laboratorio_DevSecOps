'use client';

import { StorageKeys } from '@/common/enums/storage-keys.enum';
import { handlePaste } from '@/common/utils';
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
import Textarea from '@/components/forms/textarea';
import Toggle from '@/components/forms/toggle';
import RenderConditional from '@/components/render-conditional';
import { useEffect, useState, useCallback } from 'react';

interface JsonCompareConfigs {
  leftJson: string;
  rightJson: string;
  ignoreArrayOrder: boolean;
}

interface DiffResult {
  path: string;
  type: 'added' | 'removed' | 'changed' | 'type_mismatch';
  leftValue?: unknown;
  rightValue?: unknown;
}

const DEFAULT_LEFT_JSON = `{
  "name": "DevEase",
  "version": "1.0.0",
  "features": ["json", "sql", "base64"],
  "config": {
    "theme": "dark",
    "language": "en"
  },
  "active": true
}`;

const DEFAULT_RIGHT_JSON = `{
  "name": "DevEase Pro",
  "version": "2.0.0",
  "features": ["json", "sql", "base64", "jwt"],
  "config": {
    "theme": "light",
    "language": "en",
    "beta": true
  },
  "deprecated": false
}`;

const DEFAULT_CONFIGS: JsonCompareConfigs = {
  leftJson: DEFAULT_LEFT_JSON,
  rightJson: DEFAULT_RIGHT_JSON,
  ignoreArrayOrder: false,
};

export default function JsonCompareTool() {
  const [configs, setConfigs] = useState<JsonCompareConfigs>(DEFAULT_CONFIGS);
  const [diffs, setDiffs] = useState<DiffResult[]>([]);
  const [leftError, setLeftError] = useState<string>('');
  const [rightError, setRightError] = useState<string>('');
  const [isIdentical, setIsIdentical] = useState<boolean>(false);

  useEffect(() => {
    const lastConfigs = localStorage.getItem(StorageKeys.JsonCompareConfigs);
    if (lastConfigs) {
      try {
        const parsedConfigs = JSON.parse(lastConfigs);
        setConfigs(parsedConfigs);
      } catch {
        // If parsing fails, use default configs
      }
    }
  }, []);

  const getType = (value: unknown): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };

  const sortArray = useCallback(
    (arr: unknown[], ignoreOrder: boolean): unknown[] => {
      if (!ignoreOrder) return arr;
      return [...arr].sort((a, b) => {
        const aStr = JSON.stringify(a);
        const bStr = JSON.stringify(b);
        return aStr.localeCompare(bStr);
      });
    },
    []
  );

  const compareValues = useCallback(
    (
      left: unknown,
      right: unknown,
      path: string,
      results: DiffResult[],
      ignoreArrayOrder: boolean
    ): void => {
      const leftType = getType(left);
      const rightType = getType(right);

      // Type mismatch
      if (leftType !== rightType) {
        results.push({
          path,
          type: 'type_mismatch',
          leftValue: left,
          rightValue: right,
        });
        return;
      }

      // Both are objects
      if (leftType === 'object' && left !== null && right !== null) {
        const leftObj = left as Record<string, unknown>;
        const rightObj = right as Record<string, unknown>;
        const allKeys = new Set([
          ...Object.keys(leftObj),
          ...Object.keys(rightObj),
        ]);

        for (const key of allKeys) {
          const newPath = path ? `${path}.${key}` : key;
          const hasLeft = key in leftObj;
          const hasRight = key in rightObj;

          if (hasLeft && !hasRight) {
            results.push({
              path: newPath,
              type: 'removed',
              leftValue: leftObj[key],
            });
          } else if (!hasLeft && hasRight) {
            results.push({
              path: newPath,
              type: 'added',
              rightValue: rightObj[key],
            });
          } else {
            compareValues(
              leftObj[key],
              rightObj[key],
              newPath,
              results,
              ignoreArrayOrder
            );
          }
        }
        return;
      }

      // Both are arrays
      if (leftType === 'array') {
        const leftArr = left as unknown[];
        const rightArr = right as unknown[];

        if (ignoreArrayOrder) {
          // Compare arrays ignoring order
          const sortedLeft = sortArray(leftArr, true);
          const sortedRight = sortArray(rightArr, true);

          if (JSON.stringify(sortedLeft) !== JSON.stringify(sortedRight)) {
            // Find differences in array elements
            const leftSet = new Set(leftArr.map((v) => JSON.stringify(v)));
            const rightSet = new Set(rightArr.map((v) => JSON.stringify(v)));

            leftArr.forEach((item, index) => {
              const itemStr = JSON.stringify(item);
              if (!rightSet.has(itemStr)) {
                results.push({
                  path: `${path}[${index}]`,
                  type: 'removed',
                  leftValue: item,
                });
              }
            });

            rightArr.forEach((item, index) => {
              const itemStr = JSON.stringify(item);
              if (!leftSet.has(itemStr)) {
                results.push({
                  path: `${path}[${index}]`,
                  type: 'added',
                  rightValue: item,
                });
              }
            });
          }
        } else {
          // Compare arrays by index
          const maxLen = Math.max(leftArr.length, rightArr.length);
          for (let i = 0; i < maxLen; i++) {
            const newPath = `${path}[${i}]`;
            if (i >= leftArr.length) {
              results.push({
                path: newPath,
                type: 'added',
                rightValue: rightArr[i],
              });
            } else if (i >= rightArr.length) {
              results.push({
                path: newPath,
                type: 'removed',
                leftValue: leftArr[i],
              });
            } else {
              compareValues(
                leftArr[i],
                rightArr[i],
                newPath,
                results,
                ignoreArrayOrder
              );
            }
          }
        }
        return;
      }

      // Primitive values
      if (left !== right) {
        results.push({
          path,
          type: 'changed',
          leftValue: left,
          rightValue: right,
        });
      }
    },
    [sortArray]
  );

  const compareJson = useCallback(
    (configs: JsonCompareConfigs) => {
      setLeftError('');
      setRightError('');
      setDiffs([]);
      setIsIdentical(false);

      let leftObj: unknown;
      let rightObj: unknown;

      // Parse left JSON
      try {
        if (configs.leftJson.trim()) {
          leftObj = JSON.parse(configs.leftJson);
        } else {
          setLeftError('Left JSON is empty');
          return;
        }
      } catch (error: unknown) {
        setLeftError(`Invalid JSON: ${(error as Error).message}`);
        return;
      }

      // Parse right JSON
      try {
        if (configs.rightJson.trim()) {
          rightObj = JSON.parse(configs.rightJson);
        } else {
          setRightError('Right JSON is empty');
          return;
        }
      } catch (error: unknown) {
        setRightError(`Invalid JSON: ${(error as Error).message}`);
        return;
      }

      // Compare
      const results: DiffResult[] = [];
      compareValues(leftObj, rightObj, '', results, configs.ignoreArrayOrder);
      setDiffs(results);
      setIsIdentical(results.length === 0);
    },
    [compareValues]
  );

  useEffect(() => {
    localStorage.setItem(StorageKeys.JsonCompareConfigs, JSON.stringify(configs));
    compareJson(configs);
  }, [configs, compareJson]);

  const handleLeftChange = (value: string) => {
    setConfigs((prev) => ({ ...prev, leftJson: value }));
  };

  const handleRightChange = (value: string) => {
    setConfigs((prev) => ({ ...prev, rightJson: value }));
  };

  const handleSwap = () => {
    setConfigs((prev) => ({
      ...prev,
      leftJson: prev.rightJson,
      rightJson: prev.leftJson,
    }));
  };

  const formatValue = (value: unknown): string => {
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    return JSON.stringify(value);
  };

  const getDiffStats = () => {
    const added = diffs.filter((d) => d.type === 'added').length;
    const removed = diffs.filter((d) => d.type === 'removed').length;
    const changed = diffs.filter(
      (d) => d.type === 'changed' || d.type === 'type_mismatch'
    ).length;
    return { added, removed, changed, total: diffs.length };
  };

  const stats = getDiffStats();

  return (
    <div>
      {/* Configuration */}
      <Card collapsible>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigurationItem
            icon='fa-list-ol'
            label='Ignore Array Order'
            description='Treat arrays with same elements in different order as equal'
          >
            <Toggle
              checked={configs.ignoreArrayOrder}
              onChange={(value) =>
                setConfigs((prev) => ({ ...prev, ignoreArrayOrder: value }))
              }
            />
          </ConfigurationItem>
        </CardContent>
        <CardFooter>
          <div className='flex gap-3'>
            <SecondaryButton
              text='Reset'
              onClick={() => setConfigs(DEFAULT_CONFIGS)}
            />
            <SecondaryButton text='Swap' onClick={handleSwap} />
            <PrimaryButton text='Compare' onClick={() => compareJson(configs)} />
          </div>
        </CardFooter>
      </Card>

      {/* JSON Inputs */}
      <div className='mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* Left JSON */}
        <Card>
          <CardHeader>
            <CardTitle>Left JSON (Original)</CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-times-circle'
                text='Clear'
                onClick={() => handleLeftChange('')}
              />
              <CardActionButton
                icon='far fa-fw fa-paste'
                text='Paste'
                onClick={() => handlePaste(handleLeftChange)}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <Textarea
              value={configs.leftJson}
              onChange={handleLeftChange}
              rows={18}
              placeholder='Paste your original JSON here...'
              className='font-mono text-sm'
            />
            <RenderConditional condition={!!leftError}>
              <div className='mt-3 flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/20'>
                <i className='far fa-fw fa-times-circle text-red-500' />
                <p className='text-sm text-red-500'>{leftError}</p>
              </div>
            </RenderConditional>
          </CardContent>
        </Card>

        {/* Right JSON */}
        <Card>
          <CardHeader>
            <CardTitle>Right JSON (Modified)</CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-times-circle'
                text='Clear'
                onClick={() => handleRightChange('')}
              />
              <CardActionButton
                icon='far fa-fw fa-paste'
                text='Paste'
                onClick={() => handlePaste(handleRightChange)}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <Textarea
              value={configs.rightJson}
              onChange={handleRightChange}
              rows={18}
              placeholder='Paste your modified JSON here...'
              className='font-mono text-sm'
            />
            <RenderConditional condition={!!rightError}>
              <div className='mt-3 flex items-center gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/20'>
                <i className='far fa-fw fa-times-circle text-red-500' />
                <p className='text-sm text-red-500'>{rightError}</p>
              </div>
            </RenderConditional>
          </CardContent>
        </Card>
      </div>

      {/* Results Summary */}
      <RenderConditional condition={!leftError && !rightError}>
        <Card className='mt-4'>
          <CardHeader>
            <CardTitle>Comparison Result</CardTitle>
          </CardHeader>
          <CardContent>
            <RenderConditional condition={isIdentical}>
              <div className='flex items-center gap-3 p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20'>
                <i className='far fa-fw fa-check-circle text-emerald-500 text-2xl' />
                <div>
                  <p className='font-semibold text-emerald-600 dark:text-emerald-400'>
                    JSONs are identical!
                  </p>
                  <p className='text-sm text-emerald-600/80 dark:text-emerald-400/80'>
                    Both JSON objects have the same structure and values.
                  </p>
                </div>
              </div>
            </RenderConditional>

            <RenderConditional condition={!isIdentical && diffs.length > 0}>
              <div className='flex flex-wrap gap-4 mb-4'>
                <div className='flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500/10 border border-emerald-500/20'>
                  <i className='far fa-fw fa-plus-circle text-emerald-500' />
                  <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
                    {stats.added} Added
                  </span>
                </div>
                <div className='flex items-center gap-2 px-4 py-2 rounded-md bg-red-500/10 border border-red-500/20'>
                  <i className='far fa-fw fa-minus-circle text-red-500' />
                  <span className='font-semibold text-red-600 dark:text-red-400'>
                    {stats.removed} Removed
                  </span>
                </div>
                <div className='flex items-center gap-2 px-4 py-2 rounded-md bg-amber-500/10 border border-amber-500/20'>
                  <i className='far fa-fw fa-edit text-amber-500' />
                  <span className='font-semibold text-amber-600 dark:text-amber-400'>
                    {stats.changed} Changed
                  </span>
                </div>
                <div className='flex items-center gap-2 px-4 py-2 rounded-md bg-gray-500/10 border border-gray-500/20 dark:border-neutral-600'>
                  <i className='far fa-fw fa-exchange-alt text-gray-500 dark:text-neutral-400' />
                  <span className='font-semibold text-gray-600 dark:text-neutral-400'>
                    {stats.total} Total Differences
                  </span>
                </div>
              </div>
            </RenderConditional>
          </CardContent>
        </Card>
      </RenderConditional>

      {/* Diff Details */}
      <RenderConditional condition={diffs.length > 0}>
        <Card className='mt-4'>
          <CardHeader>
            <CardTitle>Difference Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='border-b dark:border-neutral-700'>
                    <th className='px-4 py-3 text-sm font-semibold w-12'>
                      Type
                    </th>
                    <th className='px-4 py-3 text-sm font-semibold'>Path</th>
                    <th className='px-4 py-3 text-sm font-semibold'>
                      Left Value
                    </th>
                    <th className='px-4 py-3 text-sm font-semibold'>
                      Right Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {diffs.map((diff, index) => (
                    <tr
                      key={index}
                      className='border-b dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'
                    >
                      <td className='px-4 py-3'>
                        <RenderConditional condition={diff.type === 'added'}>
                          <span className='inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'>
                            <i className='far fa-fw fa-plus' />
                            Added
                          </span>
                        </RenderConditional>
                        <RenderConditional condition={diff.type === 'removed'}>
                          <span className='inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'>
                            <i className='far fa-fw fa-minus' />
                            Removed
                          </span>
                        </RenderConditional>
                        <RenderConditional condition={diff.type === 'changed'}>
                          <span className='inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'>
                            <i className='far fa-fw fa-pencil' />
                            Changed
                          </span>
                        </RenderConditional>
                        <RenderConditional
                          condition={diff.type === 'type_mismatch'}
                        >
                          <span className='inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'>
                            <i className='far fa-fw fa-exchange-alt' />
                            Type
                          </span>
                        </RenderConditional>
                      </td>
                      <td className='px-4 py-3'>
                        <code className='px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded text-sm font-mono'>
                          {diff.path || '(root)'}
                        </code>
                      </td>
                      <td className='px-4 py-3'>
                        <RenderConditional
                          condition={
                            diff.type === 'removed' ||
                            diff.type === 'changed' ||
                            diff.type === 'type_mismatch'
                          }
                        >
                          <code className='px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm font-mono break-all'>
                            {formatValue(diff.leftValue)}
                          </code>
                        </RenderConditional>
                        <RenderConditional condition={diff.type === 'added'}>
                          <span className='text-gray-400 dark:text-neutral-500'>
                            —
                          </span>
                        </RenderConditional>
                      </td>
                      <td className='px-4 py-3'>
                        <RenderConditional
                          condition={
                            diff.type === 'added' ||
                            diff.type === 'changed' ||
                            diff.type === 'type_mismatch'
                          }
                        >
                          <code className='px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-sm font-mono break-all'>
                            {formatValue(diff.rightValue)}
                          </code>
                        </RenderConditional>
                        <RenderConditional condition={diff.type === 'removed'}>
                          <span className='text-gray-400 dark:text-neutral-500'>
                            —
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
    </div>
  );
}

