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
import lang_rust from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/rust.min.js";
import lang_ini from "https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/ini.min.js";

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
      rust: lang_rust,
      toml: lang_ini,
    },
  }),
);
site.use(toc());
site.use(readInfo());
site.use(date());
const feedInfo = {
  title: "Hexagon's Blog",
  description:
    "Hexagon on JavaScript, TypeScript, Deno, Rust, Linux servers, security and open source.",
};
const markdown = () => site.formats.get(".md")!.engines![0];
site.use(feed({
  output: ["/feed.rss", "/feed.json"],
  query: "post",
  limit: 20,
  info: { ...feedInfo, lang: "en" },
  items: {
    title: "=title",
    description: (data) => data.description || data.intro,
    content: (data) =>
      data.intro ? markdown().renderComponent(data.intro, {}) : undefined,
  },
}));
// Lume 2.3's JSON feed writes RFC 822 dates and no summary; fix both.
site.addEventListener("beforeSave", () => {
  const page = site.pages.find((p) => p.data.url === "/feed.json");
  if (!page) return;
  const posts = new Map(
    site.search.pages("post").map((d) => [site.url(d.url, true), d]),
  );
  const json = JSON.parse(page.content as string);
  json.version = "https://jsonfeed.org/version/1.1";
  json.language = "en";
  json.authors = [{ name: "Hexagon", url: "https://hexagon.56k.guru" }];
  for (const item of json.items) {
    const data = posts.get(item.url);
    const summary = data?.description || data?.intro;
    if (summary) item.summary = String(summary).replace(/\s+/g, " ").trim();
    for (const key of ["date_published", "date_modified"]) {
      if (item[key]) item[key] = new Date(item[key]).toISOString();
    }
    if (data?.tags) {
      item.tags = data.tags.filter((t: string) =>
        !["post", "standalone", "index"].includes(t)
      );
    }
  }
  page.content = JSON.stringify(json);
});
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
site.copy("robots.txt");
site.copy("humans.txt");

// Success!
export default site;
