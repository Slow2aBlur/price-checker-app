// src/types/Product.ts
export interface Product {
  id: string;           // Product ID (from CSV: product_id or _sku fallback)
  name: string;         // post_title
  brand: string;        // product_brand
  sku: string;          // _sku or supplier_sku
  supplier: string;     // Supplier
  regularPrice: number; // _regular_price
  salePrice: number;    // _sale_price
  // dynamic retailer fields like "Makro", "Game", etc. will be added at runtime
  [key: string]: any;
}
