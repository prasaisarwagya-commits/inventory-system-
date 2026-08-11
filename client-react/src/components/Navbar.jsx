import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <nav className="navbar">
      <span className="brand">📦 Inventory MS</span>
      <button className="hamburger" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
        ☰
      </button>
      <div className={`nav-links ${open ? 'open' : ''}`}>
        <NavLink to="/products" className={linkClass} onClick={() => setOpen(false)}>
          Products
        </NavLink>
        <NavLink to="/suppliers" className={linkClass} onClick={() => setOpen(false)}>
          Suppliers
        </NavLink>
        <div className="nav-user">
          <span>{username}</span>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </nav>
  );
}
