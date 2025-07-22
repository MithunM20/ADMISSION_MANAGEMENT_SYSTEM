// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    define: {
        "process.env": {
            REACT_APP_API_BASE_URL: JSON.stringify(process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"),
        },
    },
});