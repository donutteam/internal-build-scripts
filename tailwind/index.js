//
// Imports
//

import tailwind from "tailwindcss";

import { plugin as twResetsPlugin } from "./plugins/resets.js";

import { theme as donutteamTheme } from "./themes/donutteam.js";
import { theme as hetcTheme } from "./themes/hetc.js";

//
// Exports
//

let theme = donutteamTheme;

if (process.argv.indexOf("--theme") != -1)
{
	const themeOverride = process.argv[process.argv.indexOf("--theme") + 1];

	switch (themeOverride)
	{
		case "donutteam":
		default:
			theme = donutteamTheme;
			break;

		case "hetc":
			theme = hetcTheme;
			break;
	}
}

export const plugin = tailwind(
	{
		content:
		[
			"./app/**/*.{html,js}",
			"./node_modules/@donutteam/**/components/**/*.{html,js}",
		],
		theme,
		prefix: "tw-",
		corePlugins:
		{
			preflight: false,
		},
		plugins: 
		[
			twResetsPlugin,
		],
	});