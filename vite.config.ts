import { defineConfig } from 'vite';

export default defineConfig({
  base: '/project-rail-grinder/',
  build: {
    rollupOptions: {
      output: {
        // Put Three.js in its own file. It rarely changes, so browsers can keep
        // it cached while our (much smaller) game code updates.
        manualChunks: {
          three: ['three'],
        },
      },
    },
    // Three.js alone is ~650 KB minified (~160 KB gzipped), which trips Vite's
    // default 500 KB warning even though it's expected for a 3D game.
    chunkSizeWarningLimit: 800,
  },
});
