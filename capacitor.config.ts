import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.devd.technotrac',
  appName: 'TechnoTrac',
  webDir: "out",
  server: {
    url: 'https://fieldfriend.web.app', // your deployed frontend
    cleartext: true,
  },
};

export default config;
