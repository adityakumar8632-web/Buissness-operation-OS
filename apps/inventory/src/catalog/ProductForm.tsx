import React, { useState } from 'react';
import { CatalogService, ProductCategoryEnum } from './catalog.service';

export function ProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const productData = {
      sku: formData.get('sku'),
      name: formData.get('name'),
      category: formData.get('category'),
      unitOfMeasure: formData.get('uom'),
      basePrice: Number(formData.get('price')),
      isActive: formData.get('isActive') === 'on'
    };

    try {
      await CatalogService.createProduct(productData);
      alert('Product created successfully');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      alert('Failed to create product. Check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <h3 style={{ margin: '0 0 24px 0' }}>Create New Product</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>SKU Code</label>
            <input name="sku" required placeholder="e.g. HW-123" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Product Name</label>
            <input name="name" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Category</label>
            <select name="category" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}>
              {ProductCategoryEnum.options.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Base Price</label>
            <input name="price" type="number" step="0.01" min="0" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Unit of Measure</label>
            <input name="uom" defaultValue="EA" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <input type="checkbox" name="isActive" id="isActive" defaultChecked />
          <label htmlFor="isActive" style={{ fontSize: '14px' }}>Product is active and available for sales</label>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ marginTop: '16px', padding: '10px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}