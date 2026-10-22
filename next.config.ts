import withPWA from 'next-pwa';

const pwa = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

export default pwa({});
