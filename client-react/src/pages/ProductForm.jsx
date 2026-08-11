import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import { fetchProduct, fetchSuppliers, createProduct, updateProduct } from '../api/resources';
import { resolveImageUrl } from '../api/client';

const emptyForm = { name: '', description: '', price: '', quantity: '', supplierId: '' };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [suppliers, setSuppliers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSuppliers().then(setSuppliers).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    fetchProduct(id)
      .then((p) => {
        setForm({
          name: p.name,
          description: p.description || '',
          price: p.price,
          quantity: p.quantity,
          supplierId: p.supplierId,
        });
        setCurrentImageUrl(resolveImageUrl(p.imagePath));
      })
      .catch((err) => setError(err.message));
  }, [id, isEdit]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Product name is required';
    if (form.price === '' || Number(form.price) < 0) errors.price = 'Price is required and cannot be negative';
    if (form.quantity === '' || Number(form.quantity) < 0 || !Number.isInteger(Number(form.quantity))) {
      errors.quantity = 'Quantity is required and cannot be negative';
    }
    if (!form.supplierId) errors.supplierId = 'Please select a supplier';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('description', form.description.trim());
    formData.append('price', form.price);
    formData.append('quantity', form.quantity);
    formData.append('supplierId', form.supplierId);
    if (imageFile) formData.append('image', imageFile);

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        <Link to="/products" className="btn btn-secondary">← Back to Products</Link>
      </div>

      <Alert message={error} />

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            {fieldErrors.name && <span className="field-error visible">{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
            />
            {fieldErrors.price && <span className="field-error visible">{fieldErrors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              step="1"
              min="0"
              value={form.quantity}
              onChange={(e) => updateField('quantity', e.target.value)}
            />
            {fieldErrors.quantity && <span className="field-error visible">{fieldErrors.quantity}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="supplierId">Supplier *</label>
            <select
              id="supplierId"
              value={form.supplierId}
              onChange={(e) => updateField('supplierId', e.target.value)}
            >
              <option value="">Select a supplier...</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {fieldErrors.supplierId && <span className="field-error visible">{fieldErrors.supplierId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            {currentImageUrl && (
              <div className="current-image">
                <img src={currentImageUrl} alt="Current product" />
              </div>
            )}
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg, image/webp, image/gif"
              onChange={(e) => setImageFile(e.target.files[0] || null)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : (isEdit ? 'Update Product' : 'Save Product')}
            </button>
            <Link to="/products" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
