export interface CategoryItem {
  name: string;
  slug: string;
}

export const CATEGORY_LIST: CategoryItem[] = [
  { name: 'आज का तंज', slug: 'satire' },
  { name: 'राष्ट्रीय', slug: 'national' },
  { name: 'राजस्थान', slug: 'rajasthan' },
  { name: 'राजनीति', slug: 'politics' },
  { name: 'समाज', slug: 'society' },
  { name: 'विश्लेषण', slug: 'analysis' },
  { name: 'Data Story', slug: 'data-story' },
  { name: 'Editorial', slug: 'editorial' },
  { name: 'Fact Check', slug: 'fact-check' },
  { name: 'नागरिक पत्रकारिता', slug: 'citizen-journalism' },
  { name: 'Videos', slug: 'videos' }
];

export function getCategoryNameFromSlug(slug: string): string | null {
  const decoded = decodeURIComponent(slug).toLowerCase();
  const match = CATEGORY_LIST.find(
    (c) => c.slug.toLowerCase() === decoded || c.name.toLowerCase() === decoded
  );
  return match ? match.name : null;
}

export function getCategorySlugFromName(name: string): string {
  const match = CATEGORY_LIST.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return match ? match.slug : encodeURIComponent(name);
}
