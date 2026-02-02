import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import dts from 'vite-plugin-dts';

// Plugin para copiar arquivos CSS estáticos
function copyStaticCss() {
  return {
    name: 'copy-static-css',
    writeBundle() {
      const distStyles = resolve(__dirname, 'dist/styles');
      if (!existsSync(distStyles)) {
        mkdirSync(distStyles, { recursive: true });
      }
      // Copiar CSS legado
      const srcCss = resolve(__dirname, 'src/styles/landing-page.css');
      if (existsSync(srcCss)) {
        copyFileSync(srcCss, resolve(distStyles, 'landing-page.css'));
      }
      // Copiar site-theme.css se existir
      const siteThemeCss = resolve(__dirname, 'src/styles/site-theme.css');
      if (existsSync(siteThemeCss)) {
        copyFileSync(siteThemeCss, resolve(distStyles, 'site-theme.css'));
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    dts({
      include: ['src/**/*'],
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
      rollupTypes: true,
    }),
    copyStaticCss(),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        shared: resolve(__dirname, 'src/shared/index.ts'),
        'site-styles': resolve(__dirname, 'src/styles/site/index.ts'),
        'site/index': resolve(__dirname, 'src/site/index.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    cssCodeSplit: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
