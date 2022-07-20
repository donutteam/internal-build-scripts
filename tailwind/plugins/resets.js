//
// Imports
//

import tailwindPlugin from "tailwindcss/plugin.js";

//
// Exports
//

export const plugin = tailwindPlugin((api) =>
{
	api.addBase(
		{
			"*, *::before, *::after":
			{
				boxSizing: "border-box",
			},

			"body":
			{
				backgroundColor: "var(--background-color, rgb(255, 255, 255))",

				fontFamily: "Arial, Helvetica, sans-serif",

				margin: "0px",

				padding: "0px",
			},

			"a":
			{
				color: "var(--link-color, rgb(68, 126, 174)",
			},

			"button":
			{
				all: "unset",
			},

			"code, pre":
			{
				wordBreak: "break-all",
			},

			"img":
			{
				display: "block",

				maxWidth: "100%",
			},
		});
});