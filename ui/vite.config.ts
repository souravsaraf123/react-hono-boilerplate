import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tanstackRouter({
			target: 'react',
			autoCodeSplitting: true,
		}),
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler']],
			},
		}),
		tailwindcss(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@api': path.resolve(__dirname, '../api/src'),
		},
	},
});
