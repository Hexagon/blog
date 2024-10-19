import lume from "lume/mod.ts";

// Native plugins
import code_highlight from "lume/plugins/code_highlight.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import feed from "lume/plugins/feed.ts";
import metas from "lume/plugins/metas.ts";
import sitemap from "lume/plugins/sitemap.ts";
import nav from "lume/plugins/nav.ts";
import date from "lume/plugins/date.ts";
import pagefind from "lume/plugins/pagefind.ts";
import inline from "lume/plugins/inline.ts";
import nunjucks from "lume/plugins/nunjucks.ts";

// Experimental plugins
import readInfo from "lume/plugins/reading_info.ts";

// Official markdown plugins
import toc from "https://deno.land/x/lume_markdown_plugins@v0.5.1/toc.ts";

// Themes for highlight.js
import lang_javascript from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/javascript.min.js";
import lang_bash from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/bash.min.js";
import lang_xml from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/xml.min.js";
import lang_json from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/json.min.js";
import lang_yaml from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/yaml.min.js";

// Initiate site
const site = lume({
  src: "./src",
  location: new URL("https://hexagon.56k.guru"),
});

// Add plugins
site.use(slugifyUrls());
site.use(nunjucks());
site.use(inline());
site.use(
  code_highlight({
    languages: {
      javascript: lang_javascript,
      bash: lang_bash,
      html: lang_xml,
      xml: lang_xml,
      json: lang_json,
      yaml: lang_yaml,
    },
  }),
);
site.use(toc());
site.use(readInfo());
site.use(date());
site.use(feed({
  output: ["/feed.rss", "/feed.json"],
  query: "post",
  info: {
    title: "=site.title",
    description: "=site.description",
  },
  items: {
    title: "=title",
    description: "=description",
    content: "=intro",
  },
}));
site.use(metas());
site.use(sitemap({
  priority: "priority",
}));
site.use(nav());
site.use(pagefind({
  resetStyles: false,
  glob: "/posts/**",
}));

// Copy static content
site.copy("css");
site.copy("img");

// Success!
export default site;
