'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import Input from '@/components/forms/input';
import { useCallback, useEffect, useState } from 'react';
import ClipboardText from '@/components/clipboard-text';
import { ConfigurationItem } from '@/components/configuration-item';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import SelectBox from '@/components/forms/select-box';
import { StorageKeys } from '@/common/enums';
import RenderConditional from '@/components/render-conditional';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(timezone);

interface EpochConverterConfigs {
  timeFormat: string;
  hoursFormat: string;
}

const DEFAULT_CONFIGS: EpochConverterConfigs = {
  timeFormat: 'seconds',
  hoursFormat: '12',
};

const TIME_FORMAT_OPTIONS = [
  { text: 'Seconds', value: 'seconds' },
  { text: 'Milliseconds', value: 'milliseconds' },
];

const HOURS_OPTIONS = [
  { text: '12 Hour', value: '12' },
  { text: '24 Hour', value: '24' },
];

export default function EpochTool() {
  const [configs, setConfigs] =
    useState<EpochConverterConfigs>(DEFAULT_CONFIGS);
  const [currentEpoch, setCurrentEpoch] = useState<string>('');
  const [epochInput, setEpochInput] = useState<string>('');
  const [dateComponents, setDateComponents] = useState({
    year: '2025',
    month: '01',
    day: '01',
    hour: '00',
    minute: '00',
    second: '00',
    ampm: 'AM',
    timezone: 'local',
  });
  const [secondsInput, setSecondsInput] = useState<string>('90061');
  const [timePeriodComponents, setTimePeriodComponents] = useState({
    year: '2025',
    month: '01',
    day: '01',
  });

  useEffect(() => {
    const lastConfigs = localStorage.getItem(StorageKeys.EpochConfigs);
    if (lastConfigs) {
      const parsedConfigs = JSON.parse(lastConfigs);
      setConfigs(parsedConfigs);
    }
    const epochSeconds = Math.floor(new Date().getTime() / 1000).toString();
    setEpochInput(epochSeconds);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      StorageKeys.EpochConfigs,
      JSON.stringify(configs)
    );
  }, [configs]);

  useEffect(() => {
    const epoch =
      configs.timeFormat === 'seconds'
        ? Math.floor(new Date().getTime() / 1000).toString()
        : new Date().getTime().toString();
    setCurrentEpoch(epoch);
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentEpoch(
        configs.timeFormat === 'seconds'
          ? Math.floor(now.getTime() / 1000).toString()
          : now.getTime().toString()
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [configs.timeFormat]);

  function ensureMilliseconds(epoch: string) {
    epoch = epoch.trim();
    const length = epoch.length;

    if (length > 13) {
      return epoch.slice(0, 13);
    }

    if (length < 13) {
      return epoch.padEnd(13, '0');
    }

    return epoch;
  }

  const convertEpochToDate = useCallback(
    (epoch: string, showUTC: boolean = false) => {
      try {
        if (!epoch) {
          return '';
        }

        const timestamp = parseInt(ensureMilliseconds(epoch));
        if (isNaN(timestamp)) {
          return 'Invalid epoch timestamp';
        }

        let dateFormat = 'dddd, DD MMMM YYYY hh:mm:ss';
        if (configs.timeFormat === 'milliseconds') {
          dateFormat += '.SSS';
        }

        if (configs.hoursFormat === '12') {
          dateFormat += ' A';
        }

        let date = dayjs(timestamp);

        if (showUTC) {
          date = date.utc();
        } else {
          dateFormat += ' Z';
        }

        return date.format(dateFormat);
      } catch {
        return 'Invalid epoch timestamp';
      }
    },
    [configs.timeFormat, configs.hoursFormat]
  );

  const getRelativeDate = (epoch: string) => {
    if (!epoch) {
      return '';
    }
    const timestamp = parseInt(ensureMilliseconds(epoch));
    if (isNaN(timestamp)) {
      return 'Invalid epoch timestamp';
    }
    return `${dayjs().from(timestamp, true)} ago`;
  };

  const convertDateToEpoch = (components: typeof dateComponents) => {
    try {
      const { year, month, day, hour, minute, second, ampm, timezone } =
        components;

      let hours = parseInt(hour || '0');

      // Convert 12-hour format to 24-hour
      if (configs.hoursFormat === '12') {
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
      }

      const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hours,
        parseInt(minute || '0'),
        parseInt(second || '0')
      );

      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }

      if (timezone === 'gmt') {
        const timestamp = Date.UTC(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          hours,
          parseInt(minute || '0'),
          parseInt(second || '0')
        );
        return timestamp.toString();
      }

      return configs.timeFormat === 'seconds'
        ? Math.floor(date.getTime() / 1000).toString()
        : date.getTime().toString();
    } catch {
      return 'Invalid date';
    }
  };

  const calculateTimeBreakdown = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;

    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);

    return parts.join(', ');
  };

  const getTimePeriodEpochs = (
    date: string,
    type: 'day' | 'month' | 'year',
    timeFormat: string
  ) => {
    const start = parseInt(dayjs(date).startOf(type).valueOf().toString());
    const end = parseInt(dayjs(date).endOf(type).valueOf().toString());
    return {
      start:
        timeFormat === 'seconds'
          ? Math.floor(start / 1000).toString()
          : start.toString(),
      end:
        timeFormat === 'seconds'
          ? Math.floor(end / 1000).toString()
          : end.toString(),
    };
  };

  return (
    <div className='flex gap-4 flex-col'>
      <Card>
        <CardContent>
          The current Unix epoch time is{' '}
          <ClipboardText id='current-epoch-text' text={currentEpoch} />
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card collapsible>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigurationItem
            icon='fa-clock'
            label='Time Format'
            description='Select the time format.'
          >
            <div className='w-40'>
              <SelectBox
                options={TIME_FORMAT_OPTIONS}
                value={configs.timeFormat}
                onChange={(value) =>
                  setConfigs((prev) => ({ ...prev, timeFormat: value }))
                }
              />
            </div>
          </ConfigurationItem>
          <ConfigurationItem
            icon='fa-hourglass'
            label='Hours Format'
            description='Select the hours format.'
          >
            <div className='w-40'>
              <SelectBox
                options={HOURS_OPTIONS}
                value={configs.hoursFormat}
                onChange={(value) =>
                  setConfigs((prev) => ({ ...prev, hoursFormat: value }))
                }
              />
            </div>
          </ConfigurationItem>
        </CardContent>
      </Card>

      {/* Epoch to Date */}
      <Card>
        <CardHeader>
          <CardTitle>Epoch to Human-Readable Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col justify-center sm:flex-row gap-4'>
              <Input
                value={epochInput}
                onChange={setEpochInput}
                placeholder='Enter Epoch'
              />
            </div>

            <RenderConditional condition={!!epochInput.trim()}>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col md:flex-row gap-4'>
                  <div className='font-semibold md:w-1/6'>GMT:</div>
                  <div>{convertEpochToDate(epochInput, true)}</div>
                </div>
                <div className='flex flex-col md:flex-row gap-4'>
                  <div className='font-semibold md:w-1/6'>Local:</div>
                  <div>{convertEpochToDate(epochInput, false)}</div>
                </div>
                <div className='flex flex-col md:flex-row gap-4'>
                  <div className='font-semibold md:w-1/6'>Relative:</div>
                  <div>{getRelativeDate(epochInput)}</div>
                </div>
              </div>
            </RenderConditional>
          </div>
        </CardContent>
      </Card>

      {/* Date to Epoch */}
      <Card>
        <CardHeader>
          <CardTitle>Human-Readable Date to Epoch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col items-center md:flex-row gap-3'>
              <Input
                placeholder='YYYY'
                className='md:w-20'
                value={dateComponents.year}
                onChange={(value) =>
                  setDateComponents((prev) => ({ ...prev, year: value }))
                }
              />
              <div className='hidden md:block'>-</div>
              <Input
                placeholder='MM'
                className='md:w-12'
                value={dateComponents.month}
                onChange={(value) =>
                  setDateComponents((prev) => ({ ...prev, month: value }))
                }
              />
              <div className='hidden md:block'>-</div>
              <Input
                placeholder='DD'
                className='md:w-12'
                value={dateComponents.day}
                onChange={(value) =>
                  setDateComponents((prev) => ({ ...prev, day: value }))
                }
              />
              <div className='hidden md:block'>-</div>
              <Input
                placeholder='HH'
                className='md:w-12'
                value={dateComponents.hour}
                onChange={(value) =>
                  setDateComponents((prev) => ({ ...prev, hour: value }))
                }
              />
              <div className='hidden md:block'>:</div>
              <Input
                placeholder='mm'
                className='md:w-12'
                value={dateComponents.minute}
                onChange={(value) =>
                  setDateComponents((prev) => ({ ...prev, minute: value }))
                }
              />
              <div className='hidden md:block'>:</div>
              <Input
                placeholder='SS'
                className='md:w-12'
                value={dateComponents.second}
                onChange={(value) =>
                  setDateComponents((prev) => ({ ...prev, second: value }))
                }
              />
              <RenderConditional condition={configs.hoursFormat === '12'}>
                <SelectBox
                  options={[
                    { text: 'AM', value: 'AM' },
                    { text: 'PM', value: 'PM' },
                  ]}
                  className='md:w-24 w-full'
                  value={dateComponents.ampm}
                  onChange={(value) =>
                    setDateComponents((prev) => ({ ...prev, ampm: value }))
                  }
                />
              </RenderConditional>
              <SelectBox
                options={[
                  { text: 'Local Time', value: 'local' },
                  { text: 'GMT', value: 'gmt' },
                ]}
                className='md:w-36 w-full'
                value={dateComponents.timezone}
                onChange={(value) =>
                  setDateComponents((prev) => ({ ...prev, timezone: value }))
                }
              />
            </div>

            {/* Result section */}
            <RenderConditional
              condition={
                !!(
                  dateComponents.year &&
                  dateComponents.month &&
                  dateComponents.day
                )
              }
            >
              <div className='flex flex-col md:flex-row md:items-center gap-4'>
                <div className='font-semibold md:w-1/6'>Epoch:</div>
                <div>
                  <ClipboardText
                    id='epoch-text'
                    text={convertDateToEpoch(dateComponents)}
                  />
                </div>
              </div>
            </RenderConditional>
          </div>
        </CardContent>
      </Card>

      {/* Seconds to Time Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Seconds to Time Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Input
                placeholder='Enter seconds'
                onChange={(value) => setSecondsInput(value)}
                value={secondsInput}
              />
            </div>
            <RenderConditional condition={!!secondsInput?.trim()}>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='font-semibold md:w-1/6'>Result:</div>
                <div>
                  {calculateTimeBreakdown(parseInt(secondsInput || '0'))}
                </div>
              </div>
            </RenderConditional>
          </div>
        </CardContent>
      </Card>

      {/* Time Period Epochs */}
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Time Period Epochs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col items-center md:flex-row gap-3 mb-4'>
              <Input
                placeholder='YYYY'
                className='md:w-20'
                value={timePeriodComponents.year}
                onChange={(value) =>
                  setTimePeriodComponents((prev) => ({ ...prev, year: value }))
                }
              />
              <div className='hidden md:block'>-</div>
              <Input
                placeholder='MM'
                className='md:w-12'
                value={timePeriodComponents.month}
                onChange={(value) =>
                  setTimePeriodComponents((prev) => ({ ...prev, month: value }))
                }
              />
              <div className='hidden md:block'>-</div>
              <Input
                placeholder='DD'
                className='md:w-12'
                value={timePeriodComponents.day}
                onChange={(value) =>
                  setTimePeriodComponents((prev) => ({ ...prev, day: value }))
                }
              />
            </div>

            <div className='w-full flex flex-col gap-4 overflow-x-auto'>
              <table className='table-auto w-full text-center border dark:border-neutral-700'>
                <thead>
                  <tr className='border-b dark:border-neutral-700'>
                    <th className='px-6 py-3 border-r dark:border-neutral-700'>
                      Type
                    </th>
                    <th className='px-6 py-3 border-r dark:border-neutral-700'>
                      Time Period
                    </th>
                    <th className='px-6 py-3 border-r dark:border-neutral-700'>
                      Epoch
                    </th>
                    <th className='px-6 py-3'>Date and Time</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Day */}
                  <RenderConditional
                    condition={
                      !!(
                        timePeriodComponents.year &&
                        timePeriodComponents.month &&
                        timePeriodComponents.day
                      )
                    }
                  >
                    {/* Day Start */}
                    <tr className='border-b dark:border-neutral-700'>
                      <td
                        rowSpan={2}
                        className='px-6 py-3 border-r dark:border-neutral-700 font-bold'
                      >
                        Day
                      </td>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        Start
                      </td>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        <ClipboardText
                          id='day-start'
                          text={
                            getTimePeriodEpochs(
                              `${timePeriodComponents.year}-${timePeriodComponents.month}-${timePeriodComponents.day}`,
                              'day',
                              configs.timeFormat
                            ).start
                          }
                        />
                      </td>
                      <td className='px-6 py-3'>
                        {convertEpochToDate(
                          getTimePeriodEpochs(
                            `${timePeriodComponents.year}-${timePeriodComponents.month}-${timePeriodComponents.day}`,
                            'day',
                            configs.timeFormat
                          ).start
                        )}
                      </td>
                    </tr>
                    {/* Day End */}
                    <tr className='border-b dark:border-neutral-700'>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        End
                      </td>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        <ClipboardText
                          id='day-end'
                          text={
                            getTimePeriodEpochs(
                              `${timePeriodComponents.year}-${timePeriodComponents.month}-${timePeriodComponents.day}`,
                              'day',
                              configs.timeFormat
                            ).end
                          }
                        />
                      </td>
                      <td className='px-6 py-3'>
                        {convertEpochToDate(
                          getTimePeriodEpochs(
                            `${timePeriodComponents.year}-${timePeriodComponents.month}-${timePeriodComponents.day}`,
                            'day',
                            configs.timeFormat
                          ).end
                        )}
                      </td>
                    </tr>
                  </RenderConditional>

                  {/* Month */}
                  <RenderConditional
                    condition={
                      !!(
                        timePeriodComponents.year && timePeriodComponents.month
                      )
                    }
                  >
                    {/* Month Start */}
                    <tr className='border-b dark:border-neutral-700'>
                      <td
                        rowSpan={2}
                        className='px-6 py-3 border-r dark:border-neutral-700 font-bold'
                      >
                        Month
                      </td>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        Start
                      </td>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        <ClipboardText
                          id='month-start'
                          text={
                            getTimePeriodEpochs(
                              `${timePeriodComponents.year}-${timePeriodComponents.month}-01`,
                              'month',
                              configs.timeFormat
                            ).start
                          }
                        />
                      </td>
                      <td className='px-6 py-3'>
                        {convertEpochToDate(
                          getTimePeriodEpochs(
                            `${timePeriodComponents.year}-${timePeriodComponents.month}-01`,
                            'month',
                            configs.timeFormat
                          ).start
                        )}
                      </td>
                    </tr>
                    {/* Month End */}
                    <tr className='border-b dark:border-neutral-700'>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        End
                      </td>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        <ClipboardText
                          id='month-end'
                          text={
                            getTimePeriodEpochs(
                              `${timePeriodComponents.year}-${timePeriodComponents.month}-01`,
                              'month',
                              configs.timeFormat
                            ).end
                          }
                        />
                      </td>
                      <td className='px-6 py-3'>
                        {convertEpochToDate(
                          getTimePeriodEpochs(
                            `${timePeriodComponents.year}-${timePeriodComponents.month}-01`,
                            'month',
                            configs.timeFormat
                          ).end
                        )}
                      </td>
                    </tr>
                  </RenderConditional>

                  {/* Year */}
                  <RenderConditional condition={!!timePeriodComponents.year}>
                    {/* Year Start */}
                    <tr className='border-b dark:border-neutral-700'>
                      <td
                        rowSpan={2}
                        className='px-6 py-3 border-r dark:border-neutral-700 font-bold'
                      >
                        Year
                      </td>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        Start
                      </td>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        <ClipboardText
                          id='year-start'
                          text={
                            getTimePeriodEpochs(
                              `${timePeriodComponents.year}-01-01`,
                              'year',
                              configs.timeFormat
                            ).start
                          }
                        />
                      </td>
                      <td className='px-6 py-3'>
                        {convertEpochToDate(
                          getTimePeriodEpochs(
                            `${timePeriodComponents.year}-01-01`,
                            'year',
                            configs.timeFormat
                          ).start
                        )}
                      </td>
                    </tr>
                    {/* Month End */}
                    <tr className='border-b dark:border-neutral-700'>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        End
                      </td>
                      <td className='px-6 py-3 border-r dark:border-neutral-700'>
                        <ClipboardText
                          id='year-end'
                          text={
                            getTimePeriodEpochs(
                              `${timePeriodComponents.year}-01-01`,
                              'year',
                              configs.timeFormat
                            ).end
                          }
                        />
                      </td>
                      <td className='px-6 py-3'>
                        {convertEpochToDate(
                          getTimePeriodEpochs(
                            `${timePeriodComponents.year}-01-01`,
                            'year',
                            configs.timeFormat
                          ).end
                        )}
                      </td>
                    </tr>
                  </RenderConditional>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
