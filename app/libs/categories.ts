// ============================================================
// CATEGORY LABELS (same as before)
// ============================================================
export const CATEGORY_LABELS = [
  'AI',
  'Animation',
  'Banners',
  'Branding',
  'Cards',
  'Character Design',
  'Editing',
  'Illustrations',
  'Infographics',
  'Interior/Exterior Design',
  'Insta Grid',
  'Labels/Stickers',
  'Logo Design',
  'Mockups',
  'Print Media',
  'Product/Packaging Design',
  'Silhouettes',
  'Social Media',
  'Stationery',
  'Typography',
  'UI/UX',
  'Vectors Design',
  'Video',
] as const;

export type CategoryLabel = typeof CATEGORY_LABELS[number];


// ============================================================
// CATEGORY CODES (DB safe)
// ============================================================
export type CategoryCode =
  | 'AI'
  | 'ANIMATION'
  |  'BANNERS'
  | 'BRANDING'
  | 'CARDS'
  | 'CHARACTER_DESIGN'
  | 'EDITING'
  | 'ILLUSTRATIONS'
  | 'INFOGRAPHICS'
  | 'INTERIOR_EXTERIOR_DESIGN'
  | 'INSTA_GRID'
  | 'LABELS_STICKERS'
  | 'LOGO_DESIGN'
  | 'MOCKUPS'
  | 'PRINT_MEDIA'
  | 'PRODUCT_PACKAGING'
  | 'SILHOUETTES'
  | 'SOCIAL_MEDIA'
  | 'STATIONERY'
  | 'TYPOGRAPHY'
  | 'UI_UX'
  | 'VECTORS_DESIGN'
  | 'VIDEO';


// ============================================================
// LABEL → CODE mapping
// ============================================================
export const LABEL_TO_CODE: Record<CategoryLabel, CategoryCode> = {
  'AI': 'AI',
  'Animation': 'ANIMATION',
  'Banners': 'BANNERS',
  'Branding': 'BRANDING',
  'Cards': 'CARDS',
  'Character Design': 'CHARACTER_DESIGN',
  'Editing': 'EDITING',
  'Illustrations': 'ILLUSTRATIONS',
  'Infographics': 'INFOGRAPHICS',
  'Interior/Exterior Design': 'INTERIOR_EXTERIOR_DESIGN',
  'Insta Grid': 'INSTA_GRID',
  'Labels/Stickers': 'LABELS_STICKERS',
  'Logo Design': 'LOGO_DESIGN',
  'Mockups': 'MOCKUPS',
  'Print Media': 'PRINT_MEDIA',
  'Product/Packaging Design': 'PRODUCT_PACKAGING',
  'Silhouettes': 'SILHOUETTES',
  'Social Media': 'SOCIAL_MEDIA',
  'Stationery': 'STATIONERY',
  'Typography': 'TYPOGRAPHY',
  'UI/UX': 'UI_UX',
  'Vectors Design': 'VECTORS_DESIGN',
  'Video': 'VIDEO',
};


// ============================================================
// CODE → LABEL
// ============================================================
export const CODE_TO_LABEL = Object.fromEntries(
  Object.entries(LABEL_TO_CODE).map(([label, code]) => [code, label])
) as Record<CategoryCode, CategoryLabel>;


// ============================================================
// CATEGORY CODES ARRAY
// ============================================================
export const CATEGORY_CODES = Object.values(LABEL_TO_CODE) as CategoryCode[];


// ============================================================
// SUBCATEGORIES (DEFAULT)
// ============================================================
export const SUBCATEGORIES: Record<CategoryCode, string[]> = {
  AI: ['AI Art', 'AI Enhancements', 'AI Retouch'],

  ANIMATION: ['2D Animation', '3D Animation', 'Animated Videos', 'Motion Graphics'],

  BANNERS: [],

  BRANDING: ['Brand Guidelines', 'Brand Identity', 'Strategy'],

  CARDS: ['Business', 'Greeting', 'Id Cards', 'Invitation', 'Menu Cards'],

  CHARACTER_DESIGN: ['3D Characters', 'Cartoon', 'Mascots'],

  EDITING: ['Photo Editing', 'Retouching', 'Video Editing'],

  ILLUSTRATIONS: ['Comic Style', 'Digital Art', 'Vector Art'],

  INFOGRAPHICS: ['Animated Infographics', 'Static Infographics'],

  INTERIOR_EXTERIOR_DESIGN: ['Exterior 3D', 'Floor Plans', 'Interior 3D'],

  INSTA_GRID: ['3x3 Grid', 'Puzzle Layouts'],

  LABELS_STICKERS: ['Bottle Labels', 'Packaging Labels', 'Stickers'],

  LOGO_DESIGN: [
    '3D Logo',
    'Mascot',
    'Minimal',
    'Premium and Signature',
    'Water Colors',
  ],

  MOCKUPS: ['Branding Mockups', 'Product Mockups', 'UI Mockups'],

  PRINT_MEDIA: ['Brochure', 'Calendars', 'Flyer', 'Media Wall / Backdrop', 'Poster', 'Magazines'],

  PRODUCT_PACKAGING: ['Bottle Packaging', 'Box Design', 'Pouch Design', 'Cans / Tins'],

  SILHOUETTES: [],

  SOCIAL_MEDIA: ['Carousel', 'Posts', 'Reels', 'Stories'],

  STATIONERY: ['Business Card', 'Envelope', 'Letterhead', 'Invoice', 'Merchandise'],

  TYPOGRAPHY: ['Arabic', 'English', 'Urdu'],

  UI_UX: ['Mobile UI', 'Web UI', 'Wireframes'],

  VECTORS_DESIGN: [],

  VIDEO: [
    'Ads',
    'Comercial (DVC)',
    'Corporate',
    'Digital Video',
    'Explainer Videos',
    'Short Form',
    'Talking Heads',
    'Vlogs',
  ],
};



// ============================================================
// REVERSE SUBCATEGORY → CATEGORY
// ============================================================
export const SUBCATEGORY_TO_CATEGORY: Record<string, CategoryCode> = {};
Object.entries(SUBCATEGORIES).forEach(([cat, subs]) => {
  for (const s of subs) SUBCATEGORY_TO_CATEGORY[s] = cat as CategoryCode;
});


// ============================================================
// HELPERS
// ============================================================
export const isValidCategoryCode = (c: string): c is CategoryCode =>
  CATEGORY_CODES.includes(c as CategoryCode);

export const getSubcategories = (c: CategoryCode): string[] =>
  SUBCATEGORIES[c] || [];

export const isValidSubcategory = (c: CategoryCode, s: string) =>
  SUBCATEGORIES[c]?.includes(s) ?? false;
