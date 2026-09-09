"use server"
import { listProducts } from './products'
import { listCategories } from './categories'
import { listBrands } from './collections'
import { SlideConfig } from '../../types'
import { DEFAULT_SLIDES } from '../../data/presets'

export type HomeData = {
  products: Awaited<ReturnType<typeof listProducts>>["products"]
  categories: Awaited<ReturnType<typeof listCategories>>
  brands: Awaited<ReturnType<typeof listBrands>>
  slides: SlideConfig[]
}

export async function getHomeData(): Promise<HomeData> {
  const [productsResult, categories, brands] = await Promise.all([
    listProducts(),
    listCategories(),
    listBrands()
  ])
  return {
    products: productsResult.products,
    categories,
    brands,
    slides: DEFAULT_SLIDES
  }
}
