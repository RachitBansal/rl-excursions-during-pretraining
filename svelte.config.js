import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [preprocess({ postcss: true })],
  kit: {
    adapter: adapter({
      pages: "docs",
      assets: "docs",
      fallback: null,
    }),
    paths: {
      // Use repo name as base when deploying to GitHub Pages (e.g. user.github.io/rl-excursions-during-pretraining/)
      base: process.env.GITHUB_PAGES ? "/rl-excursions-during-pretraining" : "",
    },
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // Ignore 404s for image placeholders during build
        if (path.includes('IMAGE_PLACEHOLDER') || path.endsWith('.png') || path.endsWith('.jpg')) {
          return;
        }
        throw new Error(message);
      }
    }
  },
};

export default config;
