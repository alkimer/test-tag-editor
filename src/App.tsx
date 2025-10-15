import React from 'react'
import { NavLink, Routes, Route } from 'react-router-dom'
import EditorPage from './routes/EditorPage'
import DashboardPage from './routes/DashboardPage'
import ReportPage from './routes/ReportPage'

export default function App() {
  return (
    <div>
      <header className="header">
        <div style={{ fontWeight: 700 }}>Tag Editor</div>
        <nav style={{ display: 'flex', gap: 12 }}>
          <NavLink to="/editor" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Editor
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Dashboard
          </NavLink>
          <NavLink to="/report" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Report
          </NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<EditorPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </main>
    </div>
  )
}

