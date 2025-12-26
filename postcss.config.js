// postcss.config.js
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";

export default ({ env }) => ({
	// Добавляем `env` параметр
	plugins: [
		autoprefixer(),
		env === "production"
			? cssnano({
					// Условие для production
					preset: "default",
			  })
			: false, // Отключаем в development
		env === "production"
			? purgeCSSPlugin({
					// Условие для production
					content: [
						"./**/*.html",
						"./src/**/*.js",
						"./src/**/*.ts",
						"./src/**/*.vue",
						"./src/**/*.tsx",
					],
					safelist: {
						standard: [
							/-(leave|enter|appear)(|-(to|from|active))$/,
							/^(?!(|.*?:)hover):/,
						],
					},
			  })
			: false, // Отключаем в development
	],
});
