'use client';

import { StorageKeys } from '@/common/enums/storage-keys.enum';
import { handleCopy, handleDownload, handlePaste } from '@/common/utils';
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
import SelectBox from '@/components/forms/select-box';
import Textarea from '@/components/forms/textarea';
import Toggle from '@/components/forms/toggle';
import { useEffect, useState, useCallback } from 'react';

enum Mode {
  Encode = 'encode',
  Decode = 'decode',
}

enum EncodeType {
  Component = 'component',
  Full = 'full',
}

interface UrlEncoderDecoderConfigs {
  mode: Mode;
  encodeType: EncodeType;
  encodeSpacesAsPlus: boolean;
  input: string;
}

const DEFAULT_CONFIGS: UrlEncoderDecoderConfigs = {
  mode: Mode.Encode,
  encodeType: EncodeType.Component,
  encodeSpacesAsPlus: false,
  input: 'Hello World! Welcome to DevEase?query=value&foo=bar',
};

const MODES = [
  { text: 'Encode', value: Mode.Encode },
  { text: 'Decode', value: Mode.Decode },
];

const ENCODE_TYPES = [
  { text: 'Component (encodeURIComponent)', value: EncodeType.Component },
  { text: 'Full URL (encodeURI)', value: EncodeType.Full },
];

export default function UrlEncoderDecoderTool() {
  const [configs, setConfigs] =
    useState<UrlEncoderDecoderConfigs>(DEFAULT_CONFIGS);
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    const lastConfigs = localStorage.getItem(
      StorageKeys.UrlEncoderDecoderConfigs
    );
    if (lastConfigs) {
      const parsedConfigs = JSON.parse(lastConfigs);
      setConfigs(parsedConfigs);
    }
  }, []);

  const convertUrl = useCallback((configs: UrlEncoderDecoderConfigs) => {
    if (!configs.input) {
      setOutput('');
      return;
    }

    try {
      let result: string;

      if (configs.mode === Mode.Encode) {
        if (configs.encodeType === EncodeType.Component) {
          result = encodeURIComponent(configs.input);
        } else {
          result = encodeURI(configs.input);
        }

        // Optionally encode spaces as + instead of %20
        if (configs.encodeSpacesAsPlus) {
          result = result.replace(/%20/g, '+');
        }
      } else {
        // Decode mode
        let inputToProcess = configs.input;

        // Convert + back to spaces before decoding if needed
        if (configs.encodeSpacesAsPlus) {
          inputToProcess = inputToProcess.replace(/\+/g, ' ');
        }

        if (configs.encodeType === EncodeType.Component) {
          result = decodeURIComponent(inputToProcess);
        } else {
          result = decodeURI(inputToProcess);
        }
      }

      setOutput(result);
    } catch (error: unknown) {
      setOutput(`Error: ${(error as Error).message}`);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      StorageKeys.UrlEncoderDecoderConfigs,
      JSON.stringify(configs)
    );
    convertUrl(configs);
  }, [configs, convertUrl]);

  const handleInputChange = (value: string) => {
    setConfigs((prev) => ({ ...prev, input: value }));
  };

  const handleSwap = () => {
    setConfigs((prev) => ({
      ...prev,
      mode: prev.mode === Mode.Encode ? Mode.Decode : Mode.Encode,
      input: output,
    }));
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
            label='Mode'
            description='Select encode or decode mode.'
          >
            <div className='w-40'>
              <SelectBox
                options={MODES}
                value={configs.mode}
                onChange={(value) => {
                  setConfigs((prev) => ({ ...prev, mode: value as Mode }));
                }}
              />
            </div>
          </ConfigurationItem>
          <ConfigurationItem
            icon='fa-code'
            label='Encoding Type'
            description='Component encodes all special characters. Full URL preserves URL structure characters like :, /, ?, &, =, #.'
          >
            <div className='w-72'>
              <SelectBox
                options={ENCODE_TYPES}
                value={configs.encodeType}
                onChange={(value) => {
                  setConfigs((prev) => ({
                    ...prev,
                    encodeType: value as EncodeType,
                  }));
                }}
              />
            </div>
          </ConfigurationItem>
          <ConfigurationItem
            icon='fa-plus'
            label='Spaces as +'
            description='Encode/decode spaces as + instead of %20 (common in query strings).'
          >
            <Toggle
              checked={configs.encodeSpacesAsPlus}
              onChange={(value) => {
                setConfigs((prev) => ({ ...prev, encodeSpacesAsPlus: value }));
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
            <SecondaryButton
              text='Swap'
              onClick={handleSwap}
            />
            <PrimaryButton
              text={configs.mode === Mode.Encode ? 'Encode' : 'Decode'}
              onClick={() => convertUrl(configs)}
            />
          </div>
        </CardFooter>
      </Card>

      <div className='mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* Input */}
        <Card className='mt-5'>
          <CardHeader>
            <CardTitle>
              {configs.mode === Mode.Encode ? 'Plain Text / URL' : 'Encoded URL'}
            </CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-times-circle'
                text='Clear'
                onClick={() => handleInputChange('')}
              />
              <CardActionButton
                icon='far fa-fw fa-paste'
                text='Paste'
                onClick={() => handlePaste(handleInputChange)}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <Textarea
              value={configs.input}
              onChange={handleInputChange}
              rows={20}
              placeholder={
                configs.mode === Mode.Encode
                  ? 'Enter text or URL to encode...'
                  : 'Enter encoded URL to decode...'
              }
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card className='mt-5'>
          <CardHeader>
            <CardTitle>
              {configs.mode === Mode.Encode ? 'Encoded URL' : 'Decoded Text / URL'}
            </CardTitle>
            <CardActions>
              <CardActionButton
                icon='far fa-fw fa-copy'
                text='Copy'
                onClick={() => handleCopy(output)}
              />
              <CardActionButton
                icon='far fa-fw fa-save'
                text='Save'
                onClick={() =>
                  handleDownload(
                    output,
                    configs.mode === Mode.Encode
                      ? 'encoded-url.txt'
                      : 'decoded-url.txt'
                  )
                }
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              rows={20}
              readOnly={true}
              placeholder='Output will appear here...'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

