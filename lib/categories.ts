export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

const initialCategories: CategoryItem[] = [
  { id: 'cat-1', name: 'आज का तंज', slug: 'satire', active: true },
  { id: 'cat-2', name: 'राष्ट्रीय', slug: 'national', active: true },
  { id: 'cat-3', name: 'राजस्थान', slug: 'rajasthan', active: true },
  { id: 'cat-4', name: 'राजनीति', slug: 'politics', active: true },
  { id: 'cat-5', name: 'समाज', slug: 'society', active: true },
  { id: 'cat-6', name: 'विश्लेषण', slug: 'analysis', active: true },
  { id: 'cat-7', name: 'Data Story', slug: 'data-story', active: true },
  { id: 'cat-8', name: 'Editorial', slug: 'editorial', active: true },
  { id: 'cat-9', name: 'Fact Check', slug: 'fact-check', active: true },
  { id: 'cat-10', name: 'नागरिक पत्रकारिता', slug: 'citizen-journalism', active: true },
  { id: 'cat-11', name: 'Videos', slug: 'videos', active: true }
];

let inMemoryCategories: CategoryItem[] = [...initialCategories];

export function getCategories(includeInactive = false): CategoryItem[] {
  if (includeInactive) return inMemoryCategories;
  return inMemoryCategories.filter((c) => c.active);
}

export function createCategory(name: string, customSlug?: string): CategoryItem {
  const cleanName = name.trim();
  const slug = (customSlug || cleanName)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `cat-${Date.now()}`;

  const newCat: CategoryItem = {
    id: `cat-${Date.now()}`,
    name: cleanName,
    slug: slug,
    active: true
  };

  inMemoryCategories.push(newCat);
  return newCat;
}

export function toggleCategoryActive(id: string): CategoryItem | null {
  const item = inMemoryCategories.find((c) => c.id === id);
  if (item) {
    item.active = !item.active;
    return item;
  }
  return null;
}

export function deleteCategory(id: string): boolean {
  const prevLen = inMemoryCategories.length;
  inMemoryCategories = inMemoryCategories.filter((c) => c.id !== id);
  return inMemoryCategories.length < prevLen;
}

export function getCategoryNameFromSlug(slug: string): string | null {
  const decoded = decodeURIComponent(slug).toLowerCase();
  const match = inMemoryCategories.find(
    (c) => c.slug.toLowerCase() === decoded || c.name.toLowerCase() === decoded
  );
  return match ? match.name : null;
}

export function getCategorySlugFromName(name: string): string {
  const match = inMemoryCategories.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return match ? match.slug : encodeURIComponent(name);
}
