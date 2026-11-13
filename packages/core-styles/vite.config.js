import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
    plugins: [tailwindcss()],
    build: {
        cssCodeSplit: true,
        rolldownOptions: {
            input: resolve(import.meta.dirname, 'src/main.css'),
            output: {
                assetFileNames: 'veltra.[ext]'
            }
        }
    }
});