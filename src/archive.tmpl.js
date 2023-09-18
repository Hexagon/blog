export const layout = "archive.njk";

export const priority = 0.7;

const blocked = ["standalone", "post", "index", "guide-to-js", "deno-tetris-guide"];

export default function* ({ search }) {

  // Find all tags
  const articles = search.pages("post", "date=desc");
  const tags = new Set();
  for (const article of articles) {
    if (article.data && article.data.tags) {
      for(const tag of article.data.tags) {
        if (!blocked.includes(tag)) tags.add(tag);
      }
    }
  }

  // Yield archuive main url
  yield {
    url: `/archive/`,
    tags: [...tags],
    articles,
  };

  // Generate one page per tag
  for (const tag of tags) {
    if (!blocked.includes(tag)) {
      const articles = search.pages(tag);
      yield {
        url: `/archive/${tag}/`,
        tag,
        articles: articles,
      };
    }
  }
}