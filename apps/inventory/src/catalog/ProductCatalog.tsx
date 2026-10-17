import React, { useEffect, useState } from 'react';
import { CatalogService, Product } from './catalog.service';

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    CatalogService.getProducts().then(data => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading product catalog...</div>;

  return (
    <div className="product-catalog" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Product Catalog</h2>
        <input 
          type="text" 
          placeholder="Search by SKU or Name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', width: '300px' }}
        />
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
            <th style={{ padding: '12px 8px' }}>SKU</th>
            <th style={{ padding: '12px 8px' }}>Name</th>
            <th style={{ padding: '12px 8px' }}>Category</th>
            <th style={{ padding: '12px 8px' }}>Base Price</th>
            <th style={{ padding: '12px 8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '12px 8px', fontFamily: 'monospace', color: '#4b5563' }}>{product.sku}</td>
              <td style={{ padding: '12px 8px', fontWeight: '500' }}>{product.name}</td>
              <td style={{ padding: '12px 8px' }}>
                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: '#f3f4f6', borderRadius: '12px' }}>
                  {product.category}
                </span>
              </td>
              <td style={{ padding: '12px 8px' }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.basePrice)} 
                <span style={{ fontSize: '12px', color: '#6b7280' }}> /{product.unitOfMeasure}</span>
              </td>
              <td style={{ padding: '12px 8px' }}>
                {product.isActive ? (
                  <span style={{ color: '#10b981', fontSize: '14px' }}>● Active</span>
                ) : (
                  <span style={{ color: '#ef4444', fontSize: '14px' }}>● Inactive</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}