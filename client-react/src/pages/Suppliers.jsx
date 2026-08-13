// import { useEffect, useState, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import Layout from '../components/Layout';
// import Alert from '../components/Alert';
// import { fetchSuppliers, deleteSupplier } from '../api/resources';

// export default function Suppliers() {
//   const [suppliers, setSuppliers] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   const load = useCallback(async () => {
//     try {
//       const data = await fetchSuppliers();
//       setSuppliers(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   async function handleDelete(id) {
//     if (!window.confirm('Delete this supplier?')) return;
//     try {
//       await deleteSupplier(id);
//       load();
//     } catch (err) {
//       setError(err.message);
//     }
//   }

//   return (
//     <Layout>
//       <div className="page-header">
//         <h1>Suppliers</h1>
//         <Link to="/suppliers/new" className="btn btn-primary">+ Add Supplier</Link>
//       </div>

//       <Alert message={error} />

//       <div className="card">
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Contact Email</th>
//                 <th>Phone</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {suppliers.map((s) => (
//                 <tr key={s.id}>
//                   <td>{s.name}</td>
//                   <td>{s.contactEmail}</td>
//                   <td>{s.phone}</td>
//                   <td className="actions-cell">
//                     <Link className="btn btn-secondary btn-sm" to={`/suppliers/${s.id}/edit`}>Edit</Link>
//                     <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {!loading && suppliers.length === 0 && <div className="empty-state">No suppliers found.</div>}
//       </div>
//     </Layout>
//   );
// }
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import { fetchSuppliers, deleteSupplier } from '../api/resources';
import { useAuth } from '../context/AuthContext';

export default function Suppliers() {
  const { userId, isAdmin } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await deleteSupplier(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Suppliers</h1>
        <Link to="/suppliers/new" className="btn btn-primary">+ Add Supplier</Link>
      </div>

      <Alert message={error} />

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.contactEmail}</td>
                  <td>{s.phone}</td>
                  <td className="actions-cell">
                    <div className="actions-inner">
                      {(isAdmin || s.createdBy === userId) && (
                        <>
                          <Link className="btn btn-secondary btn-sm" to={`/suppliers/${s.id}/edit`}>Edit</Link>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && suppliers.length === 0 && <div className="empty-state">No suppliers found.</div>}
      </div>
    </Layout>
  );
}