import { splitVendorChunkPlugin } from 'vite'

export default {
    root: './core',
    plugins: [ splitVendorChunkPlugin() ],
    build: {
        chunkSizeWarningLimit: 700,
        assetsDir: 'static',
    }
}
