import { splitVendorChunkPlugin } from 'vite'

export default {
    base: './',
    root: './core',
    plugins: [ splitVendorChunkPlugin() ],
    build: {
        chunkSizeWarningLimit: 700,
        assetsDir: 'static',
        rollupOptions: {
            input: {
                index: './core/demo.html',
            }
        }
    }
}
