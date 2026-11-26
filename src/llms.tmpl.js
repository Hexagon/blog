// Generates /llms.txt (https://llmstxt.org) and /llms-full.txt at build time.

const base = "https://hexagon.56k.guru";

const abs = (url) => new URL(url, base).href;
const oneLine = (text) => String(text ?? "").replace(/\s+/g, " ").trim();
const describe = (data) => oneLine(data.description || data.intro);

async function body(page) {
  const path = `./src${page.src.path}${page.src.ext}`;
  const source = await Deno.readTextFile(path);
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
}

export default async function* ({ search, metas }) {
  const posts = search.pages("post", "date=desc");
  const title = metas?.site || "Hexagon's Blog";
  const summary =
    "Hexagon's blog about JavaScript, TypeScript, Deno, Bun, Node.js, Linux and open source projects like Croner.";

  const header = [`# ${title}`, "", `> ${summary}`, ""];

  const list = posts.map((p) => {
    const desc = describe(p);
    return `- [${oneLine(p.title)}](${abs(p.url)})${desc ? `: ${desc}` : ""}`;
  });

  yield {
    url: "/llms.txt",
    content: [
      ...header,
      `Full text of all posts: ${abs("/llms-full.txt")}`,
      "",
      "## Posts",
      "",
      ...list,
      "",
      "## Optional",
      "",
      `- [Archive](${abs("/archive/")}): All posts grouped by tag`,
      `- [RSS feed](${abs("/feed.rss")}): Latest posts`,
      "",
    ].join("\n"),
  };

  const full = [...header];
  for (const p of posts) {
    full.push(
      "---",
      "",
      `# ${oneLine(p.title)}`,
      "",
      `URL: ${abs(p.url)}`,
      `Date: ${p.date.toISOString().slice(0, 10)}`,
      "",
      await body(p),
      "",
    );
  }
  yield { url: "/llms-full.txt", content: full.join("\n") };
}
