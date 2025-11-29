import { defineConfig, loadEnv } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            laravel({
                input: "resources/js/app.jsx",
                refresh: true,
            }),
            react(),
        ],
        server: {
            host: "0.0.0.0",
            port: 5173,
            cors: true,
            hmr: {
                host: env.VITE_HMR_HOST || "localhost",
            },
        },
    };
});
