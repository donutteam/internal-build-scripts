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

			"header, h1, h2, h3, h4, h5, h6, p":
			{
				marginTop: "1rem",
				marginBottom: "1rem",

				"&:first-child":
				{
					marginTop: "0px",
				},

				"&:last-child":
				{
					marginBottom: "0px",
				},
			},

			"img":
			{
				display: "block",

				maxWidth: "100%",
			},
		});
});