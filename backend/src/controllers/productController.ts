import { Request, Response } from 'express';
import { getProducts, getProductById, saveProduct, deleteProduct, getCategories } from '../services/productStore.js';

export function handleGetProducts(req: Request, res: Response): void {
  try {
    const { categoryId, search, brand, isFeatured, minPrice, maxPrice, sortBy } = req.query;
    
    const query = {
      categoryId: categoryId ? Number(categoryId) : undefined,
      search: search ? String(search) : undefined,
      brand: brand ? String(brand) : undefined,
      isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortBy as any
    };

    const products = getProducts(query);
    res.json({ success: true, count: products.length, products });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch products.' });
  }
}

export function handleGetCategories(req: Request, res: Response): void {
  try {
    const categories = getCategories();
    res.json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch categories.' });
  }
}

export function handleGetProductById(req: Request, res: Response): void {
  try {
    const product = getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch product details.' });
  }
}

export function handleCreateProduct(req: Request, res: Response): void {
  try {
    const product = saveProduct(req.body || {});
    res.json({ success: true, product, message: 'Product saved successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to save product.' });
  }
}

export function handleUpdateProduct(req: Request, res: Response): void {
  try {
    const product = saveProduct({ ...req.body, id: req.params.id });
    res.json({ success: true, product, message: 'Product updated successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Failed to update product.' });
  }
}

export function handleDeleteProduct(req: Request, res: Response): void {
  try {
    const success = deleteProduct(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Failed to delete product.' });
  }
}
