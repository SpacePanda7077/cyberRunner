import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
    },
    server: {
        port: 8080,
        allowedHosts:["43bcb15e-d765-4264-8b4f-3f9efb181def-00-1frvx90hk58lw.worf.replit.dev"]
    }
});
