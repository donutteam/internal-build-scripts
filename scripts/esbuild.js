//
// Imports
//

import "dotenv/config";

import path from "node:path";

import esbuild from "esbuild";

//
// ESBuild Script
//

/**
 * @type {Boolean|esbuild.WatchMode}
 */
let watch = false;

if (process.argv.indexOf("--watch") != -1)
{
	watch =
	{
		onRebuild(error, result)
		{
			if (error == null)
			{
				console.log(`Build succeeded at ${ new Date() }`);
			}
		},
	};
}

esbuild.build(
	{
		bundle: true,

		external:
		[
			"node:crypto",
		],

		entryPoints:
		[
			path.join(process.cwd(), "app", "client.js"),
		],

		minify: process.env.NODE_ENV == "production",

		outfile: path.join(process.cwd(), "app", "static", "index.js"),

		sourcemap: process.env.NODE_ENV != "production",
		
		watch,
	});