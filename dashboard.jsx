/**
 * FFIMS — Executive Supervisor Dashboard
 * File: ffims_frontend/src/pages/Dashboards/ExecutiveDashboard.jsx
 *
 * HOW TO USE:
 *  1. Drop this file into:  ffims_frontend/src/pages/Dashboards/ExecutiveDashboard.jsx
 *  2. Drop AppRouter.jsx into: ffims_frontend/src/AppRouter.jsx
 *  3. In your ffims_frontend/src/main.jsx replace <App /> with <AppRouter />
 *  4. Make sure react-router-dom is installed:  npm install react-router-dom
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// ─── COLOUR TOKENS (matches your existing red brand) ─────────────────────────
const C = {
  red:     '#c0392b',
  redDark: '#96281b',
  redSoft: '#fde8e8',
  bg:      '#f4f4f6',
  card:    '#ffffff',
  border:  '#e8e8ec',
  text:    '#1a1a2e',
  muted:   '#6b7280',
  green:   '#16a34a',
  amber:   '#d97706',
  blue:    '#2563eb',
  purple:  '#7c3aed',
  teal:    '#0d9488',
  indigo:  '#4f46e5',
};

// ─── DASHBOARD REGISTRY ───────────────────────────────────────────────────────
const DASHBOARDS = [
  {
    id: 'workforce',
    label: 'Workforce & Scheduling',
    path: '/dashboards/workforce',
    icon: '👥',
    color: C.blue,
    description: 'Active rosters, shift planning, overtime approvals, availability board',
    kpis: [
      { label: 'On Duty Now',     value: '24',   sub: 'staff active' },
      { label: 'Overtime Requests', value: '3',  sub: 'pending approval' },
      { label: 'Compliance',      value: '94%',  sub: 'labor standards' },
    ],
    status: 'operational',
  },
  {
    id: 'ffu-bookings',
    label: 'FFU Booking System',
    path: '/dashboards/ffu-bookings',
    icon: '📋',
    color: C.purple,
    description: 'Facility bookings, equipment logistics, departmental approvals',
    kpis: [
      { label: 'Active Bookings', value: '12',  sub: 'this week' },
      { label: 'Pending Approval', value: '5',  sub: 'awaiting sign-off' },
      { label: 'Utilisation',     value: '78%', sub: 'facility use rate' },
    ],
    status: 'attention',
  },
  {
    id: 'inventory',
    label: 'Inventory Management',
    path: '/dashboards/inventory',
    icon: '📦',
    color: C.teal,
    description: 'Stock levels, requisitions, low-stock alerts, category tracking',
    kpis: [
      { label: 'Total Products',  value: '1,245', sub: 'in stock' },
      { label: 'Low Stock Alerts', value: '12',   sub: 'need reorder' },
      { label: 'Pending Reqs',    value: '8',     sub: 'open requisitions' },
    ],
    status: 'warning',
  },
  {
    id: 'internal-billing',
    label: 'Internal Billing',
    path: '/dashboards/internal-billing',
    icon: '💰',
    color: C.green,
    description: 'Cost recovery, transactions, department billing, revenue analytics',
    kpis: [
      { label: 'Gross Revenue',   value: '$1.42M', sub: 'this period' },
      { label: 'Overdue Bills',   value: '3',      sub: 'action needed' },
      { label: 'Pending Bills',   value: '142',    sub: 'awaiting payment' },
    ],
    status: 'attention',
  },
  {
    id: 'campus-monitoring',
    label: 'Campus Monitoring',
    path: '/dashboards/campus-monitoring',
    icon: '⚡',
    color: C.red,
    description: 'Energy & water utilities, tank levels, building usage, live alerts',
    kpis: [
      { label: 'Energy Level',    value: '72%',   sub: 'current capacity' },
      { label: 'Water Level',     value: '58%',   sub: 'tank average' },
      { label: 'Active Alerts',   value: '2',     sub: 'require attention' },
    ],
    status: 'warning',
  },
  {
    id: 'documents',
    label: 'Document Management',
    path: '/dashboards/documents',
    icon: '🗂️',
    color: C.indigo,
    description: 'PDFs, photos, reports, version control, module-linked document governance',
    kpis: [
      { label: 'Total Documents', value: '284',  sub: 'across all modules' },
      { label: 'Recent Uploads',  value: '11',   sub: 'last 7 days' },
      { label: 'Modules Covered', value: '23',   sub: 'out of 23' },
    ],
    status: 'operational',
  },
];

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  operational: { label: 'Operational', color: C.green,  dot: '#22c55e' },
  attention:   { label: 'Needs Attention', color: C.amber, dot: '#f59e0b' },
  warning:     { label: 'Warning',      color: C.red,   dot: '#ef4444' },
};

function StatusPill({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.operational;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.4px',
      color: cfg.color, background: cfg.color + '18',
      padding: '3px 9px', borderRadius: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {cfg.label.toUpperCase()}
    </span>
  );
}

// ─── SUMMARY BAR ──────────────────────────────────────────────────────────────
function SummaryBar() {
  const operational = DASHBOARDS.filter(d => d.status === 'operational').length;
  const attention   = DASHBOARDS.filter(d => d.status === 'attention').length;
  const warning     = DASHBOARDS.filter(d => d.status === 'warning').length;

  const items = [
    { label: 'Total Modules',     value: DASHBOARDS.length, color: C.blue,  icon: '🧩' },
    { label: 'Operational',       value: operational,       color: C.green, icon: '✅' },
    { label: 'Needs Attention',   value: attention,         color: C.amber, icon: '⚠️' },
    { label: 'Warnings Active',   value: warning,           color: C.red,   icon: '🔴' },
    { label: 'Staff On Duty',     value: '24',              color: C.purple,icon: '👤' },
    { label: 'Open Alerts',       value: '7',               color: C.red,   icon: '🔔' },
  ];

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 12, marginBottom: 28,
    }}>
      {items.map(({ label, value, color, icon }) => (
        <div key={label} style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderTop: `3px solid ${color}`,
          borderRadius: 10, padding: '14px 16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.text, lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── DASHBOARD CARD ───────────────────────────────────────────────────────────
function DashboardCard({ dash }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card,
        border: `1.5px solid ${hovered ? dash.color : C.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: hovered
          ? `0 8px 28px ${dash.color}22`
          : '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.22s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Card Header */}
      <div style={{
        background: hovered ? dash.color : dash.color + '12',
        padding: '18px 20px 16px',
        borderBottom: `1px solid ${dash.color}22`,
        transition: 'background 0.22s ease',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>{dash.icon}</span>
          <div>
            <div style={{
              fontSize: 14, fontWeight: 800,
              color: hovered ? '#fff' : C.text,
              lineHeight: 1.2, transition: 'color 0.22s',
            }}>
              {dash.label}
            </div>
          </div>
        </div>
        <StatusPill status={dash.status} />
      </div>

      {/* Description */}
      <div style={{ padding: '12px 20px 0', fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
        {dash.description}
      </div>

      {/* KPIs */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: 1, margin: '14px 20px',
        background: C.border, borderRadius: 8, overflow: 'hidden',
      }}>
        {dash.kpis.map(kpi => (
          <div key={kpi.label} style={{ background: C.card, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: dash.color }}>{kpi.value}</div>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 2 }}>{kpi.label}</div>
            <div style={{ fontSize: 10, color: C.muted + 'aa', marginTop: 1 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '0 20px 18px', marginTop: 'auto' }}>
        <Link
          to={dash.path}
          style={{
            display: 'block', textAlign: 'center',
            background: hovered ? dash.color : 'transparent',
            color: hovered ? '#fff' : dash.color,
            border: `1.5px solid ${dash.color}`,
            borderRadius: 8, padding: '9px 0',
            fontSize: 13, fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.22s ease',
            letterSpacing: '0.3px',
          }}
        >
          Open Dashboard →
        </Link>
      </div>
    </div>
  );
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
const ACTIVITY = [
  { time: '09:24', module: 'Workforce',     msg: 'Overtime request approved for Driver Team A',  type: 'success' },
  { time: '09:18', module: 'Billing',       msg: '3 bills overdue by more than 30 days',         type: 'warning' },
  { time: '09:05', module: 'Inventory',     msg: 'Projector Bulbs stock reached 0 — reorder now', type: 'danger'  },
  { time: '08:51', module: 'Campus',        msg: 'Water Tank 2 below 50% — auto refill triggered', type: 'info'   },
  { time: '08:40', module: 'FFU Bookings',  msg: 'New booking request from Engineering Dept',     type: 'info'   },
  { time: '08:22', module: 'Documents',     msg: 'Governance Matrix v2 uploaded by P3 Lead',      type: 'success' },
];

const TYPE_COLOR = { success: C.green, warning: C.amber, danger: C.red, info: C.blue };

function ActivityFeed() {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: '18px 20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 14 }}>
        🕐 Recent Activity
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {ACTIVITY.map((a, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '10px 0',
            borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${C.border}` : 'none',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 5,
              background: TYPE_COLOR[a.type] || C.muted,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.4 }}>{a.msg}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
                <span style={{ fontWeight: 700, color: C.muted }}>{a.module}</span> · {a.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── QUICK LINKS ──────────────────────────────────────────────────────────────
function QuickActions() {
  const actions = [
    { label: 'Approve Overtime',    icon: '✅', path: '/dashboards/workforce',        color: C.blue   },
    { label: 'Review Overdue Bills',icon: '💳', path: '/dashboards/internal-billing', color: C.red    },
    { label: 'Reorder Inventory',   icon: '📦', path: '/dashboards/inventory',        color: C.teal   },
    { label: 'View Campus Alerts',  icon: '⚡', path: '/dashboards/campus-monitoring',color: C.amber  },
    { label: 'Pending Bookings',    icon: '📋', path: '/dashboards/ffu-bookings',     color: C.purple },
    { label: 'Upload Document',     icon: '📄', path: '/dashboards/documents',        color: C.indigo },
  ];

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: '18px 20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 14 }}>
        ⚡ Quick Actions
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {actions.map(a => (
          <Link key={a.label} to={a.path} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8,
              border: `1px solid ${C.border}`,
              fontSize: 13, fontWeight: 600, color: C.text,
              transition: 'all 0.18s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = a.color + '10'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              {a.label}
              <span style={{ marginLeft: 'auto', color: a.color, fontWeight: 700 }}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── TOP NAV ──────────────────────────────────────────────────────────────────
function TopNav() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header style={{
      background: `linear-gradient(135deg, ${C.red}, ${C.redDark})`,
      padding: '0 28px', height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 2px 12px rgba(192,57,43,0.35)',
      position: 'sticky', top: 0, zIndex: 200,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22 }}>🏛️</span>
        <div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 15, letterSpacing: '-0.3px', lineHeight: 1.1 }}>
            AFRICA UNIVERSITY — FFIMS
          </div>
          <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 11 }}>
            Executive Supervisor Dashboard
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.5px' }}>
          {time.toLocaleTimeString('en-GB')} · {time.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
        }}>
          SV
        </div>
      </div>
    </header>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function ExecutiveDashboard() {
  return (
    <>
      <TopNav />
      <div style={{
        background: C.bg, minHeight: '100vh',
        padding: '24px 28px 48px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}>

        {/* Page Title */}
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: 0, letterSpacing: '-0.5px' }}>
            Operations Overview
          </h1>
          <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>
            Real-time summary across all FFIMS modules · Click any card to open the full dashboard
          </p>
        </div>

        {/* Summary KPI Bar */}
        <SummaryBar />

        {/* Dashboard Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 18,
          marginBottom: 24,
        }}>
          {DASHBOARDS.map(d => <DashboardCard key={d.id} dash={d} />)}
        </div>

        {/* Bottom Row: Activity + Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18 }}>
          <ActivityFeed />
          <QuickActions />
        </div>
      </div>
    </>
  );
}
