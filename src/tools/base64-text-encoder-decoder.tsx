'use client';

import { StorageKeys } from '@/common/enums/storage-keys.enum';
import { handleCopy, handleDownload, handlePaste } from '@/common/utils';
import { decode, encode } from '@/common/utils/base64';
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
import { useEffect, useState, useCallback } from 'react';

enum Mode {
  Encode = 'encode',
  Decode = 'decode',
}

interface Base64TextEncoderDecoderConfigs {
  mode: Mode;
  input: string;
}

const DEFAULT_CONFIGS: Base64TextEncoderDecoderConfigs = {
  mode: Mode.Decode,
  input: 'SGksIFdlbGNvbWUgdG8gRGV2RWFzZQ==',
};

const MODES = [
  { text: 'Encode', value: Mode.Encode },
  { text: 'Decode', value: Mode.Decode },
];

export default function Base64EncoderDecoderTool() {
  const [configs, setConfigs] =
    useState<Base64TextEncoderDecoderConfigs>(DEFAULT_CONFIGS);
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    const lastConfigs = localStorage.getItem(
      StorageKeys.Base64TextEncoderDecoderConfigs
    );
    if (lastConfigs) {
      const parsedConfigs = JSON.parse(lastConfigs);
      setConfigs(parsedConfigs);
    }
  }, []);

  const convertBase64 = useCallback(
    (configs: Base64TextEncoderDecoderConfigs) => {
      if (!configs.input) {
        setOutput('');
        return;
      }

      try {
        if (configs.mode === Mode.Encode) {
          setOutput(encode(configs.input));
        } else {
          setOutput(decode(configs.input));
        }
      } catch (error: unknown) {
        setOutput((error as Error).message);
      }
    },
    []
  );

  useEffect(() => {
    localStorage.setItem(
      StorageKeys.Base64TextEncoderDecoderConfigs,
      JSON.stringify(configs)
    );
    convertBase64(configs);
  }, [configs, convertBase64]);

  const handleInputChange = (value: string) => {
    setConfigs((prev) => ({ ...prev, input: value }));
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
            description='Select the mode.'
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
        </CardContent>
        <CardFooter>
          <div className='flex gap-3'>
            <SecondaryButton
              text='Reset'
              onClick={() => setConfigs(DEFAULT_CONFIGS)}
            />
            <PrimaryButton
              text={configs.mode === Mode.Encode ? 'Encode' : 'Decode'}
              onClick={() => convertBase64(configs)}
            />
          </div>
        </CardFooter>
      </Card>

      <div className='mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* Input */}
        <Card className='mt-5'>
          <CardHeader>
            <CardTitle>
              {configs.mode === Mode.Encode ? 'Plain Text' : 'Base64 Text'}
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
              rows={30}
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card className='mt-5'>
          <CardHeader>
            <CardTitle>
              {configs.mode === Mode.Encode ? 'Base64 Text' : 'Plain Text'}
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
                onClick={() => handleDownload(output, 'formatted-json.json')}
              />
            </CardActions>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              onChange={handleInputChange}
              rows={30}
              readOnly={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
