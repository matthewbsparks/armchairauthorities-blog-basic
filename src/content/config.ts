import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const page = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/page" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
  }),
});

export const collections = { blog, page };
