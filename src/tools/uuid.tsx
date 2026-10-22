'use client';

import { useEffect, useState } from 'react';
import { StorageKeys } from '@/common/enums/storage-keys.enum';
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
import SelectBox from '@/components/forms/select-box';
import Textarea from '@/components/forms/textarea';
import Toggle from '@/components/forms/toggle';
import { v1, v4, v6, v7 } from 'uuid';
import { handleCopy, handleDownload } from '@/common/utils';

const UUID_VERSIONS = [
  { text: 'v1', value: '1', fn: v1 },
  { text: 'v4', value: '4', fn: v4 },
  { text: 'v6', value: '6', fn: v6 },
  { text: 'v7', value: '7', fn: v7 },
];

interface UuidConfigs {
  version: string;
  hyphens: boolean;
  uppercase: boolean;
  quantity: number;
}

const DEFAULT_CONFIGS: UuidConfigs = {
  version: '4',
  hyphens: true,
  uppercase: false,
  quantity: 1,
};

const MAX_QUANTITY = 100;

export default function UuidPage() {
  const [configs, setConfigs] = useState<UuidConfigs>(DEFAULT_CONFIGS);
  const [generatedUUIDs, setGeneratedUUIDs] = useState<string>('');

  useEffect(() => {
    const lastConfigs = localStorage.getItem(StorageKeys.UuidConfigs);
    if (lastConfigs) {
      const parsedConfigs = JSON.parse(lastConfigs);
      parsedConfigs.quantity = handleQuantityChange(parsedConfigs.quantity);
      setConfigs(parsedConfigs);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(StorageKeys.UuidConfigs, JSON.stringify(configs));
    generateUuids(configs);
  }, [configs]);

  const generateUuids = (configs: UuidConfigs) => {
    const uuids = [];
    for (let i = 0; i < configs.quantity; i++) {
      let uuid = '';
      if (configs.version === '1') {
        uuid = v1();
      } else if (configs.version === '4') {
        uuid = v4();
      } else if (configs.version === '6') {
        uuid = v6();
      } else if (configs.version === '7') {
        uuid = v7();
      }
      if (!configs.hyphens) {
        uuid = uuid.replace(/-/g, '');
      }
      if (configs.uppercase) {
        uuid = uuid.toUpperCase();
      }
      uuids.push(uuid);
    }
    setGeneratedUUIDs(uuids.join('\n'));
  };

  const calculateRows = (quantity: number) => {
    let rows = quantity;
    if (rows > 30) {
      rows = 30;
    }
    if (rows < 10) {
      rows = 10;
    }
    return rows;
  };

  const handleQuantityChange = (value: string) => {
    let parsedValue = Number(value);
    if (parsedValue > MAX_QUANTITY) {
      parsedValue = MAX_QUANTITY;
    }
    if (parsedValue < 1) {
      parsedValue = 1;
    }
    return parsedValue;
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
            icon='fa-sliders-h'
            label='UUID Version'
            description='Select the version of UUID to generate.'
          >
            <div className='w-28'>
              <SelectBox
                options={UUID_VERSIONS}
                value={configs.version}
                onChange={(value) => {
                  setConfigs((prev) => ({ ...prev, version: value }));
                }}
              />
            </div>
          </ConfigurationItem>
          <ConfigurationItem icon='fa-horizontal-rule' label='Hyphens'>
            <Toggle
              checked={configs.hyphens}
              onChange={(value) => {
                setConfigs((prev) => ({ ...prev, hyphens: value }));
              }}
            />
          </ConfigurationItem>
          <ConfigurationItem icon='fa-font' label='Uppercase'>
            <Toggle
              checked={configs.uppercase}
              onChange={(value) => {
                setConfigs((prev) => ({ ...prev, uppercase: value }));
              }}
            />
          </ConfigurationItem>
          <ConfigurationItem icon='fa-list-ol' label='Quantity'>
            <div className='w-28'>
              <Input
                value={configs.quantity}
                type='number'
                placeholder='Quantity'
                maxLength={3}
                min={1}
                max={MAX_QUANTITY}
                onChange={(value) => {
                  setConfigs((prev) => ({
                    ...prev,
                    quantity: handleQuantityChange(value),
                  }));
                }}
              />
            </div>
          </ConfigurationItem>
        </CardContent>
        <CardFooter>
          <div className='flex gap-3'>
            <SecondaryButton
              text='Reset'
              onClick={() => setConfigs(DEFAULT_CONFIGS)}
            />
            <PrimaryButton
              text='Generate'
              onClick={() => generateUuids(configs)}
            />
          </div>
        </CardFooter>
      </Card>

      {/* Generated UUIDs */}
      <div className='mt-5'>
        <Card>
          <CardHeader>
            <CardTitle>UUID(s)</CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-copy'
                text='Copy'
                onClick={() => handleCopy(generatedUUIDs)}
              />
              <CardActionButton
                icon='far fa-fw fa-save'
                text='Save'
                onClick={() => handleDownload(generatedUUIDs, 'uuids.txt')}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <div className='flex w-full'>
              <Textarea
                value={generatedUUIDs}
                readOnly={true}
                rows={calculateRows(configs.quantity)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
