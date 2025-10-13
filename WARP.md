# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Stack: Astro 5 with @astrojs/mdx, TypeScript config via astro/tsconfigs/base
- Purpose: Minimal, low-power blog with monochrome styling, MD/MDX content collections for posts and pages, and a tag system
- Key source roots: src/pages, src/components, src/layouts, src/content, public

Common commands (run from repository root)
- Install dependencies
  ```bash path=null start=null
  npm install
  ```
- Start dev server with hot reload
  ```bash path=null start=null
  npm run dev
  ```
- Build for production
  ```bash path=null start=null
  npm run build
  ```
- Preview the production build locally
  ```bash path=null start=null
  npm run preview
  ```
- Astro diagnostics/type-check (includes content/config, Markdown/MDX, and TS diagnostics)
  ```bash path=null start=null
  npm run astro -- check
  ```

Notes on linting and tests
- Linting: No linter is configured in this repository.
- Tests: No test framework is configured. There are no test scripts or test files present.

High-level architecture
1) Content model (src/content)
- src/content/config.ts defines two Astro Content Collections using defineCollection and zod:
  - blog: MD/MDX loader for src/content/blog with schema { title, description, image, pubDate: Date, tags: string[] }
  - page: MD/MDX loader for src/content/page with schema { title, description, image }
- These schemas gate required frontmatter for every piece of content at build/check time. pubDate must be a Date and tags defaults to an empty array.

2) Routing and rendering (src/pages)
- Files in src/pages are routed by Astro’s file-based router.
- Home page (src/pages/index.astro) loads blog posts via getCollection('blog') and renders a grid of links using the BlogCard component.
- Blog detail routes are generated under src/pages/blog/[slug].astro and list/archive/tag pages are provided under src/pages/tags/… (dynamic pages also exist as catch-all routes like src/pages/[...slug].astro and src/pages/[...page].astro).
- getCollection is the primary content entry point used by pages to fetch typed entries from the defined collections.

3) Layout and components
- Layout.astro is the site-wide frame. It:
  - Pulls pages from the page collection via getCollection('page')
  - Renders a header/nav where each page entry appears as a link using the page’s id and data.title
  - Wraps page content via <slot /> and includes minimal typography/styling
- Components in src/components (e.g., BlogCard.astro, Card.astro) encapsulate UI fragments used by pages; BlogCard drives the home page post grid.

4) Assets and styling
- Public assets live under public/ and are served as-is (favicons, manifest, images). The project emphasizes grayscale/energy-efficient imagery.
- Styling is applied inline within Astro files and via src/styles/mdx-styling.css for MDX content.

5) Tags and dynamic routes
- Tag index (src/pages/tags/index.astro): collects unique tags from all blog posts via getCollection('blog'), computes per-tag counts, and renders links to /tags/{tag}.
- Tag detail (src/pages/tags/[tag].astro): uses getStaticPaths to pre-generate a page for each unique tag. For each tag, it filters posts that include the tag and renders a grid of BlogCard links. Links point to each post.slug (derived from the content entry id).
- Blog detail (src/pages/blog/[slug].astro): uses getStaticPaths to map each blog content entry to params.slug = post.id, then uses render(post) to output the MD/MDX content inside the Layout.
- Page detail (src/pages/[page].astro): mirrors blog detail for the "page" collection; getStaticPaths sets params.page = page.id and render(page) outputs the content.
- Dynamic/catch-all routes also exist in src/pages (e.g., [...slug].astro, [...page].astro). These can be used to handle additional routing patterns if needed.

Developer workflow tips specific to this repo
- Add a blog post: create a .md or .mdx file under src/content/blog with frontmatter fields matching the blog schema (title, description, image, pubDate, tags). The post will automatically be available to pages using getCollection('blog').
- Add a top-level page that appears in the navbar: create a .md or .mdx file under src/content/page with fields matching the page schema (title, description, image). Layout.astro reads this collection and renders nav links for each page by id.
- Validate content & types locally: run the Astro diagnostics command shown above to catch schema or frontmatter issues early.

Environment notes
- Commands above are npm script invocations and work in PowerShell (Windows) as-is.
