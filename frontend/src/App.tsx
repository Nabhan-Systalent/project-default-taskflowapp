import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

/**
 * AEGIS generated frontend entrypoint (SYS-265/frontend).
 *
 * Pages are discovered at Vite build-time via import.meta.glob.
 * Each story the frontend agent generates lands at
 * src/pages/<story>/index.tsx and is auto-wired as a route here —
 * no central routing file to edit.
 *
 * Each page module must export a default React component.
 */
const pageModules = import.meta.glob('./pages/**/index.tsx');

type PageLoader = () => Promise<{ default: React.ComponentType }>;

interface PageRoute {
  slug: string;
  path: string;
  label: string;
  component: React.LazyExoticComponent<React.ComponentType>;
}

function buildRoutes(): PageRoute[] {
  return Object.entries(pageModules).map(([file, loader]) => {
    const slug = file.replace('./pages/', '').replace('/index.tsx', '');
    const label = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return {
      slug,
      path: '/' + slug,
      label,
      component: lazy(loader as PageLoader),
    };
  });
}

const routes = buildRoutes();

const NAV_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  padding: '0.75rem 1.5rem',
  borderBottom: '1px solid #e5e7eb',
  background: '#fff',
};

const LINK_STYLE: React.CSSProperties = { color: '#374151', textDecoration: 'none' };
const ACTIVE_LINK_STYLE: React.CSSProperties = { ...LINK_STYLE, fontWeight: 600 };

export default function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f9fafb' }}>
        <nav style={NAV_STYLE}>
          <Link to="/" style={ACTIVE_LINK_STYLE}>Home</Link>
          {routes.map((r) => (
            <Link key={r.path} to={r.path} style={LINK_STYLE}>{r.label}</Link>
          ))}
        </nav>

        <main style={{ padding: '2rem 1.5rem', maxWidth: 1024, margin: '0 auto' }}>
          <Suspense fallback={<p>Loading…</p>}>
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                      Welcome
                    </h1>
                    {routes.length === 0 ? (
                      <p style={{ color: '#6b7280' }}>No pages have been generated yet.</p>
                    ) : (
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {routes.map((r) => (
                          <li key={r.path} style={{ marginBottom: '0.5rem' }}>
                            <Link to={r.path} style={{ color: '#3b82f6' }}>{r.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                }
              />
              {routes.map((r) => (
                <Route key={r.path} path={r.path} element={<r.component />} />
              ))}
              <Route path="*" element={<p style={{ color: '#6b7280' }}>Page not found.</p>} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
