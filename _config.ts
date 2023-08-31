import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import feed from "lume/plugins/feed.ts";
import metas from "lume/plugins/metas.ts";
import sitemap from "lume/plugins/sitemap.ts";
import slugify_urls from "lume/plugins/slugify_urls.ts";
import nav from "lume/plugins/nav.ts";
import date from "lume/plugins/date.ts";

import readingTime from "https://raw.githubusercontent.com/lumeland/experimental-plugins/main/reading_time/mod.ts";

import lang_javascript from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/javascript.min.js";
import lang_bash from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/bash.min.js";
import lang_xml from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/xml.min.js";
import lang_json from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/json.min.js";
import lang_yaml from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/yaml.min.js";

// Markdown plugin configuration
const markdown = {};

const site = lume({
  src: "./src",
  location: new URL("https://hexagon.56k.guru"),
}, {
  markdown,
});

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
site.use(readingTime());
site.use(date());
site.use(feed());
site.use(metas());
site.use(sitemap({
  priority: "priority",
}));
site.use(slugify_urls());
site.use(nav());

site.copy("css");

export default site;
