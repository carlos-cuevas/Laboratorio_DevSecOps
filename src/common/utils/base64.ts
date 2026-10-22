export const isValid = (src: string) => {
  const s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
  return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};

export const decode = (text: string) => {
  if (!isValid(text)) {
    throw new Error('Invalid base64 string');
  }
  return Buffer.from(text, 'base64').toString('utf8');
};

export const encode = (text: string) => {
  return Buffer.from(text).toString('base64');
};
