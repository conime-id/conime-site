import { generateSW } from 'workbox-build';
import path from 'path';

const run = async () => {
  try {
    const result = await generateSW({
      globDirectory: 'dist',
      globPatterns: [
        '**/*.{js,css,html,png,jpg,svg,json,webmanifest,ttf,woff2}'
      ],
      swDest: 'dist/sw.js',
      modifyURLPrefix: {
        '': '/'
      }
    });
    console.log('SUCCESS:', result);
  } catch (error) {
    console.error('FAILED:', error);
    process.exit(1);
  }
};

run();
