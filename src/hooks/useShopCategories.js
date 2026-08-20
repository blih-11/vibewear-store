import { useState, useEffect } from 'react';
import { shopCategories as staticCategories } from '../data/categories';
import { fetchCategories } from '../lib/api';

// Live shop categories — fetched from the server so categories created in the
// admin panel show up here without a redeploy. Falls back to the static list
// in data/categories.js while loading, or if the request fails.
export function useShopCategories() {
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    fetchCategories({ type: 'category' })
      .then(res => {
        if (res.success && res.categories?.length) {
          setCategories(res.categories.map(c => ({ id: c.slug, label: c.name })));
        }
      })
      .catch(() => { /* keep static fallback */ });
  }, []);

  return categories;
}