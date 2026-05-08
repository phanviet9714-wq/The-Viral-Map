import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content/viral-content');

export interface Concept {
  slug: string;
  title: string;
  english_title: string;
  cover_image: string;
  cover_caption: string;
  category: string;
  status: string;
  date: string;
  contentHtml: string;
}

export async function getAllConcepts(): Promise<Omit<Concept, 'contentHtml'>[]> {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(contentDirectory);
  const allConcepts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        english_title: data.english_title || '',
        cover_image: data.cover_image || '',
        cover_caption: data.cover_caption || '',
        category: data.category || 'Uncategorized',
        status: data.status || 'draft',
        date: data.date ? String(data.date) : '',
      };
    });

  return allConcepts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getConceptData(slug: string): Promise<Concept> {
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(content);
  let contentHtml = processedContent.toString();

  // Hỗ trợ Obsidian Wiki-links cho ảnh: ![[image.png]]
  contentHtml = contentHtml.replace(/!\[\[(.*?)\]\]/g, (match, fileName) => {
    // Tách tên file và các thuộc tính khác (nếu có, VD: ![[image.png|300]])
    const actualFileName = fileName.split('|')[0];
    return `<img src="/api/assets?name=${encodeURIComponent(actualFileName)}" alt="${actualFileName}" style="max-width: 100%; border-radius: 8px; display: block; margin: 2rem auto; box-shadow: var(--card-shadow);" />`;
  });

  return {
    slug,
    title: data.title || slug,
    english_title: data.english_title || '',
    cover_image: data.cover_image || '',
    cover_caption: data.cover_caption || '',
    category: data.category || 'Uncategorized',
    status: data.status || 'draft',
    date: data.date ? String(data.date) : '',
    contentHtml,
  };
}
