"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export async function listCategories() {
  const headers = {
    ...(await getCacheOptions("categories")),
  }

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<{ product_categories: any[] }>(`/store/product-categories`, {
      method: "GET",
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ product_categories }) => {
      return product_categories.map((c: any) => {
        const numericId = typeof c.id === "number"
          ? c.id
          : parseInt(String(c.id || "").replace(/\D/g, ""), 10) || 1
        return {
          id: numericId,
          name: c.name || "Category",
          handle: c.handle || (c.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          imageUrl: c.imageUrl || c.image_url || c.image || c.metadata?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800",
          description: c.description || `Browse quality ${c.name} in bulk and save.`,
          icon: c.icon || c.metadata?.icon || "",
          itemCount: c.itemCount ?? c.item_count ?? 15,
          subcategories: (c.subcategories && c.subcategories.length > 0) ? c.subcategories : [],
        }
      })
    })
    .catch(() => [])
}

export async function getCategoryBySlug(slug: string) {
  const categories = await listCategories()
  return (
    categories.find((c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug) ||
    categories[0]
  )
}

export async function getCategoryBySlugStrict(slug: string) {
  const categories = await listCategories()
  if (!categories.length) return null

  const target = slug.toLowerCase().trim()

  const byHandle = categories.find((c) => c.handle.toLowerCase() === target)
  if (byHandle) return byHandle

  const byNameSpaces = categories.find((c) => c.name.toLowerCase().replace(/\s+/g, "-") === target)
  if (byNameSpaces) return byNameSpaces

  const byNameNoPunct = categories.find((c) => c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === target)
  if (byNameNoPunct) return byNameNoPunct

  return null
}

export { listCategories as getCategories }
