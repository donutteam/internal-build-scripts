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
import postcssNested from "postcss-nested";
import postcssScss from "postcss-scss";
import postcssStripInlineComments from "postcss-strip-inline-comments";

import chokidar from "chokidar";

import { plugin as tailwind } from "./../tailwind/index.js";

//
// Theme
//

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
	tailwind,
	postcssCalc(
		{ 
			mediaQueries: true,
		}),
	postcssNested,
	postcssStripInlineComments,
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

	const css = await fs.promises.readFile(inputCssPath);

	const result = await processor.process(css,
		{
			parser: postcssScss,
			from: inputCssPath,
			to: outputCssPath,
			map: process.env.NODE_ENV != "production",
		});
	
	await fs.promises.writeFile(outputCssPath, result.css);

	const duration = performance.now() - start;

	console.log(`Built CSS in ${ duration.toFixed(2) }ms on ${ new Date() }`);
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