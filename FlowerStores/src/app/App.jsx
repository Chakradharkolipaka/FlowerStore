import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { routes } from './routes.jsx';
import '../styles/globals.css';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        {routes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="py-4">
        <div className="container text-center text-muted small">
          FlowerMart • Frontend demo (React + Vite + Bootstrap + Tailwind)
        </div>
      </footer>
    </div>
  );
}
