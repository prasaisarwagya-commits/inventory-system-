import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import { fetchProducts, fetchSuppliers, deleteProduct } from '../api/resources';
import { resolveImageUrl } from '../api/client';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async (searchValue, supplierValue) => {
    try {
      const data = await fetchProducts({ search: searchValue, supplierId: supplierValue });
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers().then(setSuppliers).catch((err) => setError(err.message));
    loadProducts('', '');
  }, [loadProducts]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(search, supplierId);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, supplierId]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      loadProducts(search, supplierId);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Products</h1>
        <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      <Alert message={error} />

      <div className="filters">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
          <option value="">All Suppliers</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const imgUrl = resolveImageUrl(p.imagePath);
                return (
                  <tr key={p.id} className={p.lowStock ? 'low-stock' : ''}>
                    <td>
                      {imgUrl ? <img className="thumb" src={imgUrl} alt={p.name} /> : <div className="thumb" />}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.Supplier ? p.Supplier.name : '—'}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>{p.quantity}</td>
                    <td>
                      {p.lowStock
                        ? <span className="badge badge-danger">Low Stock</span>
                        : <span className="badge badge-ok">OK</span>}
                    </td>
                   <td className="actions-cell">
                      <Link className="btn btn-secondary btn-sm" to={`/products/${p.id}`}>View</Link>
                      {p.createdBy === userId && (
                        <>
                          <Link className="btn btn-secondary btn-sm" to={`/products/${p.id}/edit`}>Edit</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading && products.length === 0 && <div className="empty-state">No products found.</div>}
      </div>
    </Layout>
  );
}
