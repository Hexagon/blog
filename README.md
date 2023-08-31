# README for hexagon.56k.guru Blog

## Introduction

Welcome to the source code repository for my blog - [hexagon.56k.guru](https://hexagon.56k.guru), powered by Deno and Lume. Feel free to dive into the code, contribute, or even guest blog!

## Getting Started

Make sure Deno is installed on your computer.

Clone the repo:

```bash
git clone https://github.com/Hexagon/blog.git
cd blog
```

To run the blog locally:

```bash
deno task serve
```

... or to just generate the site to sub-folder `_site`

```bash
deno task lume
```

## Directory Structure
- `/_config.ts`: Lume configuration
- `/src`: The core source code
    - `/_includes`: Templates for site partials
    - `/css`: Copied to `_site` at build time
    - `/posts`: Markdown files for individual blog posts
    - `/posts/my-series`: Series of related blog posts
- `/_site`: The generated site (ignored in git)

## How to Contribute

1. Fork this repository.
2. Clone your fork.
3. Create a new branch for your work.
4. Make your changes, or add your blog post in `/src/posts` or series in `/src/posts/my-series`.
5. Push your changes and make a pull request.
6. Your pull request will be manually reviewed, only quality content matching the blog's niche will be accepted.

### For Guest Blogging

Please follow this template for posts:

```markdown
---
title: Your blog post title
author:
    name: Your name
    email: Your email
    url: Your website or social media link
license: CC BY-SA 4.0
tags:
    - tag1
    - tag2
---
# Title

text
```

For series, add an additional `part` key:

```markdown
---
part: 1
---

# Title

text
```

## License

- Code: MIT License
- Posts: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

## Questions

If you have any questions, you can reach me at hexagon@56k.guru.
