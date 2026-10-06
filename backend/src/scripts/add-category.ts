import { db } from "../prisma/db.ts";
import type { Category } from "../types/category.ts";

const categories: Category[] = [
  {
    id: 0,
    name: "Groceries",
    colour: "FF0000",
  },
  {
    id: 1,
    name: "House Expenses",
    colour: "0000FF",
  },
  {
    id: 2,
    name: "Entertainment",
    colour: "00FF00",
  },
];

async function populate() {
  console.log("populating categories...");
  await Promise.all(
    categories.map(async (category) => {
      await db.orm.public.Category.create(category);
    })
  );
  console.log("...Done!");
}

populate()