import { NewsItem } from '../types';

/**
 * Interface representing the parsed frontmatter and body of a Markdown file
 */
export interface MarkdownContent {
  frontmatter: Record<string, any>;
  body: string;
}

/**
 * Parses a Markdown string to extract YAML frontmatter and content body.
 * Note: This is an improved parser that handles simple objects and lists for topics/gallery.
 */
function parseMarkdown(content: string): MarkdownContent {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);
  
  const frontmatter: Record<string, any> = {};
  let body = content;
  
  if (match) {
    const yamlBlock = match[1];
    body = content.replace(frontmatterRegex, '').trim();
    
    // Split lines and parse manually to handle lists/objects simply
    const lines = yamlBlock.split('\n');
    let currentKey = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimLine = line.trim();
      
      if (!trimLine || trimLine.startsWith('#')) continue;

      // Handle list items
      if (trimLine.startsWith('-')) {
        if (!frontmatter[currentKey]) frontmatter[currentKey] = [];
        
        // Is it a simple string list or an object list?
        if (trimLine.includes(':')) {
          // It's likely an object list item (e.g., gallery)
          // Look ahead to collect fields for this object
          const obj: any = {};
          let j = i;
          while (j < lines.length) {
            const l = lines[j].trim();
            if (j > i && l.startsWith('-')) break; // Next item
            
            const cleanL = l.replace(/^- /, '');
            const idx = cleanL.indexOf(':');
            if (idx !== -1) {
              const k = cleanL.substring(0, idx).trim();
              let v = cleanL.substring(idx + 1).trim().replace(/^["'](.*)["']$/, '$1');
              obj[k] = v;
            }
            j++;
          }
          frontmatter[currentKey].push(obj);
          i = j - 1;
        } else {
          // Simple string list item (e.g., topics)
          frontmatter[currentKey].push(trimLine.replace(/^- /, '').replace(/^["'](.*)["']$/, '$1'));
        }
        continue;
      }

      const idx = line.indexOf(':');
      if (idx !== -1) {
        currentKey = line.substring(0, idx).trim();
        let value: any = line.substring(idx + 1).trim();
        
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        
        if (value === '') {
           // Might be a list or object start
        } else {
           frontmatter[currentKey] = value;
        }
      }
    }
  }
  
  return { frontmatter, body };
}

/**
 * Helper to format date string to bilingual object
 */
function formatBilingualDate(dateStr: string) {
  const d = new Date(dateStr);
  const monthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    id: `${d.getDate()} ${monthsId[d.getMonth()]} ${d.getFullYear()}`,
    en: `${monthsEn[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  };
}

/**
 * Loads all articles from the src/content directory
 */
export async function getAllArticles(): Promise<NewsItem[]> {
  const newsFiles = import.meta.glob('/src/content/news/*.md', { query: '?raw', import: 'default', eager: true });
  const opinionFiles = import.meta.glob('/src/content/opinion/*.md', { query: '?raw', import: 'default', eager: true });
  const reviewFiles = import.meta.glob('/src/content/reviews/*.md', { query: '?raw', import: 'default', eager: true });

  const allFiles = { ...newsFiles, ...opinionFiles, ...reviewFiles };
  
  const articles: NewsItem[] = Object.entries(allFiles).map(([path, content]) => {
    const { frontmatter, body } = parseMarkdown(content as string);
    const filename = path.split('/').pop()?.replace('.md', '') || 'unknown';
    
    // Determine category based on folder path
    let folderCategoryId = 'news';
    let folderCategoryEn = 'News';
    if (path.includes('/opinion/')) {
      folderCategoryId = 'opinion';
      folderCategoryEn = 'Opinion';
    } else if (path.includes('/reviews/')) {
      folderCategoryId = 'reviews';
      folderCategoryEn = 'Reviews';
    }

    // Split body into ID and EN if separator exists
    const bodyParts = body.split(/\n---\n/);
    const bodyId = bodyParts[0]?.trim() || '';
    const bodyEn = bodyParts[1]?.trim() || bodyId;
    
    return {
      id: filename, 
      title: {
        id: frontmatter.title_id || frontmatter.title || 'No Title',
        en: frontmatter.title_en || frontmatter.title || 'No Title'
      },
      excerpt: {
        id: frontmatter.excerpt_id || '',
        en: frontmatter.excerpt_en || ''
      },
      content: {
        id: bodyId,
        en: bodyEn
      },
      category: {
        id: folderCategoryId,
        en: folderCategoryEn
      },
      subCategory: {
        id: frontmatter.category?.toLowerCase() || 'anime',
        en: frontmatter.category || 'Anime'
      },
      author: frontmatter.author || 'CoNime Editorial',
      date: formatBilingualDate(frontmatter.date || new Date().toISOString()),
      imageUrl: frontmatter.thumbnail || '/icons/default.png',
      videoUrl: frontmatter.video_url,
      videoLabel: frontmatter.video_title ? {
         id: frontmatter.video_title,
         en: frontmatter.video_title
      } : undefined,
      imageSource: frontmatter.image_credit,
      imageSourceUrl: frontmatter.image_source_url,
      imageCaption: frontmatter.image_title ? {
         id: frontmatter.image_title,
         en: frontmatter.image_title
      } : undefined,
      source: frontmatter.source_name,
      sourceUrl: frontmatter.source_url,
      views: Math.floor(Math.random() * 5000) + 1000, 
      featured: frontmatter.featured === 'true' || frontmatter.featured === true,
      tags: frontmatter.topics?.map((t: string) => ({ id: t, en: t })) || [],
      gallery: frontmatter.gallery?.map((item: any) => ({
         url: item.image || item.url || '/icons/default.png',
         videoUrl: item.type === 'video' ? item.url : undefined,
         source: item.source,
         caption: { id: item.title || '', en: item.title || '' }
      }))
    } as NewsItem;
  });

  return articles.sort((a, b) => new Date(b.date.en).getTime() - new Date(a.date.en).getTime());
}
