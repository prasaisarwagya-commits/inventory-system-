import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  function validate() {
    const errors = {};
    if (!username.trim()) errors.username = 'Username is required';
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(username.trim(), password);
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>📦 Create Account</h1>

        <Alert message={error} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            {fieldErrors.username && <span className="field-error visible">{fieldErrors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {fieldErrors.password && <span className="field-error visible">{fieldErrors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {fieldErrors.confirmPassword && <span className="field-error visible">{fieldErrors.confirmPassword}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="hint">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}