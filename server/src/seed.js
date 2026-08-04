import { prisma } from "./lib/prisma.js";

const CATEGORIES = [
  { name: "Smartphones", slug: "smartphones", icon: "📱" },
  { name: "Laptops", slug: "laptops", icon: "💻" },
  { name: "Tablets", slug: "tablets", icon: "📲" },
  { name: "Fragrances", slug: "fragrances", icon: "🌸" },
  { name: "Skincare", slug: "skincare", icon: "✨" },
  { name: "Groceries", slug: "groceries", icon: "🛒" },
  { name: "Home & Decor", slug: "home-decoration", icon: "🏠" },
  { name: "Furniture", slug: "furniture", icon: "🪑" },
  { name: "Fashion", slug: "fashion", icon: "👕" },
  { name: "Shoes", slug: "shoes", icon: "👟" },
  { name: "Watches", slug: "watches", icon: "⌚" },
  { name: "Bags", slug: "bags", icon: "👜" },
  { name: "Jewellery", slug: "jewellery", icon: "💍" },
  { name: "Sunglasses", slug: "sunglasses", icon: "🕶️" },
  { name: "Sports", slug: "sports", icon: "⚽" },
  { name: "Automotive", slug: "vehicle", icon: "🚗" },
  { name: "Lighting", slug: "lighting", icon: "💡" },
];

async function main() {
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ Seeded ${CATEGORIES.length} categories`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
