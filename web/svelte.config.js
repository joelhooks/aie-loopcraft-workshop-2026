import adapter from "@sveltejs/adapter-static";
import { mdsvex } from "mdsvex";
import { codeToHtml } from "shiki";
import { feedbackSectionsPreprocess } from "./mdsvex-feedback-sections.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svx"],
  kit: {
    adapter: adapter({
      assets: "build",
      pages: "build",
      strict: true,
    }),
    paths: {
      relative: true,
    },
  },
  preprocess: [
    feedbackSectionsPreprocess(),
    mdsvex({
      extensions: [".svx"],
      highlight: {
        highlighter: async (code, lang = "text") => {
          const html = await codeToHtml(code, {
            lang,
            theme: "github-light",
          });
          return `{@html ${JSON.stringify(html)}}`;
        },
      },
    }),
  ],
};

export default config;
