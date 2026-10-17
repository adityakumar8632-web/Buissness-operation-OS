import { z } from 'zod';

export const ProductCategoryEnum = z.enum(['HARDWARE', 'SOFTWARE', 'SERVICES', 'CONSUMABLES']);

export const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z.string().min(3, "SKU is required").max(50),
  name: z.string().min(2, "Product name is required"),
  description: z.string().optional(),
  category: ProductCategoryEnum,
  unitOfMeasure: z.string().default('EA'),
  basePrice: z.number().min(0, "Price cannot be negative"),
  currency: z.string().default('USD'),
  isActive: z.boolean().default(true)
});

export type Product = z.infer<typeof ProductSchema>;

export class CatalogService {
  static async getProducts(): Promise<Product[]> {
    // Simulated API fetch returning base catalog data[cite: 3]
    return [
      { id: 'p1', sku: 'HW-SRV-001', name: 'Enterprise Server Rack', category: 'HARDWARE', unitOfMeasure: 'EA', basePrice: 4500, currency: 'USD', isActive: true },
      { id: 'p2', sku: 'SW-LIC-100', name: 'Cloud Ops License (Annual)', category: 'SOFTWARE', unitOfMeasure: 'LIC', basePrice: 1200, currency: 'USD', isActive: true },
      { id: 'p3', sku: 'CON-CBL-05M', name: 'Cat6 Ethernet Cable - 5m', category: 'CONSUMABLES', unitOfMeasure: 'EA', basePrice: 15, currency: 'USD', isActive: true }
    ];
  }

  static async createProduct(data: unknown): Promise<Product> {
    const validProduct = ProductSchema.parse(data);
    // Simulated POST request
    return { ...validProduct, id: crypto.randomUUID() };
  }

  static async deactivateProduct(id: string): Promise<void> {
    // Simulated PATCH request
    console.log(`Product ${id} deactivated.`);
  }
}