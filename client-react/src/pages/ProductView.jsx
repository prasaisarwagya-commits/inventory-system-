import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import { fetchProduct } from '../api/resources';
import { resolveImageUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProductView() {
  const { userId } = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct(id).then(setProduct).catch((err) => setError(err.message));
  }, [id]);

  const imgUrl = product ? resolveImageUrl(product.imagePath) : null;

  return (
    <Layout>
      <div className="page-header">
        <h1>Product Details</h1>
        <Link to="/products" className="btn btn-secondary">← Back to Products</Link>
      </div>

      <Alert message={error} />

      {product && (
        <>
          <div className="detail-grid">
            <div>
              {imgUrl
                ? <img src={imgUrl} alt={product.name} />
                : (
                  <div className="thumb" style={{ width: '100%', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    No Image
                  </div>
                )}
            </div>
            <dl className="detail-list">
              <dt>Name</dt>
              <dd>{product.name}</dd>

              <dt>Status</dt>
              <dd>
                {product.lowStock
                  ? <span className="badge badge-danger">Low Stock</span>
                  : <span className="badge badge-ok">OK</span>}
              </dd>

              <dt>Description</dt>
              <dd>{product.description || '—'}</dd>

              <dt>Price</dt>
              <dd>${Number(product.price).toFixed(2)}</dd>

              <dt>Quantity</dt>
              <dd>{product.quantity}</dd>

              <dt>Supplier</dt>
              <dd>{product.Supplier ? product.Supplier.name : '—'}</dd>

              <dt>Supplier Contact</dt>
              <dd>{product.Supplier ? `${product.Supplier.contactEmail} · ${product.Supplier.phone}` : '—'}</dd>
            </dl>
          </div>

          {product.createdBy === userId && (
            <div className="form-actions">
              <Link to={`/products/${product.id}/edit`} className="btn btn-primary">Edit Product</Link>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
