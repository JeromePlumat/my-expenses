import { useEffect, useState } from "react";
import type { Category } from "../types/Category";
import { apiRequest } from "../lib/rest";

async function fetchAllCategories() {
  return apiRequest<Category[]>("/api/categories");
}

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

export default useCategories;