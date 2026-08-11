import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import { fetchSupplier, createSupplier, updateSupplier } from '../api/resources';

const emptyForm = { name: '', contactEmail: '', phone: '' };

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SupplierForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    fetchSupplier(id)
      .then((s) => setForm({ name: s.name, contactEmail: s.contactEmail, phone: s.phone }))
      .catch((err) => setError(err.message));
  }, [id, isEdit]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Supplier name is required';
    if (!isValidEmail(form.contactEmail.trim())) errors.contactEmail = 'A valid email is required';
    if (!form.phone.trim()) errors.phone = 'Phone number is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      contactEmail: form.contactEmail.trim(),
      phone: form.phone.trim(),
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateSupplier(id, payload);
      } else {
        await createSupplier(payload);
      }
      navigate('/suppliers');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>{isEdit ? 'Edit Supplier' : 'Add Supplier'}</h1>
        <Link to="/suppliers" className="btn btn-secondary">← Back to Suppliers</Link>
      </div>

      <Alert message={error} />

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Supplier Name *</label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            {fieldErrors.name && <span className="field-error visible">{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">Contact Email *</label>
            <input
              type="email"
              id="contactEmail"
              value={form.contactEmail}
              onChange={(e) => updateField('contactEmail', e.target.value)}
            />
            {fieldErrors.contactEmail && <span className="field-error visible">{fieldErrors.contactEmail}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              type="text"
              id="phone"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
            {fieldErrors.phone && <span className="field-error visible">{fieldErrors.phone}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : (isEdit ? 'Update Supplier' : 'Save Supplier')}
            </button>
            <Link to="/suppliers" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
