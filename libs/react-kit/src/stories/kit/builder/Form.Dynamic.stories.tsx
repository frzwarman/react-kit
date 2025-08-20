import type { Meta, StoryObj } from '@storybook/react';
import { FormBuilder } from '../../../kit/builder/form/components/FormBuilder';
import { createSection, createField, createDependency, conditions } from '../../../kit/builder/form/utils';

const meta: Meta<typeof FormBuilder> = {
  title: 'Kit/Builder/Form',
  component: FormBuilder,
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
};

export default meta;

type Story = StoryObj<typeof FormBuilder>;

export const DynamicExample: Story = {
  name: 'Dynamic example',
  render: () => {
    const handleSubmit = (data: unknown) => {
      console.log('Dynamic form submitted:', data);
    };
  
    const handleFieldChange = (name: string, value: unknown) => {
      console.log(`Field ${name} changed to:`, value);
      if (name === 'productType' && value === 'subscription') {
        console.log('Subscription product selected - additional fields will appear');
      }
      if (name === 'hasDiscount' && value === true) {
        console.log('Discount enabled - discount fields will appear');
      }
    };
  
    const sections = [
      createSection.card('Product Configuration', [
        createField.select(
          'productType',
          'Product Type',
          [
            { label: 'One-time Purchase', value: 'onetime' },
            { label: 'Subscription', value: 'subscription' },
            { label: 'Bundle', value: 'bundle' },
            { label: 'Digital Download', value: 'digital' },
          ],
          { required: true, placeholder: 'Select product type' },
        ),
        createField.text('productName', 'Product Name', { required: true, placeholder: 'Enter product name' }),
        createField.number('basePrice', 'Base Price ($)', { required: true, placeholder: '29.99' }),
        createField.select(
          'billingCycle',
          'Billing Cycle',
          [
            { label: 'Monthly', value: 'monthly' },
            { label: 'Quarterly', value: 'quarterly' },
            { label: 'Yearly', value: 'yearly' },
          ],
          {
            required: true,
            placeholder: 'Select billing cycle',
            dependencies: [createDependency.showWhen('productType', conditions.equals('subscription'))],
          },
        ),
        createField.number('trialDays', 'Free Trial Days', {
          placeholder: '14',
          defaultValue: 0,
          dependencies: [createDependency.showWhen('productType', conditions.equals('subscription'))],
        }),
        createField.array(
          'bundleItems',
          'Bundle Items',
          [
            createField.text('itemName', 'Item Name', { required: true, placeholder: 'Item name' }),
            createField.number('itemPrice', 'Item Price ($)', { required: true, placeholder: '9.99' }),
            createField.number('quantity', 'Quantity', { required: true, defaultValue: 1, placeholder: '1' }),
          ],
          {
            gridCols: 2,
            defaultValue: [{ itemName: '', itemPrice: 0, quantity: 1 }],
            dependencies: [createDependency.showWhen('productType', conditions.equals('bundle'))],
          },
        ),
        createField.select(
          'fileFormat',
          'File Format',
          [
            { label: 'PDF', value: 'pdf' },
            { label: 'ZIP Archive', value: 'zip' },
            { label: 'Video (MP4)', value: 'mp4' },
            { label: 'Audio (MP3)', value: 'mp3' },
            { label: 'Software Installer', value: 'exe' },
          ],
          { required: true, placeholder: 'Select file format', dependencies: [createDependency.showWhen('productType', conditions.equals('digital'))] },
        ),
        createField.number('fileSizeMB', 'File Size (MB)', { placeholder: '50', dependencies: [createDependency.showWhen('productType', conditions.equals('digital'))] }),
      ]),
  
      createSection.card('Pricing & Discounts', [
        createField.checkbox('hasDiscount', 'Apply Discount', { defaultValue: false, gridCols: 2 }),
        createField.select(
          'discountType',
          'Discount Type',
          [
            { label: 'Percentage', value: 'percentage' },
            { label: 'Fixed Amount', value: 'fixed' },
            { label: 'Buy One Get One', value: 'bogo' },
          ],
          { required: true, placeholder: 'Select discount type', dependencies: [createDependency.showWhen('hasDiscount', conditions.isTrue())] },
        ),
        createField.number('discountValue', 'Discount Value', {
          required: true,
          placeholder: '10',
          dependencies: [createDependency.showWhen('hasDiscount', conditions.isTrue()), createDependency.showWhen('discountType', value => value !== 'bogo')],
        }),
        createField.date('discountStartDate', 'Discount Start Date', { dependencies: [createDependency.showWhen('hasDiscount', conditions.isTrue())] }),
        createField.date('discountEndDate', 'Discount End Date', { dependencies: [createDependency.showWhen('hasDiscount', conditions.isTrue())] }),
        createField.number('minimumQuantity', 'Minimum Quantity for Discount', { placeholder: '2', defaultValue: 1, dependencies: [createDependency.showWhen('hasDiscount', conditions.isTrue())] }),
      ]),
  
      createSection.card('Shipping Configuration', [
        createField.checkbox('requiresShipping', 'Requires Physical Shipping', {
          defaultValue: true,
          gridCols: 2,
          dependencies: [
            createDependency.setValueWhen('productType', conditions.equals('digital'), false),
            createDependency.disableWhen('productType', conditions.equals('digital')),
          ],
        }),
        createField.number('weight', 'Weight (lbs)', { placeholder: '1.5', dependencies: [createDependency.showWhen('requiresShipping', conditions.isTrue())] }),
        createField.object(
          'dimensions',
          'Dimensions (inches)',
          [
            createField.number('length', 'Length', { required: true, placeholder: '10' }),
            createField.number('width', 'Width', { required: true, placeholder: '8' }),
            createField.number('height', 'Height', { required: true, placeholder: '2' }),
          ],
          { dependencies: [createDependency.showWhen('requiresShipping', conditions.isTrue())] },
        ),
        createField.select(
          'shippingClass',
          'Shipping Class',
          [
            { label: 'Standard', value: 'standard' },
            { label: 'Express', value: 'express' },
            { label: 'Overnight', value: 'overnight' },
            { label: 'Fragile', value: 'fragile' },
            { label: 'Hazardous', value: 'hazardous' },
          ],
          { required: true, defaultValue: 'standard', placeholder: 'Select shipping class', dependencies: [createDependency.showWhen('requiresShipping', conditions.isTrue())] },
        ),
        createField.checkbox('freeShipping', 'Offer Free Shipping', { defaultValue: false, dependencies: [createDependency.showWhen('requiresShipping', conditions.isTrue())] }),
        createField.number('freeShippingThreshold', 'Free Shipping Threshold ($)', { placeholder: '50', dependencies: [createDependency.showWhen('requiresShipping', conditions.isTrue()), createDependency.showWhen('freeShipping', conditions.isTrue())] }),
      ]),
  
      createSection.card('Inventory Management', [
        createField.checkbox('trackInventory', 'Track Inventory', {
          defaultValue: true,
          gridCols: 2,
          dependencies: [createDependency.setValueWhen('productType', conditions.equals('digital'), false)],
        }),
        createField.number('stockQuantity', 'Stock Quantity', { required: true, placeholder: '100', dependencies: [createDependency.showWhen('trackInventory', conditions.isTrue())] }),
        createField.number('lowStockThreshold', 'Low Stock Alert Threshold', { placeholder: '10', dependencies: [createDependency.showWhen('trackInventory', conditions.isTrue())] }),
        createField.checkbox('allowBackorders', 'Allow Backorders', { defaultValue: false, dependencies: [createDependency.showWhen('trackInventory', conditions.isTrue())] }),
        createField.text('sku', 'SKU (Stock Keeping Unit)', { placeholder: 'PROD-001', dependencies: [createDependency.showWhen('trackInventory', conditions.isTrue())] }),
        createField.text('barcode', 'Barcode', { placeholder: '123456789012', dependencies: [createDependency.showWhen('trackInventory', conditions.isTrue())] }),
      ]),
  
      createSection.card('Marketing & SEO', [
        createField.text('metaTitle', 'Meta Title', { placeholder: 'SEO-friendly title', gridCols: 2 }),
        createField.textarea('metaDescription', 'Meta Description', { placeholder: 'SEO-friendly description (150-160 characters)', gridCols: 2 }),
        createField.array('tags', 'Product Tags', [createField.text('tag', 'Tag', { required: true, placeholder: 'e.g., electronics, gadgets' })], { gridCols: 2, defaultValue: [{ tag: '' }] }),
        createField.checkbox('featured', 'Featured Product', { defaultValue: false }),
        createField.checkbox('newProduct', 'Mark as New', { defaultValue: false }),
        createField.select(
          'visibility',
          'Product Visibility',
          [
            { label: 'Public', value: 'public' },
            { label: 'Private', value: 'private' },
            { label: 'Password Protected', value: 'password' },
            { label: 'Coming Soon', value: 'coming_soon' },
          ],
          { required: true, defaultValue: 'public', placeholder: 'Select visibility' },
        ),
        createField.text('password', 'Access Password', { placeholder: 'Enter password', dependencies: [createDependency.showWhen('visibility', conditions.equals('password'))] }),
        createField.date('launchDate', 'Launch Date', { dependencies: [createDependency.showWhen('visibility', conditions.equals('coming_soon'))] }),
      ]),
    ];
  
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dynamic Product Configuration</h1>
          <p className="text-gray-600 mt-2">
            This form demonstrates advanced field dependencies and real-time interactions. Watch how fields appear, disappear, and change based on your selections.
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900">Try these interactions:</h3>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• Change Product Type to see different field sets</li>
              <li>• Enable "Apply Discount" to reveal discount configuration</li>
              <li>• Toggle "Requires Physical Shipping" for shipping options</li>
              <li>• Select "Digital Download" to auto-disable shipping</li>
              <li>• Choose "Password Protected" visibility for password field</li>
            </ul>
          </div>
        </div>
  
        <FormBuilder sections={sections} onSubmit={handleSubmit} onFieldChange={handleFieldChange} submitLabel="Save Product Configuration" resetLabel="Reset All" className="space-y-8" />
      </div>
    );
  },
};
