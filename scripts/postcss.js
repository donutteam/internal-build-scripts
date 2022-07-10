//
// Imports
//

import "dotenv/config";

import fs from "node:fs";
import path from "node:path";

import postcss from "postcss";

import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcssCalc from "postcss-calc";
import postcssImport from "postcss-import";
import tailwind from "tailwindcss";

import chokidar from "chokidar";

//
// PostCSS Build Script
//

const inputCssPath = path.join(process.cwd(), "app", "client.css");
const outputCssPath = path.join(process.cwd(), "app", "static", "index.css");

await fs.promises.mkdir(path.dirname(outputCssPath), 
	{ 
		recursive: true, 
	});

const plugins =
[
	postcssImport,
	tailwind(
		{
			content:
			[
				"./app/**/*.{html,js}",
				"./node_modules/@donutteam/**/components/**/*.{html,js}",
			],
			theme:
			{
				extend: {},
			},
			plugins: [],
		}),
	postcssCalc(
		{ 
			mediaQueries: true,
		}),
	autoprefixer,	
];

if (process.env.NODE_ENV == "production")
{
	plugins.push(cssnano({ preset: "default" }));
}

const processor = postcss(plugins);

async function build()
{
	const start = performance.now();

	console.log("Building CSS...");

	const css = await fs.promises.readFile(inputCssPath);

	const result = await processor.process(css,
		{
			from: inputCssPath,
			to: outputCssPath,
			map: process.env.NODE_ENV != "production",
		});
	
	await fs.promises.writeFile(outputCssPath, result.css);

	const duration = performance.now() - start;

	console.log(`Built CSS in ${ duration.toFixed(2) }ms!`);
}

build();

//
// Watcher
//

let timeout;

function queueBuild()
{
	clearTimeout(timeout);

	timeout = setTimeout(() =>
	{
		build();
	}, 100);
}

if (process.argv.indexOf("--watch") != -1)
{
	const watcher = chokidar.watch(path.join(process.cwd(), "**", "*.{css,js,html}"),
		{
			ignored:
			[
				"**/static/index.css",
				"**/static/index.css.map",
			],
			ignoreInitial: true,
			persistent: true,
		});

	watcher.on("add", (path) =>
	{
		queueBuild();
	});

	watcher.on("change", (path) =>
	{
		queueBuild();
	});

	watcher.on("unlink", (path) => 
	{
		queueBuild();
	});
}