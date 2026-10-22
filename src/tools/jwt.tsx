'use client';

import { handleCopy, handlePaste } from '@/common/utils';
import {
  Card,
  CardActionButton,
  CardActions,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { ConfigurationItem } from '@/components/configuration-item';
import CodeEditor from '@/components/forms/code-editor';
import SelectBox from '@/components/forms/select-box';
import Textarea from '@/components/forms/textarea';
import RenderConditional from '@/components/render-conditional';
import { useEffect, useState, useCallback } from 'react';
import { jwtVerify } from 'jose';
import jwtSign from 'jwt-encode';
import Input from '@/components/forms/input';
import { StorageKeys } from '@/common/enums';

enum Mode {
  Encode = 'encode',
  Decode = 'decode',
}

interface JwtConfigs {
  mode: Mode;
}

const DEFAULT_CONFIGS: JwtConfigs = {
  mode: Mode.Decode,
};

const MODES = [
  { text: 'Encode', value: Mode.Encode },
  { text: 'Decode', value: Mode.Decode },
];

export default function JwtTool() {
  const [configs, setConfigs] = useState<JwtConfigs>(DEFAULT_CONFIGS);

  const [token, setToken] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldkVhc2UiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNzM1Njg5NjAwLCJleHAiOjI1NTYxNDM5OTl9.tlvBeWl47-bDa5z9McrgU2tseAmWsnehvM5nZtOCb-I'
  );
  const [secret, setSecret] = useState<string>(
    'a-string-secret-at-least-256-bits-long'
  );
  const [verified, setVerified] = useState<boolean>(false);
  const [header, setHeader] = useState<string>('');
  const [payload, setPayload] = useState<string>('');

  useEffect(() => {
    const lastConfigs = localStorage.getItem(StorageKeys.JwtConfigs);
    if (lastConfigs) {
      const parsedConfigs = JSON.parse(lastConfigs);
      setConfigs(parsedConfigs);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(StorageKeys.JwtConfigs, JSON.stringify(configs));
  }, [configs]);

  const verifyJwt = useCallback(async (token: string, secret: string) => {
    try {
      await jwtVerify(token, Buffer.from(secret), {});
      setVerified(true);
    } catch {
      setVerified(false);
    }
  }, []);

  const decodeJwt = useCallback((token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const decodedHeader = JSON.parse(
        Buffer.from(parts[0], 'base64').toString()
      );
      const decodedPayload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString()
      );

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
    } catch (error: unknown) {
      setHeader((error as Error).message);
      setPayload('');
    }
  }, []);

  const encodeJwt = useCallback((payload: string, secret: string) => {
    try {
      const encodedToken = jwtSign(JSON.parse(payload), secret);
      setToken(encodedToken);
    } catch (error: unknown) {
      setToken((error as Error).message);
    }
  }, []);

  useEffect(() => {
    if (configs.mode === Mode.Encode) {
      return;
    }

    decodeJwt(token);
  }, [token, configs.mode, decodeJwt]);

  useEffect(() => {
    if (configs.mode === Mode.Encode) {
      return;
    }

    verifyJwt(token, secret);
  }, [token, secret, configs.mode, verifyJwt]);

  useEffect(() => {
    if (configs.mode === Mode.Decode) {
      return;
    }

    encodeJwt(payload, secret);
  }, [payload, secret, configs.mode, encodeJwt]);

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
      </Card>

      <div className='mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* JWT Input */}

        <div
          className={`flex flex-col gap-4 ${
            configs.mode === Mode.Encode ? 'order-2' : ''
          }`}
        >
          <Card>
            <CardHeader>
              <CardTitle>JWT Token</CardTitle>
              <CardActions>
                <RenderConditional condition={configs.mode === Mode.Decode}>
                  <CardActionButton
                    icon='far fa-fw fa-times-circle'
                    text='Clear'
                    onClick={() => setToken('')}
                  />
                </RenderConditional>
                <CardActionButton
                  icon='far fa-fw fa-paste'
                  text='Paste'
                  onClick={() => handlePaste((value) => setToken(value))}
                />
              </CardActions>
            </CardHeader>
            <CardContent>
              <Textarea
                value={token}
                onChange={(value) => setToken(value)}
                rows={configs.mode === Mode.Decode ? 20 : 22}
                readOnly={configs.mode === Mode.Encode}
              />
            </CardContent>
          </Card>

          <RenderConditional
            condition={configs.mode === Mode.Decode && verified}
          >
            <div className='flex items-center border border-emerald-500/20 p-3 gap-2 rounded-md bg-emerald-500/10'>
              <i className='far fa-fw fa-check-circle text-emerald-500' />
              <p className='text-md font-medium text-emerald-500'>
                Signature Verified
              </p>
            </div>
          </RenderConditional>

          <RenderConditional
            condition={configs.mode === Mode.Decode && !verified}
          >
            <div className='flex items-center border border-red-500/20 p-3 gap-2 rounded-md bg-red-500/10'>
              <i className='far fa-fw fa-times-circle text-red-500' />
              <p className='text-md font-medium text-red-500'>
                Invalid Signature
              </p>
            </div>
          </RenderConditional>
        </div>

        {/* Decoded Sections */}
        <div className='flex flex-col gap-4'>
          <RenderConditional condition={configs.mode === Mode.Decode}>
            <Card>
              <CardHeader>
                <CardTitle>Header</CardTitle>
                <CardActions>
                  <CardActionButton
                    icon='far fa-fw fa-copy'
                    text='Copy'
                    onClick={() => handleCopy(header)}
                  />
                </CardActions>
              </CardHeader>
              <CardContent>
                <CodeEditor
                  id='jwt-header'
                  value={header}
                  minLines={5}
                  readOnly
                />
              </CardContent>
            </Card>
          </RenderConditional>

          <Card>
            <CardHeader>
              <CardTitle>Payload</CardTitle>
              <CardActions>
                <RenderConditional condition={configs.mode === Mode.Encode}>
                  <CardActionButton
                    icon='far fa-fw fa-times-circle'
                    text='Clear'
                    onClick={() => setPayload('')}
                  />
                </RenderConditional>
                <CardActionButton
                  icon='far fa-fw fa-copy'
                  text='Copy'
                  onClick={() => handleCopy(payload)}
                />
              </CardActions>
            </CardHeader>
            <CardContent>
              <CodeEditor
                id='jwt-payload'
                value={payload}
                minLines={12}
                readOnly={configs.mode === Mode.Decode}
                onChange={(value) => setPayload(value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signature</CardTitle>
              <CardActions>
                <CardActionButton
                  icon='far fa-fw fa-copy'
                  text='Copy'
                  onClick={() => handleCopy(secret)}
                />
              </CardActions>
            </CardHeader>
            <CardContent>
              <Input
                value={secret}
                onChange={(value) => setSecret(value)}
                placeholder='your-256-bit-secret'
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
