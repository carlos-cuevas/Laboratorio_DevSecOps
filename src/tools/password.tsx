'use client';

import { StorageKeys } from '@/common/enums/storage-keys.enum';
import { handleCopy, handleDownload } from '@/common/utils';
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
import { useCallback, useEffect, useState } from 'react';

interface PasswordConfigs {
  length: number;
  quantity: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

const DEFAULT_CONFIGS: PasswordConfigs = {
  length: 16,
  quantity: 1,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: true,
  excludeAmbiguous: false,
};

const MAX_LENGTH = 128;
const MAX_QUANTITY = 100;

const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: 'iIlL1oO0',
  ambiguous: '{}[]()/\'"`~,;:.<>',
};

export default function PasswordGeneratorTool() {
  const [configs, setConfigs] = useState<PasswordConfigs>(DEFAULT_CONFIGS);
  const [generatedPasswords, setGeneratedPasswords] = useState<string>('');

  useEffect(() => {
    const lastConfigs = localStorage.getItem(StorageKeys.PasswordConfigs);
    if (lastConfigs) {
      const parsedConfigs = JSON.parse(lastConfigs);
      parsedConfigs.length = handleLengthChange(parsedConfigs.length);
      parsedConfigs.quantity = handleQuantityChange(parsedConfigs.quantity);
      setConfigs(parsedConfigs);
    }
  }, []);

  const getCharacterPool = (configs: PasswordConfigs) => {
    let pool = '';
    if (configs.uppercase) pool += CHARS.uppercase;
    if (configs.lowercase) pool += CHARS.lowercase;
    if (configs.numbers) pool += CHARS.numbers;
    if (configs.symbols) pool += CHARS.symbols;

    if (configs.excludeSimilar) {
      CHARS.similar.split('').forEach((char) => {
        pool = pool.replace(new RegExp(char, 'g'), '');
      });
    }

    if (configs.excludeAmbiguous) {
      CHARS.ambiguous.split('').forEach((char) => {
        pool = pool.replace(new RegExp('\\' + char, 'g'), '');
      });
    }

    return pool;
  };

  const generatePassword = (length: number, pool: string) => {
    let password = '';
    const poolLength = pool.length;
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      password += pool.charAt(randomValues[i] % poolLength);
    }

    return password;
  };

  const generatePasswords = useCallback((configs: PasswordConfigs) => {
    const pool = getCharacterPool(configs);
    if (!pool) {
      setGeneratedPasswords('Please select at least one character type');
      return;
    }

    const passwords = [];
    for (let i = 0; i < configs.quantity; i++) {
      passwords.push(generatePassword(configs.length, pool));
    }
    setGeneratedPasswords(passwords.join('\n'));
  }, []);

  const handleLengthChange = (value: string) => {
    let parsedValue = Number(value);
    if (parsedValue > MAX_LENGTH) {
      parsedValue = MAX_LENGTH;
    }
    if (parsedValue < 1) {
      parsedValue = 1;
    }
    return parsedValue;
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

  useEffect(() => {
    localStorage.setItem(StorageKeys.PasswordConfigs, JSON.stringify(configs));
    generatePasswords(configs);
  }, [configs, generatePasswords]);

  return (
    <div>
      {/* Configuration */}
      <Card collapsible>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigurationItem icon='fa-text-width' label='Length'>
            <div className='w-28'>
              <Input
                value={configs.length}
                type='number'
                placeholder='Length'
                maxLength={3}
                min={1}
                max={MAX_LENGTH}
                onChange={(value) => {
                  setConfigs((prev) => ({
                    ...prev,
                    length: handleLengthChange(value),
                  }));
                }}
              />
            </div>
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
          <ConfigurationItem icon='fa-font' label='Uppercase (A-Z)'>
            <Toggle
              checked={configs.uppercase}
              onChange={(value) => {
                setConfigs((prev) => ({ ...prev, uppercase: value }));
              }}
            />
          </ConfigurationItem>
          <ConfigurationItem icon='fa-font' label='Lowercase (a-z)'>
            <Toggle
              checked={configs.lowercase}
              onChange={(value) => {
                setConfigs((prev) => ({ ...prev, lowercase: value }));
              }}
            />
          </ConfigurationItem>
          <ConfigurationItem icon='fa-hashtag' label='Numbers (0-9)'>
            <Toggle
              checked={configs.numbers}
              onChange={(value) => {
                setConfigs((prev) => ({ ...prev, numbers: value }));
              }}
            />
          </ConfigurationItem>
          <ConfigurationItem icon='fa-at' label='Symbols (!@#$%^&*)'>
            <Toggle
              checked={configs.symbols}
              onChange={(value) => {
                setConfigs((prev) => ({ ...prev, symbols: value }));
              }}
            />
          </ConfigurationItem>
          <ConfigurationItem
            icon='fa-eye-slash'
            label='Exclude Similar'
            description='Exclude similar characters (i, l, 1, L, o, 0, O)'
          >
            <Toggle
              checked={configs.excludeSimilar}
              onChange={(value) => {
                setConfigs((prev) => ({ ...prev, excludeSimilar: value }));
              }}
            />
          </ConfigurationItem>
          <ConfigurationItem
            icon='fa-eye-slash'
            label='Exclude Ambiguous'
            description={`Exclude ambiguous characters ({ } [ ] ( ) / \\ ' " \` ~ , ; : . < >)`}
          >
            <Toggle
              checked={configs.excludeAmbiguous}
              onChange={(value) => {
                setConfigs((prev) => ({ ...prev, excludeAmbiguous: value }));
              }}
            />
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
              onClick={() => generatePasswords(configs)}
            />
          </div>
        </CardFooter>
      </Card>

      {/* Generated Passwords */}
      <div className='mt-5'>
        <Card>
          <CardHeader>
            <CardTitle>Password(s)</CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-copy'
                text='Copy'
                onClick={() => handleCopy(generatedPasswords)}
              />
              <CardActionButton
                icon='far fa-fw fa-save'
                text='Save'
                onClick={() =>
                  handleDownload(generatedPasswords, 'passwords.txt')
                }
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <div className='flex w-full'>
              <Textarea
                value={generatedPasswords}
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
